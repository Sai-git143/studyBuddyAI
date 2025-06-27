import React, { useEffect } from 'react';
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
  Heart,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Settings,
  Activity
} from 'lucide-react';
import Navigation from '../components/layout/Navigation';
import EmotionalStateIndicator from '../components/dashboard/EmotionalStateIndicator';
import ProgressChart from '../components/dashboard/ProgressChart';
import QuickActions from '../components/dashboard/QuickActions';
import RecentSessions from '../components/dashboard/RecentSessions';
import StudyStreak from '../components/dashboard/StudyStreak';
import WeeklyGoals from '../components/dashboard/WeeklyGoals';
import AIInsights from '../components/dashboard/AIInsights';
import UserActivityFeed from '../components/dashboard/UserActivityFeed';
import RealTimeStats from '../components/dashboard/RealTimeStats';
import { useAuthStore } from '../store/authStore';
import { useUserDataStore } from '../store/userDataStore';
import { useLearningStore } from '../store/learningStore';
import { API_CONFIG } from '../config/api';

const Dashboard = () => {
  const { user } = useAuthStore();
  const { addActivity, syncUserData } = useUserDataStore();
  const { progress, totalStudyTime, streakDays, achievements, totalXP, level } = useLearningStore();

  useEffect(() => {
    if (user) {
      // Sync user data on dashboard load
      syncUserData(user.id);
      
      // Add dashboard visit activity
      addActivity(user.id, {
        type: 'social_interaction',
        description: 'Visited dashboard',
        metadata: { page: 'dashboard' }
      });
    }
  }, [user]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  // Check API configuration status
  const getFeatureStatus = () => {
    const features = [
      {
        name: 'Voice Recognition',
        icon: Mic,
        status: API_CONFIG.ELEVENLABS.API_KEY ? 'configured' : 'not-configured',
        implemented: false,
        description: API_CONFIG.ELEVENLABS.API_KEY ? 'API configured (feature in development)' : 'ElevenLabs API key required'
      },
      {
        name: 'Video Avatar',
        icon: Video,
        status: API_CONFIG.TAVUS.API_KEY && API_CONFIG.TAVUS.REPLICA_ID ? 'configured' : 'not-configured',
        implemented: false,
        description: API_CONFIG.TAVUS.API_KEY && API_CONFIG.TAVUS.REPLICA_ID ? 'API configured (feature in development)' : 'Tavus API key/replica required'
      },
      {
        name: 'Emotional Analysis',
        icon: Heart,
        status: 'active',
        implemented: true,
        description: 'Built-in emotional intelligence system'
      },
      {
        name: 'Learning Path',
        icon: Brain,
        status: API_CONFIG.GEMINI.API_KEY ? 'active' : 'not-configured',
        implemented: true,
        description: API_CONFIG.GEMINI.API_KEY ? 'Gemini AI configured and active' : 'Gemini API key required'
      }
    ];

    return features;
  };

  const features = getFeatureStatus();
  const activeFeatures = features.filter(f => f.status === 'active' && f.implemented).length;

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Brain className="h-16 w-16 text-primary-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Please Sign In</h1>
          <p className="text-gray-600">You need to be logged in to access your dashboard.</p>
        </div>
      </div>
    );
  }

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
                  {getGreeting()}, {user.name}! 👋
                </h1>
                <p className="text-lg text-gray-600">
                  Welcome to your personalized learning dashboard. You're on Level {level}!
                </p>
                <div className="mt-2 flex items-center text-sm text-gray-500">
                  <Activity className="h-4 w-4 mr-1" />
                  Last active: {new Date(user.lastLoginAt).toLocaleString()}
                </div>
              </div>
              <EmotionalStateIndicator />
            </div>

            {/* Real-time Stats */}
            <RealTimeStats />
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

              {/* User Activity Feed */}
              <UserActivityFeed />
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
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Brain className="h-6 w-6 text-primary-600 mr-3" />
                    <h3 className="text-lg font-semibold text-gray-900">AI Tutor Status</h3>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${
                      activeFeatures >= 2 ? 'bg-green-500' : 
                      activeFeatures > 0 ? 'bg-yellow-500' : 'bg-red-500'
                    } animate-pulse`}></div>
                    <span className="text-xs font-medium text-gray-600">
                      {activeFeatures}/{features.length} Ready
                    </span>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <feature.icon className={`h-4 w-4 mr-3 ${
                          feature.implemented && feature.status === 'active' ? 'text-green-600' : 
                          feature.status === 'configured' ? 'text-yellow-600' : 'text-gray-400'
                        }`} />
                        <div>
                          <span className={`text-sm font-medium ${
                            feature.implemented && feature.status === 'active' ? 'text-gray-900' : 'text-gray-500'
                          }`}>
                            {feature.name}
                          </span>
                          <p className="text-xs text-gray-500">{feature.description}</p>
                        </div>
                      </div>
                      {feature.implemented && feature.status === 'active' ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : feature.status === 'configured' ? (
                        <Settings className="h-4 w-4 text-yellow-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-gray-400" />
                      )}
                    </div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <button 
                    className={`w-full py-3 rounded-lg font-medium transition-colors ${
                      activeFeatures >= 1 
                        ? 'bg-primary-500 text-white hover:bg-primary-600' 
                        : 'bg-gray-100 text-gray-500 cursor-not-allowed'
                    }`}
                    disabled={activeFeatures === 0}
                  >
                    {activeFeatures >= 1 ? 'Start AI Session' : 'Configure APIs to Enable'}
                  </button>
                </div>
              </motion.div>

              {/* Recent Sessions */}
              <RecentSessions />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;