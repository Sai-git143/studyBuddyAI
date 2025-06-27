import { API_CONFIG, getElevenLabsHeaders, isSubscriptionError, MOCK_RESPONSES } from '../config/api';

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
  private fallbackVoiceIndex = 0;

  private async tryWithFallbackVoice(request: TextToSpeechRequest, voiceId: string): Promise<Blob> {
    const response = await fetch(`${this.baseUrl}/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: getElevenLabsHeaders(),
      body: JSON.stringify({
        text: request.text,
        model_id: request.model_id || 'eleven_monolingual_v1',
        voice_settings: request.voice_settings || {
          stability: 0.5,
          similarity_boost: 0.7,
          style: 0.0,
          use_speaker_boost: true
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`ElevenLabs API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    return await response.blob();
  }

  async textToSpeech(request: TextToSpeechRequest): Promise<Blob> {
    try {
      console.log('Generating speech with ElevenLabs...', { text: request.text.substring(0, 50) + '...' });
      
      // Try with the primary voice first
      try {
        return await this.tryWithFallbackVoice(request, this.voiceId);
      } catch (error) {
        console.warn('Primary voice failed, trying fallback voices...', error);
        
        // If subscription error, try fallback voices
        if (isSubscriptionError(error) && API_CONFIG.FALLBACKS.ENABLED) {
          for (const fallbackVoiceId of API_CONFIG.ELEVENLABS.FALLBACK_VOICE_IDS) {
            try {
              console.log(`Trying fallback voice: ${fallbackVoiceId}`);
              return await this.tryWithFallbackVoice(request, fallbackVoiceId);
            } catch (fallbackError) {
              console.warn(`Fallback voice ${fallbackVoiceId} failed:`, fallbackError);
              continue;
            }
          }
        }
        
        // If all voices fail or fallbacks disabled, re-throw the original error
        throw error;
      }
    } catch (error) {
      console.error('ElevenLabs TTS Error:', error);
      
      // If fallbacks are enabled and this is a subscription error, create a silent audio blob
      if (API_CONFIG.FALLBACKS.ENABLED && isSubscriptionError(error)) {
        console.log('Creating fallback silent audio due to subscription limitations');
        return this.createSilentAudioBlob();
      }
      
      throw error;
    }
  }

  private createSilentAudioBlob(): Blob {
    // Create a minimal silent audio file (1 second of silence)
    const sampleRate = 44100;
    const duration = 1; // 1 second
    const numSamples = sampleRate * duration;
    const buffer = new ArrayBuffer(44 + numSamples * 2);
    const view = new DataView(buffer);
    
    // WAV header
    const writeString = (offset: number, string: string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };
    
    writeString(0, 'RIFF');
    view.setUint32(4, 36 + numSamples * 2, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeString(36, 'data');
    view.setUint32(40, numSamples * 2, true);
    
    // Silent audio data (all zeros)
    for (let i = 0; i < numSamples; i++) {
      view.setInt16(44 + i * 2, 0, true);
    }
    
    return new Blob([buffer], { type: 'audio/wav' });
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
      audio.onerror = (e) => {
        URL.revokeObjectURL(audioUrl);
        console.error('Audio playback error:', e);
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
      
      // If fallbacks enabled, show a notification instead of throwing
      if (API_CONFIG.FALLBACKS.ENABLED && isSubscriptionError(error)) {
        console.log('Speech synthesis unavailable due to subscription limitations');
        // Could show a toast notification here
        return;
      }
      
      throw error;
    }
  }

  // Enhanced voice emotion analysis with fallback
  async analyzeVoiceEmotion(audioData: Blob): Promise<VoiceAnalysisResult> {
    try {
      console.log('Analyzing voice emotion...');
      
      // In production, this would send audio to ElevenLabs or another service for analysis
      // For now, we'll simulate more sophisticated analysis
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate analysis based on audio characteristics
      const audioSize = audioData.size;
      const duration = audioSize / 16000; // Rough estimate
      
      // Simulate emotion detection based on various factors
      const emotions: Array<'calm' | 'excited' | 'frustrated' | 'confident' | 'anxious'> = 
        ['calm', 'excited', 'frustrated', 'confident', 'anxious'];
      
      // More sophisticated emotion selection based on audio characteristics
      let selectedEmotion: typeof emotions[number];
      let confidence: number;
      let energyLevel: number;
      
      if (duration > 5) {
        // Longer speech might indicate confidence or frustration
        selectedEmotion = Math.random() > 0.5 ? 'confident' : 'frustrated';
        confidence = 0.8 + Math.random() * 0.2;
        energyLevel = 0.6 + Math.random() * 0.4;
      } else if (duration < 2) {
        // Short speech might indicate anxiety or excitement
        selectedEmotion = Math.random() > 0.5 ? 'anxious' : 'excited';
        confidence = 0.7 + Math.random() * 0.2;
        energyLevel = Math.random();
      } else {
        // Medium duration suggests calm state
        selectedEmotion = 'calm';
        confidence = 0.75 + Math.random() * 0.25;
        energyLevel = 0.3 + Math.random() * 0.4;
      }
      
      console.log('Voice emotion analysis result:', { selectedEmotion, confidence, energyLevel });
      
      return {
        emotion: selectedEmotion,
        confidence,
        energy_level: energyLevel
      };
    } catch (error) {
      console.error('Voice analysis failed:', error);
      
      // Return mock response as fallback
      return MOCK_RESPONSES.VOICE_ANALYSIS;
    }
  }

  async getAvailableVoices() {
    try {
      console.log('Fetching available voices...');
      
      const response = await fetch(`${this.baseUrl}/voices`, {
        headers: getElevenLabsHeaders()
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch voices: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Available voices:', data.voices?.length || 0);
      return data;
    } catch (error) {
      console.error('Failed to get voices:', error);
      
      // Return mock voices data if fallbacks enabled
      if (API_CONFIG.FALLBACKS.ENABLED) {
        return {
          voices: API_CONFIG.ELEVENLABS.FALLBACK_VOICE_IDS.map((id, index) => ({
            voice_id: id,
            name: `Voice ${index + 1}`,
            category: 'premade'
          }))
        };
      }
      
      throw error;
    }
  }

  // Create audio URL from text for use in components
  async createAudioUrl(text: string, emotion: string = 'calm'): Promise<string> {
    try {
      // Adjust voice settings based on emotion
      const voiceSettings: VoiceSettings = {
        stability: emotion === 'anxious' ? 0.8 : 0.5,
        similarity_boost: 0.7,
        style: emotion === 'excited' ? 0.3 : 0.1,
        use_speaker_boost: true
      };

      const audioBlob = await this.textToSpeech({
        text,
        voice_settings: voiceSettings
      });

      return URL.createObjectURL(audioBlob);
    } catch (error) {
      console.error('Failed to create audio URL:', error);
      
      // Return silent audio URL as fallback
      if (API_CONFIG.FALLBACKS.ENABLED && isSubscriptionError(error)) {
        const silentBlob = this.createSilentAudioBlob();
        return URL.createObjectURL(silentBlob);
      }
      
      throw error;
    }
  }
}

export const elevenLabsService = new ElevenLabsService();