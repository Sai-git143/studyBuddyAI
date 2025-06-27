import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Mic, Video, Settings, Brain, MessageCircle, Zap, Volume2, Phone, PhoneOff } from 'lucide-react';
import VoiceRecognitionButton from './VoiceRecognitionButton';
import TavusVideoInterface from './TavusVideoInterface';
import { useRealTimeAI } from '../../hooks/useRealTimeAI';
import { useAuthStore } from '../../store/authStore';
import { API_CONFIG } from '../../config/api';
import toast from 'react-hot-toast';

interface AITutorInterfaceProps {
  subject?: string;
  topic?: string;
  onEmotionChange?: (emotion: string) => void;
}

interface Message {
  id: number;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  isVoice?: boolean;
  confidence?: number;
  audioUrl?: string;
  videoUrl?: string;
}

const AITutorInterface: React.FC<AITutorInterfaceProps> = ({
  subject = 'General',
  topic = 'Learning',
  onEmotionChange
}) => {
  const { user } = useAuthStore();
  const { generateAIResponse, isProcessing } = useRealTimeAI();
  
  const [textInput, setTextInput] = useState('');
  const [conversation, setConversation] = useState<Message[]>([]);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [isVoiceRecording, setIsVoiceRecording] = useState(false);
  const [videoMode, setVideoMode] = useState<'avatar' | 'conversation'>('conversation');
  const [showVideoChat, setShowVideoChat] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const conversationRef = useRef<HTMLDivElement>(null);

  // Check API configuration
  const isVoiceConfigured = !!API_CONFIG.ELEVENLABS.API_KEY;
  const isVideoConfigured = !!API_CONFIG.TAVUS.API_KEY;
  const isAIConfigured = !!API_CONFIG.GEMINI.API_KEY;

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]);

  // Add welcome message on mount
  useEffect(() => {
    if (conversation.length === 0) {
      const welcomeMessage: Message = {
        id: Date.now(),
        type: 'ai',
        content: `Hello! I'm your AI tutor for ${subject}. I'm here to help you learn ${topic}. You can ask me questions by typing, using voice input, or starting a video conversation. How can I help you today?`,
        timestamp: new Date()
      };
      setConversation([welcomeMessage]);
    }
  }, [subject, topic]);

  const handleTextSubmit = async () => {
    if (!textInput.trim() || isProcessing) return;

    const userMessage: Message = {
      id: Date.now(),
      type: 'user',
      content: textInput,
      timestamp: new Date()
    };

    setConversation(prev => [...prev, userMessage]);
    setTextInput('');

    try {
      const response = await generateAIResponse(
        textInput,
        user?.emotionalState || 'calm',
        false, // Don't include audio for text input
        false // Use Tavus conversation instead of video generation
      );

      const aiMessage: Message = {
        id: Date.now() + 1,
        type: 'ai',
        content: response.text,
        timestamp: response.timestamp,
        videoUrl: response.videoUrl
      };

      setConversation(prev => [...prev, aiMessage]);

      // Detect emotion from response and notify parent
      if (onEmotionChange) {
        onEmotionChange(response.emotion);
      }

    } catch (error) {
      console.error('Failed to get AI response:', error);
      toast.error('Failed to get AI response. Please try again.');
      
      // Add error message to conversation
      const errorMessage: Message = {
        id: Date.now() + 1,
        type: 'ai',
        content: 'I apologize, but I encountered an error processing your request. Please try again or check your internet connection.',
        timestamp: new Date()
      };
      setConversation(prev => [...prev, errorMessage]);
    }
  };

  const handleVoiceTranscript = async (transcript: string, confidence: number) => {
    if (confidence > 0.6 && transcript.trim().length > 5) {
      const userMessage: Message = {
        id: Date.now(),
        type: 'user',
        content: transcript,
        timestamp: new Date(),
        isVoice: true,
        confidence
      };

      setConversation(prev => [...prev, userMessage]);

      try {
        const response = await generateAIResponse(
          transcript,
          user?.emotionalState || 'calm',
          isVoiceConfigured, // Include audio if voice is configured
          false // Use Tavus conversation instead
        );

        const aiMessage: Message = {
          id: Date.now() + 1,
          type: 'ai',
          content: response.text,
          timestamp: response.timestamp,
          audioUrl: response.audioUrl,
          videoUrl: response.videoUrl
        };

        setConversation(prev => [...prev, aiMessage]);

        // Play audio response if available
        if (response.audioUrl) {
          const audio = new Audio(response.audioUrl);
          audio.play().catch(console.error);
        }

        // Detect emotion and notify parent
        if (onEmotionChange) {
          onEmotionChange(response.emotion);
        }

      } catch (error) {
        console.error('Failed to process voice input:', error);
        toast.error('Failed to process voice input. Please try again.');
      }
    }
  };

  const handleVoiceStart = () => {
    setIsVoiceRecording(true);
    toast.success('🎤 Voice recognition started - speak now!');
  };

  const handleVoiceStop = () => {
    setIsVoiceRecording(false);
    toast.info('Voice recognition stopped');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleTextSubmit();
    }
  };

  const handleVideoConversationStart = (conversationUrl: string) => {
    toast.success('Video conversation started! 🎥');
    console.log('Video conversation URL:', conversationUrl);
  };

  const handleVideoConversationEnd = () => {
    toast.info('Video conversation ended');
    setShowVideoChat(false);
  };

  const handleStartVideoChat = () => {
    if (!isVideoConfigured) {
      toast.error('Tavus API not configured. Please check your .env file.');
      return;
    }
    setShowVideoChat(true);
    setVideoMode('conversation');
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-primary-50 to-secondary-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Brain className="h-6 w-6 text-primary-600 mr-3" />
            <div>
              <h3 className="font-semibold text-gray-900">AI Tutor</h3>
              <p className="text-sm text-gray-600">{subject} • {topic}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Feature Status Indicators */}
            <div className="flex items-center space-x-1 mr-3">
              <div className={`w-2 h-2 rounded-full ${isAIConfigured ? 'bg-green-500' : 'bg-red-500'}`} title="AI Status"></div>
              <div className={`w-2 h-2 rounded-full ${isVoiceConfigured ? 'bg-green-500' : 'bg-yellow-500'}`} title="Voice Status"></div>
              <div className={`w-2 h-2 rounded-full ${isVideoConfigured ? 'bg-green-500' : 'bg-yellow-500'}`} title="Video Status"></div>
            </div>

            {/* Video Chat Button */}
            <button
              onClick={handleStartVideoChat}
              disabled={!isVideoConfigured}
              className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                isVideoConfigured
                  ? 'bg-green-500 text-white hover:bg-green-600'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
              title={isVideoConfigured ? 'Start Video Chat' : 'Tavus API not configured'}
            >
              <Phone className="h-4 w-4 mr-2" />
              Start Video Chat
            </button>

            {/* Video Mode Toggle */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setVideoMode('conversation')}
                className={`px-3 py-1 text-xs rounded-md transition-colors ${
                  videoMode === 'conversation'
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-gray-600'
                }`}
              >
                Live Chat
              </button>
              <button
                onClick={() => setVideoMode('avatar')}
                className={`px-3 py-1 text-xs rounded-md transition-colors ${
                  videoMode === 'avatar'
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-gray-600'
                }`}
              >
                Avatar
              </button>
            </div>

            <button
              onClick={() => setIsVoiceEnabled(!isVoiceEnabled)}
              className={`p-2 rounded-lg transition-colors ${
                isVoiceEnabled 
                  ? 'bg-green-100 text-green-600' 
                  : 'bg-gray-100 text-gray-600'
              }`}
              title={`Voice Recognition: ${isVoiceEnabled ? 'On' : 'Off'}`}
            >
              <Mic className="h-4 w-4" />
            </button>

            <button
              onClick={() => setIsVideoEnabled(!isVideoEnabled)}
              className={`p-2 rounded-lg transition-colors ${
                isVideoEnabled 
                  ? 'bg-blue-100 text-blue-600' 
                  : 'bg-gray-100 text-gray-600'
              }`}
              title={`Video: ${isVideoEnabled ? 'On' : 'Off'}`}
            >
              <Video className="h-4 w-4" />
            </button>

            <button className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
              <Settings className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Configuration Status */}
        {(!isAIConfigured || !isVoiceConfigured || !isVideoConfigured) && (
          <div className="mt-3 p-2 bg-yellow-50 rounded-lg border border-yellow-200">
            <p className="text-xs text-yellow-800">
              <strong>Setup Status:</strong>
              {!isAIConfigured && ' AI (Gemini) not configured.'}
              {!isVoiceConfigured && ' Voice (ElevenLabs) not configured.'}
              {!isVideoConfigured && ' Video (Tavus) not configured.'}
              {' '}Check your .env file for API keys.
            </p>
          </div>
        )}
      </div>

      {/* Video Chat Modal */}
      <AnimatePresence>
        {showVideoChat && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
            >
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-xl font-semibold">AI Video Tutor</h2>
                <button
                  onClick={() => setShowVideoChat(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  ✕
                </button>
              </div>
              <div className="h-96">
                <TavusVideoInterface
                  subject={subject}
                  topic={topic}
                  personaId={API_CONFIG.TAVUS.REPLICA_ID || 'default-persona'}
                  onConversationStart={handleVideoConversationStart}
                  onConversationEnd={handleVideoConversationEnd}
                  className="h-full"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
        
        {/* Video Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-gray-900">
              {videoMode === 'conversation' ? 'AI Video Conversation' : 'AI Video Avatar'}
            </h4>
            <div className="flex items-center text-xs text-gray-500">
              {isVideoEnabled ? (
                <span className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                  Active
                </span>
              ) : (
                <span className="flex items-center">
                  <div className="w-2 h-2 bg-gray-400 rounded-full mr-1"></div>
                  Disabled
                </span>
              )}
            </div>
          </div>
          
          {videoMode === 'conversation' ? (
            <div className="h-64 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-2xl flex items-center justify-center border-2 border-dashed border-primary-300">
              <div className="text-center">
                <Phone className="h-12 w-12 text-primary-600 mx-auto mb-4" />
                <p className="font-medium text-primary-800 mb-2">Ready for Video Chat</p>
                <p className="text-sm text-primary-600 mb-4">Click "Start Video Chat" to begin</p>
                <button
                  onClick={handleStartVideoChat}
                  disabled={!isVideoConfigured}
                  className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                    isVideoConfigured
                      ? 'bg-primary-600 text-white hover:bg-primary-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {isVideoConfigured ? 'Start Video Chat' : 'Configure Tavus API'}
                </button>
              </div>
            </div>
          ) : (
            <div className="h-64 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center">
              <div className="text-center text-gray-600">
                <Video className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="font-medium">Avatar Mode</p>
                <p className="text-sm opacity-75">Switch to Live Chat for real-time video</p>
              </div>
            </div>
          )}
        </div>

        {/* Conversation Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-gray-900">Text Conversation</h4>
            <div className="flex items-center text-xs text-gray-500">
              <MessageCircle className="h-3 w-3 mr-1" />
              {conversation.length} messages
            </div>
          </div>
          
          {/* Chat Messages */}
          <div 
            ref={conversationRef}
            className="h-48 overflow-y-auto bg-gray-50 rounded-lg p-4 space-y-3 scroll-smooth"
          >
            <AnimatePresence>
              {conversation.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-xs px-4 py-2 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-primary-500 text-white'
                      : 'bg-white text-gray-900 border border-gray-200'
                  }`}>
                    <p className="text-sm">{message.content}</p>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-xs opacity-70">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                      <div className="flex items-center space-x-1">
                        {message.isVoice && (
                          <span className="text-xs opacity-70" title="Voice Input">🎤</span>
                        )}
                        {message.confidence && (
                          <span className="text-xs opacity-70" title={`Confidence: ${Math.round(message.confidence * 100)}%`}>
                            {Math.round(message.confidence * 100)}%
                          </span>
                        )}
                        {message.audioUrl && (
                          <button 
                            onClick={() => {
                              const audio = new Audio(message.audioUrl);
                              audio.play().catch(console.error);
                            }}
                            className="text-xs opacity-70 hover:opacity-100"
                            title="Play Audio"
                          >
                            <Volume2 className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {isProcessing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="bg-white border border-gray-200 px-4 py-2 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-sm text-gray-600">AI is thinking...</span>
                  </div>
                </div>
              </motion.div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Section */}
          <div className="space-y-3">
            {/* Text Input */}
            <div className="flex space-x-2">
              <textarea
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your question or press Enter to send..."
                className="flex-1 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                rows={2}
                disabled={isProcessing}
              />
              <button
                onClick={handleTextSubmit}
                disabled={isProcessing || !textInput.trim()}
                className="bg-primary-500 text-white p-3 rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50 self-end"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>

            {/* Voice Input */}
            {isVoiceEnabled && (
              <div className="flex justify-center">
                <VoiceRecognitionButton
                  onTranscript={handleVoiceTranscript}
                  onStart={handleVoiceStart}
                  onStop={handleVoiceStop}
                  disabled={isProcessing}
                  continuous={false}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className={`w-2 h-2 rounded-full mr-2 ${
                isProcessing ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'
              }`}></div>
              {isProcessing ? 'Processing...' : 'Ready'}
            </div>
            
            <div className="flex items-center space-x-2">
              <span>Voice:</span>
              <span className={isVoiceEnabled && isVoiceConfigured ? 'text-green-600' : 'text-gray-400'}>
                {isVoiceEnabled && isVoiceConfigured ? 'Ready' : 'Off'}
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <span>Video:</span>
              <span className={isVideoEnabled && isVideoConfigured ? 'text-blue-600' : 'text-gray-400'}>
                {isVideoEnabled && isVideoConfigured ? 'Ready' : 'Off'}
              </span>
            </div>

            {isVoiceRecording && (
              <div className="flex items-center space-x-2 text-red-600">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span>Recording...</span>
              </div>
            )}
          </div>

          <div className="text-xs flex items-center">
            <Zap className="h-3 w-3 mr-1 text-yellow-500" />
            Powered by Tavus & Gemini AI • {conversation.length} messages
          </div>
        </div>
      </div>
    </div>
  );
};

export default AITutorInterface;