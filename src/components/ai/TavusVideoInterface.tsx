import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Phone, 
  PhoneOff,
  Settings,
  Download,
  FileText,
  Loader,
  AlertCircle,
  Play,
  Pause
} from 'lucide-react';
import { useTavusConversation } from '../../hooks/useTavusConversation';
import { useAuthStore } from '../../store/authStore';

interface TavusVideoInterfaceProps {
  subject: string;
  topic: string;
  personaId?: string;
  onConversationStart?: (conversationUrl: string) => void;
  onConversationEnd?: () => void;
  className?: string;
}

const TavusVideoInterface: React.FC<TavusVideoInterfaceProps> = ({
  subject,
  topic,
  personaId = 'default-persona',
  onConversationStart,
  onConversationEnd,
  className = ''
}) => {
  const { user } = useAuthStore();
  const {
    conversation,
    conversationStatus,
    isLoading,
    error,
    isConfigured,
    startConversation,
    endConversation,
    getTranscript,
    getRecording
  } = useTavusConversation();

  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [showTranscript, setShowTranscript] = useState(false);
  const [transcript, setTranscript] = useState<string | null>(null);

  useEffect(() => {
    if (conversation?.conversation_url && onConversationStart) {
      onConversationStart(conversation.conversation_url);
    }
  }, [conversation?.conversation_url, onConversationStart]);

  const handleStartConversation = async () => {
    const result = await startConversation(personaId, subject, topic);
    if (result) {
      console.log('Conversation started:', result);
    }
  };

  const handleEndConversation = async () => {
    await endConversation();
    if (onConversationEnd) {
      onConversationEnd();
    }
  };

  const handleGetTranscript = async () => {
    const transcriptData = await getTranscript();
    setTranscript(transcriptData);
    setShowTranscript(true);
  };

  const handleDownloadRecording = async () => {
    const recordingUrl = await getRecording();
    if (recordingUrl) {
      window.open(recordingUrl, '_blank');
    }
  };

  if (!isConfigured) {
    return (
      <div className={`bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl p-8 text-center ${className}`}>
        <div className="max-w-sm mx-auto">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Tavus Video Chat Setup Required</h3>
          <p className="text-gray-600 text-sm mb-4">
            To enable AI video conversations, configure your Tavus API credentials in your .env file:
          </p>
          <div className="text-left bg-white p-4 rounded-lg text-sm text-gray-700 border">
            <p className="font-medium mb-2 text-gray-900">Required Environment Variables:</p>
            <div className="space-y-1 font-mono text-xs">
              <div className="flex justify-between">
                <span>VITE_TAVUS_API_KEY</span>
                <span className="text-red-500">Missing</span>
              </div>
            </div>
          </div>
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-xs text-blue-700">
              💡 Get your API key from <a href="https://tavus.io" target="_blank" rel="noopener noreferrer" className="underline">tavus.io</a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-primary-50 to-secondary-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Video className="h-6 w-6 text-primary-600 mr-3" />
            <div>
              <h3 className="font-semibold text-gray-900">AI Video Tutor</h3>
              <p className="text-sm text-gray-600">{subject} • {topic}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {conversationStatus && (
              <div className="flex items-center text-sm">
                <div className={`w-2 h-2 rounded-full mr-2 ${
                  conversationStatus.status === 'active' ? 'bg-green-500 animate-pulse' :
                  conversationStatus.status === 'ended' ? 'bg-gray-400' :
                  'bg-red-500'
                }`}></div>
                <span className="text-gray-600 capitalize">{conversationStatus.status}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Video Area */}
      <div className="relative h-96 bg-gray-900">
        {conversation?.conversation_url ? (
          <iframe
            src={conversation.conversation_url}
            className="w-full h-full"
            allow="camera; microphone; fullscreen"
            title="Tavus AI Video Conversation"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
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
          </div>
        )}

        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="text-center text-white">
              <Loader className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p className="text-lg font-medium">Starting Video Conversation...</p>
              <p className="text-sm opacity-75">This may take a moment</p>
            </div>
          </div>
        )}

        {/* Error Overlay */}
        {error && (
          <div className="absolute inset-0 bg-red-900/80 flex items-center justify-center">
            <div className="text-center text-white p-6 max-w-sm">
              <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Connection Failed</h3>
              <p className="text-sm opacity-75 mb-4">{error}</p>
              <button
                onClick={handleStartConversation}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="p-4 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {!conversation ? (
              <button
                onClick={handleStartConversation}
                disabled={isLoading}
                className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 flex items-center"
              >
                {isLoading ? (
                  <>
                    <Loader className="h-4 w-4 mr-2 animate-spin" />
                    Starting...
                  </>
                ) : (
                  <>
                    <Phone className="h-4 w-4 mr-2" />
                    Start Video Chat
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={handleEndConversation}
                className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center"
              >
                <PhoneOff className="h-4 w-4 mr-2" />
                End Chat
              </button>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsVideoEnabled(!isVideoEnabled)}
              className={`p-2 rounded-lg transition-colors ${
                isVideoEnabled 
                  ? 'bg-blue-100 text-blue-600' 
                  : 'bg-gray-100 text-gray-600'
              }`}
              title={`Video: ${isVideoEnabled ? 'On' : 'Off'}`}
            >
              {isVideoEnabled ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
            </button>

            <button
              onClick={() => setIsAudioEnabled(!isAudioEnabled)}
              className={`p-2 rounded-lg transition-colors ${
                isAudioEnabled 
                  ? 'bg-green-100 text-green-600' 
                  : 'bg-gray-100 text-gray-600'
              }`}
              title={`Audio: ${isAudioEnabled ? 'On' : 'Off'}`}
            >
              {isAudioEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
            </button>

            {conversationStatus?.status === 'ended' && (
              <>
                <button
                  onClick={handleGetTranscript}
                  className="p-2 rounded-lg bg-purple-100 text-purple-600 hover:bg-purple-200 transition-colors"
                  title="View Transcript"
                >
                  <FileText className="h-4 w-4" />
                </button>

                <button
                  onClick={handleDownloadRecording}
                  className="p-2 rounded-lg bg-orange-100 text-orange-600 hover:bg-orange-200 transition-colors"
                  title="Download Recording"
                >
                  <Download className="h-4 w-4" />
                </button>
              </>
            )}

            <button className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
              <Settings className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Status Information */}
        {conversationStatus && (
          <div className="mt-3 flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center space-x-4">
              <span>Participants: {conversationStatus.participant_count}</span>
              <span>Duration: {Math.floor(conversationStatus.duration / 60)}:{(conversationStatus.duration % 60).toString().padStart(2, '0')}</span>
            </div>
            
            {conversationStatus.status === 'active' && (
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                <span>Live</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Transcript Modal */}
      <AnimatePresence>
        {showTranscript && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
            >
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-semibold">Conversation Transcript</h3>
                <button
                  onClick={() => setShowTranscript(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  ✕
                </button>
              </div>
              <div className="p-6 overflow-y-auto max-h-96">
                {transcript ? (
                  <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                    {transcript}
                  </div>
                ) : (
                  <div className="text-center text-gray-500">
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No transcript available yet</p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TavusVideoInterface;