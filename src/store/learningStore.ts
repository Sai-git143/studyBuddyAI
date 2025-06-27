import { create } from 'zustand';

interface LearningProgress {
  subject: string;
  progress: number;
  timeSpent: number;
  lastStudied: string;
  mastery: number;
  weakAreas: string[];
  strongAreas: string[];
}

interface StudySession {
  id: string;
  subject: string;
  duration: number;
  topicsCompleted: string[];
  emotionalStates: string[];
  timestamp: string;
  score?: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt: Date;
  category: 'learning' | 'social' | 'streak' | 'mastery';
}

interface LearningState {
  currentSubject: string | null;
  progress: LearningProgress[];
  recentSessions: StudySession[];
  totalStudyTime: number;
  streakDays: number;
  achievements: Achievement[];
  weeklyGoal: number;
  weeklyProgress: number;
  learningStreak: number;
  totalXP: number;
  level: number;
  
  // Actions
  startStudySession: (subject: string) => void;
  endStudySession: (duration: number, topicsCompleted: string[], score?: number) => void;
  updateProgress: (subject: string, progressDelta: number) => void;
  addAchievement: (title: string) => void;
  updateWeeklyProgress: (minutes: number) => void;
  checkAndUnlockAchievements: (sessionData: any) => Achievement[];
}

