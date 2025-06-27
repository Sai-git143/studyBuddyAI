import React from 'react';
import { motion } from 'framer-motion';
import { 
  MessageCircle, 
  Video, 
  Star, 
  Clock, 
  BookOpen, 
  Zap,
  Heart,
  Trophy,
  Calendar
} from 'lucide-react';

interface StudyPartner {
  id: string;
  name: string;
  avatar: string;
  subject: string;
  level: string;
  compatibility: number;
  status: 'online' | 'studying' | 'offline';
  lastActive: string;
  studyStreak: number;
  rating: number;
  totalSessions: number;
  specialties: string[];
  timezone: string;
  nextAvailable: string;
}

interface StudyPartnerCardProps {
  partner: StudyPartner;
  onConnect: (partnerId: string) => void;
  onVideoCall: (partnerId: string) => void;
}

const StudyPartnerCard: React.FC<StudyPartnerCardProps> = ({ 
  partner, 
  onConnect, 
  onVideoCall 
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'studying': return 'bg-blue-500';
      case 'offline': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'online': return 'Available';
      case 'studying': return 'In Session';
      case 'offline': return 'Offline';
      default: return 'Unknown';
    }
  };

  const getCompatibilityColor = (compatibility: number) => {
    if (compatibility >= 90) return 'text-green-600 bg-green-100';
    if (compatibility >= 75) return 'text-blue-600 bg-blue-100';
    if (compatibility >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-gray-600 bg-gray-100';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}
      transition={{ duration: 0.3 }}
      className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-primary-200"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <div className="relative">
            <img
              src={partner.avatar}
              alt={partner.name}
              className="w-14 h-14 rounded-full object-cover"
            />
            <div className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white ${getStatusColor(partner.status)}`}></div>
          </div>
          <div className="ml-4">
            <h3 className="font-semibold text-gray-900 text-lg">{partner.name}</h3>
            <p className="text-sm text-gray-600">{getStatusText(partner.status)} • {partner.lastActive}</p>
          </div>
        </div>
        
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${getCompatibilityColor(partner.compatibility)}`}>
          {partner.compatibility}% match
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center p-3 bg-primary-50 rounded-lg">
          <div className="flex items-center justify-center mb-1">
            <Star className="h-4 w-4 text-primary-600 mr-1" />
            <span className="font-bold text-primary-700">{partner.rating}</span>
          </div>
          <div className="text-xs text-primary-600">Rating</div>
        </div>
        
        <div className="text-center p-3 bg-secondary-50 rounded-lg">
          <div className="flex items-center justify-center mb-1">
            <Zap className="h-4 w-4 text-secondary-600 mr-1" />
            <span className="font-bold text-secondary-700">{partner.studyStreak}</span>
          </div>
          <div className="text-xs text-secondary-600">Day Streak</div>
        </div>
      </div>

      {/* Subject & Level */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-gray-600">Primary Subject</span>
          <span className="font-medium text-gray-900">{partner.subject}</span>
        </div>
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-gray-600">Level</span>
          <span className="font-medium text-gray-900">{partner.level}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Sessions</span>
          <span className="font-medium text-gray-900">{partner.totalSessions}</span>
        </div>
      </div>

      {/* Specialties */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Specialties</h4>
        <div className="flex flex-wrap gap-2">
          {partner.specialties.map((specialty, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-accent-100 text-accent-700 text-xs rounded-full"
            >
              {specialty}
            </span>
          ))}
        </div>
      </div>

      {/* Availability */}
      <div className="mb-6 p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center text-sm text-gray-600 mb-1">
          <Clock className="h-4 w-4 mr-2" />
          <span>Timezone: {partner.timezone}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="h-4 w-4 mr-2" />
          <span>Next available: {partner.nextAvailable}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onConnect(partner.id)}
          className="flex-1 bg-primary-500 text-white py-3 rounded-xl hover:bg-primary-600 transition-colors flex items-center justify-center font-medium"
        >
          <MessageCircle className="h-4 w-4 mr-2" />
          Connect
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onVideoCall(partner.id)}
          disabled={partner.status === 'offline'}
          className="flex-1 border border-secondary-500 text-secondary-500 py-3 rounded-xl hover:bg-secondary-50 transition-colors flex items-center justify-center font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Video className="h-4 w-4 mr-2" />
          Study Call
        </motion.button>
      </div>

      {/* Quick Actions */}
      <div className="mt-4 flex justify-center space-x-4">
        <button className="p-2 text-gray-400 hover:text-primary-600 transition-colors" title="Add to favorites">
          <Heart className="h-4 w-4" />
        </button>
        <button className="p-2 text-gray-400 hover:text-secondary-600 transition-colors" title="View profile">
          <BookOpen className="h-4 w-4" />
        </button>
        <button className="p-2 text-gray-400 hover:text-accent-600 transition-colors" title="View achievements">
          <Trophy className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  );
};

export default StudyPartnerCard;