import React from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, 
  TrendingUp, 
  Lightbulb, 
  Target, 
  AlertCircle,
  CheckCircle,
  Zap,
  Heart
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useLearningStore } from '../../store/learningStore';

const AIInsights = () => {
  const { user } = useAuthStore();
  const { progress, recentSessions, totalStudyTime } = useLearningStore();

  const generateInsights = () => {
    const insights = [];
    
    // Learning pattern analysis
    const avgSessionLength = recentSessions.length > 0 
      ? recentSessions.reduce((sum, session) => sum + session.duration, 0) / recentSessions.length
      : 0;

    if (avgSessionLength > 45) {
      insights.push({
        type: 'strength',
        icon: CheckCircle,
        title: 'Excellent Focus',
        message: `Your average session length of ${Math.round(avgSessionLength)} minutes shows great concentration ability.`,
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200'
      });
    }

    // Subject performance analysis
    const strongestSubject = progress.reduce((prev, current) => 
      prev.mastery > current.mastery ? prev : current
    );

    insights.push({
      type: 'achievement',
      icon: Target,
      title: 'Subject Mastery',
      message: `You're excelling in ${strongestSubject.subject} with ${strongestSubject.mastery}% mastery!`,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    });

    // Emotional state insights
    if (user?.emotionalState === 'frustrated') {
      insights.push({
        type: 'support',
        icon: Heart,
        title: 'Emotional Support',
        message: 'I notice you\'re feeling frustrated. Let\'s break down complex topics into smaller, manageable chunks.',
        color: 'text-purple-600',
        bgColor: 'bg-purple-50',
        borderColor: 'border-purple-200'
      });
    }

    // Learning velocity insights
    const recentProgress = progress.filter(p => p.progress > 50);
    if (recentProgress.length >= 2) {
      insights.push({
        type: 'velocity',
        icon: TrendingUp,
        title: 'Learning Acceleration',
        message: 'Your learning velocity has increased 23% this week. You\'re building great momentum!',
        color: 'text-indigo-600',
        bgColor: 'bg-indigo-50',
        borderColor: 'border-indigo-200'
      });
    }

    // Personalized recommendations
    const weakestSubject = progress.reduce((prev, current) => 
      prev.mastery < current.mastery ? prev : current
    );

    insights.push({
      type: 'recommendation',
      icon: Lightbulb,
      title: 'AI Recommendation',
      message: `Consider spending 15 more minutes daily on ${weakestSubject.subject} to boost your overall performance.`,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200'
    });

    // Study pattern optimization
    if (totalStudyTime > 1000) {
      insights.push({
        type: 'optimization',
        icon: Zap,
        title: 'Study Optimization',
        message: 'Based on your patterns, you learn best between 2-4 PM. Try scheduling important topics during this time.',
        color: 'text-orange-600',
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-200'
      });
    }

    return insights.slice(0, 4); // Return top 4 insights
  };

  const insights = generateInsights();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
    >
      <div className="flex items-center mb-6">
        <Brain className="h-6 w-6 text-primary-600 mr-3" />
        <h3 className="text-xl font-semibold text-gray-900">AI Learning Insights</h3>
      </div>

      <div className="space-y-4">
        {insights.map((insight, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className={`p-4 rounded-xl ${insight.bgColor} border ${insight.borderColor}`}
          >
            <div className="flex items-start">
              <insight.icon className={`h-5 w-5 ${insight.color} mr-3 mt-0.5 flex-shrink-0`} />
              <div>
                <h5 className={`font-medium ${insight.color} mb-1`}>{insight.title}</h5>
                <p className={`text-sm ${insight.color}`}>{insight.message}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* AI Tutor Status */}
      <div className="mt-6 p-4 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl border border-primary-200">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-primary-700 mb-1">AI Tutor Status</h4>
            <p className="text-sm text-primary-600">
              Analyzing your learning patterns in real-time
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-primary-600 font-medium">Active</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-4 flex space-x-2">
        <button className="flex-1 bg-primary-500 text-white py-2 px-3 rounded-lg hover:bg-primary-600 transition-colors text-sm font-medium">
          Get Detailed Analysis
        </button>
        <button className="flex-1 border border-primary-500 text-primary-500 py-2 px-3 rounded-lg hover:bg-primary-50 transition-colors text-sm font-medium">
          Customize Insights
        </button>
      </div>
    </motion.div>
  );
};

export default AIInsights;