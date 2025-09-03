import { create } from 'zustand';
import toast from 'react-hot-toast';

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'reading';
  emotionalState: 'calm' | 'excited' | 'frustrated' | 'confident' | 'anxious';
  subscriptionTier: 'free' | 'premium' | 'pro';
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  showAuthModal: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  setShowAuthModal: (show: boolean) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  showAuthModal: false,
  loading: false,

  login: async (email: string, password: string) => {
    set({ loading: true });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const user: User = {
        id: '1',
        email,
        name: email.split('@')[0],
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
        learningStyle: 'visual',
        emotionalState: 'calm',
        subscriptionTier: 'free',
      };
      
      set({ 
        user, 
        isAuthenticated: true, 
        showAuthModal: false, 
        loading: false 
      });
      
      toast.success(`Welcome back, ${user.name}! 🎉`);
      
    } catch (error) {
      set({ loading: false });
      toast.error('Login failed. Please try again.');
    }
  },

  signup: async (email: string, password: string, name: string) => {
    set({ loading: true });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const user: User = {
        id: '1',
        email,
        name,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
        learningStyle: 'visual',
        emotionalState: 'calm',
        subscriptionTier: 'free',
      };
      
      set({ 
        user, 
        isAuthenticated: true, 
        showAuthModal: false, 
        loading: false 
      });
      
      toast.success(`Welcome to StudyBuddy AI, ${user.name}! 🚀 Let's start learning together.`);
      
    } catch (error) {
      set({ loading: false });
      toast.error('Signup failed. Please try again.');
    }
  },

  logout: () => {
    set({ user: null, isAuthenticated: false });
    toast.success('See you next time! 👋');
  },

  updateUser: (updates) => {
    const { user } = get();
    if (user) {
      set({ user: { ...user, ...updates } });
    }
  },

  setShowAuthModal: (show) => {
    set({ showAuthModal: show });
  },
}));