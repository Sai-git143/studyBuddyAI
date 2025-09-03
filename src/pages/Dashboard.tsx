import React from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, 
  Clock, 
  Target, 
  TrendingUp, 
  Users, 
  Award,
  Calendar,
  Mic,
  Video,
  BookOpen,
  Zap,
  Heart
} from 'lucide-react';
import Navigation from '../components/layout/Navigation';
import EmotionalStateIndicator from '../components/dashboard/EmotionalStateIndicator';
import ProgressChart from '../components/dashboard/ProgressChart';
import QuickActions from '../components/dashboard/QuickActions';
import RecentSessions from '../components/dashboard/RecentSessions';
import StudyStreak from '../components/dashboard/StudyStreak';
import WeeklyGoals from '../components/dashboard/WeeklyGoals';
import AIInsights from '../components/dashboard/AIInsights';
import { useAuthStore } from '../store/authStore';
import { useLearningStore } from '../store/learningStore';

const Dashboard = () => {
  const { user } = useAuthStore();
  const { progress, totalStudyTime, streakDays, achievements, totalXP, level } = useLearningStore();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const stats = [
    {
      label: 'Study Time',
      value: `${Math.floor(totalStudyTime / 60)}h ${totalStudyTime % 60}m`,
      icon: <Clock className="h-5 w-5" />,
      color: 'text-primary-600',
      bg: 'bg-primary-50',
      change: '+12%',
      changeType: 'positive'
    },
    {
      label: 'XP Points',
      value: totalXP.toLocaleString(),
      icon: <Zap className="h-5 w-5" />,
      color: 'text-yellow-600',
      bg: 'bg-yellow-50',
      change: '+156',
      changeType: 'positive'
    },
    {
      label: 'Level',
      value: level,
      icon: <Award className="h-5 w-5" />,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
      change: 'Level up!',
      changeType: 'positive'
    },
    {
      label: 'Streak',
      value: `${streakDays} days`,
      icon: <Target className="h-5 w-5" />,
      color: 'text-orange-600',
      bg: 'bg-orange-50',
      change: '+1',
      changeType: 'positive'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navigation />
      
      <div className="pt-16 px-4 sm:px-6 lg:px-8 pb-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
              <div className="mb-4 lg:mb-0">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {getGreeting()}, {user?.name}! 👋
                </h1>
                <p className="text-lg text-gray-600">
                  Ready to continue your learning journey? You're on Level {level}!
                </p>
              </div>
              <EmotionalStateIndicator />
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                >
                  <div className={`${stat.bg} ${stat.color} p-3 rounded-lg w-fit mb-3`}>
                    {stat.icon}
                  </div>
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                    <div className={`text-xs px-2 py-1 rounded-full ${
                      stat.changeType === 'positive' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {stat.change}
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column */}
            <div className="lg:col-span-8 space-y-8">
              
              {/* Quick Actions */}
              <QuickActions />
              
              {/* Progress Chart */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Learning Progress</h2>
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-success-600" />
                    <span className="text-sm text-success-600 font-medium">+15% this week</span>
                  </div>
                </div>
                <ProgressChart />
              </motion.div>

              {/* Recent Sessions */}
              <RecentSessions />
            </div>

            {/* Right Column */}
            <div className="lg:col-span-4 space-y-8">
              
              {/* Weekly Goals */}
              <WeeklyGoals />

              {/* Study Streak */}
              <StudyStreak />

              {/* AI Insights */}
              <AIInsights />

              {/* AI Tutor Status */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="bg-gradient-to-br from-primary-500 to-secondary-500 p-6 rounded-2xl text-white"
              >
                <div className="flex items-center mb-4">
                  <Brain className="h-6 w-6 mr-2" />
                  <h3 className="text-lg font-semibold">AI Tutor Status</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-3 animate-pulse"></div>
                    <span className="text-sm">Voice Recognition Active</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-3 animate-pulse"></div>
                    <span className="text-sm">Video Avatar Ready</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-3 animate-pulse"></div>
                    <span className="text-sm">Emotional Analysis Online</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-3 animate-pulse"></div>
                    <span className="text-sm">Learning Path Optimized</span>
                  </div>
                </div>
                <button className="w-full mt-4 bg-white/20 text-white py-3 rounded-lg hover:bg-white/30 transition-colors font-medium">
                  Start AI Learning Session
                </button>
              </motion.div>

              {/* Recent Achievements */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
              >
                <div className="flex items-center mb-4">
                  <Award className="h-5 w-5 text-success-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900">Recent Achievements</h3>
                </div>
                <div className="space-y-3">
                  {achievements.slice(-3).map((achievement, index) => (
                    <div key={index} className="flex items-center p-3 bg-gradient-to-r from-success-50 to-primary-50 rounded-lg border border-success-200">
                      <div className="w-10 h-10 bg-gradient-to-r from-success-500 to-primary-500 rounded-full flex items-center justify-center mr-3">
                        <span className="text-lg">{achievement.icon}</span>
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-success-700">{achievement.title}</div>
                        <div className="text-xs text-success-600">{achievement.description}</div>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        achievement.rarity === 'legendary' ? 'bg-yellow-100 text-yellow-700' :
                        achievement.rarity === 'epic' ? 'bg-purple-100 text-purple-700' :
                        achievement.rarity === 'rare' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {achievement.rarity}
                      </div>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-4 p-3 text-center text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors font-medium">
                  View All Achievements
                </button>
              </motion.div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;