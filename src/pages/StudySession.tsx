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
  Activity
} from 'lucide-react';
import Navigation from '../components/layout/Navigation';
import RealTimeTutoringInterface from '../components/tutoring/RealTimeTutoringInterface';
import EmotionalFeedback from '../components/study/EmotionalFeedback';
import StudyProgress from '../components/study/StudyProgress';
import PracticeProblems from '../components/study/PracticeProblems';
import LearningInsights from '../components/study/LearningInsights';
import AchievementModal from '../components/achievements/AchievementModal';
import { useAuthStore } from '../store/authStore';
import { useLearningStore } from '../store/learningStore';
import { useBlockchainRewards } from '../hooks/useBlockchainRewards';
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
  const [sessionMode, setSessionMode] = useState<'traditional' | 'realtime'>('realtime');

  useEffect(() => {
    if (!sessionStartTime) {
      setSessionStartTime(new Date());
      startStudySession('Mathematics');
      initializeWallet();
      toast.success('Real-time study session started! 🚀');
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
      await rewardForActivity('Real-time Study Session', duration * 3);
      
      // Check for achievements
      if (duration >= 30) {
        const achievement = {
          id: 'realtime-learner',
          title: 'Real-time Learner',
          description: 'Completed a 30-minute real-time tutoring session',
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
                    <h1 className="text-2xl font-bold text-gray-900">Real-Time AI Tutoring</h1>
                    <p className="text-gray-600">{currentTopic} • Mathematics • Live Session</p>
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

                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-green-600 font-medium">Live</span>
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
                    onClick={() => setSessionMode('realtime')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      sessionMode === 'realtime'
                        ? 'bg-white text-primary-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Activity className="h-4 w-4 mr-2 inline" />
                    Real-Time Tutoring
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
              
              {sessionMode === 'realtime' ? (
                <RealTimeTutoringInterface
                  subject="Mathematics"
                  topic={currentTopic}
                  onEmotionChange={handleEmotionDetected}
                />
              ) : (
                <div className="space-y-6">
                  {/* Traditional study components would go here */}
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Traditional Study Mode</h3>
                    <p className="text-gray-600">
                      Switch to Real-Time Tutoring mode for interactive AI-powered learning with live content generation and adaptive feedback.
                    </p>
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

              {/* Real-Time Features */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="bg-gradient-to-r from-primary-50 to-secondary-50 p-6 rounded-2xl border border-primary-200"
              >
                <h3 className="font-semibold text-primary-800 mb-4">Real-Time Features</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-primary-700">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3 animate-pulse"></div>
                    Live Content Generation
                  </div>
                  <div className="flex items-center text-sm text-primary-700">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3 animate-pulse"></div>
                    Adaptive Difficulty
                  </div>
                  <div className="flex items-center text-sm text-primary-700">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3 animate-pulse"></div>
                    Emotional Intelligence
                  </div>
                  <div className="flex items-center text-sm text-primary-700">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3 animate-pulse"></div>
                    Interactive Problems
                  </div>
                  <div className="flex items-center text-sm text-primary-700">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3 animate-pulse"></div>
                    Visual Explanations
                  </div>
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
                    • Earn 3x tokens for real-time sessions
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