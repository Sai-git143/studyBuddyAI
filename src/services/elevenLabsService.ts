import { API_CONFIG, getElevenLabsHeaders } from '../config/api';

export interface VoiceSettings {
  stability: number;
  similarity_boost: number;
  style?: number;
  use_speaker_boost?: boolean;
}

export interface TextToSpeechRequest {
  text: string;
  model_id?: string;
  voice_settings?: VoiceSettings;
}

export interface VoiceAnalysisResult {
  emotion: 'calm' | 'excited' | 'frustrated' | 'confident' | 'anxious';
  confidence: number;
  energy_level: number;
}

class ElevenLabsService {
  private baseUrl = API_CONFIG.ELEVENLABS.BASE_URL;
  private voiceId = API_CONFIG.ELEVENLABS.VOICE_ID;

  async textToSpeech(request: TextToSpeechRequest): Promise<Blob> {
    try {
      const response = await fetch(`${this.baseUrl}/text-to-speech/${this.voiceId}`, {
        method: 'POST',
        headers: getElevenLabsHeaders(),
        body: JSON.stringify({
          text: request.text,
          model_id: request.model_id || 'eleven_monolingual_v1',
          voice_settings: request.voice_settings || {
            stability: 0.5,
            similarity_boost: 0.5,
            style: 0.0,
            use_speaker_boost: true
          }
        })
      });

      if (!response.ok) {
        throw new Error(`ElevenLabs API error: ${response.statusText}`);
      }

      return await response.blob();
    } catch (error) {
      console.error('ElevenLabs TTS Error:', error);
      throw error;
    }
  }

  async playAudio(audioBlob: Blob): Promise<void> {
    return new Promise((resolve, reject) => {
      const audio = new Audio();
      const audioUrl = URL.createObjectURL(audioBlob);
      
      audio.src = audioUrl;
      audio.onended = () => {
        URL.revokeObjectURL(audioUrl);
        resolve();
      };
      audio.onerror = () => {
        URL.revokeObjectURL(audioUrl);
        reject(new Error('Audio playback failed'));
      };
      
      audio.play().catch(reject);
    });
  }

  async speakText(text: string, voiceSettings?: VoiceSettings): Promise<void> {
    try {
      const audioBlob = await this.textToSpeech({
        text,
        voice_settings: voiceSettings
      });
      
      await this.playAudio(audioBlob);
    } catch (error) {
      console.error('Speech synthesis failed:', error);
      throw error;
    }
  }

  // Simulate voice emotion analysis (would use actual ElevenLabs voice analysis in production)
  async analyzeVoiceEmotion(audioData: Blob): Promise<VoiceAnalysisResult> {
    try {
      // In production, this would send audio to ElevenLabs for analysis
      // For now, we'll simulate the analysis
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const emotions: Array<'calm' | 'excited' | 'frustrated' | 'confident' | 'anxious'> = 
        ['calm', 'excited', 'frustrated', 'confident', 'anxious'];
      
      return {
        emotion: emotions[Math.floor(Math.random() * emotions.length)],
        confidence: 0.7 + Math.random() * 0.3,
        energy_level: Math.random()
      };
    } catch (error) {
      console.error('Voice analysis failed:', error);
      throw error;
    }
  }

  async getAvailableVoices() {
    try {
      const response = await fetch(`${this.baseUrl}/voices`, {
        headers: getElevenLabsHeaders()
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch voices: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to get voices:', error);
      throw error;
    }
  }
}

export const elevenLabsService = new ElevenLabsService();