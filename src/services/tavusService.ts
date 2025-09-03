import { API_CONFIG, getTavusHeaders } from '../config/api';

export interface VideoGenerationRequest {
  script: string;
  replica_id?: string;
  video_name?: string;
  callback_url?: string;
}

export interface VideoGenerationResponse {
  video_id: string;
  status: 'queued' | 'generating' | 'completed' | 'failed';
  download_url?: string;
  callback_url?: string;
}

export interface ReplicaInfo {
  replica_id: string;
  name: string;
  status: 'training' | 'ready' | 'failed';
  created_at: string;
}

class TavusService {
  private baseUrl = API_CONFIG.TAVUS.BASE_URL;
  private replicaId = API_CONFIG.TAVUS.REPLICA_ID;

  async generateVideo(request: VideoGenerationRequest): Promise<VideoGenerationResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/videos`, {
        method: 'POST',
        headers: getTavusHeaders(),
        body: JSON.stringify({
          script: request.script,
          replica_id: request.replica_id || this.replicaId,
          video_name: request.video_name || `StudyBuddy_${Date.now()}`,
          callback_url: request.callback_url
        })
      });

      if (!response.ok) {
        throw new Error(`Tavus API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Tavus video generation error:', error);
      throw error;
    }
  }

  async getVideoStatus(videoId: string): Promise<VideoGenerationResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/videos/${videoId}`, {
        headers: getTavusHeaders()
      });

      if (!response.ok) {
        throw new Error(`Failed to get video status: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to get video status:', error);
      throw error;
    }
  }

  async pollVideoCompletion(videoId: string, maxAttempts: number = 30): Promise<VideoGenerationResponse> {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const status = await this.getVideoStatus(videoId);
      
      if (status.status === 'completed' || status.status === 'failed') {
        return status;
      }
      
      // Wait 2 seconds before next poll
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    throw new Error('Video generation timeout');
  }

  async getReplicas(): Promise<ReplicaInfo[]> {
    try {
      const response = await fetch(`${this.baseUrl}/replicas`, {
        headers: getTavusHeaders()
      });

      if (!response.ok) {
        throw new Error(`Failed to get replicas: ${response.statusText}`);
      }

      const data = await response.json();
      return data.replicas || [];
    } catch (error) {
      console.error('Failed to get replicas:', error);
      throw error;
    }
  }

  // Generate AI tutor response with video
  async generateTutorResponse(message: string, emotion: string = 'calm'): Promise<{
    videoUrl?: string;
    audioUrl?: string;
    text: string;
  }> {
    try {
      // Generate the AI response text first
      const responseText = await this.generateResponseText(message, emotion);
      
      // Generate video with the response
      const videoRequest = await this.generateVideo({
        script: responseText,
        video_name: `tutor_response_${Date.now()}`
      });

      // Poll for completion
      const completedVideo = await this.pollVideoCompletion(videoRequest.video_id);

      return {
        videoUrl: completedVideo.download_url,
        text: responseText
      };
    } catch (error) {
      console.error('Failed to generate tutor response:', error);
      // Fallback to text-only response
      return {
        text: await this.generateResponseText(message, emotion)
      };
    }
  }

  private async generateResponseText(message: string, emotion: string): Promise<string> {
    // This would integrate with OpenAI or your AI service
    // For now, return contextual responses based on emotion
    const responses = {
      calm: "I understand your question. Let me explain this step by step in a clear and organized way.",
      excited: "Great question! I love your enthusiasm! Let's dive into this exciting topic together!",
      frustrated: "I can sense this is challenging for you. Don't worry, we'll break this down into smaller, manageable pieces.",
      confident: "Excellent! You're ready for this. Let's tackle this concept with confidence!",
      anxious: "Take a deep breath. You're doing great, and I'm here to help you through this at your own pace."
    };

    return responses[emotion as keyof typeof responses] || responses.calm;
  }
}

export const tavusService = new TavusService();