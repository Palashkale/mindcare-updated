from flask import Flask, request, jsonify
from flask_cors import CORS
import speech_recognition as sr
from nltk.sentiment import SentimentIntensityAnalyzer
import nltk
import re
import os
import tempfile
import wave
import io
import subprocess
import base64

# Download required NLTK data
try:
    nltk.data.find('sentiment/vader_lexicon')
except LookupError:
    nltk.download('vader_lexicon')

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

recognizer = sr.Recognizer()
sia = SentimentIntensityAnalyzer()

def convert_webm_to_wav(webm_data):
    """Convert WebM audio data to WAV format using ffmpeg"""
    try:
        # Create temporary files
        with tempfile.NamedTemporaryFile(delete=False, suffix='.webm') as webm_file:
            webm_file.write(webm_data)
            webm_path = webm_file.name

        wav_path = webm_path.replace('.webm', '.wav')

        try:
            # Use ffmpeg to convert WebM to WAV
            cmd = [
                'ffmpeg',
                '-i', webm_path,
                '-acodec', 'pcm_s16le',
                '-ac', '1',
                '-ar', '16000',
                '-y',  # Overwrite output file
                wav_path
            ]
            
            result = subprocess.run(cmd, capture_output=True, text=True)
            
            if result.returncode != 0:
                raise Exception(f"FFmpeg conversion failed: {result.stderr}")
            
            # Read the converted WAV file
            with open(wav_path, 'rb') as wav_file:
                wav_data = wav_file.read()
                
            return wav_data
            
        finally:
            # Clean up temporary files
            if os.path.exists(webm_path):
                os.unlink(webm_path)
            if os.path.exists(wav_path):
                os.unlink(wav_path)
                
    except Exception as e:
        raise Exception(f"Audio conversion error: {str(e)}")

def analyze_sentiment_from_text(text):
    """Analyze sentiment from text input"""
    try:
        # Clean Text
        text = text.lower().strip()
        text = re.sub(r'[^a-z\s\.\!\?]', '', text)  # Allow basic punctuation

        if not text or len(text.strip()) < 3:
            return None

        # Sentiment Analysis
        scores = sia.polarity_scores(text)
        
        # Keyword Cues
        keywords = {
            "anxious": "Anxious",
            "anxiety": "Anxious",
            "worried": "Anxious",
            "nervous": "Anxious",
            "tired": "Exhausted",
            "exhausted": "Exhausted",
            "fatigued": "Exhausted",
            "lonely": "Lonely",
            "alone": "Lonely",
            "depressed": "Depressed",
            "sad": "Sad",
            "unhappy": "Sad",
            "angry": "Angry",
            "mad": "Angry",
            "frustrated": "Frustrated",
            "annoyed": "Frustrated",
            "relaxed": "Calm",
            "calm": "Calm",
            "peaceful": "Calm",
            "grateful": "Grateful",
            "thankful": "Grateful",
            "happy": "Happy",
            "joyful": "Happy",
            "hopeful": "Hopeful",
            "optimistic": "Hopeful",
            "motivated": "Motivated",
            "energized": "Motivated",
            "stressed": "Stressed",
            "overwhelmed": "Stressed",
            "panic": "Panicked",
            "scared": "Scared",
            "afraid": "Scared"
        }

        detected_keywords = [emotion for word, emotion in keywords.items() if word in text]

        # Weighted Emotion Logic
        compound_score = scores['compound']
        if compound_score >= 0.6 and scores['pos'] > 0.5:
            emotion = "Hopeful / Motivated"
        elif 0.3 <= compound_score < 0.6:
            emotion = "Calm / Relaxed"
        elif -0.2 <= compound_score < 0.3 and scores['neu'] > 0.6:
            emotion = "Neutral / Reflective"
        elif -0.6 <= compound_score < -0.2 and scores['neg'] > 0.3:
            emotion = "Sad / Low"
        elif compound_score < -0.6:
            emotion = "Stressed / Anxious"
        else:
            emotion = "Mixed Emotions"

        # If strong keyword cue exists, prioritize it
        if detected_keywords:
            primary_emotion = detected_keywords[0]
            # Only override if keyword strongly indicates different emotion
            if ("Anxious" in primary_emotion and compound_score > 0) or \
               ("Happy" in primary_emotion and compound_score < -0.3):
                pass  # Don't override if sentiment contradicts keyword
            else:
                emotion = f"{primary_emotion}"

        return {
            'emotion': emotion,
            'scores': {
                'compound': round(compound_score, 3),
                'positive': round(scores['pos'], 3),
                'negative': round(scores['neg'], 3),
                'neutral': round(scores['neu'], 3)
            },
            'keywords_detected': detected_keywords
        }
    except Exception as e:
        print(f"Sentiment analysis error: {e}")
        return None

