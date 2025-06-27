import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Video, 
  Phone, 
  PhoneOff, 
  Users, 
  BookOpen, 
  Brain,
  MessageCircle,
  Settings,
  Maximize,
  X
} from 'lucide-react';
import TavusVibeChat from '../tavus/TavusVibeChat';
import { useTavusVibecode } from '../../hooks/useTavusVibecode';
import { API_CONFIG } from '../../config/api';
import toast from 'react-hot-toast';

interface TavusVibeStudySessionProps {
  subject: string;
  topic: string;
  onSessionEnd?: () => void;
  className?: string;
}

const TavusVibeStudySession: React.FC<TavusVibeStudySessionProps> = ({
  subject,
  topic,
  onSessionEnd,
  className = ''
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [sessionNotes, setSessionNotes] = useState('');

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
  } = useTavusVibecode();

  const handleStartSession = async () => {
    if (!isConfigured) {
      toast.error('Tavus API not configured. Please check your .env file.');
      return;
    }

    const conversationName = `StudyBuddy_${subject}_${topic}_${Date.now()}`;
    const personaId = API_CONFIG.TAVUS.REPLICA_ID || 'default-persona';
    
    await startConversation(personaId, conversationName);
  };

  const handleEndSession = async () => {
    await endConversation();
    if (onSessionEnd) {
      onSessionEnd();
    }
  };

  const handleGetTranscript = async () => {
    const transcript = await getTranscript();
    if (transcript) {
      console.log('Session transcript:', transcript);
      toast.success('Transcript retrieved successfully');
      // You could save this to user's session history
    } else {
      toast.info('No transcript available yet');
    }
  };

  const handleGetRecording = async () => {
    const recordingUrl = await getRecording();
    if (recordingUrl) {
      window.open(recordingUrl, '_blank');
      toast.success('Opening session recording');
    } else {
      toast.info('No recording available yet');
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  if (!isConfigured) {
    return (
      <div className={`bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl p-8 text-center ${className}`}>
        <div className="max-w-md mx-auto">
          <Video className="h-16 w-16 text-gray-400 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-700 mb-4">Tavus Vibecode Setup Required</h2>
          <p className="text-gray-600 mb-6">
            To enable AI video conversations with Tavus Vibecode, you need to configure your API credentials.
          </p>
          <div className="bg-white p-6 rounded-xl border border-gray-200 text-left">
            <h3 className="font-semibold text-gray-900 mb-3">Required Environment Variables:</h3>
            <div className="space-y-2 font-mono text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">VITE_TAVUS_API_KEY</span>
                <span className="text-red-500 text-xs">Missing</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">VITE_TAVUS_REPLICA_ID</span>
                <span className="text-red-500 text-xs">Missing</span>
              </div>
            </div>
          </div>
          <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
            <p className="text-sm text-blue-700">
              💡 <strong>Get started:</strong> Visit <a href="https://tavus.io" target="_blank" rel="noopener noreferrer" className="underline">tavus.io</a> to get your API keys and set up your AI persona.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={`bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden ${className}`}>
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-primary-50 to-secondary-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-primary-500 to-secondary-500 p-3 rounded-lg mr-4">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">AI Video Study Session</h2>
                <p className="text-gray-600">{subject} • {topic}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {conversationStatus && (
                <div className="flex items-center text-sm text-gray-600">
                  <div className={`w-2 h-2 rounded-full mr-2 ${
                    conversationStatus.status === 'active' ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
                  }`}></div>
                  <span className="capitalize">{conversationStatus.status}</span>
                  {conversationStatus.status === 'active' && (
                    <span className="ml-2">• {Math.floor(conversationStatus.duration / 60)}:{(conversationStatus.duration % 60).toString().padStart(2, '0')}</span>
                  )}
                </div>
              )}
              
              <button
                onClick={toggleFullscreen}
                className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
              >
                <Maximize className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
          
          {/* Video Chat Area */}
          <div className="lg:col-span-2">
            <TavusVibeChat
              personaId={API_CONFIG.TAVUS.REPLICA_ID}
              conversationName={`StudyBuddy_${subject}_${topic}`}
              subject={subject}
              topic={topic}
              className="h-96"
            />
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            
            {/* Session Info */}
            <div className="bg-gray-50 p-4 rounded-xl">
              <h3 className="font-semibold text-gray-900 mb-3">Session Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subject:</span>
                  <span className="font-medium">{subject}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Topic:</span>
                  <span className="font-medium">{topic}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className={`font-medium ${
                    conversation ? 'text-green-600' : 'text-gray-600'
                  }`}>
                    {conversation ? 'Active' : 'Ready'}
                  </span>
                </div>
                {conversationStatus && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Participants:</span>
                    <span className="font-medium">{conversationStatus.participant_count}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900">Quick Actions</h3>
              
              {!conversation ? (
                <button
                  onClick={handleStartSession}
                  disabled={isLoading}
                  className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Starting...
                    </>
                  ) : (
                    <>
                      <Phone className="h-4 w-4 mr-2" />
                      Start Video Session
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={handleEndSession}
                  className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center"
                >
                  <PhoneOff className="h-4 w-4 mr-2" />
                  End Session
                </button>
              )}

              <button
                onClick={() => setShowChat(!showChat)}
                className="w-full border border-primary-500 text-primary-500 py-2 rounded-lg hover:bg-primary-50 transition-colors flex items-center justify-center"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                {showChat ? 'Hide' : 'Show'} Chat
              </button>

              {conversationStatus?.status === 'ended' && (
                <>
                  <button
                    onClick={handleGetTranscript}
                    className="w-full border border-blue-500 text-blue-500 py-2 rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center"
                  >
                    <BookOpen className="h-4 w-4 mr-2" />
                    Get Transcript
                  </button>

                  <button
                    onClick={handleGetRecording}
                    className="w-full border border-purple-500 text-purple-500 py-2 rounded-lg hover:bg-purple-50 transition-colors flex items-center justify-center"
                  >
                    <Video className="h-4 w-4 mr-2" />
                    View Recording
                  </button>
                </>
              )}
            </div>

            {/* Session Notes */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Session Notes</h3>
              <textarea
                value={sessionNotes}
                onChange={(e) => setSessionNotes(e.target.value)}
                placeholder="Take notes during your session..."
                className="w-full h-32 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
              />
            </div>

            {/* Error Display */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
            >
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-xl font-semibold">AI Video Study Session - Fullscreen</h2>
                <button
                  onClick={toggleFullscreen}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="h-[70vh]">
                <TavusVibeChat
                  personaId={API_CONFIG.TAVUS.REPLICA_ID}
                  conversationName={`StudyBuddy_${subject}_${topic}`}
                  subject={subject}
                  topic={topic}
                  className="h-full"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default TavusVibeStudySession;