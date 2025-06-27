import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  Heart, 
  Lightbulb,
  ArrowRight,
  Pause,
  Play,
  RotateCcw,
  BookOpen,
  Target,
  Clock,
  Settings,
  Award,
  Zap,
  Activity,
  Mic,
  Video
} from 'lucide-react';
import Navigation from '../components/layout/Navigation';
import AITutorInterface from '../components/ai/AITutorInterface';
import EmotionalFeedback from '../components/study/EmotionalFeedback';
import StudyProgress from '../components/study/StudyProgress';
import PracticeProblems from '../components/study/PracticeProblems';
import LearningInsights from '../components/study/LearningInsights';
import AchievementModal from '../components/achievements/AchievementModal';
import { useAuthStore } from '../store/authStore';
import { useLearningStore } from '../store/learningStore';
import { useBlockchainRewards } from '../hooks/useBlockchainRewards';
import { API_CONFIG } from '../config/api';
import toast from 'react-hot-toast';

const StudySession = () => {
  const { user, updateUser } = useAuthStore();
  const { startStudySession, endStudySession, currentSubject, addAchievement } = useLearningStore();
  const { initializeWallet, rewardForActivity, balance } = useBlockchainRewards();
  
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [currentTopic, setCurrentTopic] = useState('Introduction to Calculus');
  const [sessionPaused, setSessionPaused] = useState(false);
  const [showPracticeProblems, setShowPracticeProblems] = useState(false);
  const [achievementToShow, setAchievementToShow] = useState<any>(null);
  const [currentEmotion, setCurrentEmotion] = useState<'calm' | 'excited' | 'frustrated' | 'confident' | 'anxious'>('calm');
  const [sessionMode, setSessionMode] = useState<'ai-tutor' | 'traditional'>('ai-tutor');

  // Check feature availability
  const isVoiceAvailable = !!API_CONFIG.ELEVENLABS.API_KEY;
  const isVideoAvailable = !!(API_CONFIG.TAVUS.API_KEY && API_CONFIG.TAVUS.REPLICA_ID);
  const isAIAvailable = !!API_CONFIG.GEMINI.API_KEY;

  useEffect(() => {
    if (!sessionStartTime) {
      setSessionStartTime(new Date());
      startStudySession('Mathematics');
      initializeWallet();
      toast.success('Study session started! 🚀');
    }
  }, []);

  const getSessionDuration = () => {
    if (!sessionStartTime) return 0;
    return Math.floor((new Date().getTime() - sessionStartTime.getTime()) / (1000 * 60));
  };

  const handleEndSession = async () => {
    if (sessionStartTime) {
      const duration = getSessionDuration();
      endStudySession(duration, [currentTopic]);
      
      // Reward tokens for session completion
      await rewardForActivity('Study Session', duration * 3);
      
      // Check for achievements
      if (duration >= 30) {
        const achievement = {
          id: 'focused-learner',
          title: 'Focused Learner',
          description: 'Completed a 30-minute study session',
          icon: '🎯',
          rarity: 'rare' as const,
          unlockedAt: new Date(),
          category: 'learning' as const
        };
        addAchievement(achievement.title);
        setAchievementToShow(achievement);
      }
      
      toast.success(`Excellent session! You studied for ${duration} minutes and earned ${duration * 3} tokens.`);
    }
  };

  const handlePracticeComplete = async (score: number) => {
    setShowPracticeProblems(false);
    
    // Reward tokens based on score
    const tokenReward = Math.floor(score / 10) * 8;
    await rewardForActivity('Practice Problems', tokenReward);
    
    toast.success(`Practice complete! You scored ${score}% and earned ${tokenReward} tokens.`);
    
    if (score >= 90) {
      const achievement = {
        id: 'perfect-score',
        title: 'Perfect Score',
        description: 'Achieved 90% or higher on practice problems',
        icon: '💯',
        rarity: 'epic' as const,
        unlockedAt: new Date(),
        category: 'mastery' as const
      };
      addAchievement(achievement.title);
      setAchievementToShow(achievement);
    }
  };

  const toggleSessionPause = () => {
    setSessionPaused(!sessionPaused);
    toast(sessionPaused ? 'Session resumed' : 'Session paused');
  };

  const handleEmotionDetected = (emotion: string) => {
    setCurrentEmotion(emotion as any);
    updateUser({ emotionalState: emotion as any });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navigation />
      
      <div className="pt-16 px-4 sm:px-6 lg:px-8 pb-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Session Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div className="flex items-center mb-4 md:mb-0">
                  <div className="bg-gradient-to-r from-primary-500 to-secondary-500 p-3 rounded-lg mr-4">
                    <Activity className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">AI-Powered Study Session</h1>
                    <p className="text-gray-600">{currentTopic} • Mathematics • Interactive Learning</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{getSessionDuration()} min</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <Zap className="h-4 w-4 mr-1 text-yellow-500" />
                    <span>{balance} tokens</span>
                  </div>

                  {/* Feature Status Indicators */}
                  <div className="flex items-center space-x-2">
                    <div className={`flex items-center text-xs px-2 py-1 rounded-full ${
                      isVoiceAvailable ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                    }`}>
                      <Mic className="h-3 w-3 mr-1" />
                      Voice
                    </div>
                    <div className={`flex items-center text-xs px-2 py-1 rounded-full ${
                      isVideoAvailable ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'
                    }`}>
                      <Video className="h-3 w-3 mr-1" />
                      Video
                    </div>
                  </div>
                  
                  <button
                    onClick={toggleSessionPause}
                    className={`p-2 rounded-lg transition-colors ${
                      sessionPaused 
                        ? 'bg-green-500 text-white hover:bg-green-600' 
                        : 'bg-yellow-500 text-white hover:bg-yellow-600'
                    }`}
                  >
                    {sessionPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                  </button>
                  
                  <button
                    onClick={handleEndSession}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                  >
                    End Session
                  </button>
                </div>
              </div>

              {/* Session Mode Toggle */}
              <div className="mt-4 flex items-center justify-center">
                <div className="bg-gray-100 p-1 rounded-lg flex">
                  <button
                    onClick={() => setSessionMode('ai-tutor')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      sessionMode === 'ai-tutor'
                        ? 'bg-white text-primary-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Brain className="h-4 w-4 mr-2 inline" />
                    AI Tutor Mode
                  </button>
                  <button
                    onClick={() => setSessionMode('traditional')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      sessionMode === 'traditional'
                        ? 'bg-white text-primary-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <BookOpen className="h-4 w-4 mr-2 inline" />
                    Traditional Study
                  </button>
                </div>
              </div>

              {/* Feature Availability Notice */}
              {(!isVoiceAvailable || !isVideoAvailable) && (
                <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-start">
                    <Settings className="h-4 w-4 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-yellow-800">Enhanced Features Available</p>
                      <p className="text-xs text-yellow-700 mt-1">
                        {!isVoiceAvailable && 'Configure ElevenLabs API for voice recognition. '}
                        {!isVideoAvailable && 'Configure Tavus API for video avatar. '}
                        Check the setup guide for instructions.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Practice Problems Modal */}
          <AnimatePresence>
            {showPracticeProblems && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                >
                  <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Practice Problems</h2>
                    <button
                      onClick={() => setShowPracticeProblems(false)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="p-6">
                    <PracticeProblems 
                      subject="Mathematics"
                      onComplete={handlePracticeComplete}
                    />
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column - Main Learning Interface */}
            <div className="lg:col-span-2 space-y-6">
              
              {sessionMode === 'ai-tutor' ? (
                <AITutorInterface
                  subject="Mathematics"
                  topic={currentTopic}
                  onEmotionChange={handleEmotionDetected}
                />
              ) : (
                <div className="space-y-6">
                  {/* Traditional study components */}
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Traditional Study Mode</h3>
                    <p className="text-gray-600 mb-4">
                      Switch to AI Tutor Mode for interactive learning with voice recognition and video avatar features.
                    </p>
                    <button
                      onClick={() => setSessionMode('ai-tutor')}
                      className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors"
                    >
                      Try AI Tutor Mode
                    </button>
                  </div>
                </div>
              )}

              {/* Learning Insights */}
              <LearningInsights
                currentEmotion={currentEmotion}
                sessionDuration={getSessionDuration()}
                topicsCompleted={['Derivatives', 'Chain Rule']}
                strugglingAreas={['Integration by Parts']}
              />
            </div>

            {/* Right Column - Status & Progress */}
            <div className="space-y-6">
              
              {/* Emotional Feedback */}
              <EmotionalFeedback 
                currentEmotion={currentEmotion}
                onEmotionChange={(emotion) => {
                  setCurrentEmotion(emotion);
                  updateUser({ emotionalState: emotion });
                }}
              />

              {/* Study Progress */}
              <StudyProgress 
                currentTopic={currentTopic}
                progress={75}
                timeSpent={getSessionDuration()}
              />

              {/* AI Features Status */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
              >
                <h3 className="font-semibold text-gray-900 mb-4">AI Features Status</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Mic className="h-4 w-4 mr-2 text-primary-600" />
                      <span className="text-sm text-gray-700">Voice Recognition</span>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      isVoiceAvailable ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {isVoiceAvailable ? 'Ready' : 'Configure API'}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Video className="h-4 w-4 mr-2 text-blue-600" />
                      <span className="text-sm text-gray-700">Video Avatar</span>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      isVideoAvailable ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {isVideoAvailable ? 'Ready' : 'Configure API'}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Brain className="h-4 w-4 mr-2 text-green-600" />
                      <span className="text-sm text-gray-700">AI Intelligence</span>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      isAIAvailable ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {isAIAvailable ? 'Active' : 'Configure API'}
                    </span>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-xs text-blue-700">
                    💡 <strong>Setup Guide:</strong> Check the .env.example file for required API keys to enable all features.
                  </p>
                </div>
              </motion.div>

              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
              >
                <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
                
                <div className="space-y-2">
                  <button 
                    onClick={() => setShowPracticeProblems(true)}
                    className="w-full p-3 text-left bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 transition-colors flex items-center"
                  >
                    <Target className="h-4 w-4 mr-3" />
                    Practice Problems
                  </button>
                  <button className="w-full p-3 text-left bg-secondary-50 text-secondary-700 rounded-lg hover:bg-secondary-100 transition-colors flex items-center">
                    <Brain className="h-4 w-4 mr-3" />
                    AI Explanation
                  </button>
                  <button className="w-full p-3 text-left bg-accent-50 text-accent-700 rounded-lg hover:bg-accent-100 transition-colors flex items-center">
                    <Lightbulb className="h-4 w-4 mr-3" />
                    Get Hint
                  </button>
                </div>
              </motion.div>

              {/* Blockchain Status */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-2xl border border-yellow-200"
              >
                <div className="flex items-center mb-4">
                  <Zap className="h-5 w-5 text-yellow-600 mr-2" />
                  <h3 className="font-semibold text-yellow-800">Blockchain Rewards</h3>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-yellow-700">Current Balance</span>
                    <span className="font-bold text-yellow-800">{balance} tokens</span>
                  </div>
                  
                  <div className="text-xs text-yellow-600">
                    • Earn 3x tokens for AI sessions
                    • Verified on Algorand blockchain
                    • Trade with study partners
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Achievement Modal */}
      <AchievementModal
        achievement={achievementToShow}
        isOpen={!!achievementToShow}
        onClose={() => setAchievementToShow(null)}
      />
    </div>
  );
};

export default StudySession;