export const useLearningStore = create<LearningState>((set, get) => ({
  currentSubject: null,
  progress: [
    { 
      subject: 'Mathematics', 
      progress: 75, 
      timeSpent: 1200, 
      lastStudied: '2024-01-15', 
      mastery: 80,
      weakAreas: ['Integration by Parts', 'Complex Numbers'],
      strongAreas: ['Derivatives', 'Limits', 'Basic Integration']
    },
    { 
      subject: 'Physics', 
      progress: 60, 
      timeSpent: 800, 
      lastStudied: '2024-01-14', 
      mastery: 65,
      weakAreas: ['Quantum Mechanics', 'Relativity'],
      strongAreas: ['Mechanics', 'Thermodynamics']
    },
    { 
      subject: 'Chemistry', 
      progress: 45, 
      timeSpent: 600, 
      lastStudied: '2024-01-13', 
      mastery: 50,
      weakAreas: ['Organic Reactions', 'Electrochemistry'],
      strongAreas: ['Atomic Structure', 'Chemical Bonding']
    },
    { 
      subject: 'Biology', 
      progress: 30, 
      timeSpent: 400, 
      lastStudied: '2024-01-12', 
      mastery: 35,
      weakAreas: ['Genetics', 'Molecular Biology'],
      strongAreas: ['Cell Biology', 'Ecology']
    },
  ],
  recentSessions: [
    {
      id: '1',
      subject: 'Mathematics',
      duration: 45,
      topicsCompleted: ['Derivatives', 'Chain Rule'],
      emotionalStates: ['calm', 'confident'],
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      score: 85,
      difficulty: 'medium'
    },
    {
      id: '2',
      subject: 'Physics',
      duration: 30,
      topicsCompleted: ['Newton\'s Laws'],
      emotionalStates: ['excited', 'focused'],
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      score: 78,
      difficulty: 'easy'
    }
  ],
  totalStudyTime: 3000,
  streakDays: 7,
  achievements: [
    {
      id: 'first-session',
      title: 'First Steps',
      description: 'Completed your first study session',
      icon: '🎯',
      rarity: 'common',
      unlockedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      category: 'learning'
    },
    {
      id: 'week-streak',
      title: 'Consistent Learner',
      description: 'Maintained a 7-day study streak',
      icon: '🔥',
      rarity: 'rare',
      unlockedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      category: 'streak'
    },
    {
      id: 'math-master',
      title: 'Math Wizard',
      description: 'Achieved 75% mastery in Mathematics',
      icon: '🧮',
      rarity: 'epic',
      unlockedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      category: 'mastery'
    }
  ],
  weeklyGoal: 300, // minutes
  weeklyProgress: 180,
  learningStreak: 7,
  totalXP: 2450,
  level: 12,

  startStudySession: (subject) => {
    set({ currentSubject: subject });
  },

  endStudySession: (duration, topicsCompleted, score) => {
    const { recentSessions, progress, totalStudyTime, weeklyProgress } = get();
    const newSession: StudySession = {
      id: Date.now().toString(),
      subject: get().currentSubject || 'General',
      duration,
      topicsCompleted,
      emotionalStates: ['focused'],
      timestamp: new Date().toISOString(),
      score,
      difficulty: 'medium'
    };

    // Update progress for the subject
    const updatedProgress = progress.map(p => 
      p.subject === newSession.subject 
        ? { 
            ...p, 
            timeSpent: p.timeSpent + duration, 
            lastStudied: new Date().toISOString().split('T')[0],
            progress: Math.min(100, p.progress + (score ? Math.floor(score / 10) : 5))
          }
        : p
    );

    // Check for new achievements
    const newAchievements = get().checkAndUnlockAchievements({
      duration,
      score,
      subject: newSession.subject,
      totalTime: totalStudyTime + duration
    });

    set({
      currentSubject: null,
      recentSessions: [newSession, ...recentSessions.slice(0, 9)],
      progress: updatedProgress,
      totalStudyTime: totalStudyTime + duration,
      weeklyProgress: weeklyProgress + duration,
      totalXP: get().totalXP + (score || 50),
    });

    return newAchievements;
  },

  updateProgress: (subject, progressDelta) => {
    const { progress } = get();
    const updatedProgress = progress.map(p =>
      p.subject === subject
        ? { ...p, progress: Math.min(100, p.progress + progressDelta) }
        : p
    );
    set({ progress: updatedProgress });
  },

  addAchievement: (title) => {
    const { achievements } = get();
    if (!achievements.find(a => a.title === title)) {
      const newAchievement: Achievement = {
        id: Date.now().toString(),
        title,
        description: `Unlocked: ${title}`,
        icon: '🏆',
        rarity: 'common',
        unlockedAt: new Date(),
        category: 'learning'
      };
      set({ achievements: [...achievements, newAchievement] });
    }
  },

  updateWeeklyProgress: (minutes) => {
    const { weeklyProgress } = get();
    set({ weeklyProgress: weeklyProgress + minutes });
  },

  checkAndUnlockAchievements: (sessionData) => {
    const { totalStudyTime, streakDays, achievements } = get();
    const newAchievements: Achievement[] = [];

    // Check for time-based achievements
    if (sessionData.duration >= 60 && !achievements.find(a => a.id === 'marathon-learner')) {
      newAchievements.push({
        id: 'marathon-learner',
        title: 'Marathon Learner',
        description: 'Studied for 60 minutes straight',
        icon: '🏃‍♂️',
        rarity: 'rare',
        unlockedAt: new Date(),
        category: 'learning'
      });
    }

    // Check for score-based achievements
    if (sessionData.score >= 90 && !achievements.find(a => a.id === 'perfectionist')) {
      newAchievements.push({
        id: 'perfectionist',
        title: 'Perfectionist',
        description: 'Scored 90% or higher on practice problems',
        icon: '💯',
        rarity: 'epic',
        unlockedAt: new Date(),
        category: 'mastery'
      });
    }

    // Check for total time achievements
    if (sessionData.totalTime >= 5000 && !achievements.find(a => a.id === 'dedicated-scholar')) {
      newAchievements.push({
        id: 'dedicated-scholar',
        title: 'Dedicated Scholar',
        description: 'Accumulated 5000 minutes of study time',
        icon: '📚',
        rarity: 'legendary',
        unlockedAt: new Date(),
        category: 'learning'
      });
    }

    if (newAchievements.length > 0) {
      set({ achievements: [...achievements, ...newAchievements] });
    }

    return newAchievements;
  },
}));