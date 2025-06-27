import { useState, useEffect, useCallback } from 'react';
import { realTimeTutoringService, LiveTutoringSession, RealTimeContent, LiveFeedback } from '../services/realTimeTutoringService';
import { useAuthStore } from '../store/authStore';
import { useLearningStore } from '../store/learningStore';
import toast from 'react-hot-toast';

export const useRealTimeTutoring = () => {
  const { user } = useAuthStore();
  const { currentSubject } = useLearningStore();
  
  const [session, setSession] = useState<LiveTutoringSession | null>(null);
  const [currentContent, setCurrentContent] = useState<RealTimeContent | null>(null);
  const [feedback, setFeedback] = useState<LiveFeedback | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [understanding, setUnderstanding] = useState(50);
  const [engagement, setEngagement] = useState(50);

  // Initialize feedback listener
  useEffect(() => {
    realTimeTutoringService.onFeedback((newFeedback: LiveFeedback) => {
      setFeedback(newFeedback);
      setUnderstanding(newFeedback.understanding);
      setEngagement(newFeedback.engagement);
    });
  }, []);

  const startTutoringSession = useCallback(async (
    subject: string,
    topic: string
  ) => {
    if (!user) return;

    setIsLoading(true);
    try {
      const newSession = await realTimeTutoringService.startLiveTutoringSession(
        subject,
        topic,
        'intermediate', // This would come from user profile
        user.learningStyle || 'visual'
      );

      setSession(newSession);
      
      // Get initial content
      const initialContent = realTimeTutoringService.getNextContent();
      if (initialContent) {
        setCurrentContent(initialContent);
      }

      toast.success('Live tutoring session started!');
    } catch (error) {
      console.error('Failed to start tutoring session:', error);
      toast.error('Failed to start tutoring session');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const generateContent = useCallback(async (
    userInput: string,
    emotionalState: string = 'calm'
  ) => {
    if (!session) return;

    setIsLoading(true);
    try {
      const newContent = await realTimeTutoringService.generateRealTimeContent(
        userInput,
        understanding,
        emotionalState
      );

      setCurrentContent(newContent);
      
      // Provide feedback based on interaction
      const newFeedback = await realTimeTutoringService.provideLiveFeedback(
        userInput,
        30, // Mock time spent
        { interaction: 'text_input' }
      );

      setFeedback(newFeedback);
    } catch (error) {
      console.error('Failed to generate content:', error);
      toast.error('Failed to generate content');
    } finally {
      setIsLoading(false);
    }
  }, [session, understanding]);

  const generateProblem = useCallback(async (
    topic: string,
    weaknesses: string[] = []
  ) => {
    if (!session) return null;

    try {
      const problem = await realTimeTutoringService.generateInteractiveProblem(
        topic,
        Math.floor(understanding / 10),
        weaknesses
      );

      return problem;
    } catch (error) {
      console.error('Failed to generate problem:', error);
      return null;
    }
  }, [session, understanding]);

  const generateVisual = useCallback(async (concept: string) => {
    if (!session) return null;

    try {
      const visual = await realTimeTutoringService.generateVisualExplanation(concept);
      return visual;
    } catch (error) {
      console.error('Failed to generate visual:', error);
      return null;
    }
  }, [session]);

  const adaptContent = useCallback(async (
    performance: number,
    timeSpent: number
  ) => {
    if (!session || !currentContent) return;

    try {
      const adaptedContent = await realTimeTutoringService.adaptContentDifficulty(
        currentContent,
        performance,
        timeSpent
      );

      setCurrentContent(adaptedContent);
      toast.success('Content adapted to your performance!');
    } catch (error) {
      console.error('Failed to adapt content:', error);
    }
  }, [session, currentContent]);

  const endSession = useCallback(() => {
    if (session) {
      realTimeTutoringService.endSession();
      setSession(null);
      setCurrentContent(null);
      setFeedback(null);
      toast.success('Tutoring session ended');
    }
  }, [session]);

  const updateUnderstanding = useCallback((newUnderstanding: number) => {
    setUnderstanding(newUnderstanding);
  }, []);

  const updateEngagement = useCallback((newEngagement: number) => {
    setEngagement(newEngagement);
  }, []);

  return {
    session,
    currentContent,
    feedback,
    understanding,
    engagement,
    isLoading,
    startTutoringSession,
    generateContent,
    generateProblem,
    generateVisual,
    adaptContent,
    endSession,
    updateUnderstanding,
    updateEngagement
  };
};