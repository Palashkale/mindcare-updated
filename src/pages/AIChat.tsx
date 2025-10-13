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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const speechSynthesisRef = useRef<any>(null);

  // Check if browser supports Web Speech API
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
  }, []);

  // Initialize speech recognition
  useEffect(() => {
    if (voiceSupported) {
      const SpeechRecognition =
        (window as any).webkitSpeechRecognition ||
        (window as any).SpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = selectedLanguage;

        recognitionRef.current.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setVoiceTranscript(transcript);
          if (voiceMode) {
            setVoiceStatus(`Listening: "${transcript}"`);
          } else {
            setInputMessage(transcript);
          }
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error("Speech recognition error", event.error);
          setIsListening(false);
          setVoiceStatus("Error: Please try again");
          setTimeout(() => setVoiceStatus("Click to start voice chat"), 3000);
        };

        recognitionRef.current.onend = () => {
          if (voiceMode && isListening && voiceTranscript) {
            // In voice mode, process the speech immediately
            processVoiceCommand();
          } else {
            setIsListening(false);
          }
        };
      }

      speechSynthesisRef.current = window.speechSynthesis;
    }
  }, [selectedLanguage, voiceSupported, voiceMode, voiceTranscript]);

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
    setIsTyping(true);

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
      // In voice mode, process the prompt directly
      processVoiceInput(prompt);
    } else {
      setInputMessage(prompt);
      handleSendMessage();
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

  const startListening = () => {
    if (recognitionRef.current && voiceSupported) {
      setIsListening(true);
      setVoiceTranscript("");
      setVoiceStatus("Listening... Speak now");
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && voiceSupported) {
      setIsListening(false);
      recognitionRef.current.stop();
      setVoiceStatus("Click to start voice chat");
    }
  };

  const processVoiceCommand = () => {
    if (voiceTranscript) {
      processVoiceInput(voiceTranscript);
    }
  };

  const processVoiceInput = async (input: string) => {
    setIsListening(false);
    setVoiceStatus("Processing your request...");

    setIsTyping(true);

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

      // Speak the response
      speakResponse(data);
    } catch (err) {
      console.error("Error talking to Groq:", err);
      speakResponse("Sorry, something went wrong. Please try again.");
    } finally {
      setIsTyping(false);
    }
  };

  const speakResponse = (text: string) => {
    if (!voiceSupported || !speechSynthesisRef.current) return;

    // Stop any ongoing speech
    speechSynthesisRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = selectedLanguage;
    utterance.rate = 0.9; // Slightly slower for more calming speech

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
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatedSection>
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Mental Health Companion
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Your compassionate AI companion is available 24/7 to provide
              support, coping strategies, and guidance for your mental health
              journey.
            </p>

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
          className={`grid ${isExpanded ? "lg:grid-cols-1" : "lg:grid-cols-4"} gap-8`}
        >
          {/* Chat Interface - Now takes full width when expanded */}
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
                        Online • Always here for you
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

                {/* Messages - Hidden in voice mode */}
                {!voiceMode ? (
                  <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                    {messages.length === 0 && (
                      <div className="flex flex-col items-center justify-center h-full text-center">
                        <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-4">
                          <Bot className="h-8 w-8 text-blue-600" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          How can I help you today?
                        </h3>
                        <p className="text-gray-500 max-w-md">
                          I'm here to listen and provide support. Share what's
                          on your mind, or try one of the quick prompts below.
                        </p>
                        <p className="text-sm text-gray-400 mt-3">
                          Responses will be in{" "}
                          {getLanguageName(selectedLanguage)}
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
                                  : "bg-white text-gray-900 border border-gray-200 shadow-sm"
                              }`}
                            >
                              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                                {message.content}
                              </p>
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
                ) : (
                  // Voice Mode Interface
                  <div className="flex-1 overflow-y-auto p-4 bg-gray-50 flex flex-col items-center justify-center">
                    <div className="text-center max-w-md">
                      <div className="relative mb-6">
                        <div className="w-32 h-32 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto">
                          {isListening ? (
                            <div className="relative">
                              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center animate-pulse">
                                <Mic className="h-8 w-8 text-white" />
                              </div>
                              {/* Animated circles */}
                              <div className="absolute inset-0 rounded-full border-2 border-purple-300 animate-ping opacity-75"></div>
                              <div
                                className="absolute inset-0 rounded-full border-2 border-purple-400 animate-ping"
                                style={{ animationDelay: "0.5s" }}
                              ></div>
                            </div>
                          ) : isSpeaking ? (
                            <div className="relative">
                              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                                <Volume2 className="h-8 w-8 text-white" />
                              </div>
                              {/* Sound waves */}
                              <div className="absolute -inset-4 flex items-center justify-center space-x-1">
                                <div className="w-1 h-2 bg-blue-300 rounded-full animate-wave"></div>
                                <div
                                  className="w-1 h-4 bg-blue-400 rounded-full animate-wave"
                                  style={{ animationDelay: "0.2s" }}
                                ></div>
                                <div
                                  className="w-1 h-6 bg-blue-500 rounded-full animate-wave"
                                  style={{ animationDelay: "0.4s" }}
                                ></div>
                                <div
                                  className="w-1 h-4 bg-blue-400 rounded-full animate-wave"
                                  style={{ animationDelay: "0.6s" }}
                                ></div>
                                <div
                                  className="w-1 h-2 bg-blue-300 rounded-full animate-wave"
                                  style={{ animationDelay: "0.8s" }}
                                ></div>
                              </div>
                            </div>
                          ) : (
                            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                              <Mic className="h-8 w-8 text-gray-600" />
                            </div>
                          )}
                        </div>
                      </div>

                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Voice Mode
                      </h3>
                      <p className="text-gray-500 mb-4">{voiceStatus}</p>

                      {voiceTranscript && (
                        <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 mb-4">
                          <p className="text-sm text-blue-800">
                            <span className="font-medium">You said:</span>{" "}
                            {voiceTranscript}
                          </p>
                        </div>
                      )}

                      <button
                        onClick={
                          isListening
                            ? stopListening
                            : isSpeaking
                              ? stopSpeaking
                              : startListening
                        }
                        disabled={isTyping}
                        className={`px-6 py-3 rounded-full font-medium transition-all ${
                          isListening
                            ? "bg-red-600 text-white hover:bg-red-700 shadow-lg"
                            : isSpeaking
                              ? "bg-blue-600 text-white hover:bg-blue-700 shadow-lg"
                              : "bg-purple-600 text-white hover:bg-purple-700 shadow-lg"
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        {isListening ? (
                          <>Stop Listening</>
                        ) : isSpeaking ? (
                          <>Stop Speaking</>
                        ) : (
                          <>Start Voice Chat</>
                        )}
                      </button>

                      {isTyping && (
                        <div className="mt-6 bg-blue-50 p-4 rounded-lg border border-blue-200">
                          <div className="flex items-center justify-center space-x-2 text-blue-700">
                            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                            <div
                              className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
                              style={{ animationDelay: "0.1s" }}
                            ></div>
                            <div
                              className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
                              style={{ animationDelay: "0.2s" }}
                            ></div>
                            <span className="text-sm">
                              Processing your request...
                            </span>
                          </div>
                        </div>
                      )}
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

                {/* Input - Hidden in voice mode */}
                {!voiceMode && (
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
                        placeholder="Message Mental Health Companion..."
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
                )}
              </div>
            </AnimatedSection>
          </div>

          {/* Sidebar - Hidden when expanded */}
          {!isExpanded && (
            <div className="space-y-6">
              {/* Voice Bot Card */}
              <AnimatedSection delay={150}>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Volume2 className="h-5 w-5 text-purple-600 mr-2" />
                    VOICEBOT
                  </h3>
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                      {voiceMode
                        ? "You're in voice mode. Click the button below to start a voice conversation."
                        : "Switch to voice mode for a hands-free experience with your mental health companion."}
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
                      <>
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

                        {voiceMode && (
                          <div className="bg-purple-50 p-3 rounded-lg border border-purple-200 mt-2">
                            <p className="text-xs text-purple-800">
                              You're in voice mode. Your conversations will be
                              spoken aloud and not shown in the chat.
                            </p>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </AnimatedSection>

              <AnimatedSection delay={200}>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    AI Features
                  </h3>
                  <div className="space-y-4">
                    {features.map((feature, index) => (
                      <div key={index} className="flex items-start">
                        <div className="bg-blue-100 p-2 rounded-lg mr-3">
                          <feature.icon className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 text-sm">
                            {feature.title}
                          </h4>
                          <p className="text-xs text-gray-600">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </AnimatedSection>

              <AnimatedSection delay={300}>
                <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-200">
                  <div className="bg-yellow-100 p-2 rounded-lg w-fit mb-4">
                    <Shield className="h-6 w-6 text-yellow-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-yellow-900 mb-3">
                    Important Notice
                  </h3>
                  <p className="text-sm text-yellow-800 leading-relaxed">
                    This AI is designed to provide support and coping
                    strategies, but it's not a replacement for professional
                    mental health care. If you're experiencing a crisis, please
                    contact a mental health professional or crisis hotline
                    immediately.
                  </p>
                  <div className="mt-4">
                    <button className="text-sm font-medium text-yellow-700 hover:text-yellow-800 underline">
                      Crisis Resources →
                    </button>
                  </div>
                </div>
              </AnimatedSection>

              <AnimatedSection delay={400}>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Quick Actions
                  </h3>
                  <div className="space-y-3">
                    <button className="w-full text-left p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors border border-blue-100">
                      <div className="font-medium text-blue-900 text-sm">
                        Breathing Exercise
                      </div>
                      <div className="text-xs text-blue-600">
                        5-minute guided session
                      </div>
                    </button>
                    <button className="w-full text-left p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors border border-green-100">
                      <div className="font-medium text-green-900 text-sm">
                        Mood Check-in
                      </div>
                      <div className="text-xs text-green-600">
                        Quick emotional assessment
                      </div>
                    </button>
                    <button className="w-full text-left p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors border border-purple-100">
                      <div className="font-medium text-purple-900 text-sm">
                        Coping Strategies
                      </div>
                      <div className="text-xs text-purple-600">
                        Personalized techniques
                      </div>
                    </button>
                  </div>
                </div>
              </AnimatedSection>
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
