import React from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, 
  TrendingUp, 
  Target, 
  Clock, 
  Lightbulb, 
  Award,
  AlertCircle,
  CheckCircle,
  Zap
} from 'lucide-react';

interface LearningInsightsProps {
  currentEmotion: string;
  sessionDuration: number;
  topicsCompleted: string[];
  strugglingAreas: string[];
}

const LearningInsights: React.FC<LearningInsightsProps> = ({
  currentEmotion,
  sessionDuration,
  topicsCompleted,
  strugglingAreas
}) => {
  const insights = [
    {
      type: 'strength',
      icon: CheckCircle,
      title: 'Strong Performance',
      message: 'You\'re excelling at visual problem-solving! Your pattern recognition skills are improving.',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      type: 'improvement',
      icon: TrendingUp,
      title: 'Learning Velocity',
      message: 'Your understanding speed has increased 23% this week. Keep up the momentum!',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      type: 'suggestion',
      icon: Lightbulb,
      title: 'AI Recommendation',
      message: 'Based on your learning style, try explaining concepts out loud to reinforce understanding.',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200'
    },
    {
      type: 'challenge',
      icon: Target,
      title: 'Next Challenge',
      message: 'You\'re ready for advanced integration techniques. Let\'s tackle substitution methods!',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    }
  ];

  const getEmotionInsight = () => {
    switch (currentEmotion) {
      case 'frustrated':
        return {
          icon: AlertCircle,
          message: 'I notice you\'re feeling frustrated. Let\'s break this down into smaller, manageable steps.',
          color: 'text-red-600',
          bgColor: 'bg-red-50'
        };
      case 'confident':
        return {
          icon: Zap,
          message: 'Great confidence level! This is the perfect time to tackle challenging problems.',
          color: 'text-green-600',
          bgColor: 'bg-green-50'
        };
      case 'anxious':
        return {
          icon: Brain,
          message: 'Take a deep breath. Remember, making mistakes is part of learning. You\'re doing great!',
          color: 'text-purple-600',
          bgColor: 'bg-purple-50'
        };
      default:
        return {
          icon: CheckCircle,
          message: 'Your calm focus is excellent for learning. Let\'s maintain this steady pace.',
          color: 'text-blue-600',
          bgColor: 'bg-blue-50'
        };
    }
  };

  const emotionInsight = getEmotionInsight();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
    >
      <div className="flex items-center mb-6">
        <Brain className="h-6 w-6 text-primary-600 mr-3" />
        <h3 className="text-xl font-semibold text-gray-900">AI Learning Insights</h3>
      </div>

      {/* Emotional State Insight */}
      <div className={`p-4 rounded-xl mb-6 ${emotionInsight.bgColor} border border-opacity-30`}>
        <div className="flex items-start">
          <emotionInsight.icon className={`h-5 w-5 ${emotionInsight.color} mr-3 mt-0.5 flex-shrink-0`} />
          <div>
            <h4 className={`font-medium ${emotionInsight.color} mb-1`}>Emotional Intelligence</h4>
            <p className={`text-sm ${emotionInsight.color}`}>{emotionInsight.message}</p>
          </div>
        </div>
      </div>

      {/* Session Statistics */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center p-4 bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl">
          <Clock className="h-6 w-6 text-primary-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-primary-700">{sessionDuration}m</div>
          <div className="text-xs text-primary-600">Focus Time</div>
        </div>
        <div className="text-center p-4 bg-gradient-to-br from-secondary-50 to-secondary-100 rounded-xl">
          <Award className="h-6 w-6 text-secondary-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-secondary-700">{topicsCompleted.length}</div>
          <div className="text-xs text-secondary-600">Topics Mastered</div>
        </div>
      </div>

      {/* AI Insights */}
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

      {/* Struggling Areas */}
      {strugglingAreas.length > 0 && (
        <div className="mt-6 p-4 bg-orange-50 rounded-xl border border-orange-200">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-orange-600 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <h5 className="font-medium text-orange-700 mb-2">Areas for Extra Practice</h5>
              <div className="flex flex-wrap gap-2">
                {strugglingAreas.map((area, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-orange-100 text-orange-700 text-xs rounded-full"
                  >
                    {area}
                  </span>
                ))}
              </div>
              <p className="text-sm text-orange-600 mt-2">
                Don't worry! These topics just need a bit more attention. I'll create personalized exercises for you.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-6 flex space-x-3">
        <button className="flex-1 bg-primary-500 text-white py-2 px-4 rounded-lg hover:bg-primary-600 transition-colors text-sm font-medium">
          Generate Practice Problems
        </button>
        <button className="flex-1 border border-primary-500 text-primary-500 py-2 px-4 rounded-lg hover:bg-primary-50 transition-colors text-sm font-medium">
          View Detailed Analytics
        </button>
      </div>
    </motion.div>
  );
};

export default LearningInsights;