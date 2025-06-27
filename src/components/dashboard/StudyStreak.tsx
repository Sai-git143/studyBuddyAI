import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Calendar, Target } from 'lucide-react';
import { useLearningStore } from '../../store/learningStore';

const StudyStreak = () => {
  const { streakDays } = useLearningStore();

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const currentDay = new Date().getDay();
  const mondayFirst = currentDay === 0 ? 6 : currentDay - 1; // Convert Sunday=0 to Monday=0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="bg-gradient-to-br from-orange-500 to-red-500 p-6 rounded-2xl text-white"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Study Streak</h3>
        <Flame className="h-6 w-6 text-yellow-300" />
      </div>

      <div className="text-center mb-6">
        <div className="text-4xl font-bold mb-2">{streakDays}</div>
        <div className="text-white/90">Days in a row</div>
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm text-white/90">This Week</span>
          <Calendar className="h-4 w-4 text-white/70" />
        </div>
        <div className="grid grid-cols-7 gap-1">
          {weekDays.map((day, index) => (
            <div key={day} className="text-center">
              <div className="text-xs text-white/70 mb-1">{day}</div>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                  index <= mondayFirst
                    ? 'bg-white/30 text-white'
                    : 'bg-white/10 text-white/50'
                }`}
              >
                {index <= mondayFirst ? '✓' : '○'}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white/20 p-4 rounded-xl">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-white/90">Next Milestone</span>
          <Target className="h-4 w-4 text-white/70" />
        </div>
        <div className="flex items-center justify-between">
          <span className="font-medium">30 Day Streak</span>
          <span className="text-sm text-white/90">{30 - streakDays} days to go</span>
        </div>
        <div className="w-full bg-white/20 rounded-full h-2 mt-2">
          <div
            className="bg-white h-2 rounded-full transition-all duration-500"
            style={{ width: `${(streakDays / 30) * 100}%` }}
          ></div>
        </div>
      </div>
    </motion.div>
  );
};

export default StudyStreak;