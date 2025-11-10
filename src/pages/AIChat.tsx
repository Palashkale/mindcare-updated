import React, { useState, useEffect, useRef } from "react";
import {
  Bot,
  User,
  Send,
  Shield,
  Globe,
  Maximize2,
  Minimize2,
  Mic,
  Volume2,
  MessageSquare,
  MicOff,
  BarChart3,
  X,
  Brain,
} from "lucide-react";
import AnimatedSection from "../components/AnimatedSection";

const quickPrompts = [
  "I feel anxious today",
  "I need motivation",
  "I'm feeling low",
  "Help me relax",
  "I'm stressed about work",
];

const features = [
  {
    title: "24/7 Availability",
    description: "Get support any time of day or night.",
    icon: Bot,
  },
  {
    title: "Personalized Responses",
    description: "Tailored support based on your input.",
    icon: User,
  },
];

const languages = [
  { code: "en", name: "English" },
  { code: "hi", name: "Hindi" },
  { code: "mr", name: "Marathi" },
  { code: "pa", name: "Punjabi" },
  { code: "ta", name: "Tamil" },
  { code: "kn", name: "Kannada" },
  { code: "bn", name: "Bengali" },
  { code: "te", name: "Telugu" },
  { code: "gu", name: "Gujarati" },
  { code: "ml", name: "Malayalam" },
  { code: "or", name: "Odia" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "it", name: "Italian" },
  { code: "pt", name: "Portuguese" },
  { code: "ja", name: "Japanese" },
  { code: "zh", name: "Chinese" },
  { code: "ar", name: "Arabic" },
];

