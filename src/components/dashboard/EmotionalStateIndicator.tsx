import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Brain, Zap, Cloud, Star } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const EmotionalStateIndicator = () => {
  const { user, updateUser } = useAuthStore();

  const emotionalStates = [
    { 
      id: 'calm', 
      label: 'Calm', 
      icon: Cloud, 
      color: 'bg-blue-500', 
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      description: 'Feeling focused and peaceful'
    },
    { 
      id: 'excited', 
      label: 'Excited', 
      icon: Star, 
      color: 'bg-yellow-500', 
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-700',
      description: 'High energy and enthusiasm'
    },
    { 
      id: 'frustrated', 
      label: 'Frustrated', 
      icon: Zap, 
      color: 'bg-red-500', 
      bgColor: 'bg-red-50',
      textColor: 'text-red-700',
      description: 'Feeling challenged or stuck'
    },
    { 
      id: 'confident', 
      label: 'Confident', 
      icon: Brain, 
      color: 'bg-green-500', 
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
      description: 'Ready to tackle anything'
    },
    { 
      id: 'anxious', 
      label: 'Anxious', 
      icon: Heart, 
      color: 'bg-purple-500', 
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700',
      description: 'Feeling nervous or worried'
    }
  ];

  const currentState = emotionalStates.find(state => state.id === user?.emotionalState) || emotionalStates[0];

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">How are you feeling?</h3>
        <div className={`p-2 rounded-lg ${currentState.bgColor}`}>
          <currentState.icon className={`h-5 w-5 ${currentState.textColor}`} />
        </div>
      </div>

      <div className={`p-4 rounded-lg ${currentState.bgColor} mb-4`}>
        <div className="flex items-center mb-2">
          <div className={`w-3 h-3 rounded-full ${currentState.color} mr-3`}></div>
          <span className={`font-medium ${currentState.textColor}`}>{currentState.label}</span>
        </div>
        <p className={`text-sm ${currentState.textColor}`}>{currentState.description}</p>
      </div>

      <div className="grid grid-cols-5 gap-2">
        {emotionalStates.map((state) => (
          <motion.button
            key={state.id}
            onClick={() => updateUser({ emotionalState: state.id as any })}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`p-2 rounded-lg transition-colors ${
              user?.emotionalState === state.id
                ? `${state.bgColor} border-2 border-opacity-50`
                : 'bg-gray-50 hover:bg-gray-100'
            }`}
            title={state.label}
          >
            <state.icon className={`h-4 w-4 mx-auto ${
              user?.emotionalState === state.id ? state.textColor : 'text-gray-600'
            }`} />
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default EmotionalStateIndicator;