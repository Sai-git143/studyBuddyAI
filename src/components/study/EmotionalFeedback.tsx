import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Brain, Zap, Cloud, Star, TrendingUp } from 'lucide-react';

interface EmotionalFeedbackProps {
  currentEmotion: 'calm' | 'excited' | 'frustrated' | 'confident' | 'anxious';
  onEmotionChange: (emotion: 'calm' | 'excited' | 'frustrated' | 'confident' | 'anxious') => void;
}

const EmotionalFeedback: React.FC<EmotionalFeedbackProps> = ({ currentEmotion, onEmotionChange }) => {
  const emotions = [
    { 
      id: 'calm', 
      label: 'Calm', 
      icon: Cloud, 
      color: 'bg-blue-500', 
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      feedback: 'Perfect mindset for learning! Your focus is excellent.',
      suggestion: 'Continue at this steady pace.'
    },
    { 
      id: 'excited', 
      label: 'Excited', 
      icon: Star, 
      color: 'bg-yellow-500', 
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-700',
      feedback: 'Great energy! Channel this enthusiasm into learning.',
      suggestion: 'Try some challenging problems to match your energy.'
    },
    { 
      id: 'frustrated', 
      label: 'Frustrated', 
      icon: Zap, 
      color: 'bg-red-500', 
      bgColor: 'bg-red-50',
      textColor: 'text-red-700',
      feedback: 'It\'s okay to feel stuck. This is part of learning.',
      suggestion: 'Let\'s break this down into smaller steps.'
    },
    { 
      id: 'confident', 
      label: 'Confident', 
      icon: Brain, 
      color: 'bg-green-500', 
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
      feedback: 'Excellent! You\'re ready for more advanced topics.',
      suggestion: 'Let\'s tackle some challenging concepts.'
    },
    { 
      id: 'anxious', 
      label: 'Anxious', 
      icon: Heart, 
      color: 'bg-purple-500', 
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700',
      feedback: 'Take a deep breath. You\'re doing better than you think.',
      suggestion: 'Let\'s start with some review to build confidence.'
    }
  ];

  const currentEmotionData = emotions.find(e => e.id === currentEmotion) || emotions[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
    >
      <div className="flex items-center mb-4">
        <TrendingUp className="h-5 w-5 text-primary-600 mr-2" />
        <h3 className="font-semibold text-gray-900">Emotional Intelligence</h3>
      </div>

      {/* Current Emotion Display */}
      <div className={`p-4 rounded-xl ${currentEmotionData.bgColor} mb-4`}>
        <div className="flex items-center mb-3">
          <div className={`p-2 rounded-lg ${currentEmotionData.color} mr-3`}>
            <currentEmotionData.icon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className={`font-medium ${currentEmotionData.textColor}`}>
              Currently: {currentEmotionData.label}
            </h4>
          </div>
        </div>
        
        <p className={`text-sm ${currentEmotionData.textColor} mb-2`}>
          {currentEmotionData.feedback}
        </p>
        
        <p className={`text-xs ${currentEmotionData.textColor} font-medium`}>
          💡 {currentEmotionData.suggestion}
        </p>
      </div>

      {/* Emotion Selector */}
      <div>
        <p className="text-sm text-gray-600 mb-3">How are you feeling right now?</p>
        <div className="grid grid-cols-5 gap-2">
          {emotions.map((emotion) => (
            <motion.button
              key={emotion.id}
              onClick={() => onEmotionChange(emotion.id as any)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`p-3 rounded-lg transition-all duration-200 ${
                currentEmotion === emotion.id
                  ? `${emotion.bgColor} border-2 border-opacity-50 ${emotion.color.replace('bg-', 'border-')}`
                  : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
              }`}
              title={emotion.label}
            >
              <emotion.icon className={`h-5 w-5 mx-auto ${
                currentEmotion === emotion.id ? emotion.textColor : 'text-gray-600'
              }`} />
              <div className={`text-xs mt-1 ${
                currentEmotion === emotion.id ? emotion.textColor : 'text-gray-600'
              }`}>
                {emotion.label}
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* AI Adaptation Notice */}
      <div className="mt-4 p-3 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg border border-primary-100">
        <p className="text-xs text-primary-700">
          🤖 AI is adapting teaching style based on your emotional state
        </p>
      </div>
    </motion.div>
  );
};

export default EmotionalFeedback;