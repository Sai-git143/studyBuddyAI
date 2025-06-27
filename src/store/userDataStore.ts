import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserActivity {
  id: string;
  userId: string;
  type: 'study_session' | 'achievement' | 'social_interaction' | 'course_enrollment';
  description: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

interface UserStats {
  userId: string;
  totalStudyTime: number;
  sessionsCompleted: number;
  achievementsUnlocked: number;
  currentStreak: number;
  longestStreak: number;
  totalXP: number;
  level: number;
  coursesEnrolled: number;
  coursesCompleted: number;
  lastActive: string;
}

interface UserDataState {
  activities: UserActivity[];
  userStats: Record<string, UserStats>;
  
  // Actions
  addActivity: (userId: string, activity: Omit<UserActivity, 'id' | 'userId' | 'timestamp'>) => void;
  updateUserStats: (userId: string, updates: Partial<Omit<UserStats, 'userId'>>) => void;
  getUserActivities: (userId: string, limit?: number) => UserActivity[];
  getUserStats: (userId: string) => UserStats | null;
  clearUserData: (userId: string) => void;
  syncUserData: (userId: string) => Promise<void>;
}

const createDefaultStats = (userId: string): UserStats => ({
  userId,
  totalStudyTime: 0,
  sessionsCompleted: 0,
  achievementsUnlocked: 0,
  currentStreak: 0,
  longestStreak: 0,
  totalXP: 0,
  level: 1,
  coursesEnrolled: 0,
  coursesCompleted: 0,
  lastActive: new Date().toISOString()
});

export const useUserDataStore = create<UserDataState>()(
  persist(
    (set, get) => ({
      activities: [],
      userStats: {},

      addActivity: (userId, activity) => {
        const newActivity: UserActivity = {
          ...activity,
          id: `activity-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          userId,
          timestamp: new Date().toISOString()
        };

        set(state => ({
          activities: [newActivity, ...state.activities].slice(0, 1000) // Keep last 1000 activities
        }));

        // Update last active time
        get().updateUserStats(userId, { lastActive: new Date().toISOString() });
      },

      updateUserStats: (userId, updates) => {
        set(state => {
          const currentStats = state.userStats[userId] || createDefaultStats(userId);
          const updatedStats = { ...currentStats, ...updates };
          
          return {
            userStats: {
              ...state.userStats,
              [userId]: updatedStats
            }
          };
        });
      },

      getUserActivities: (userId, limit = 50) => {
        const { activities } = get();
        return activities
          .filter(activity => activity.userId === userId)
          .slice(0, limit);
      },

      getUserStats: (userId) => {
        const { userStats } = get();
        return userStats[userId] || createDefaultStats(userId);
      },

      clearUserData: (userId) => {
        set(state => ({
          activities: state.activities.filter(activity => activity.userId !== userId),
          userStats: Object.fromEntries(
            Object.entries(state.userStats).filter(([id]) => id !== userId)
          )
        }));
      },

      syncUserData: async (userId) => {
        // Simulate real-time data sync
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // In a real app, this would sync with your backend
        console.log(`Syncing data for user: ${userId}`);
        
        // Update last sync time
        get().updateUserStats(userId, { lastActive: new Date().toISOString() });
      }
    }),
    {
      name: 'studybuddy-userdata',
    }
  )
);