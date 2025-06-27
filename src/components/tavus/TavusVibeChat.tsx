import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Phone, 
  PhoneOff, 
  Mic, 
  MicOff, 
  Video, 
  VideoOff,
  Settings,
  Users,
  MessageCircle,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  RotateCcw
} from 'lucide-react';
import { API_CONFIG } from '../../config/api';
import toast from 'react-hot-toast';

interface TavusVibeChatProps {
  personaId?: string;
  conversationName?: string;
  onConversationStart?: (conversationUrl: string) => void;
  onConversationEnd?: () => void;
  className?: string;
  subject?: string;
  topic?: string;
}

interface ConversationState {
  isActive: boolean;
  conversationId: string | null;
  conversationUrl: string | null;
  participants: number;
  duration: number;
  status: 'idle' | 'connecting' | 'active' | 'ended' | 'error';
}

const TavusVibeChat: React.FC<TavusVibeChatProps> = ({
  personaId = API_CONFIG.TAVUS.REPLICA_ID || 'default-persona',
  conversationName,
  onConversationStart,
  onConversationEnd,
  className = '',
  subject = 'General Study',
  topic = 'Learning Session'
}) => {
  const [conversation, setConversation] = useState<ConversationState>({
    isActive: false,
    conversationId: null,
    conversationUrl: null,
    participants: 0,
    duration: 0,
    status: 'idle'
  });

  const [controls, setControls] = useState({
    isMuted: false,
    isVideoOff: false,
    isFullscreen: false
  });

  const [error, setError] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const durationInterval = useRef<NodeJS.Timeout | null>(null);

  // Check if Tavus is properly configured
  const isConfigured = !!(API_CONFIG.TAVUS.API_KEY && personaId);

  useEffect(() => {
    return () => {
      if (durationInterval.current) {
        clearInterval(durationInterval.current);
      }
    };
  }, []);

  const startConversation = async () => {
    if (!isConfigured) {
      setError('Tavus API not configured. Please add your API key and replica ID.');
      toast.error('Tavus API not configured');
      return;
    }

    setConversation(prev => ({ ...prev, status: 'connecting' }));
    setError(null);

    try {
      console.log('Starting Tavus Vibecode conversation...', { personaId, subject, topic });

      // Create conversation using Tavus API
      const response = await fetch(`${API_CONFIG.TAVUS.BASE_URL}/conversations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': API_CONFIG.TAVUS.API_KEY!,
        },
        body: JSON.stringify({
          persona_id: personaId,
          conversation_name: conversationName || `StudyBuddy_${subject}_${topic}_${Date.now()}`,
          properties: {
            max_call_duration: 3600, // 1 hour
            participant_left_timeout: 60,
            participant_absent_timeout: 300,
            enable_recording: true,
            enable_transcription: true,
            language: 'en'
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Failed to create conversation: ${response.status} ${response.statusText} - ${errorData}`);
      }

      const conversationData = await response.json();
      console.log('Conversation created:', conversationData);

      setConversation({
        isActive: true,
        conversationId: conversationData.conversation_id,
        conversationUrl: conversationData.conversation_url,
        participants: 1,
        duration: 0,
        status: 'active'
      });

      // Start duration timer
      durationInterval.current = setInterval(() => {
        setConversation(prev => ({
          ...prev,
          duration: prev.duration + 1
        }));
      }, 1000);

      // Notify parent component
      if (onConversationStart && conversationData.conversation_url) {
        onConversationStart(conversationData.conversation_url);
      }

      toast.success('Video conversation started! 🎥');

    } catch (error) {
      console.error('Failed to start conversation:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to start video conversation';
      setError(errorMessage);
      setConversation(prev => ({ ...prev, status: 'error' }));
      toast.error('Failed to start video conversation');
    }
  };

  const endConversation = async () => {
    if (!conversation.conversationId) return;

    try {
      // End conversation via API
      await fetch(`${API_CONFIG.TAVUS.BASE_URL}/conversations/${conversation.conversationId}/end`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': API_CONFIG.TAVUS.API_KEY!,
        }
      });

      // Clear duration timer
      if (durationInterval.current) {
        clearInterval(durationInterval.current);
        durationInterval.current = null;
      }

      setConversation({
        isActive: false,
        conversationId: null,
        conversationUrl: null,
        participants: 0,
        duration: 0,
        status: 'ended'
      });

      if (onConversationEnd) {
        onConversationEnd();
      }

      toast.success('Video conversation ended');

    } catch (error) {
      console.error('Failed to end conversation:', error);
      toast.error('Failed to end conversation properly');
    }
  };

  const toggleMute = () => {
    setControls(prev => ({ ...prev, isMuted: !prev.isMuted }));
    // In a real implementation, this would control the iframe's audio
  };

  const toggleVideo = () => {
    setControls(prev => ({ ...prev, isVideoOff: !prev.isVideoOff }));
    // In a real implementation, this would control the iframe's video
  };

  const toggleFullscreen = () => {
    setControls(prev => ({ ...prev, isFullscreen: !prev.isFullscreen }));
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const restartConversation = async () => {
    await endConversation();
    setTimeout(() => {
      startConversation();
    }, 1000);
  };

  if (!isConfigured) {
    return (
      <div className={`bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl p-8 text-center ${className}`}>
        <div className="max-w-sm mx-auto">
          <Video className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Tavus Video Chat Setup Required</h3>
          <p className="text-gray-600 text-sm mb-4">
            To enable AI video conversations, configure your Tavus API credentials:
          </p>
          <div className="text-left bg-white p-4 rounded-lg text-sm text-gray-700 border">
            <p className="font-medium mb-2 text-gray-900">Required Environment Variables:</p>
            <div className="space-y-1 font-mono text-xs">
              <div className="flex justify-between">
                <span>VITE_TAVUS_API_KEY</span>
                <span className="text-red-500">Missing</span>
              </div>
              <div className="flex justify-between">
                <span>VITE_TAVUS_REPLICA_ID</span>
                <span className="text-red-500">Missing</span>
              </div>
            </div>
          </div>
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-xs text-blue-700">
              💡 Get your API keys from <a href="https://tavus.io" target="_blank" rel="noopener noreferrer" className="underline">tavus.io</a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-primary-50 to-secondary-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Video className="h-6 w-6 text-primary-600 mr-3" />
            <div>
              <h3 className="font-semibold text-gray-900">AI Video Tutor</h3>
              <p className="text-sm text-gray-600">{subject} • {topic}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {conversation.status === 'active' && (
              <div className="flex items-center text-sm">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse mr-2"></div>
                <span className="text-gray-600">Live • {formatDuration(conversation.duration)}</span>
              </div>
            )}
            
            <div className="flex items-center text-sm text-gray-600">
              <Users className="h-4 w-4 mr-1" />
              {conversation.participants}
            </div>
          </div>
        </div>
      </div>

      {/* Video Area */}
      <div className="relative h-96 bg-gray-900">
        <AnimatePresence mode="wait">
          {conversation.status === 'idle' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="text-center text-white">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <Video className="h-8 w-8" />
                </motion.div>
                <p className="text-lg font-medium mb-2">AI Video Tutor Ready</p>
                <p className="text-sm opacity-75">Start a conversation to begin learning</p>
              </div>
            </motion.div>
          )}

          {conversation.status === 'connecting' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-black/50"
            >
              <div className="text-center text-white">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                <p className="text-lg font-medium mb-2">Connecting to AI Tutor...</p>
                <p className="text-sm opacity-75">This may take a moment</p>
              </div>
            </motion.div>
          )}

          {conversation.status === 'active' && conversation.conversationUrl && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full"
            >
              <iframe
                ref={iframeRef}
                src={conversation.conversationUrl}
                className="w-full h-full"
                allow="camera; microphone; fullscreen; display-capture"
                title="Tavus AI Video Conversation"
                style={{ border: 'none' }}
              />
            </motion.div>
          )}

          {conversation.status === 'error' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-red-900/80"
            >
              <div className="text-center text-white p-6 max-w-sm">
                <PhoneOff className="h-12 w-12 text-red-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Connection Failed</h3>
                <p className="text-sm opacity-75 mb-4">{error}</p>
                <button
                  onClick={restartConversation}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center mx-auto"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Try Again
                </button>
              </div>
            </motion.div>
          )}

          {conversation.status === 'ended' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-gray-800/80"
            >
              <div className="text-center text-white">
                <PhoneOff className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium mb-2">Conversation Ended</p>
                <p className="text-sm opacity-75">Duration: {formatDuration(conversation.duration)}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="p-4 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {conversation.status === 'idle' ? (
              <button
                onClick={startConversation}
                className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors flex items-center font-medium"
              >
                <Phone className="h-5 w-5 mr-2" />
                Start Video Chat
              </button>
            ) : conversation.status === 'active' ? (
              <button
                onClick={endConversation}
                className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors flex items-center font-medium"
              >
                <PhoneOff className="h-5 w-5 mr-2" />
                End Chat
              </button>
            ) : conversation.status === 'connecting' ? (
              <button
                disabled
                className="bg-gray-400 text-white px-6 py-3 rounded-lg cursor-not-allowed flex items-center font-medium"
              >
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Connecting...
              </button>
            ) : (
              <button
                onClick={startConversation}
                className="bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition-colors flex items-center font-medium"
              >
                <Phone className="h-5 w-5 mr-2" />
                Start New Chat
              </button>
            )}
          </div>

          {conversation.status === 'active' && (
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleMute}
                className={`p-3 rounded-lg transition-colors ${
                  controls.isMuted 
                    ? 'bg-red-100 text-red-600' 
                    : 'bg-green-100 text-green-600'
                }`}
                title={controls.isMuted ? 'Unmute' : 'Mute'}
              >
                {controls.isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </button>

              <button
                onClick={toggleVideo}
                className={`p-3 rounded-lg transition-colors ${
                  controls.isVideoOff 
                    ? 'bg-red-100 text-red-600' 
                    : 'bg-blue-100 text-blue-600'
                }`}
                title={controls.isVideoOff ? 'Turn on video' : 'Turn off video'}
              >
                {controls.isVideoOff ? <VideoOff className="h-4 w-4" /> : <Video className="h-4 w-4" />}
              </button>

              <button
                onClick={toggleFullscreen}
                className="p-3 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                title={controls.isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
              >
                {controls.isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
              </button>

              <button className="p-3 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
                <Settings className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        {/* Status Information */}
        {conversation.status === 'active' && (
          <div className="mt-3 flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center space-x-4">
              <span>Quality: HD</span>
              <span>Latency: Low</span>
            </div>
            
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              <span>Connected</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TavusVibeChat;