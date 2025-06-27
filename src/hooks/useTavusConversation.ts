import { useState, useCallback, useEffect } from 'react';
import { tavusVibeService, ConversationResponse, ConversationStatus } from '../services/tavusVibeService';
import { API_CONFIG } from '../config/api';
import toast from 'react-hot-toast';

interface TavusConversationHook {
  conversation: ConversationResponse | null;
  conversationStatus: ConversationStatus | null;
  isLoading: boolean;
  error: string | null;
  isConfigured: boolean;
  startConversation: (personaId: string, subject: string, topic: string) => Promise<ConversationResponse | null>;
  endConversation: () => Promise<void>;
  getTranscript: () => Promise<string | null>;
  getRecording: () => Promise<string | null>;
}

export const useTavusConversation = (): TavusConversationHook => {
  const [conversation, setConversation] = useState<ConversationResponse | null>(null);
  const [conversationStatus, setConversationStatus] = useState<ConversationStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isConfigured = !!(API_CONFIG.TAVUS.API_KEY);

  // Poll conversation status
  useEffect(() => {
    if (!conversation?.conversation_id) return;

    const pollStatus = async () => {
      try {
        const status = await tavusVibeService.getConversationStatus(conversation.conversation_id);
        setConversationStatus(status);
      } catch (error) {
        console.error('Failed to poll conversation status:', error);
      }
    };

    const interval = setInterval(pollStatus, 5000); // Poll every 5 seconds
    pollStatus(); // Initial poll

    return () => clearInterval(interval);
  }, [conversation?.conversation_id]);

  const startConversation = useCallback(async (
    personaId: string,
    subject: string,
    topic: string
  ): Promise<ConversationResponse | null> => {
    if (!isConfigured) {
      setError('Tavus API not configured. Please add your API key to your .env file.');
      toast.error('Tavus API not configured');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('Starting Tavus conversation...', { personaId, subject, topic });
      
      const newConversation = await tavusVibeService.startTutorConversation(
        personaId,
        subject,
        topic
      );

      setConversation(newConversation);
      toast.success('AI Video Tutor session started! 🎥');
      
      return newConversation;
    } catch (error) {
      console.error('Failed to start conversation:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to start video conversation';
      setError(errorMessage);
      toast.error('Failed to start video conversation');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [isConfigured]);

  const endConversation = useCallback(async (): Promise<void> => {
    if (!conversation?.conversation_id) return;

    try {
      await tavusVibeService.endConversation(conversation.conversation_id);
      setConversation(null);
      setConversationStatus(null);
      toast.success('Video conversation ended');
    } catch (error) {
      console.error('Failed to end conversation:', error);
      toast.error('Failed to end conversation');
    }
  }, [conversation?.conversation_id]);

  const getTranscript = useCallback(async (): Promise<string | null> => {
    if (!conversation?.conversation_id) return null;

    try {
      return await tavusVibeService.getConversationTranscript(conversation.conversation_id);
    } catch (error) {
      console.error('Failed to get transcript:', error);
      return null;
    }
  }, [conversation?.conversation_id]);

  const getRecording = useCallback(async (): Promise<string | null> => {
    if (!conversation?.conversation_id) return null;

    try {
      return await tavusVibeService.getConversationRecording(conversation.conversation_id);
    } catch (error) {
      console.error('Failed to get recording:', error);
      return null;
    }
  }, [conversation?.conversation_id]);

  return {
    conversation,
    conversationStatus,
    isLoading,
    error,
    isConfigured,
    startConversation,
    endConversation,
    getTranscript,
    getRecording
  };
};