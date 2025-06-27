import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Clock, 
  Target, 
  Zap, 
  Users, 
  BookOpen,
  Activity,
  BarChart3
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useUserDataStore } from '../../store/userDataStore';

const RealTimeStats = () => {
  const { user } = useAuthStore();
  const { getUserStats, updateUserStats } = useUserDataStore();
  const [stats, setStats] = useState<any>(null);
  const [isLive, setIsLive] = useState(true);

  useEffect(() => {
    if (user) {
      loadStats();
      
      // Simulate real-time stat updates
      const interval = setInterval(() => {
        if (isLive) {
          simulateStatUpdate();
        }
      }, 5000); // Update every 5 seconds

      return () => clearInterval(interval);
    }
  }, [user, isLive]);

  const loadStats = () => {
    if (!user) return;
    
    const userStats = getUserStats(user.id);
    setStats(userStats);
  };

  const simulateStatUpdate = () => {
    if (!user || !stats) return;

    // Simulate small incremental updates
    const updates = {
      totalStudyTime: stats.totalStudyTime + Math.floor(Math.random() * 5),
      totalXP: stats.totalXP + Math.floor(Math.random() * 10),
      lastActive: new Date().toISOString()
    };

    updateUserStats(user.id, updates);
    loadStats();
  };

  if (!user || !stats) return null;

  const statCards = [
    {
      label: 'Study Time Today',
      value: `${Math.floor(stats.totalStudyTime / 60)}h ${stats.totalStudyTime % 60}m`,
      icon: Clock,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      change: '+12 min',
      changeType: 'positive' as const
    },
    {
      label: 'Current Level',
      value: stats.level,
      icon: Target,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
      change: `${stats.totalXP} XP`,
      changeType: 'neutral' as const
    },
    {
      label: 'Study Streak',
      value: `${stats.currentStreak} days`,
      icon: Zap,
      color: 'text-orange-600',
      bg: 'bg-orange-50',
      change: stats.currentStreak > stats.longestStreak ? 'New record!' : `Best: ${stats.longestStreak}`,
      changeType: stats.currentStreak > stats.longestStreak ? 'positive' as const : 'neutral' as const
    },
    {
      label: 'Sessions Completed',
      value: stats.sessionsCompleted,
      icon: BookOpen,
      color: 'text-green-600',
      bg: 'bg-green-50',
      change: '+2 today',
      changeType: 'positive' as const
    }
  ];

  return (
    <div className="space-y-6">
      {/* Live Status Indicator */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Real-time Statistics</h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsLive(!isLive)}
            className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              isLive 
                ? 'bg-green-100 text-green-700' 
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
            <span>{isLive ? 'Live' : 'Paused'}</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className={`${stat.bg} ${stat.color} p-3 rounded-lg w-fit mb-4`}>
              <stat.icon className="h-5 w-5" />
            </div>
            
            <div className="flex items-center justify-between mb-2">
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              {isLive && (
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              )}
            </div>
            
            <div className="text-sm text-gray-600 mb-2">{stat.label}</div>
            
            <div className={`text-xs px-2 py-1 rounded-full w-fit ${
              stat.changeType === 'positive' 
                ? 'bg-green-100 text-green-700' 
                : stat.changeType === 'negative'
                ? 'bg-red-100 text-red-700'
                : 'bg-gray-100 text-gray-600'
            }`}>
              {stat.change}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Real-time Activity Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <BarChart3 className="h-6 w-6 text-primary-600 mr-3" />
            <h4 className="text-lg font-semibold text-gray-900">Activity Overview</h4>
          </div>
          <div className="text-sm text-gray-500">
            Last updated: {new Date(stats.lastActive).toLocaleTimeString()}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-xl">
            <div className="text-2xl font-bold text-blue-600 mb-1">{stats.coursesEnrolled}</div>
            <div className="text-sm text-blue-700">Courses Enrolled</div>
          </div>
          
          <div className="text-center p-4 bg-green-50 rounded-xl">
            <div className="text-2xl font-bold text-green-600 mb-1">{stats.coursesCompleted}</div>
            <div className="text-sm text-green-700">Courses Completed</div>
          </div>
          
          <div className="text-center p-4 bg-yellow-50 rounded-xl">
            <div className="text-2xl font-bold text-yellow-600 mb-1">{stats.achievementsUnlocked}</div>
            <div className="text-sm text-yellow-700">Achievements</div>
          </div>
          
          <div className="text-center p-4 bg-purple-50 rounded-xl">
            <div className="text-2xl font-bold text-purple-600 mb-1">{Math.floor(stats.totalStudyTime / 60)}</div>
            <div className="text-sm text-purple-700">Hours Studied</div>
          </div>
        </div>
      </motion.div>

      {/* Performance Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="bg-gradient-to-r from-primary-50 to-secondary-50 p-6 rounded-2xl border border-primary-200"
      >
        <div className="flex items-center mb-4">
          <TrendingUp className="h-5 w-5 text-primary-600 mr-2" />
          <h4 className="font-semibold text-primary-800">Performance Insights</h4>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="bg-white/50 p-4 rounded-lg">
            <div className="font-medium text-primary-700 mb-1">Study Consistency</div>
            <div className="text-primary-600">
              {stats.currentStreak > 0 
                ? `Great! You've studied ${stats.currentStreak} days in a row.`
                : 'Start a study session to begin your streak!'
              }
            </div>
          </div>
          
          <div className="bg-white/50 p-4 rounded-lg">
            <div className="font-medium text-primary-700 mb-1">Learning Progress</div>
            <div className="text-primary-600">
              {stats.totalXP > 1000 
                ? 'Excellent progress! You\'re becoming a learning expert.'
                : 'Keep going! Every study session builds your expertise.'
              }
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default RealTimeStats;