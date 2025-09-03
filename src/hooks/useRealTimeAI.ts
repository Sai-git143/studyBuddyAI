import { useState, useEffect, useCallback } from 'react';
import { elevenLabsService } from '../services/elevenLabsService';
import { tavusService } from '../services/tavusService';
import { openaiService, LearningContext } from '../services/openaiService';
import { useAuthStore } from '../store/authStore';
import { useLearningStore } from '../store/learningStore';

export interface AIResponse {
  text: string;
  audioUrl?: string;
  videoUrl?: string;
  emotion: string;
  timestamp: Date;
  confidence?: number;
}

export const useRealTimeAI = () => {
  const { user } = useAuthStore();
  const { currentSubject, progress } = useLearningStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentResponse, setCurrentResponse] = useState<AIResponse | null>(null);
  const [conversationHistory, setConversationHistory] = useState<any[]>([]);

  const generateAIResponse = useCallback(async (
    userMessage: string,
    emotionalState: string = 'calm',
    includeAudio: boolean = true,
    includeVideo: boolean = false
  ): Promise<AIResponse> => {
    setIsProcessing(true);
    
    try {
      // Create learning context
      const context: LearningContext = {
        subject: currentSubject || 'General',
        currentTopic: 'Current Topic', // This would come from current session
        userLevel: 'Intermediate', // This would come from user profile
        emotionalState,
        learningStyle: user?.learningStyle || 'visual',
        strugglingAreas: progress.find(p => p.subject === currentSubject)?.weakAreas || [],
        strongAreas: progress.find(p => p.subject === currentSubject)?.strongAreas || []
      };

      // Add conversation history for context
      const conversationContext = conversationHistory.length > 0 
        ? `\n\nConversation History:\n${conversationHistory.slice(-3).map(msg => 
            `${msg.type}: ${msg.content}`
          ).join('\n')}`
        : '';

      // Generate text response using OpenAI
      const responseText = await openaiService.generateTutorResponse(
        userMessage + conversationContext, 
        context
      );

      const response: AIResponse = {
        text: responseText,
        emotion: emotionalState,
        timestamp: new Date(),
        confidence: 0.85 + Math.random() * 0.15 // Simulate confidence score
      };

      // Generate audio using ElevenLabs (if enabled and API key available)
      if (includeAudio && elevenLabsService) {
        try {
          const audioBlob = await elevenLabsService.textToSpeech({
            text: responseText,
            voice_settings: {
              stability: emotionalState === 'anxious' ? 0.8 : 0.5,
              similarity_boost: 0.7,
              style: emotionalState === 'excited' ? 0.3 : 0.1
            }
          });
          response.audioUrl = URL.createObjectURL(audioBlob);
        } catch (audioError) {
          console.warn('Audio generation failed, continuing without audio:', audioError);
        }
      }

      // Generate video using Tavus (if enabled and API key available)
      if (includeVideo && tavusService) {
        try {
          const videoResponse = await tavusService.generateTutorResponse(responseText, emotionalState);
          if (videoResponse.videoUrl) {
            response.videoUrl = videoResponse.videoUrl;
          }
        } catch (videoError) {
          console.warn('Video generation failed, continuing without video:', videoError);
        }
      }

      // Update conversation history
      setConversationHistory(prev => [
        ...prev,
        { type: 'user', content: userMessage, timestamp: new Date() },
        { type: 'ai', content: responseText, timestamp: new Date() }
      ].slice(-10)); // Keep last 10 messages

      setCurrentResponse(response);
      return response;

    } catch (error) {
      console.error('AI response generation failed:', error);
      
      // Provide intelligent fallback based on error type
      let fallbackText = "I apologize, but I'm having trouble processing your request right now.";
      
      if (error instanceof Error) {
        if (error.message.includes('API key')) {
          fallbackText = "It looks like there's an issue with the AI service configuration. Please check that your OpenAI API key is properly set up.";
        } else if (error.message.includes('network') || error.message.includes('fetch')) {
          fallbackText = "I'm having trouble connecting to the AI service. Please check your internet connection and try again.";
        } else if (error.message.includes('rate limit')) {
          fallbackText = "I'm receiving too many requests right now. Please wait a moment and try again.";
        }
      }
      
      const fallbackResponse: AIResponse = {
        text: fallbackText + " In the meantime, feel free to ask me anything about the topic, and I'll do my best to help you learn!",
        emotion: 'calm',
        timestamp: new Date(),
        confidence: 0.5
      };
      
      setCurrentResponse(fallbackResponse);
      return fallbackResponse;
    } finally {
      setIsProcessing(false);
    }
  }, [user, currentSubject, progress, conversationHistory]);

  const generateContent = useCallback(async (
    type: 'explanation' | 'example' | 'practice' | 'quiz' | 'visual',
    topic: string,
    difficulty: number = 5,
    emotionalState: string = 'calm'
  ): Promise<string> => {
    try {
      const context: LearningContext = {
        subject: currentSubject || 'General',
        currentTopic: topic,
        userLevel: 'Intermediate',
        emotionalState,
        learningStyle: user?.learningStyle || 'visual',
        strugglingAreas: progress.find(p => p.subject === currentSubject)?.weakAreas || [],
        strongAreas: progress.find(p => p.subject === currentSubject)?.strongAreas || []
      };

      return await openaiService.generateRealTimeContent({
        type,
        topic,
        difficulty,
        userContext: context
      });
    } catch (error) {
      console.error('Content generation failed:', error);
      return `Here's some information about ${topic}. This is a fundamental concept that's important to understand.`;
    }
  }, [user, currentSubject, progress]);

  const generatePracticeProblems = useCallback(async (
    subject: string,
    topic: string,
    difficulty: string = 'medium',
    count: number = 5
  ): Promise<any[]> => {
    try {
      const weakAreas = progress.find(p => p.subject === subject)?.weakAreas || [];
      return await openaiService.generatePracticeProblems(
        subject,
        topic,
        difficulty,
        count,
        weakAreas
      );
    } catch (error) {
      console.error('Practice problems generation failed:', error);
      return [];
    }
  }, [progress]);

  const speakResponse = useCallback(async (response: AIResponse) => {
    if (!response.audioUrl) return;
    
    setIsSpeaking(true);
    
    try {
      const audio = new Audio(response.audioUrl);
      
      return new Promise<void>((resolve, reject) => {
        audio.onended = () => {
          setIsSpeaking(false);
          resolve();
        };
        
        audio.onerror = () => {
          setIsSpeaking(false);
          reject(new Error('Audio playback failed'));
        };
        
        audio.play().catch(reject);
      });
    } catch (error) {
      console.error('Speech playback failed:', error);
      setIsSpeaking(false);
      throw error;
    }
  }, []);

  const analyzeVoiceEmotion = useCallback(async (audioBlob: Blob) => {
    try {
      return await elevenLabsService.analyzeVoiceEmotion(audioBlob);
    } catch (error) {
      console.error('Voice emotion analysis failed:', error);
      return {
        emotion: 'calm' as const,
        confidence: 0.5,
        energy_level: 0.5
      };
    }
  }, []);

  const generateInsights = useCallback(async (
    sessionData: any,
    userProgress: any,
    emotionalState: string
  ): Promise<string[]> => {
    try {
      return await openaiService.generateLearningInsights(
        sessionData,
        userProgress,
        emotionalState
      );
    } catch (error) {
      console.error('Insights generation failed:', error);
      return [
        'Keep up the consistent study schedule!',
        'Focus on practicing weak areas identified in recent sessions.',
        'Your progress shows steady improvement - great work!'
      ];
    }
  }, []);

  const adaptContent = useCallback(async (
    originalContent: string,
    userPerformance: number,
    timeSpent: number,
    targetDifficulty: number
  ): Promise<string> => {
    try {
      return await openaiService.adaptContentDifficulty(
        originalContent,
        userPerformance,
        timeSpent,
        targetDifficulty
      );
    } catch (error) {
      console.error('Content adaptation failed:', error);
      return originalContent;
    }
  }, []);

  // Cleanup audio URLs when component unmounts
  useEffect(() => {
    return () => {
      if (currentResponse?.audioUrl) {
        URL.revokeObjectURL(currentResponse.audioUrl);
      }
    };
  }, [currentResponse]);

  // Clear conversation history when subject changes
  useEffect(() => {
    setConversationHistory([]);
  }, [currentSubject]);

  return {
    generateAIResponse,
    generateContent,
    generatePracticeProblems,
    generateInsights,
    adaptContent,
    speakResponse,
    analyzeVoiceEmotion,
    isProcessing,
    isSpeaking,
    currentResponse,
    conversationHistory
  };
};