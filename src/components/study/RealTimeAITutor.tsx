import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Brain, 
  Loader,
  Send,
  Zap
} from 'lucide-react';
import { useRealTimeAI } from '../../hooks/useRealTimeAI';
import { useVoiceRecording } from '../../hooks/useVoiceRecording';
import { useBlockchainRewards } from '../../hooks/useBlockchainRewards';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';

interface RealTimeAITutorProps {
  currentTopic: string;
  onEmotionDetected: (emotion: string) => void;
}

const RealTimeAITutor: React.FC<RealTimeAITutorProps> = ({
  currentTopic,
  onEmotionDetected
}) => {
  const { user } = useAuthStore();
  const { 
    generateAIResponse, 
    speakResponse, 
    analyzeVoiceEmotion,
    isProcessing, 
    isSpeaking, 
    currentResponse 
  } = useRealTimeAI();
  
  const {
    isRecording,
    audioBlob,
    startRecording,
    stopRecording,
    clearRecording,
    error: recordingError
  } = useVoiceRecording();

  const { rewardForActivity, balance } = useBlockchainRewards();

  const [textInput, setTextInput] = useState('');
  const [conversation, setConversation] = useState<any[]>([]);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [currentEmotion, setCurrentEmotion] = useState('calm');

  // Handle voice input processing
  useEffect(() => {
    if (audioBlob && !isRecording) {
      handleVoiceInput();
    }
  }, [audioBlob, isRecording]);

  const handleVoiceInput = async () => {
    if (!audioBlob) return;

    try {
      // Analyze emotion from voice
      const emotionAnalysis = await analyzeVoiceEmotion(audioBlob);
      setCurrentEmotion(emotionAnalysis.emotion);
      onEmotionDetected(emotionAnalysis.emotion);

      // Convert speech to text (in production, use a speech-to-text service)
      const mockTranscription = "I need help understanding this concept better.";
      
      // Add user message to conversation
      const userMessage = {
        id: Date.now(),
        type: 'user',
        content: mockTranscription,
        timestamp: new Date(),
        emotion: emotionAnalysis.emotion
      };
      
      setConversation(prev => [...prev, userMessage]);

      // Generate AI response
      const aiResponse = await generateAIResponse(mockTranscription, emotionAnalysis.emotion);
      
      // Add AI response to conversation
      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: aiResponse.text,
        timestamp: aiResponse.timestamp,
        emotion: aiResponse.emotion,
        audioUrl: aiResponse.audioUrl,
        videoUrl: aiResponse.videoUrl
      };
      
      setConversation(prev => [...prev, aiMessage]);

      // Play audio response if enabled
      if (isAudioEnabled && aiResponse.audioUrl) {
        await speakResponse(aiResponse);
      }

      // Reward tokens for interaction
      await rewardForActivity('AI Conversation', 5);

      clearRecording();
    } catch (error) {
      console.error('Voice input processing failed:', error);
      toast.error('Failed to process voice input');
    }
  };

  const handleTextSubmit = async () => {
    if (!textInput.trim()) return;

    try {
      // Add user message
      const userMessage = {
        id: Date.now(),
        type: 'user',
        content: textInput,
        timestamp: new Date(),
        emotion: currentEmotion
      };
      
      setConversation(prev => [...prev, userMessage]);
      setTextInput('');

      // Generate AI response
      const aiResponse = await generateAIResponse(textInput, currentEmotion);
      
      // Add AI response
      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: aiResponse.text,
        timestamp: aiResponse.timestamp,
        emotion: aiResponse.emotion,
        audioUrl: aiResponse.audioUrl,
        videoUrl: aiResponse.videoUrl
      };
      
      setConversation(prev => [...prev, aiMessage]);

      // Play audio if enabled
      if (isAudioEnabled && aiResponse.audioUrl) {
        await speakResponse(aiResponse);
      }

      // Reward tokens
      await rewardForActivity('AI Conversation', 5);
    } catch (error) {
      console.error('Text input processing failed:', error);
      toast.error('Failed to process message');
    }
  };

  const toggleRecording = async () => {
    if (isRecording) {
      stopRecording();
    } else {
      await startRecording();
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 h-96 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center">
          <Brain className="h-5 w-5 text-primary-600 mr-2" />
          <h3 className="font-semibold text-gray-900">AI Tutor</h3>
          {isProcessing && (
            <Loader className="h-4 w-4 ml-2 animate-spin text-primary-600" />
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="flex items-center text-xs text-gray-600">
            <Zap className="h-3 w-3 mr-1 text-yellow-500" />
            {balance} tokens
          </div>
          
          <button
            onClick={() => setIsAudioEnabled(!isAudioEnabled)}
            className={`p-2 rounded-lg transition-colors ${
              isAudioEnabled 
                ? 'bg-green-100 text-green-600' 
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            {isAudioEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Conversation */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {conversation.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                message.type === 'user' 
                  ? 'bg-primary-500 text-white' 
                  : 'bg-gray-100 text-gray-900'
              }`}>
                <p className="text-sm">{message.content}</p>
                
                {/* Video Response */}
                {message.videoUrl && (
                  <video 
                    src={message.videoUrl} 
                    controls 
                    className="mt-2 rounded-lg w-full max-w-xs"
                    autoPlay
                  />
                )}
                
                <div className="flex items-center justify-between mt-1">
                  <p className="text-xs opacity-70">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                  
                  {message.type === 'ai' && message.audioUrl && (
                    <button
                      onClick={() => speakResponse(message)}
                      className="text-xs opacity-70 hover:opacity-100 transition-opacity"
                      disabled={isSpeaking}
                    >
                      🔊
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Processing Indicator */}
        {isProcessing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-gray-100 px-4 py-2 rounded-2xl">
              <div className="flex items-center space-x-2">
                <Loader className="h-4 w-4 animate-spin text-primary-600" />
                <span className="text-sm text-gray-600">AI is thinking...</span>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-100">
        {recordingError && (
          <div className="mb-2 text-xs text-red-600">{recordingError}</div>
        )}
        
        <div className="flex space-x-2">
          <input
            type="text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleTextSubmit()}
            placeholder="Ask me anything about the topic..."
            className="flex-1 p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
            disabled={isProcessing}
          />
          
          <button
            onClick={toggleRecording}
            disabled={isProcessing}
            className={`p-3 rounded-xl transition-colors ${
              isRecording 
                ? 'bg-red-500 text-white animate-pulse' 
                : 'bg-green-500 text-white hover:bg-green-600'
            }`}
          >
            {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </button>
          
          <button
            onClick={handleTextSubmit}
            disabled={isProcessing || !textInput.trim()}
            className="bg-primary-500 text-white p-3 rounded-xl hover:bg-primary-600 transition-colors disabled:opacity-50"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RealTimeAITutor;