// API Configuration and Service Integrations
export const API_CONFIG = {
  // Base API URL - would be your actual backend
  BASE_URL: import.meta.env.VITE_API_URL || 'https://api.studybuddy.ai',
  
  // ElevenLabs Configuration (Voice Recognition & Text-to-Speech)
  ELEVENLABS: {
    API_KEY: import.meta.env.VITE_ELEVENLABS_API_KEY,
    BASE_URL: 'https://api.elevenlabs.io/v1',
    VOICE_ID: import.meta.env.VITE_ELEVENLABS_VOICE_ID || '21m00Tcm4TlvDq8ikWAM', // Free tier voice (Adam)
    FALLBACK_VOICE_IDS: [
      '21m00Tcm4TlvDq8ikWAM', // Adam (free)
      'AZnzlk1XvdvUeBnXmlld', // Domi (free)
      'EXAVITQu4vr4xnSDxMaL', // Bella (free)
      'MF3mGyEYCl7XYWbV9V6O', // Elli (free)
      'TxGEqnHWrfWFTfGW9XjX', // Josh (free)
    ],
  },
  
  // Tavus Configuration (Video Avatar & Conversations)
  TAVUS: {
    API_KEY: import.meta.env.VITE_TAVUS_API_KEY,
    BASE_URL: 'https://tavusapi.com/v2',
    REPLICA_ID: import.meta.env.VITE_TAVUS_REPLICA_ID,
  },
  
  // RevenueCat Configuration
  REVENUECAT: {
    API_KEY: import.meta.env.VITE_REVENUECAT_API_KEY,
    APP_USER_ID: import.meta.env.VITE_REVENUECAT_APP_USER_ID,
  },
  
  // Gemini AI Configuration (Google)
  GEMINI: {
    API_KEY: import.meta.env.VITE_GEMINI_API_KEY,
    BASE_URL: 'https://generativelanguage.googleapis.com/v1',
    MODEL: 'gemini-1.5-flash',
    FALLBACK_MODEL: 'gemini-1.5-flash-8b', // Lighter model for quota issues
  },
  
  // Algorand Configuration
  ALGORAND: {
    NODE_URL: import.meta.env.VITE_ALGORAND_NODE_URL || 'https://testnet-api.algonode.cloud',
    INDEXER_URL: import.meta.env.VITE_ALGORAND_INDEXER_URL || 'https://testnet-idx.algonode.cloud',
    APP_ID: import.meta.env.VITE_ALGORAND_APP_ID,
  },

  // Fallback Configuration
  FALLBACKS: {
    ENABLED: import.meta.env.VITE_ENABLE_API_FALLBACKS === 'true',
    USE_MOCK_RESPONSES: import.meta.env.VITE_USE_MOCK_RESPONSES === 'true',
  }
};

// API Headers
export const getAuthHeaders = (token?: string) => ({
  'Content-Type': 'application/json',
  ...(token && { 'Authorization': `Bearer ${token}` }),
});

export const getElevenLabsHeaders = () => ({
  'Accept': 'audio/mpeg',
  'Content-Type': 'application/json',
  'xi-api-key': API_CONFIG.ELEVENLABS.API_KEY,
});

export const getTavusHeaders = () => ({
  'Content-Type': 'application/json',
  'x-api-key': API_CONFIG.TAVUS.API_KEY,
});

export const getGeminiHeaders = () => ({
  'Content-Type': 'application/json',
});

// Error handling utilities
export const isQuotaExceededError = (error: any): boolean => {
  const errorMessage = error?.message || error?.toString() || '';
  return errorMessage.includes('quota') || 
         errorMessage.includes('rate limit') || 
         errorMessage.includes('billing') ||
         errorMessage.includes('exceeded');
};

export const isSubscriptionError = (error: any): boolean => {
  const errorMessage = error?.message || error?.toString() || '';
  return errorMessage.includes('free_users_not_allowed') ||
         errorMessage.includes('subscription') ||
         errorMessage.includes('tier') ||
         errorMessage.includes('upgrade');
};

// Mock responses for fallback scenarios
export const MOCK_RESPONSES = {
  AI_RESPONSE: "I'm currently experiencing some technical difficulties with my AI services. However, I'm here to help you with your studies! Could you please rephrase your question or try again in a moment?",
  
  VOICE_ANALYSIS: {
    emotion: 'calm' as const,
    confidence: 0.7,
    energy_level: 0.5
  },
  
  STUDY_FEEDBACK: "Great job on your study session! Keep up the excellent work. I'll provide more detailed feedback once my services are fully operational.",
};