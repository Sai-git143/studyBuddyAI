// API Configuration and Service Integrations
export const API_CONFIG = {
  // Base API URL - would be your actual backend
  BASE_URL: import.meta.env.VITE_API_URL || 'https://api.studybuddy.ai',
  
  // ElevenLabs Configuration
  ELEVENLABS: {
    API_KEY: import.meta.env.VITE_ELEVENLABS_API_KEY,
    BASE_URL: 'https://api.elevenlabs.io/v1',
    VOICE_ID: import.meta.env.VITE_ELEVENLABS_VOICE_ID || 'pNInz6obpgDQGcFmaJgB', // Default voice
  },
  
  // Tavus Configuration
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
  
  // OpenAI Configuration
  OPENAI: {
    API_KEY: import.meta.env.VITE_OPENAI_API_KEY,
    BASE_URL: 'https://api.openai.com/v1',
  },
  
  // Algorand Configuration
  ALGORAND: {
    NODE_URL: import.meta.env.VITE_ALGORAND_NODE_URL || 'https://testnet-api.algonode.cloud',
    INDEXER_URL: import.meta.env.VITE_ALGORAND_INDEXER_URL || 'https://testnet-idx.algonode.cloud',
    APP_ID: import.meta.env.VITE_ALGORAND_APP_ID,
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