import React from 'react';
import { motion } from 'framer-motion';
import { Clock, BookOpen, TrendingUp, Brain } from 'lucide-react';
import { useLearningStore } from '../../store/learningStore';

const RecentSessions = () => {
  const { recentSessions } = useLearningStore();

  // Mock data if no sessions exist
  const sessions = recentSessions.length > 0 ? recentSessions : [
    {
      id: '1',
      subject: 'Mathematics',
      duration: 45,
      topicsCompleted: ['Derivatives', 'Chain Rule'],
      emotionalStates: ['calm', 'confident'],
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() // 2 hours ago
    },
    {
      id: '2',
      subject: 'Physics',
      duration: 30,
      topicsCompleted: ['Newton\'s Laws'],
      emotionalStates: ['excited', 'focused'],
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() // 1 day ago
    },
    {
      id: '3',
      subject: 'Chemistry',
      duration: 60,
      topicsCompleted: ['Molecular Structure', 'Bonding'],
      emotionalStates: ['frustrated', 'determined'],
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() // 2 days ago
    }
  ];

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const sessionTime = new Date(timestamp);
    const diffInHours = Math.floor((now.getTime() - sessionTime.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  const getEmotionEmoji = (emotion: string) => {
    const emotions: { [key: string]: string } = {
      calm: '😌',
      excited: '🤩',
      frustrated: '😤',
      confident: '😎',
      anxious: '😰',
      focused: '🎯',
      determined: '💪'
    };
    return emotions[emotion] || '😐';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Recent Sessions</h2>
        <TrendingUp className="h-5 w-5 text-success-600" />
      </div>

      <div className="space-y-4">
        {sessions.slice(0, 3).map((session, index) => (
          <motion.div
            key={session.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center">
                <div className="bg-primary-100 p-2 rounded-lg mr-3">
                  <BookOpen className="h-4 w-4 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{session.subject}</h3>
                  <p className="text-sm text-gray-600">{getTimeAgo(session.timestamp)}</p>
                </div>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="h-4 w-4 mr-1" />
                {session.duration}m
              </div>
            </div>

            <div className="mb-3">
              <div className="flex flex-wrap gap-2">
                {session.topicsCompleted.map((topic, topicIndex) => (
                  <span
                    key={topicIndex}
                    className="px-2 py-1 bg-secondary-100 text-secondary-700 text-xs rounded-full"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1">
                {session.emotionalStates.map((emotion, emotionIndex) => (
                  <span key={emotionIndex} className="text-lg" title={emotion}>
                    {getEmotionEmoji(emotion)}
                  </span>
                ))}
              </div>
              <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                Review Session
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <button className="w-full mt-4 p-3 text-center text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors font-medium">
        View All Sessions
      </button>
    </motion.div>
  );
};

export default RecentSessions;