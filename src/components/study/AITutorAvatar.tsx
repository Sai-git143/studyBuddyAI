import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Mic, MicOff } from 'lucide-react';

interface AITutorAvatarProps {
  isEnabled: boolean;
  isSpeaking: boolean;
  emotion: 'calm' | 'excited' | 'frustrated' | 'confident' | 'anxious';
}

const AITutorAvatar: React.FC<AITutorAvatarProps> = ({ isEnabled, isSpeaking, emotion }) => {
  const getEmotionColor = () => {
    switch (emotion) {
      case 'calm': return 'from-blue-400 to-blue-600';
      case 'excited': return 'from-yellow-400 to-orange-500';
      case 'frustrated': return 'from-red-400 to-red-600';
      case 'confident': return 'from-green-400 to-green-600';
      case 'anxious': return 'from-purple-400 to-purple-600';
      default: return 'from-blue-400 to-blue-600';
    }
  };

  const getEmotionExpression = () => {
    switch (emotion) {
      case 'calm': return '😌';
      case 'excited': return '🤩';
      case 'frustrated': return '😤';
      case 'confident': return '😎';
      case 'anxious': return '😰';
      default: return '😊';
    }
  };

  if (!isEnabled) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-100 rounded-2xl">
        <div className="text-center">
          <div className="bg-gray-300 p-4 rounded-full mb-4 mx-auto w-fit">
            <Brain className="h-8 w-8 text-gray-600" />
          </div>
          <p className="text-gray-600">Video Avatar Disabled</p>
          <p className="text-sm text-gray-500 mt-1">Enable to see your AI tutor</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-64 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 opacity-20">
        <div className={`absolute inset-0 bg-gradient-to-br ${getEmotionColor()} animate-pulse-soft`}></div>
      </div>

      {/* Avatar Container */}
      <div className="relative h-full flex items-center justify-center">
        <motion.div
          animate={{
            scale: isSpeaking ? [1, 1.05, 1] : 1,
            rotate: isSpeaking ? [0, 1, -1, 0] : 0
          }}
          transition={{
            duration: isSpeaking ? 0.5 : 0,
            repeat: isSpeaking ? Infinity : 0,
            ease: "easeInOut"
          }}
          className="relative"
        >
          {/* Main Avatar Circle */}
          <div className={`w-32 h-32 rounded-full bg-gradient-to-br ${getEmotionColor()} flex items-center justify-center shadow-2xl`}>
            <div className="text-4xl">{getEmotionExpression()}</div>
          </div>

          {/* Speaking Indicator */}
          {isSpeaking && (
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="absolute -inset-4 rounded-full border-4 border-white/30"
            />
          )}

          {/* Microphone Indicator */}
          <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-2 shadow-lg">
            {isSpeaking ? (
              <Mic className="h-4 w-4 text-green-600" />
            ) : (
              <MicOff className="h-4 w-4 text-gray-400" />
            )}
          </div>
        </motion.div>
      </div>

      {/* Status Text */}
      <div className="absolute bottom-4 left-4 right-4 text-center">
        <div className="bg-black/50 backdrop-blur-sm rounded-lg px-3 py-2">
          <p className="text-white text-sm font-medium">
            {isSpeaking ? 'Speaking...' : 'Listening'}
          </p>
          <p className="text-white/70 text-xs capitalize">
            Feeling {emotion}
          </p>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-4 left-4 w-2 h-2 bg-white/30 rounded-full animate-bounce-gentle"></div>
      <div className="absolute top-8 right-6 w-1 h-1 bg-white/40 rounded-full animate-bounce-gentle" style={{ animationDelay: '0.5s' }}></div>
      <div className="absolute bottom-8 left-8 w-1.5 h-1.5 bg-white/20 rounded-full animate-bounce-gentle" style={{ animationDelay: '1s' }}></div>
    </div>
  );
};

export default AITutorAvatar;