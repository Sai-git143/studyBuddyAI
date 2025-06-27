import { API_CONFIG, getGeminiHeaders, isQuotaExceededError, MOCK_RESPONSES } from '../config/api';

export interface GeminiRequest {
  prompt: string;
  context?: string;
  maxTokens?: number;
  temperature?: number;
}

export interface GeminiResponse {
  text: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

class GeminiService {
  private baseUrl = API_CONFIG.GEMINI.BASE_URL;
  private apiKey = API_CONFIG.GEMINI.API_KEY;
  private model = API_CONFIG.GEMINI.MODEL;
  private fallbackModel = API_CONFIG.GEMINI.FALLBACK_MODEL;

  private async makeRequest(prompt: string, model: string = this.model): Promise<GeminiResponse> {
    const url = `${this.baseUrl}/models/${model}:generateContent?key=${this.apiKey}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: getGeminiHeaders(),
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Gemini API error: ${response.status} ${response.statusText} - ${errorData}`);
    }

    const data = await response.json();
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      throw new Error('Invalid response format from Gemini API');
    }

    const text = data.candidates[0].content.parts[0].text;
    
    return {
      text,
      usage: data.usageMetadata ? {
        promptTokens: data.usageMetadata.promptTokenCount || 0,
        completionTokens: data.usageMetadata.candidatesTokenCount || 0,
        totalTokens: data.usageMetadata.totalTokenCount || 0,
      } : undefined
    };
  }

  async generateResponse(request: GeminiRequest): Promise<GeminiResponse> {
    try {
      console.log('Generating response with Gemini...', { 
        prompt: request.prompt.substring(0, 100) + '...',
        model: this.model 
      });

      // Try with primary model first
      try {
        return await this.makeRequest(request.prompt, this.model);
      } catch (error) {
        console.warn('Primary model failed, trying fallback...', error);
        
        // If quota exceeded and fallbacks enabled, try fallback model
        if (isQuotaExceededError(error) && API_CONFIG.FALLBACKS.ENABLED) {
          console.log(`Trying fallback model: ${this.fallbackModel}`);
          return await this.makeRequest(request.prompt, this.fallbackModel);
        }
        
        // Re-throw original error if not a quota issue or fallbacks disabled
        throw error;
      }
    } catch (error) {
      console.error('Gemini API Error:', error);
      
      // If fallbacks enabled and this is a quota error, return mock response
      if (API_CONFIG.FALLBACKS.ENABLED && isQuotaExceededError(error)) {
        console.log('Returning mock response due to quota limitations');
        return {
          text: MOCK_RESPONSES.AI_RESPONSE,
          usage: {
            promptTokens: 0,
            completionTokens: 0,
            totalTokens: 0
          }
        };
      }
      
      throw error;
    }
  }

  async generateStudyResponse(topic: string, userInput: string, context?: string): Promise<string> {
    try {
      const prompt = `
        You are an AI tutor helping a student learn about ${topic}.
        
        ${context ? `Context: ${context}` : ''}
        
        Student input: ${userInput}
        
        Provide a helpful, encouraging response that:
        1. Addresses their question or comment
        2. Provides educational value
        3. Encourages continued learning
        4. Is conversational and supportive
        
        Keep the response concise but informative.
      `;

      const response = await this.generateResponse({ prompt });
      return response.text;
    } catch (error) {
      console.error('Failed to generate study response:', error);
      
      // Return fallback response
      if (API_CONFIG.FALLBACKS.ENABLED) {
        return `I understand you're working on ${topic}. ${MOCK_RESPONSES.AI_RESPONSE}`;
      }
      
      throw error;
    }
  }

  async generateFeedback(performance: any, topic: string): Promise<string> {
    try {
      const prompt = `
        Provide encouraging feedback for a student studying ${topic}.
        
        Performance data: ${JSON.stringify(performance)}
        
        Give specific, actionable feedback that:
        1. Acknowledges their effort
        2. Highlights areas of improvement
        3. Suggests next steps
        4. Maintains a positive, motivating tone
      `;

      const response = await this.generateResponse({ prompt });
      return response.text;
    } catch (error) {
      console.error('Failed to generate feedback:', error);
      
      // Return fallback feedback
      if (API_CONFIG.FALLBACKS.ENABLED) {
        return MOCK_RESPONSES.STUDY_FEEDBACK;
      }
      
      throw error;
    }
  }

  async isServiceAvailable(): Promise<boolean> {
    try {
      // Simple test request to check if service is available
      await this.generateResponse({ 
        prompt: "Test", 
        maxTokens: 10 
      });
      return true;
    } catch (error) {
      console.warn('Gemini service availability check failed:', error);
      return false;
    }
  }
}

export const geminiService = new GeminiService();