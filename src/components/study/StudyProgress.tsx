import React from 'react';
import { motion } from 'framer-motion';
import { Target, Clock, BookOpen, TrendingUp, Award } from 'lucide-react';

interface StudyProgressProps {
  currentTopic: string;
  progress: number;
  timeSpent: number;
}

const StudyProgress: React.FC<StudyProgressProps> = ({ currentTopic, progress, timeSpent }) => {
  const milestones = [
    { threshold: 25, label: 'Getting Started', icon: '🌱', achieved: progress >= 25 },
    { threshold: 50, label: 'Making Progress', icon: '🚀', achieved: progress >= 50 },
    { threshold: 75, label: 'Almost There', icon: '⭐', achieved: progress >= 75 },
    { threshold: 100, label: 'Mastered!', icon: '🏆', achieved: progress >= 100 }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
    >
      <div className="flex items-center mb-4">
        <Target className="h-5 w-5 text-success-600 mr-2" />
        <h3 className="font-semibold text-gray-900">Study Progress</h3>
      </div>

      {/* Current Topic */}
      <div className="mb-6">
        <div className="flex items-center mb-2">
          <BookOpen className="h-4 w-4 text-primary-600 mr-2" />
          <span className="text-sm font-medium text-gray-700">Current Topic</span>
        </div>
        <h4 className="text-lg font-semibold text-gray-900">{currentTopic}</h4>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Understanding</span>
          <span className="text-sm font-bold text-primary-600">{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <motion.div
            className="bg-gradient-to-r from-primary-500 to-secondary-500 h-3 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Session Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center p-3 bg-primary-50 rounded-lg">
          <Clock className="h-5 w-5 text-primary-600 mx-auto mb-1" />
          <div className="text-lg font-bold text-primary-700">{timeSpent}m</div>
          <div className="text-xs text-primary-600">Time Spent</div>
        </div>
        <div className="text-center p-3 bg-secondary-50 rounded-lg">
          <TrendingUp className="h-5 w-5 text-secondary-600 mx-auto mb-1" />
          <div className="text-lg font-bold text-secondary-700">+{Math.floor(progress / 10)}</div>
          <div className="text-xs text-secondary-600">XP Gained</div>
        </div>
      </div>

      {/* Milestones */}
      <div>
        <div className="flex items-center mb-3">
          <Award className="h-4 w-4 text-yellow-500 mr-2" />
          <span className="text-sm font-medium text-gray-700">Milestones</span>
        </div>
        <div className="space-y-2">
          {milestones.map((milestone, index) => (
            <motion.div
              key={milestone.threshold}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className={`flex items-center p-2 rounded-lg transition-colors ${
                milestone.achieved 
                  ? 'bg-success-50 border border-success-200' 
                  : 'bg-gray-50'
              }`}
            >
              <div className="text-lg mr-3">{milestone.icon}</div>
              <div className="flex-1">
                <div className={`text-sm font-medium ${
                  milestone.achieved ? 'text-success-700' : 'text-gray-600'
                }`}>
                  {milestone.label}
                </div>
                <div className="text-xs text-gray-500">{milestone.threshold}% Complete</div>
              </div>
              {milestone.achieved && (
                <div className="text-success-600">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Next Steps */}
      <div className="mt-6 p-4 bg-gradient-to-r from-accent-50 to-warning-50 rounded-lg border border-accent-200">
        <h5 className="font-medium text-accent-700 mb-2">Next Steps</h5>
        <p className="text-sm text-accent-600">
          {progress < 50 
            ? "Keep practicing the fundamentals. You're building a strong foundation!"
            : progress < 75
            ? "Great progress! Ready for some practice problems?"
            : "Excellent work! Let's move to advanced applications."
          }
        </p>
      </div>
    </motion.div>
  );
};

export default StudyProgress;