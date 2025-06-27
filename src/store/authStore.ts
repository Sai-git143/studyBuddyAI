import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import toast from 'react-hot-toast';

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'reading';
  emotionalState: 'calm' | 'excited' | 'frustrated' | 'confident' | 'anxious';
  subscriptionTier: 'free' | 'premium' | 'pro';
  createdAt: string;
  lastLoginAt: string;
  preferences: {
    theme: 'light' | 'dark';
    notifications: boolean;
    language: string;
  };
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  showAuthModal: boolean;
  loading: boolean;
  users: User[]; // Simulated user database
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  setShowAuthModal: (show: boolean) => void;
  deleteAccount: () => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
}

// Simulated user database with some demo users
const initialUsers: User[] = [
  {
    id: 'demo-user-1',
    email: 'demo@studybuddy.ai',
    name: 'Demo User',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo',
    learningStyle: 'visual',
    emotionalState: 'calm',
    subscriptionTier: 'premium',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    lastLoginAt: new Date().toISOString(),
    preferences: {
      theme: 'light',
      notifications: true,
      language: 'en'
    }
  },
  {
    id: 'user-2',
    email: 'sarah@example.com',
    name: 'Sarah Chen',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
    learningStyle: 'auditory',
    emotionalState: 'excited',
    subscriptionTier: 'pro',
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    lastLoginAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    preferences: {
      theme: 'dark',
      notifications: true,
      language: 'en'
    }
  }
];

// Simulated password storage (in real app, this would be hashed and stored securely)
const userPasswords: Record<string, string> = {
  'demo@studybuddy.ai': 'demo123',
  'sarah@example.com': 'password123'
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      showAuthModal: false,
      loading: false,
      users: initialUsers,

      login: async (email: string, password: string) => {
        set({ loading: true });
        try {
          // Simulate API call delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Check if user exists and password is correct
          const { users } = get();
          const user = users.find(u => u.email === email);
          const storedPassword = userPasswords[email];
          
          if (!user || !storedPassword || storedPassword !== password) {
            throw new Error('Invalid email or password');
          }
          
          // Update last login time
          const updatedUser = {
            ...user,
            lastLoginAt: new Date().toISOString()
          };
          
          const updatedUsers = users.map(u => u.id === user.id ? updatedUser : u);
          
          set({ 
            user: updatedUser, 
            isAuthenticated: true, 
            showAuthModal: false, 
            loading: false,
            users: updatedUsers
          });
          
          toast.success(`Welcome back, ${updatedUser.name}! 🎉`);
          
        } catch (error) {
          set({ loading: false });
          const errorMessage = error instanceof Error ? error.message : 'Login failed';
          toast.error(errorMessage);
          throw error;
        }
      },

      signup: async (email: string, password: string, name: string) => {
        set({ loading: true });
        try {
          // Simulate API call delay
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          const { users } = get();
          
          // Check if user already exists
          if (users.find(u => u.email === email)) {
            throw new Error('User with this email already exists');
          }
          
          // Create new user
          const newUser: User = {
            id: `user-${Date.now()}`,
            email,
            name,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
            learningStyle: 'visual',
            emotionalState: 'calm',
            subscriptionTier: 'free',
            createdAt: new Date().toISOString(),
            lastLoginAt: new Date().toISOString(),
            preferences: {
              theme: 'light',
              notifications: true,
              language: 'en'
            }
          };
          
          // Store password (in real app, this would be hashed)
          userPasswords[email] = password;
          
          const updatedUsers = [...users, newUser];
          
          set({ 
            user: newUser, 
            isAuthenticated: true, 
            showAuthModal: false, 
            loading: false,
            users: updatedUsers
          });
          
          toast.success(`Welcome to StudyBuddy AI, ${newUser.name}! 🚀`);
          
        } catch (error) {
          set({ loading: false });
          const errorMessage = error instanceof Error ? error.message : 'Signup failed';
          toast.error(errorMessage);
          throw error;
        }
      },

      logout: () => {
        const { user } = get();
        set({ user: null, isAuthenticated: false });
        toast.success(`Goodbye, ${user?.name}! See you next time! 👋`);
      },

      updateUser: (updates) => {
        const { user, users } = get();
        if (user) {
          const updatedUser = { ...user, ...updates };
          const updatedUsers = users.map(u => u.id === user.id ? updatedUser : u);
          
          set({ 
            user: updatedUser,
            users: updatedUsers
          });
          
          toast.success('Profile updated successfully! ✨');
        }
      },

      setShowAuthModal: (show) => {
        set({ showAuthModal: show });
      },

      deleteAccount: async () => {
        const { user, users } = get();
        if (!user) return;
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Remove user from database
          const updatedUsers = users.filter(u => u.id !== user.id);
          delete userPasswords[user.email];
          
          set({
            user: null,
            isAuthenticated: false,
            users: updatedUsers
          });
          
          toast.success('Account deleted successfully');
        } catch (error) {
          toast.error('Failed to delete account');
          throw error;
        }
      },

      changePassword: async (currentPassword: string, newPassword: string) => {
        const { user } = get();
        if (!user) return;
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Check current password
          if (userPasswords[user.email] !== currentPassword) {
            throw new Error('Current password is incorrect');
          }
          
          // Update password
          userPasswords[user.email] = newPassword;
          
          toast.success('Password changed successfully! 🔒');
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to change password';
          toast.error(errorMessage);
          throw error;
        }
      },
    }),
    {
      name: 'studybuddy-auth',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        users: state.users
      }),
    }
  )
);