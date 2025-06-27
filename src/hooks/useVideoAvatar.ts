import { useState, useCallback } from 'react';
import { tavusService } from '../services/tavusService';
import { API_CONFIG } from '../config/api';

interface VideoAvatarHook {
  isGenerating: boolean;
  currentVideoUrl: string | null;
  error: string | null;
  generateVideoResponse: (text: string, emotion?: string) => Promise<string | null>;
  clearVideo: () => void;
  isConfigured: boolean;
}

export const useVideoAvatar = (): VideoAvatarHook => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentVideoUrl, setCurrentVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isConfigured = !!(API_CONFIG.TAVUS.API_KEY && API_CONFIG.TAVUS.REPLICA_ID);

  const generateVideoResponse = useCallback(async (
    text: string, 
    emotion: string = 'calm'
  ): Promise<string | null> => {
    if (!isConfigured) {
      setError('Tavus API not configured. Please add your API key and replica ID to your .env file.');
      return null;
    }

    if (!text || text.trim().length === 0) {
      setError('No text provided for video generation');
      return null;
    }

    setIsGenerating(true);
    setError(null);

    try {
      console.log('Generating video with Tavus API...');
      
      // Generate video using Tavus service
      const response = await tavusService.generateTutorResponse(text, emotion);
      
      // Check if video generation was successful
      if (response.videoUrl) {
        setCurrentVideoUrl(response.videoUrl);
        console.log('Video generated successfully:', response.videoUrl);
        return response.videoUrl;
      } else {
        // Video generation failed, but we have a text response
        console.warn('Video generation failed, falling back to text-only response');
        setCurrentVideoUrl(null);
        setError('Video generation failed or timed out. The AI tutor response is available as text only.');
        return null;
      }
    } catch (error) {
      console.error('Video generation failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate video';
      
      // Set a user-friendly error message
      if (errorMessage.includes('timeout') || errorMessage.includes('polling attempts')) {
        setError('Video generation is taking longer than expected. Please try again or continue with text-only responses.');
      } else if (errorMessage.includes('No video URL')) {
        setError('Video generation completed but the video is not available. Please try again.');
      } else {
        setError('Video generation failed. Please check your internet connection and try again.');
      }
      
      setCurrentVideoUrl(null);
      return null;
    } finally {
      setIsGenerating(false);
    }
  }, [isConfigured]);

  const clearVideo = useCallback(() => {
    setCurrentVideoUrl(null);
    setError(null);
  }, []);

  return {
    isGenerating,
    currentVideoUrl,
    error,
    generateVideoResponse,
    clearVideo,
    isConfigured
  };
};