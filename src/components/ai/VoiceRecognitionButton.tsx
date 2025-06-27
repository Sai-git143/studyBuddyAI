import React from 'react';
import { motion } from 'framer-motion';
import { Mic, MicOff, Loader, AlertCircle, Volume2 } from 'lucide-react';
import { useVoiceRecognition } from '../../hooks/useVoiceRecognition';

interface VoiceRecognitionButtonProps {
  onTranscript: (transcript: string, confidence: number) => void;
  onStart?: () => void;
  onStop?: () => void;
  disabled?: boolean;
  className?: string;
  continuous?: boolean;
}

const VoiceRecognitionButton: React.FC<VoiceRecognitionButtonProps> = ({
  onTranscript,
  onStart,
  onStop,
  disabled = false,
  className = '',
  continuous = false
}) => {
  const {
    isListening,
    transcript,
    confidence,
    error,
    isSupported,
    startListening,
    stopListening,
    resetTranscript
  } = useVoiceRecognition('en-US', continuous);

  React.useEffect(() => {
    if (transcript && transcript.trim().length > 0) {
      onTranscript(transcript, confidence);
    }
  }, [transcript, confidence, onTranscript]);

  const handleToggle = () => {
    if (isListening) {
      stopListening();
      onStop?.();
    } else {
      resetTranscript();
      startListening();
      onStart?.();
    }
  };

  if (!isSupported) {
    return (
      <div className={`flex flex-col items-center ${className}`}>
        <div className="p-4 bg-gray-100 rounded-full">
          <AlertCircle className="h-6 w-6 text-gray-400" />
        </div>
        <div className="mt-2 text-center">
          <p className="text-sm text-gray-500">Voice recognition not supported</p>
          <p className="text-xs text-gray-400">Try Chrome, Edge, or Safari</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <motion.button
        onClick={handleToggle}
        disabled={disabled}
        whileHover={{ scale: disabled ? 1 : 1.05 }}
        whileTap={{ scale: disabled ? 1 : 0.95 }}
        className={`relative p-4 rounded-full transition-all duration-300 ${
          isListening
            ? 'bg-red-500 text-white shadow-lg'
            : 'bg-primary-500 text-white hover:bg-primary-600'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        {isListening ? (
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <MicOff className="h-6 w-6" />
          </motion.div>
        ) : (
          <Mic className="h-6 w-6" />
        )}

        {/* Listening Animation */}
        {isListening && (
          <>
            <motion.div
              className="absolute inset-0 rounded-full border-4 border-red-300"
              animate={{ scale: [1, 1.5], opacity: [0.7, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-red-400"
              animate={{ scale: [1, 1.3], opacity: [0.5, 0] }}
              transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
            />
          </>
        )}
      </motion.button>

      {/* Status Text */}
      <div className="mt-3 text-center max-w-xs">
        <p className="text-sm font-medium text-gray-700">
          {isListening ? 'Listening...' : 'Click to speak'}
        </p>
        
        {transcript && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-200"
          >
            <div className="flex items-center mb-1">
              <Volume2 className="h-3 w-3 text-blue-600 mr-1" />
              <span className="text-xs text-blue-600 font-medium">Transcript</span>
            </div>
            <p className="text-sm text-blue-800">{transcript}</p>
            {confidence > 0 && (
              <div className="mt-2 flex items-center justify-between">
                <span className="text-xs text-blue-600">Confidence:</span>
                <div className="flex items-center">
                  <div className="w-16 bg-blue-200 rounded-full h-1 mr-2">
                    <div 
                      className="bg-blue-600 h-1 rounded-full transition-all duration-300"
                      style={{ width: `${confidence * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-blue-600 font-medium">
                    {Math.round(confidence * 100)}%
                  </span>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 p-3 bg-red-50 rounded-lg border border-red-200"
          >
            <div className="flex items-center mb-1">
              <AlertCircle className="h-3 w-3 text-red-600 mr-1" />
              <span className="text-xs text-red-600 font-medium">Error</span>
            </div>
            <p className="text-xs text-red-700">{error}</p>
          </motion.div>
        )}

        {/* Instructions */}
        {!isListening && !transcript && !error && (
          <div className="mt-2 text-xs text-gray-500 space-y-1">
            <p>• Speak clearly into your microphone</p>
            <p>• Allow microphone permissions</p>
            <p>• Works best in quiet environments</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VoiceRecognitionButton;