const formatTime = (timestamp: number) =>
  new Date(timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

// Sentiment display component - FIXED VERSION
const SentimentDisplay = ({
  sentiment,
  onClose,
}: {
  sentiment: any;
  onClose: () => void;
}) => {
  if (!sentiment || !sentiment.sentiment) return null;

  const getSentimentColor = (emotion: string) => {
    if (!emotion) return "bg-gray-100 border-gray-300 text-gray-800";

    if (
      emotion.includes("Hopeful") ||
      emotion.includes("Motivated") ||
      emotion.includes("Happy")
    )
      return "bg-green-100 border-green-300 text-green-800";
    if (
      emotion.includes("Calm") ||
      emotion.includes("Relaxed") ||
      emotion.includes("Grateful")
    )
      return "bg-blue-100 border-blue-300 text-blue-800";
    if (emotion.includes("Neutral") || emotion.includes("Reflective"))
      return "bg-gray-100 border-gray-300 text-gray-800";
    if (
      emotion.includes("Sad") ||
      emotion.includes("Low") ||
      emotion.includes("Lonely")
    )
      return "bg-purple-100 border-purple-300 text-purple-800";
    if (
      emotion.includes("Stressed") ||
      emotion.includes("Anxious") ||
      emotion.includes("Angry") ||
      emotion.includes("Panicked") ||
      emotion.includes("Scared")
    )
      return "bg-red-100 border-red-300 text-red-800";
    return "bg-yellow-100 border-yellow-300 text-yellow-800";
  };

  const emotion = sentiment.sentiment.emotion || "Neutral / Reflective";
  const scores = sentiment.sentiment.scores || {
    compound: 0,
    positive: 0,
    negative: 0,
    neutral: 1.0,
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Brain className="h-5 w-5 mr-2 text-purple-600" />
            Emotional Analysis
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div
          className={`p-4 rounded-lg border-2 ${getSentimentColor(emotion)} mb-4`}
        >
          <div className="text-center">
            <div className="text-2xl font-bold mb-2">{emotion}</div>
            {sentiment.transcript && (
              <div className="text-sm opacity-75">"{sentiment.transcript}"</div>
            )}
          </div>
        </div>

        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3">
            Sentiment Scores:
          </h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
              <div className="text-xs text-blue-600 font-medium">Positive</div>
              <div className="text-lg font-bold text-blue-700">
                {(scores.positive * 100).toFixed(1)}%
              </div>
            </div>
            <div className="bg-red-50 p-3 rounded-lg border border-red-200">
              <div className="text-xs text-red-600 font-medium">Negative</div>
              <div className="text-lg font-bold text-red-700">
                {(scores.negative * 100).toFixed(1)}%
              </div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
              <div className="text-xs text-gray-600 font-medium">Neutral</div>
              <div className="text-lg font-bold text-gray-700">
                {(scores.neutral * 100).toFixed(1)}%
              </div>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
              <div className="text-xs text-purple-600 font-medium">
                Compound
              </div>
              <div className="text-lg font-bold text-purple-700">
                {scores.compound > 0 ? "+" : ""}
                {scores.compound.toFixed(3)}
              </div>
            </div>
          </div>
        </div>

        {sentiment.sentiment.keywords_detected &&
          sentiment.sentiment.keywords_detected.length > 0 && (
            <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
              <div className="text-xs text-yellow-700">
                <strong>Keywords detected:</strong>{" "}
                {sentiment.sentiment.keywords_detected.join(", ")}
              </div>
            </div>
          )}

        <div className="mt-4 text-xs text-gray-500">
          <p>
            Compound score ranges from -1 (most negative) to +1 (most positive)
          </p>
        </div>
      </div>
    </div>
  );
};

const LlamaChat = () => {
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(true);
  const [voiceMode, setVoiceMode] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState("Click to start voice chat");
  const [voiceTranscript, setVoiceTranscript] = useState("");
  const [sentimentData, setSentimentData] = useState<any>(null);
  const [showSentiment, setShowSentiment] = useState(false);
  const [isAnalyzingSentiment, setIsAnalyzingSentiment] = useState(false);
  const [autoSentiment, setAutoSentiment] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<
    "connected" | "error" | "checking"
  >("checking");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const speechSynthesisRef = useRef<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const currentTranscriptRef = useRef<string>("");
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastVoiceActivityRef = useRef<number>(0);

  // Check backend connection
  useEffect(() => {
    const checkBackend = async () => {
      try {
        const response = await fetch("http://localhost:5052/api/health");
        if (response.ok) {
          setConnectionStatus("connected");
          console.log("✅ Backend connected successfully");
        } else {
          setConnectionStatus("error");
          console.error("❌ Backend health check failed");
        }
      } catch (error) {
        setConnectionStatus("error");
        console.error("❌ Backend connection failed:", error);
      }
    };

    checkBackend();
  }, []);

  // Check if browser supports required APIs
  useEffect(() => {
    if (
      !("webkitSpeechRecognition" in window) &&
      !("SpeechRecognition" in window)
    ) {
      setVoiceSupported(false);
      console.warn("Speech recognition not supported in this browser");
    }

    if (!("speechSynthesis" in window)) {
      setVoiceSupported(false);
      console.warn("Speech synthesis not supported in this browser");
    }

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.warn("MediaRecorder not supported in this browser");
    }
  }, []);

  // Initialize speech recognition with auto-send
  useEffect(() => {
    if (voiceSupported) {
      const SpeechRecognition =
        (window as any).webkitSpeechRecognition ||
        (window as any).SpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = selectedLanguage;

        recognitionRef.current.onresult = (event: any) => {
          let interimTranscript = "";
          let finalTranscript = "";

          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript;
            } else {
              interimTranscript += event.results[i][0].transcript;
            }
          }

          // Update last voice activity timestamp
          lastVoiceActivityRef.current = Date.now();

          // Clear any existing silence timer
          if (silenceTimerRef.current) {
            clearTimeout(silenceTimerRef.current);
          }

          if (finalTranscript) {
            currentTranscriptRef.current = finalTranscript;
            setVoiceTranscript(finalTranscript);
            setVoiceStatus(`Listening: "${finalTranscript}"`);

            // Set timer to auto-send after 1.5 seconds of silence
            silenceTimerRef.current = setTimeout(() => {
              if (isListening && finalTranscript.trim()) {
                console.log("🔄 Auto-sending after silence");
                handleVoiceInputSubmit();
              }
            }, 1500);
          } else if (interimTranscript) {
            setVoiceTranscript(interimTranscript);
            setVoiceStatus(`Listening: "${interimTranscript}"`);
          }
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error("Speech recognition error", event.error);
          setIsListening(false);
          setVoiceStatus("Error: Please try again");
          setTimeout(() => setVoiceStatus("Click to start voice chat"), 3000);
        };

        recognitionRef.current.onend = () => {
          // Auto-restart if still in listening mode
          if (isListening && recognitionRef.current) {
            try {
              recognitionRef.current.start();
            } catch (e) {
              console.log("Recognition restart:", e);
            }
          }
        };
      }

      speechSynthesisRef.current = window.speechSynthesis;
    }

    return () => {
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }
    };
  }, [selectedLanguage, voiceSupported, voiceMode, isListening]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Load saved language preference from localStorage
  useEffect(() => {
    const savedLanguage = localStorage.getItem("preferredLanguage");
    if (savedLanguage) {
      setSelectedLanguage(savedLanguage);
    }
  }, []);

  // Save language preference to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("preferredLanguage", selectedLanguage);
    if (recognitionRef.current) {
      recognitionRef.current.lang = selectedLanguage;
    }
  }, [selectedLanguage]);

  // Analyze sentiment from text
  const analyzeTextSentiment = async (text: string) => {
    if (!text.trim() || !autoSentiment) return;

    setIsAnalyzingSentiment(true);
    try {
      const response = await fetch("http://localhost:5052/api/text-sentiment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSentimentData(data);

        // Auto-show sentiment for very strong emotions
        if (Math.abs(data.sentiment.scores.compound) > 0.7) {
          setShowSentiment(true);
        }
      } else {
        console.warn("Text sentiment analysis failed:", data.error);
      }
    } catch (error) {
      console.error("Error analyzing text sentiment:", error);
    } finally {
      setIsAnalyzingSentiment(false);
    }
  };

  // Analyze sentiment from audio
  const analyzeVoiceSentiment = async (audioBlob: Blob) => {
    if (!autoSentiment) return;

    setIsAnalyzingSentiment(true);
    try {
      const formData = new FormData();
      formData.append("audio", audioBlob, "recording.webm");

      console.log("🎙️ Sending voice for sentiment analysis...");

      const response = await fetch(
        "http://localhost:5052/api/voice-sentiment",
        {
          method: "POST",
          body: formData,
        },
      );

      const data = await response.json();
      console.log("📊 Sentiment response:", data);

      if (response.ok && data.success) {
        setSentimentData(data);
        // Auto-show sentiment analysis for voice mode
        setShowSentiment(true);

        // Add sentiment result as a bot message
        const sentimentMessage = {
          id: Date.now(),
          type: "bot",
          content: `I detected that you're feeling: **${data.sentiment.emotion}**\n\nBased on your voice: "${data.transcript}"`,
          timestamp: Date.now(),
          isSentiment: true,
        };

        setMessages((prev) => [...prev, sentimentMessage]);
      } else {
        console.warn("Voice sentiment analysis failed:", data.error);
      }
    } catch (error) {
      console.error("Error analyzing voice sentiment:", error);
    } finally {
      setIsAnalyzingSentiment(false);
    }
  };

  // Record audio for sentiment analysis
  const recordAudioForSentiment = async (): Promise<Blob | null> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          sampleRate: 16000,
          echoCancellation: true,
          noiseSuppression: true,
        },
      });

      return new Promise((resolve) => {
        audioChunksRef.current = [];

        mediaRecorderRef.current = new MediaRecorder(stream, {
          mimeType: "audio/webm;codecs=opus",
        });

        mediaRecorderRef.current.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        mediaRecorderRef.current.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, {
            type: "audio/webm",
          });
          stream.getTracks().forEach((track) => track.stop());
          resolve(audioBlob);
        };

        mediaRecorderRef.current.start();

        // Record for 3 seconds (shorter for real-time analysis)
        setTimeout(() => {
          if (
            mediaRecorderRef.current &&
            mediaRecorderRef.current.state === "recording"
          ) {
            mediaRecorderRef.current.stop();
          }
        }, 3000);
      });
    } catch (error) {
      console.error("Error recording audio:", error);
      return null;
    }
  };

  const handleSendMessage = async (text?: string) => {
    const messageToSend = text || inputMessage;
    if (!messageToSend.trim()) return;

    const newMessage = {
      id: Date.now(),
      type: "user",
      content: messageToSend,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputMessage("");
    setVoiceTranscript("");
    setIsTyping(true);

    // Analyze sentiment in parallel
    if (autoSentiment) {
      analyzeTextSentiment(messageToSend);
    }

    const responseMessage = {
      id: Date.now() + 1,
      type: "bot",
      content: "",
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, responseMessage]);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:5051/api/ai-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({
          prompt: messageToSend,
          language: selectedLanguage,
        }),
      });

      const data = await response.text();

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === responseMessage.id ? { ...msg, content: data } : msg,
        ),
      );

      // Speak the response if voice is enabled
      if (voiceSupported && voiceMode) {
        speakResponse(data);
      }
    } catch (err) {
      console.error("Error talking to Groq:", err);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === responseMessage.id
            ? {
                ...msg,
                content: "Sorry, something went wrong. Please try again.",
              }
            : msg,
        ),
      );

      if (voiceMode) {
        speakResponse("Sorry, something went wrong. Please try again.");
      }
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickPrompt = (prompt: string) => {
    if (voiceMode) {
      setVoiceTranscript(prompt);
      processVoiceInput(prompt);
    } else {
      setInputMessage(prompt);
      handleSendMessage(prompt);
    }
  };

  const handleLanguageChange = (languageCode: string) => {
    setSelectedLanguage(languageCode);
    setShowLanguageDropdown(false);
  };

  const getLanguageName = (code: string) => {
    const language = languages.find((lang) => lang.code === code);
    return language ? language.name : "English";
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const startListening = async () => {
    if (recognitionRef.current && voiceSupported) {
      setIsListening(true);
      currentTranscriptRef.current = "";
      setVoiceTranscript("");
      setVoiceStatus("Listening... Speak now");
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.log("Recognition already started");
      }

      // Start parallel sentiment recording in voice mode
      if (voiceMode && autoSentiment) {
        const audioBlob = await recordAudioForSentiment();
        if (audioBlob) {
          analyzeVoiceSentiment(audioBlob);
        }
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && voiceSupported) {
      setIsListening(false);
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }
      recognitionRef.current.stop();
      setVoiceStatus("Click to start voice chat");
    }
  };

  const processVoiceInput = async (input: string) => {
    if (!input.trim()) return;

    console.log("🎤 Processing voice input:", input);

    setIsListening(false);
    setVoiceStatus("Processing your request...");

    // Add user message to chat
    const userMessage = {
      id: Date.now(),
      type: "user",
      content: input,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setVoiceTranscript("");

    setIsTyping(true);

    // Add bot response placeholder
    const botMessage = {
      id: Date.now() + 1,
      type: "bot",
      content: "",
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, botMessage]);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:5051/api/ai-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({
          prompt: input,
          language: selectedLanguage,
        }),
      });

      const data = await response.text();

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === botMessage.id ? { ...msg, content: data } : msg,
        ),
      );

      // Speak the response
      speakResponse(data);
    } catch (err) {
      console.error("Error talking to Groq:", err);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === botMessage.id
            ? {
                ...msg,
                content: "Sorry, something went wrong. Please try again.",
              }
            : msg,
        ),
      );
      speakResponse("Sorry, something went wrong. Please try again.");
    } finally {
      setIsTyping(false);
    }
  };

  const handleVoiceInputSubmit = () => {
    const transcript = voiceTranscript.trim();
    if (transcript) {
      processVoiceInput(transcript);
    }
  };

  const speakResponse = (text: string) => {
    if (!voiceSupported || !speechSynthesisRef.current) return;

    // Stop any ongoing speech
    speechSynthesisRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = selectedLanguage;
    utterance.rate = 0.9;

    setIsSpeaking(true);
    setVoiceStatus("AI is speaking...");

    utterance.onend = () => {
      setIsSpeaking(false);
      setVoiceStatus("Click to start voice chat");
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setVoiceStatus("Error speaking. Click to try again.");
    };

    speechSynthesisRef.current.speak(utterance);
  };

  const stopSpeaking = () => {
    if (speechSynthesisRef.current) {
      speechSynthesisRef.current.cancel();
      setIsSpeaking(false);
      setVoiceStatus("Click to start voice chat");
    }
  };

  const toggleVoiceMode = () => {
    if (voiceMode) {
      // Switching to text mode
      setVoiceMode(false);
      if (isListening) stopListening();
      if (isSpeaking) stopSpeaking();
    } else {
      // Switching to voice mode
      setVoiceMode(true);
      setVoiceStatus("Click to start voice chat");
      setVoiceTranscript("");
      currentTranscriptRef.current = "";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pt-16">
      {showSentiment && sentimentData && (
        <SentimentDisplay
          sentiment={sentimentData}
          onClose={() => setShowSentiment(false)}
        />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatedSection>
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Mental Health Companion
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Your compassionate AI companion with real-time emotional analysis
            </p>

            {/* Connection Status */}
            <div className="flex justify-center mt-4">
              <div
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                  connectionStatus === "connected"
                    ? "bg-green-100 text-green-800"
                    : connectionStatus === "error"
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full mr-2 ${
                    connectionStatus === "connected"
                      ? "bg-green-500"
                      : connectionStatus === "error"
                        ? "bg-red-500"
                        : "bg-yellow-500 animate-pulse"
                  }`}
                ></div>
                {connectionStatus === "connected"
                  ? "Emotional Analysis Connected"
                  : connectionStatus === "error"
                    ? "Analysis Service Offline"
                    : "Checking Analysis Service..."}
              </div>
            </div>

            {/* Mode Toggle */}
            <div className="flex justify-center mt-6">
              <div className="bg-white rounded-full p-1 shadow-lg border border-gray-200 inline-flex">
                <button
                  onClick={() => setVoiceMode(false)}
                  className={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    !voiceMode
                      ? "bg-blue-600 text-white shadow"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Text Mode
                </button>
                <button
                  onClick={() => setVoiceMode(true)}
                  className={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    voiceMode
                      ? "bg-purple-600 text-white shadow"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <Mic className="h-4 w-4 mr-2" />
                  Voice Mode
                </button>
              </div>
            </div>
          </div>
        </AnimatedSection>

        <div
          className={`grid ${
            isExpanded ? "lg:grid-cols-1" : "lg:grid-cols-4"
          } gap-8`}
        >
          {/* Chat Interface */}
          <div className={isExpanded ? "lg:col-span-1" : "lg:col-span-3"}>
            <AnimatedSection delay={100}>
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 flex flex-col h-[700px]">
                {/* Chat Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50 rounded-t-xl">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-3">
                      <Bot className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        Mental Health Companion
                      </h3>
                      <p className="text-sm text-green-600 flex items-center">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        Online •{" "}
                        {autoSentiment
                          ? "Emotional Analysis Active"
                          : "Analysis Disabled"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    {/* Language Selector */}
                    <div className="relative">
                      <button
                        onClick={() =>
                          setShowLanguageDropdown(!showLanguageDropdown)
                        }
                        className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
                      >
                        <Globe className="h-4 w-4" />
                        <span>{getLanguageName(selectedLanguage)}</span>
                      </button>

                      {showLanguageDropdown && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10 max-h-60 overflow-y-auto">
                          {languages.map((language) => (
                            <button
                              key={language.code}
                              onClick={() =>
                                handleLanguageChange(language.code)
                              }
                              className={`w-full text-left px-4 py-2 text-sm hover:bg-blue-50 transition-colors ${
                                selectedLanguage === language.code
                                  ? "bg-blue-100 text-blue-700 font-medium"
                                  : "text-gray-700"
                              }`}
                            >
                              {language.name}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Sentiment Toggle */}
                    <button
                      onClick={() => setAutoSentiment(!autoSentiment)}
                      className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                        autoSentiment
                          ? "bg-green-100 text-green-700 border border-green-300"
                          : "bg-gray-100 text-gray-600 border border-gray-300"
                      }`}
                      title={
                        autoSentiment
                          ? "Disable emotional analysis"
                          : "Enable emotional analysis"
                      }
                    >
                      <Brain className="h-4 w-4 mr-1" />
                      {autoSentiment ? "Analysis ON" : "Analysis OFF"}
                    </button>

                    {/* Expand/Collapse Button */}
                    <button
                      onClick={toggleExpand}
                      className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                      title={isExpanded ? "Show sidebar" : "Expand chat"}
                    >
                      {isExpanded ? (
                        <Minimize2 size={18} />
                      ) : (
                        <Maximize2 size={18} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                  {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-4">
                        <Bot className="h-8 w-8 text-blue-600" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        How are you feeling today?
                      </h3>
                      <p className="text-gray-500 max-w-md">
                        {voiceMode
                          ? "Click 'Start Listening' and speak naturally. I'll automatically detect when you stop talking."
                          : "Share what's on your mind. I'm here to listen and provide support with real-time emotional analysis."}
                      </p>
                      <p className="text-sm text-gray-400 mt-3">
                        Responses in {getLanguageName(selectedLanguage)} •
                        Emotional Analysis: {autoSentiment ? "ON" : "OFF"}
                      </p>
                    </div>
                  )}

                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.type === "user"
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <div
                          className={`flex items-start max-w-3xl ${
                            message.type === "user"
                              ? "flex-row-reverse"
                              : "flex-row"
                          }`}
                        >
                          <div
                            className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                              message.type === "user"
                                ? "bg-gradient-to-r from-blue-600 to-blue-700 ml-3"
                                : "bg-gradient-to-r from-blue-100 to-purple-100 mr-3"
                            }`}
                          >
                            {message.type === "user" ? (
                              <User className="h-4 w-4 text-white" />
                            ) : (
                              <Bot className="h-4 w-4 text-blue-600" />
                            )}
                          </div>
                          <div
                            className={`px-4 py-3 rounded-2xl max-w-md ${
                              message.type === "user"
                                ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white"
                                : message.isSentiment
                                  ? "bg-gradient-to-r from-green-100 to-blue-100 text-gray-900 border-2 border-green-200 shadow-sm"
                                  : "bg-white text-gray-900 border border-gray-200 shadow-sm"
                            }`}
                          >
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">
                              {message.content}
                            </p>
                            {message.isSentiment && (
                              <button
                                onClick={() => {
                                  setShowSentiment(true);
                                }}
                                className="mt-2 px-3 py-1 bg-blue-600 text-white text-xs rounded-full hover:bg-blue-700 transition-colors"
                              >
                                View Detailed Analysis
                              </button>
                            )}
                            <p
                              className={`text-xs mt-2 ${
                                message.type === "user"
                                  ? "text-blue-100"
                                  : "text-gray-500"
                              }`}
                            >
                              {formatTime(message.timestamp)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}

                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="flex items-start">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mr-3">
                            <Bot className="h-4 w-4 text-blue-600" />
                          </div>
                          <div className="bg-white px-4 py-3 rounded-2xl border border-gray-200 shadow-sm">
                            <div className="flex space-x-1.5">
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                              <div
                                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                style={{ animationDelay: "0.1s" }}
                              ></div>
                              <div
                                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                style={{ animationDelay: "0.2s" }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div ref={messagesEndRef} />
                </div>

                {/* Voice Transcript Display */}
                {voiceMode && voiceTranscript && (
                  <div className="px-6 py-3 bg-blue-50 border-t border-blue-200">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm text-blue-800">
                          <span className="font-medium">You said:</span>{" "}
                          {voiceTranscript}
                        </p>
                        <p className="text-xs text-blue-600 mt-1">
                          I'll send automatically your message to backend for
                          voice based sentiment analysis when you stop
                          speaking...
                        </p>
                      </div>
                      <button
                        onClick={handleVoiceInputSubmit}
                        disabled={!voiceTranscript.trim()}
                        className="ml-3 px-4 py-1 bg-blue-600 text-white text-sm rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Send Now
                      </button>
                    </div>
                  </div>
                )}

                {/* Quick Prompts */}
                {messages.length === 0 && !voiceMode && (
                  <div className="px-6 py-4 border-t border-gray-200 bg-white">
                    <p className="text-xs font-medium text-gray-500 mb-2">
                      TRY SAYING:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {quickPrompts.map((prompt, index) => (
                        <button
                          key={index}
                          onClick={() => handleQuickPrompt(prompt)}
                          className="px-4 py-2 text-sm bg-blue-50 text-blue-700 rounded-full hover:bg-blue-100 transition-colors border border-blue-100"
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Input Area */}
                {!voiceMode ? (
                  <div className="p-4 border-t border-gray-200 bg-white rounded-b-xl">
                    <div className="flex items-center space-x-3">
                      {voiceSupported && (
                        <button
                          onClick={isListening ? stopListening : startListening}
                          className={`p-3 rounded-full transition-all ${
                            isListening
                              ? "bg-red-100 text-red-600 animate-pulse"
                              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                          }`}
                          title={
                            isListening ? "Stop listening" : "Start voice input"
                          }
                        >
                          <Mic className="h-5 w-5" />
                        </button>
                      )}
                      <input
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={(e) =>
                          e.key === "Enter" && handleSendMessage()
                        }
                        placeholder="Share how you're feeling..."
                        className="flex-1 border border-gray-300 rounded-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                      />
                      <button
                        onClick={() => handleSendMessage()}
                        disabled={!inputMessage.trim()}
                        className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-3 rounded-full hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                      >
                        <Send className="h-5 w-5" />
                      </button>
                    </div>
                    {isListening && (
                      <p className="text-sm text-red-500 mt-2 ml-12">
                        Listening... Speak now
                      </p>
                    )}
                  </div>
                ) : (
                  // Voice Mode Interface
                  <div className="p-4 border-t border-gray-200 bg-white rounded-b-xl">
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-4 mb-4">
                        <div className="relative">
                          <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full flex items-center justify-center">
                            {isListening ? (
                              <div className="relative">
                                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center animate-pulse">
                                  <Mic className="h-6 w-6 text-white" />
                                </div>
                                <div className="absolute inset-0 rounded-full border-2 border-purple-300 animate-ping opacity-75"></div>
                              </div>
                            ) : isSpeaking ? (
                              <div className="relative">
                                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                                  <Volume2 className="h-6 w-6 text-white" />
                                </div>
                              </div>
                            ) : (
                              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                                <Mic className="h-6 w-6 text-gray-600" />
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="text-left">
                          <p className="text-sm font-medium text-gray-900">
                            Voice Mode
                          </p>
                          <p className="text-xs text-gray-500">{voiceStatus}</p>
                          {isListening}
                        </div>
                      </div>

                      <div className="flex justify-center space-x-3">
                        <button
                          onClick={isListening ? stopListening : startListening}
                          disabled={isSpeaking}
                          className={`px-6 py-3 rounded-full font-medium transition-all ${
                            isListening
                              ? "bg-red-600 text-white hover:bg-red-700 shadow-lg"
                              : "bg-purple-600 text-white hover:bg-purple-700 shadow-lg"
                          } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                          {isListening ? "Stop Listening" : "Start Listening"}
                        </button>

                        {isSpeaking && (
                          <button
                            onClick={stopSpeaking}
                            className="px-6 py-3 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 shadow-lg transition-all"
                          >
                            Stop Speaking
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </AnimatedSection>
          </div>

          {/* Sidebar - Hidden when expanded */}
          {!isExpanded && (
            <div className="space-y-6">
              {/* Emotional Analysis Card */}
              <AnimatedSection delay={150}>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Brain className="h-5 w-5 text-purple-600 mr-2" />
                    EMOTIONAL ANALYSIS
                  </h3>
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                      Real-time sentiment analysis of your conversations to
                      provide better emotional support.
                    </p>

                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">
                        Auto Analysis
                      </span>
                      <button
                        onClick={() => setAutoSentiment(!autoSentiment)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          autoSentiment ? "bg-green-600" : "bg-gray-300"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            autoSentiment ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>

                    {sentimentData && (
                      <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                        <p className="text-xs text-blue-800">
                          <strong>Current Mood:</strong>{" "}
                          {sentimentData.sentiment?.emotion || "Neutral"}
                        </p>
                        <button
                          onClick={() => setShowSentiment(true)}
                          className="text-xs text-blue-600 hover:text-blue-800 mt-1 underline"
                        >
                          View detailed analysis
                        </button>
                      </div>
                    )}

                    {connectionStatus === "error" && (
                      <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                        <p className="text-xs text-red-800">
                          <strong>Service Offline:</strong> Emotional analysis
                          is currently unavailable.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </AnimatedSection>

              {/* Voice Mode Card */}
              <AnimatedSection delay={200}>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Volume2 className="h-5 w-5 text-purple-600 mr-2" />
                    VOICE MODE
                  </h3>
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                      {voiceMode
                        ? "You're in voice mode. Speak naturally and I'll respond automatically when you stop talking."
                        : "Switch to voice mode for hands-free conversation with auto-send."}
                    </p>

                    {!voiceSupported ? (
                      <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                        <p className="text-xs text-yellow-800">
                          Voice features are not supported in your browser.
                          Please use Chrome, Edge, or Safari for voice
                          functionality.
                        </p>
                      </div>
                    ) : (
                      <button
                        onClick={toggleVoiceMode}
                        className={`w-full py-3 rounded-lg font-medium transition-all flex items-center justify-center ${
                          voiceMode
                            ? "bg-red-600 text-white hover:bg-red-700"
                            : "bg-purple-600 text-white hover:bg-purple-700"
                        }`}
                      >
                        {voiceMode ? (
                          <>
                            <MicOff className="h-4 w-4 mr-2" />
                            Exit Voice Mode
                          </>
                        ) : (
                          <>
                            <Mic className="h-4 w-4 mr-2" />
                            Enable Voice Mode
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </AnimatedSection>

              {/* ... (rest of sidebar components remain similar) */}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes wave {
          0% {
            height: 2px;
          }
          50% {
            height: 12px;
          }
          100% {
            height: 2px;
          }
        }
        .animate-wave {
          animation: wave 1s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default LlamaChat;
