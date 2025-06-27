import React from 'react';
import { motion } from 'framer-motion';
import { Target, Clock, TrendingUp, Award, Calendar } from 'lucide-react';
import { useLearningStore } from '../../store/learningStore';

const WeeklyGoals = () => {
  const { weeklyGoal, weeklyProgress, updateWeeklyProgress } = useLearningStore();
  
  const progressPercentage = Math.min((weeklyProgress / weeklyGoal) * 100, 100);
  const remainingTime = Math.max(weeklyGoal - weeklyProgress, 0);
  const daysLeft = 7 - new Date().getDay();

  const getProgressColor = () => {
    if (progressPercentage >= 100) return 'from-green-500 to-emerald-600';
    if (progressPercentage >= 75) return 'from-blue-500 to-indigo-600';
    if (progressPercentage >= 50) return 'from-yellow-500 to-orange-600';
    return 'from-red-500 to-pink-600';
  };

  const getMotivationalMessage = () => {
    if (progressPercentage >= 100) return "🎉 Goal achieved! You're on fire!";
    if (progressPercentage >= 75) return "🚀 Almost there! Keep pushing!";
    if (progressPercentage >= 50) return "💪 Great progress! Stay consistent!";
    return "🎯 Let's get started! Every minute counts!";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Target className="h-6 w-6 text-primary-600 mr-3" />
          <h3 className="text-lg font-semibold text-gray-900">Weekly Goal</h3>
        </div>
        <div className="text-sm text-gray-600">
          {daysLeft} days left
        </div>
      </div>

      {/* Progress Circle */}
      <div className="flex items-center justify-center mb-6">
        <div className="relative w-32 h-32">
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
            <circle
              cx="60"
              cy="60"
              r="50"
              stroke="#e5e7eb"
              strokeWidth="8"
              fill="none"
            />
            <motion.circle
              cx="60"
              cy="60"
              r="50"
              stroke="url(#progressGradient)"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 50}`}
              initial={{ strokeDashoffset: 2 * Math.PI * 50 }}
              animate={{ 
                strokeDashoffset: 2 * Math.PI * 50 * (1 - progressPercentage / 100)
              }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
            <defs>
              <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#14b8a6" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {Math.round(progressPercentage)}%
              </div>
              <div className="text-xs text-gray-600">Complete</div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center p-3 bg-primary-50 rounded-lg">
          <Clock className="h-5 w-5 text-primary-600 mx-auto mb-1" />
          <div className="text-lg font-bold text-primary-700">
            {Math.floor(weeklyProgress / 60)}h {weeklyProgress % 60}m
          </div>
          <div className="text-xs text-primary-600">Completed</div>
        </div>
        <div className="text-center p-3 bg-secondary-50 rounded-lg">
          <Target className="h-5 w-5 text-secondary-600 mx-auto mb-1" />
          <div className="text-lg font-bold text-secondary-700">
            {Math.floor(remainingTime / 60)}h {remainingTime % 60}m
          </div>
          <div className="text-xs text-secondary-600">Remaining</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Weekly Progress</span>
          <span>{weeklyProgress}/{weeklyGoal} min</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <motion.div
            className={`bg-gradient-to-r ${getProgressColor()} h-3 rounded-full`}
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Motivational Message */}
      <div className="text-center p-3 bg-gradient-to-r from-accent-50 to-warning-50 rounded-lg border border-accent-200">
        <p className="text-sm font-medium text-accent-700">
          {getMotivationalMessage()}
        </p>
      </div>

      {/* Quick Actions */}
      <div className="mt-4 flex space-x-2">
        <button className="flex-1 bg-primary-500 text-white py-2 px-3 rounded-lg hover:bg-primary-600 transition-colors text-sm font-medium">
          Start Session
        </button>
        <button className="flex-1 border border-primary-500 text-primary-500 py-2 px-3 rounded-lg hover:bg-primary-50 transition-colors text-sm font-medium">
          Adjust Goal
        </button>
      </div>
    </motion.div>
  );
};

export default WeeklyGoals;