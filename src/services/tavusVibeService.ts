import { API_CONFIG, getTavusHeaders } from '../config/api';

export interface ConversationRequest {
  persona_id: string;
  conversation_name?: string;
  callback_url?: string;
  properties?: {
    max_call_duration?: number;
    participant_left_timeout?: number;
    participant_absent_timeout?: number;
    enable_recording?: boolean;
    enable_transcription?: boolean;
    language?: string;
  };
}

export interface ConversationResponse {
  conversation_id: string;
  conversation_url: string;
  status: 'active' | 'ended' | 'failed';
  created_at: string;
}

export interface ConversationStatus {
  conversation_id: string;
  status: 'active' | 'ended' | 'failed';
  participant_count: number;
  duration: number;
  recording_url?: string;
  transcript?: string;
}

class TavusVibeService {
  private baseUrl = API_CONFIG.TAVUS.BASE_URL;
  private apiKey = API_CONFIG.TAVUS.API_KEY;

  async createConversation(request: ConversationRequest): Promise<ConversationResponse> {
    try {
      console.log('Creating Tavus conversation...', { persona_id: request.persona_id });
      
      const response = await fetch(`${this.baseUrl}/conversations`, {
        method: 'POST',
        headers: getTavusHeaders(),
        body: JSON.stringify({
          persona_id: request.persona_id,
          conversation_name: request.conversation_name || `StudyBuddy_${Date.now()}`,
          callback_url: request.callback_url,
          properties: {
            max_call_duration: 3600, // 1 hour
            participant_left_timeout: 60,
            participant_absent_timeout: 300,
            enable_recording: true,
            enable_transcription: true,
            language: 'en',
            ...request.properties
          }
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Tavus conversation creation error:', errorText);
        throw new Error(`Tavus API error: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const result = await response.json();
      console.log('Tavus conversation created successfully:', result);
      return result;
    } catch (error) {
      console.error('Tavus conversation creation error:', error);
      throw error;
    }
  }

  async getConversationStatus(conversationId: string): Promise<ConversationStatus> {
    try {
      const response = await fetch(`${this.baseUrl}/conversations/${conversationId}`, {
        headers: getTavusHeaders()
      });

      if (!response.ok) {
        throw new Error(`Failed to get conversation status: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to get conversation status:', error);
      throw error;
    }
  }

  async endConversation(conversationId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/conversations/${conversationId}/end`, {
        method: 'POST',
        headers: getTavusHeaders()
      });

      if (!response.ok) {
        throw new Error(`Failed to end conversation: ${response.status} ${response.statusText}`);
      }

      console.log('Conversation ended successfully');
    } catch (error) {
      console.error('Failed to end conversation:', error);
      throw error;
    }
  }

  async getPersonas(): Promise<any[]> {
    try {
      const response = await fetch(`${this.baseUrl}/personas`, {
        headers: getTavusHeaders()
      });

      if (!response.ok) {
        throw new Error(`Failed to get personas: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data.personas || [];
    } catch (error) {
      console.error('Failed to get personas:', error);
      throw error;
    }
  }

  // Generate AI tutor conversation with real-time video
  async startTutorConversation(
    personaId: string,
    subject: string,
    topic: string
  ): Promise<ConversationResponse> {
    try {
      console.log('Starting tutor conversation...', { personaId, subject, topic });
      
      const conversation = await this.createConversation({
        persona_id: personaId,
        conversation_name: `StudyBuddy_${subject}_${topic}_${Date.now()}`,
        properties: {
          max_call_duration: 3600, // 1 hour
          enable_recording: true,
          enable_transcription: true,
          language: 'en'
        }
      });

      return conversation;
    } catch (error) {
      console.error('Failed to start tutor conversation:', error);
      throw error;
    }
  }

  // Enhanced method for real-time tutoring with emotion adaptation
  async createAdaptiveTutorSession(
    personaId: string,
    userContext: {
      subject: string;
      topic: string;
      emotionalState: string;
      learningStyle: string;
      difficulty: string;
    }
  ): Promise<ConversationResponse> {
    try {
      const sessionName = `StudyBuddy_${userContext.subject}_${userContext.topic}_${Date.now()}`;
      
      const conversation = await this.createConversation({
        persona_id: personaId,
        conversation_name: sessionName,
        properties: {
          max_call_duration: 3600,
          enable_recording: true,
          enable_transcription: true,
          language: 'en',
          // Custom properties for adaptive learning
          participant_left_timeout: userContext.emotionalState === 'anxious' ? 120 : 60,
          participant_absent_timeout: userContext.emotionalState === 'frustrated' ? 180 : 300
        }
      });

      console.log('Adaptive tutor session created:', conversation);
      return conversation;
    } catch (error) {
      console.error('Failed to create adaptive tutor session:', error);
      throw error;
    }
  }

  // Get conversation transcript for learning analytics
  async getConversationTranscript(conversationId: string): Promise<string | null> {
    try {
      const status = await this.getConversationStatus(conversationId);
      return status.transcript || null;
    } catch (error) {
      console.error('Failed to get conversation transcript:', error);
      return null;
    }
  }

  // Get conversation recording for review
  async getConversationRecording(conversationId: string): Promise<string | null> {
    try {
      const status = await this.getConversationStatus(conversationId);
      return status.recording_url || null;
    } catch (error) {
      console.error('Failed to get conversation recording:', error);
      return null;
    }
  }
}

export const tavusVibeService = new TavusVibeService();