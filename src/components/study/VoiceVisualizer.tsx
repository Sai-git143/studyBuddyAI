import React from 'react';
import { motion } from 'framer-motion';

interface VoiceVisualizerProps {
  isActive: boolean;
}

const VoiceVisualizer: React.FC<VoiceVisualizerProps> = ({ isActive }) => {
  const bars = Array.from({ length: 12 }, (_, i) => i);

  return (
    <div className="flex items-center justify-center h-24 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl">
      <div className="flex items-end space-x-1">
        {bars.map((bar) => (
          <motion.div
            key={bar}
            className="bg-gradient-to-t from-primary-500 to-secondary-500 rounded-full"
            style={{ width: '4px' }}
            animate={{
              height: isActive 
                ? [8, Math.random() * 40 + 10, Math.random() * 30 + 8, Math.random() * 35 + 12]
                : 8
            }}
            transition={{
              duration: 0.5,
              repeat: isActive ? Infinity : 0,
              ease: "easeInOut",
              delay: bar * 0.1
            }}
          />
        ))}
      </div>
      
      <div className="ml-4 text-center">
        <p className="text-sm font-medium text-gray-700">
          {isActive ? 'Listening...' : 'Voice Recognition Ready'}
        </p>
        <p className="text-xs text-gray-500">
          {isActive ? 'Speak clearly into your microphone' : 'Click the mic button to start'}
        </p>
      </div>
    </div>
  );
};

export default VoiceVisualizer;