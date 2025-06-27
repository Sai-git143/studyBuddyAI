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
      console.log('Generating video with Tavus API...', { script: request.script.substring(0, 50) + '...' });
      
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
        const errorText = await response.text();
        console.error('Tavus API error response:', errorText);
        throw new Error(`Tavus API error: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const result = await response.json();
      console.log('Tavus video generation response:', result);
      return result;
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
        throw new Error(`Failed to get video status: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to get video status:', error);
      throw error;
    }
  }

  async pollVideoCompletion(videoId: string, maxAttempts: number = 180): Promise<VideoGenerationResponse> {
    console.log(`Polling video completion for ID: ${videoId}`);
    
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        const status = await this.getVideoStatus(videoId);
        console.log(`Poll attempt ${attempt + 1}: Status = ${status.status}`);
        
        if (status.status === 'completed') {
          if (!status.download_url) {
            console.error('Video completed but no download URL provided:', status);
            throw new Error('Video generation completed but no download URL was provided');
          }
          console.log('Video generation completed successfully:', status.download_url);
          return status;
        }
        
        if (status.status === 'failed') {
          throw new Error('Video generation failed');
        }
        
        // Wait 5 seconds before next poll for longer intervals
        await new Promise(resolve => setTimeout(resolve, 5000));
      } catch (error) {
        console.error(`Poll attempt ${attempt + 1} failed:`, error);
        if (attempt === maxAttempts - 1) {
          throw error;
        }
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }
    
    throw new Error('Video generation timeout - exceeded maximum polling attempts');
  }

  async getReplicas(): Promise<ReplicaInfo[]> {
    try {
      const response = await fetch(`${this.baseUrl}/replicas`, {
        headers: getTavusHeaders()
      });

      if (!response.ok) {
        throw new Error(`Failed to get replicas: ${response.status} ${response.statusText}`);
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
      console.log('Generating tutor response with video...', { message: message.substring(0, 50) + '...' });
      
      // Generate the AI response text first
      const responseText = await this.generateResponseText(message, emotion);
      
      // Generate video with the response
      const videoRequest = await this.generateVideo({
        script: responseText,
        video_name: `tutor_response_${Date.now()}`
      });

      console.log('Video generation initiated, polling for completion...');
      
      // Poll for completion with extended timeout
      const completedVideo = await this.pollVideoCompletion(videoRequest.video_id, 180);

      // Validate that we have a video URL
      if (!completedVideo.download_url) {
        throw new Error('No video URL returned from Tavus API');
      }

      return {
        videoUrl: completedVideo.download_url,
        text: responseText
      };
    } catch (error) {
      console.error('Failed to generate tutor response with video:', error);
      
      // Fallback to text-only response
      const fallbackText = await this.generateResponseText(message, emotion);
      return {
        text: fallbackText
      };
    }
  }

  private async generateResponseText(message: string, emotion: string): Promise<string> {
    // Enhanced contextual responses based on emotion and message content
    const responses = {
      calm: [
        "I understand your question. Let me explain this step by step in a clear and organized way.",
        "That's a great question. Let me break this down for you systematically.",
        "I can help you with that. Here's a structured approach to understanding this concept."
      ],
      excited: [
        "Great question! I love your enthusiasm! Let's dive into this exciting topic together!",
        "Fantastic! Your energy is contagious. Let's explore this amazing concept!",
        "Wonderful question! I'm excited to share this knowledge with you!"
      ],
      frustrated: [
        "I can sense this is challenging for you. Don't worry, we'll break this down into smaller, manageable pieces.",
        "I understand this can be frustrating. Let's take it one step at a time and make it clearer.",
        "It's completely normal to feel stuck sometimes. Let me help you work through this patiently."
      ],
      confident: [
        "Excellent! You're ready for this. Let's tackle this concept with confidence!",
        "Perfect! I can see you're prepared to dive deep into this topic.",
        "Great! Your confidence shows you're ready for more advanced concepts."
      ],
      anxious: [
        "Take a deep breath. You're doing great, and I'm here to help you through this at your own pace.",
        "Don't worry, we'll go slowly and make sure you understand each step before moving forward.",
        "It's okay to feel uncertain. Learning is a journey, and I'm here to support you every step of the way."
      ]
    };

    // Select appropriate response based on emotion
    const emotionResponses = responses[emotion as keyof typeof responses] || responses.calm;
    const baseResponse = emotionResponses[Math.floor(Math.random() * emotionResponses.length)];

    // Add context based on message content
    let contextualAddition = "";
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('math') || lowerMessage.includes('calculus') || lowerMessage.includes('algebra')) {
      contextualAddition = " Mathematics is all about patterns and logical thinking.";
    } else if (lowerMessage.includes('physics')) {
      contextualAddition = " Physics helps us understand how the world works around us.";
    } else if (lowerMessage.includes('chemistry')) {
      contextualAddition = " Chemistry is fascinating - it's the science of matter and change.";
    } else if (lowerMessage.includes('help') || lowerMessage.includes('explain')) {
      contextualAddition = " I'm here to make complex concepts simple and understandable.";
    }

    return baseResponse + contextualAddition;
  }
}

export const tavusService = new TavusService();