@app.route('/api/voice-sentiment', methods=['POST'])
def analyze_voice_sentiment():
    try:
        print("Received voice sentiment request")
        
        # Check if audio file is in the request
        if 'audio' not in request.files:
            print("No audio file in request")
            return jsonify({'error': 'No audio file provided', 'success': False}), 400
        
        audio_file = request.files['audio']
        
        # Check if file is empty
        if audio_file.filename == '':
            print("Empty filename")
            return jsonify({'error': 'No file selected', 'success': False}), 400

        print(f"Processing audio file: {audio_file.filename}")
        
        # Read the audio file data
        audio_data = audio_file.read()
        if len(audio_data) == 0:
            print("Empty audio data")
            return jsonify({'error': 'Empty audio file', 'success': False}), 400

        print(f"Audio data size: {len(audio_data)} bytes")

        # Convert WebM to WAV if needed
        if audio_file.filename.endswith('.webm') or 'webm' in audio_file.content_type:
            print("Converting WebM to WAV format...")
            try:
                wav_data = convert_webm_to_wav(audio_data)
                audio_data = wav_data
                print("Successfully converted WebM to WAV")
            except Exception as e:
                print(f"WebM to WAV conversion failed: {e}")
                return jsonify({
                    'error': f'Audio conversion failed: {str(e)}',
                    'success': False
                }), 400

        # Create a temporary WAV file
        with tempfile.NamedTemporaryFile(delete=False, suffix='.wav') as temp_audio:
            temp_audio.write(audio_data)
            temp_audio_path = temp_audio.name

        print(f"Saved temporary file: {temp_audio_path}")

        try:
            # Convert Speech → Text
            print("Starting speech recognition...")
            with sr.AudioFile(temp_audio_path) as source:
                # Adjust for ambient noise with shorter duration
                recognizer.adjust_for_ambient_noise(source, duration=0.3)
                audio = recognizer.record(source)
                
                # Use Google Speech Recognition
                text = recognizer.recognize_google(audio)
                print(f" Speech recognized: '{text}'")

            if not text or len(text.strip()) < 2:
                print("No meaningful speech detected")
                return jsonify({
                    'error': 'No speech detected or speech too short',
                    'transcript': text or '',
                    'success': False
                }), 400

            # Analyze sentiment
            print("Analyzing sentiment...")
            sentiment_result = analyze_sentiment_from_text(text)
            
            if not sentiment_result:
                print("Sentiment analysis failed")
                return jsonify({
                    'error': 'Could not analyze sentiment from speech',
                    'transcript': text,
                    'success': False
                }), 400

            # Prepare response
            response_data = {
                'transcript': text,
                'sentiment': sentiment_result,
                'success': True
            }

            print(f"Analysis complete: {sentiment_result['emotion']}")
            print(f"Scores: {sentiment_result['scores']}")
            
            return jsonify(response_data)

        except sr.UnknownValueError:
            print(" Speech recognition could not understand audio")
            return jsonify({
                'error': 'Could not understand the audio. Please try speaking more clearly.',
                'success': False
            }), 400
            
        except sr.RequestError as e:
            print(f" Speech recognition service error: {e}")
            return jsonify({
                'error': f'Speech recognition service unavailable: {str(e)}',
                'success': False
            }), 500
            
        except Exception as e:
            print(f" Processing error: {e}")
            return jsonify({
                'error': f'Error processing audio: {str(e)}',
                'success': False
            }), 500
            
        finally:
            # Clean up temporary file
            if os.path.exists(temp_audio_path):
                os.unlink(temp_audio_path)
                print(f" Cleaned up temporary file: {temp_audio_path}")

    except Exception as e:
        print(f"Server error: {str(e)}")
        return jsonify({
            'error': f'Server error: {str(e)}',
            'success': False
        }), 500

@app.route('/api/text-sentiment', methods=['POST'])
def analyze_text_sentiment():
    """Analyze sentiment from text input"""
    try:
        data = request.get_json()
        if not data or 'text' not in data:
            return jsonify({'error': 'No text provided', 'success': False}), 400
        
        text = data['text']
        print(f"Analyzing text sentiment: '{text}'")
        
        sentiment_result = analyze_sentiment_from_text(text)
        
        if not sentiment_result:
            return jsonify({
                'error': 'No meaningful text provided for analysis',
                'success': False
            }), 400
            
        return jsonify({
            'transcript': text,
            'sentiment': sentiment_result,
            'success': True
        })
        
    except Exception as e:
        print(f"Text sentiment error: {e}")
        return jsonify({
            'error': f'Server error: {str(e)}',
            'success': False
        }), 500

@app.route('/api/test-audio', methods=['POST'])
def test_audio_endpoint():
    """Test endpoint to check audio processing"""
    try:
        if 'audio' not in request.files:
            return jsonify({'error': 'No audio file'}), 400
        
        audio_file = request.files['audio']
        audio_data = audio_file.read()
        
        info = {
            'file_size': len(audio_data),
            'file_name': audio_file.filename,
            'content_type': audio_file.content_type,
            'success': True
        }
        
        return jsonify({'audio_info': info})
    except Exception as e:
        return jsonify({'error': str(e), 'success': False}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy', 
        'service': 'Voice Sentiment Analysis',
        'endpoints': {
            '/api/voice-sentiment': 'POST - Analyze voice sentiment',
            '/api/text-sentiment': 'POST - Analyze text sentiment',
            '/api/health': 'GET - Health check',
            '/api/test-audio': 'POST - Test audio processing'
        }
    })

if __name__ == '__main__':
    print("Starting Voice Sentiment Analysis Server...")
    
    # Check if ffmpeg is available
    try:
        result = subprocess.run(['ffmpeg', '-version'], capture_output=True, text=True)
        if result.returncode == 0:
            print("FFmpeg is available for audio conversion")
        else:
            print("FFmpeg is not available. WebM conversion will fail.")
    except Exception as e:
        print(f"FFmpeg check failed: {e}")
    
    app.run(host='0.0.0.0', port=5052, debug=True)