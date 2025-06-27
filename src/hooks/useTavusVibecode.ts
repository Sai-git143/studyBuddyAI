import { useState, useCallback, useEffect } from 'react';
import { API_CONFIG } from '../config/api';
import toast from 'react-hot-toast';

interface ConversationData {
  conversation_id: string;
  conversation_url: string;
  status: 'active' | 'ended' | 'failed';
  created_at: string;
}

interface ConversationStatus {
  conversation_id: string;
  status: 'active' | 'ended' | 'failed';
  participant_count: number;
  duration: number;
  recording_url?: string;
  transcript?: string;
}

interface UseTavusVibecodeReturn {
  conversation: ConversationData | null;
  conversationStatus: ConversationStatus | null;
  isLoading: boolean;
  error: string | null;
  isConfigured: boolean;
  startConversation: (personaId: string, conversationName?: string) => Promise<ConversationData | null>;
  endConversation: () => Promise<void>;
  getConversationStatus: () => Promise<ConversationStatus | null>;
  getTranscript: () => Promise<string | null>;
  getRecording: () => Promise<string | null>;
}

export const useTavusVibecode = (): UseTavusVibecodeReturn => {
  const [conversation, setConversation] = useState<ConversationData | null>(null);
  const [conversationStatus, setConversationStatus] = useState<ConversationStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isConfigured = !!(API_CONFIG.TAVUS.API_KEY);

  // Poll conversation status when active
  useEffect(() => {
    if (!conversation?.conversation_id) return;

    const pollStatus = async () => {
      try {
        const status = await fetchConversationStatus(conversation.conversation_id);
        setConversationStatus(status);
      } catch (error) {
        console.error('Failed to poll conversation status:', error);
      }
    };

    const interval = setInterval(pollStatus, 5000); // Poll every 5 seconds
    pollStatus(); // Initial poll

    return () => clearInterval(interval);
  }, [conversation?.conversation_id]);

  const fetchConversationStatus = async (conversationId: string): Promise<ConversationStatus> => {
    const response = await fetch(`${API_CONFIG.TAVUS.BASE_URL}/conversations/${conversationId}`, {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_CONFIG.TAVUS.API_KEY!,
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to get conversation status: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  };

  const startConversation = useCallback(async (
    personaId: string,
    conversationName?: string
  ): Promise<ConversationData | null> => {
    if (!isConfigured) {
      setError('Tavus API not configured. Please add your API key to your .env file.');
      toast.error('Tavus API not configured');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('Starting Tavus Vibecode conversation...', { personaId, conversationName });
      
      const response = await fetch(`${API_CONFIG.TAVUS.BASE_URL}/conversations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': API_CONFIG.TAVUS.API_KEY!,
        },
        body: JSON.stringify({
          persona_id: personaId,
          conversation_name: conversationName || `StudyBuddy_${Date.now()}`,
          properties: {
            max_call_duration: 3600, // 1 hour
            participant_left_timeout: 60,
            participant_absent_timeout: 300,
            enable_recording: true,
            enable_transcription: true,
            language: 'en'
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Failed to create conversation: ${response.status} ${response.statusText} - ${errorData}`);
      }

      const conversationData = await response.json();
      console.log('Tavus Vibecode conversation created:', conversationData);
      
      setConversation(conversationData);
      toast.success('AI Video conversation started! 🎥');
      
      return conversationData;
    } catch (error) {
      console.error('Failed to start Tavus Vibecode conversation:', error);
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
      await fetch(`${API_CONFIG.TAVUS.BASE_URL}/conversations/${conversation.conversation_id}/end`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': API_CONFIG.TAVUS.API_KEY!,
        }
      });

      setConversation(null);
      setConversationStatus(null);
      toast.success('Video conversation ended');
    } catch (error) {
      console.error('Failed to end conversation:', error);
      toast.error('Failed to end conversation');
    }
  }, [conversation?.conversation_id]);

  const getConversationStatus = useCallback(async (): Promise<ConversationStatus | null> => {
    if (!conversation?.conversation_id) return null;

    try {
      return await fetchConversationStatus(conversation.conversation_id);
    } catch (error) {
      console.error('Failed to get conversation status:', error);
      return null;
    }
  }, [conversation?.conversation_id]);

  const getTranscript = useCallback(async (): Promise<string | null> => {
    if (!conversation?.conversation_id) return null;

    try {
      const status = await fetchConversationStatus(conversation.conversation_id);
      return status.transcript || null;
    } catch (error) {
      console.error('Failed to get transcript:', error);
      return null;
    }
  }, [conversation?.conversation_id]);

  const getRecording = useCallback(async (): Promise<string | null> => {
    if (!conversation?.conversation_id) return null;

    try {
      const status = await fetchConversationStatus(conversation.conversation_id);
      return status.recording_url || null;
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
    getConversationStatus,
    getTranscript,
    getRecording
  };
};