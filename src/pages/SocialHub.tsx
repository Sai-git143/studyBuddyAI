import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  MessageCircle, 
  Video, 
  Trophy, 
  Star,
  UserPlus,
  Calendar,
  Clock,
  BookOpen,
  Award,
  Zap,
  Heart,
  Search,
  Filter,
  Globe,
  Mic,
  Camera
} from 'lucide-react';
import Navigation from '../components/layout/Navigation';
import StudyPartnerCard from '../components/social/StudyPartnerCard';
import toast from 'react-hot-toast';

const SocialHub = () => {
  const [activeTab, setActiveTab] = useState('partners');
  const [searchQuery, setSearchQuery] = useState('');

  const studyPartners = [
    {
      id: '1',
      name: 'Emily Chen',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emily',
      subject: 'Mathematics',
      level: 'Advanced',
      compatibility: 95,
      status: 'online' as const,
      lastActive: '2 min ago',
      studyStreak: 12,
      rating: 4.9,
      totalSessions: 47,
      specialties: ['Calculus', 'Linear Algebra', 'Statistics'],
      timezone: 'PST',
      nextAvailable: 'Now'
    },
    {
      id: '2',
      name: 'Alex Johnson',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex',
      subject: 'Physics',
      level: 'Intermediate',
      compatibility: 88,
      status: 'studying' as const,
      lastActive: '5 min ago',
      studyStreak: 8,
      rating: 4.7,
      totalSessions: 32,
      specialties: ['Mechanics', 'Thermodynamics'],
      timezone: 'EST',
      nextAvailable: 'In 30 min'
    },
    {
      id: '3',
      name: 'Maya Patel',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=maya',
      subject: 'Chemistry',
      level: 'Beginner',
      compatibility: 82,
      status: 'offline' as const,
      lastActive: '1 hour ago',
      studyStreak: 15,
      rating: 4.8,
      totalSessions: 23,
      specialties: ['Organic Chemistry', 'Biochemistry'],
      timezone: 'GMT',
      nextAvailable: 'Tomorrow 9 AM'
    }
  ];

  const studyRooms = [
    {
      id: 1,
      name: 'Calculus Study Group',
      participants: 4,
      maxParticipants: 6,
      subject: 'Mathematics',
      topic: 'Integration Techniques',
      duration: '2 hours',
      facilitator: 'AI Tutor Sarah',
      status: 'active',
      language: 'English',
      difficulty: 'Advanced'
    },
    {
      id: 2,
      name: 'Physics Problem Solving',
      participants: 2,
      maxParticipants: 4,
      subject: 'Physics',
      topic: 'Quantum Mechanics',
      duration: '1.5 hours',
      facilitator: 'Dr. AI Thompson',
      status: 'starting',
      language: 'English',
      difficulty: 'Expert'
    },
    {
      id: 3,
      name: 'Chemistry Lab Review',
      participants: 6,
      maxParticipants: 8,
      subject: 'Chemistry',
      topic: 'Organic Reactions',
      duration: '3 hours',
      facilitator: 'Prof. AI Martinez',
      status: 'scheduled',
      language: 'Spanish',
      difficulty: 'Intermediate'
    }
  ];

  const leaderboard = [
    { rank: 1, name: 'Sarah Kim', points: 2450, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah', streak: 21 },
    { rank: 2, name: 'David Lee', points: 2380, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=david', streak: 18 },
    { rank: 3, name: 'Luna Rodriguez', points: 2320, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=luna', streak: 15 },
    { rank: 4, name: 'James Wilson', points: 2180, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=james', streak: 12 },
    { rank: 5, name: 'You', points: 1950, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=you', streak: 7 }
  ];

  const getRoomStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'starting': return 'bg-yellow-100 text-yellow-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleConnectPartner = (partnerId: string) => {
    const partner = studyPartners.find(p => p.id === partnerId);
    toast.success(`Connected with ${partner?.name}! Starting chat...`);
  };

  const handleVideoCall = (partnerId: string) => {
    const partner = studyPartners.find(p => p.id === partnerId);
    if (partner?.status === 'offline') {
      toast.error(`${partner.name} is currently offline`);
      return;
    }
    toast.success(`Starting video call with ${partner?.name}...`);
  };

  const handleJoinRoom = (roomId: number) => {
    const room = studyRooms.find(r => r.id === roomId);
    if (room?.participants >= room?.maxParticipants) {
      toast.error('Room is full');
      return;
    }
    toast.success(`Joining ${room?.name}...`);
  };

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
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Social Learning Hub</h1>
                <p className="text-lg text-gray-600">Connect, learn, and grow together with AI-powered matching</p>
              </div>
              
              <div className="flex items-center space-x-4 mt-4 md:mt-0">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search partners..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Find Partners
                </button>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="bg-white p-1 rounded-xl shadow-sm border border-gray-100 inline-flex">
              {[
                { id: 'partners', label: 'Study Partners', icon: Users },
                { id: 'rooms', label: 'Study Rooms', icon: Video },
                { id: 'leaderboard', label: 'Leaderboard', icon: Trophy }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-6 py-3 rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary-500 text-white'
                      : 'text-gray-600 hover:text-primary-600 hover:bg-primary-50'
                  }`}
                >
                  <tab.icon className="h-4 w-4 mr-2" />
                  {tab.label}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Content based on active tab */}
          {activeTab === 'partners' && (
            <div>
              {/* Filter Bar */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6"
              >
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center">
                    <Filter className="h-4 w-4 text-gray-500 mr-2" />
                    <span className="text-sm font-medium text-gray-700">Filter by:</span>
                  </div>
                  <select className="px-3 py-1 border border-gray-200 rounded-lg text-sm">
                    <option>All Subjects</option>
                    <option>Mathematics</option>
                    <option>Physics</option>
                    <option>Chemistry</option>
                  </select>
                  <select className="px-3 py-1 border border-gray-200 rounded-lg text-sm">
                    <option>All Levels</option>
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                  </select>
                  <select className="px-3 py-1 border border-gray-200 rounded-lg text-sm">
                    <option>All Timezones</option>
                    <option>PST</option>
                    <option>EST</option>
                    <option>GMT</option>
                  </select>
                </div>
              </motion.div>

              {/* Study Partners Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {studyPartners.map((partner, index) => (
                  <StudyPartnerCard
                    key={partner.id}
                    partner={partner}
                    onConnect={handleConnectPartner}
                    onVideoCall={handleVideoCall}
                  />
                ))}
              </div>
            </div>
          )}

          {activeTab === 'rooms' && (
            <div className="space-y-6">
              {/* Create Room Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="text-center"
              >
                <button className="bg-secondary-600 text-white px-6 py-3 rounded-xl hover:bg-secondary-700 transition-colors flex items-center mx-auto">
                  <Video className="h-5 w-5 mr-2" />
                  Create Study Room
                </button>
              </motion.div>

              {/* Study Rooms */}
              {studyRooms.map((room, index) => (
                <motion.div
                  key={room.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center">
                    <div className="flex-1 mb-4 lg:mb-0">
                      <div className="flex items-center mb-3">
                        <h3 className="text-xl font-semibold text-gray-900 mr-3">{room.name}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoomStatusColor(room.status)}`}>
                          {room.status}
                        </span>
                        <span className="ml-2 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          {room.difficulty}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center">
                          <BookOpen className="h-4 w-4 mr-2" />
                          {room.subject}
                        </div>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-2" />
                          {room.participants}/{room.maxParticipants}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2" />
                          {room.duration}
                        </div>
                        <div className="flex items-center">
                          <Globe className="h-4 w-4 mr-2" />
                          {room.language}
                        </div>
                      </div>
                      
                      <p className="text-gray-700 font-medium mb-2">Topic: {room.topic}</p>
                      <p className="text-sm text-gray-600">Facilitated by {room.facilitator}</p>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="text-center">
                        <div className="text-lg font-bold text-primary-600">{room.participants}</div>
                        <div className="text-xs text-gray-500">participants</div>
                      </div>
                      <button
                        onClick={() => handleJoinRoom(room.id)}
                        className="bg-secondary-500 text-white px-6 py-3 rounded-xl hover:bg-secondary-600 transition-colors flex items-center"
                      >
                        <Video className="h-4 w-4 mr-2" />
                        Join Room
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {activeTab === 'leaderboard' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
            >
              <div className="bg-gradient-to-r from-primary-500 to-secondary-500 p-6 text-white">
                <h2 className="text-2xl font-bold mb-2">This Week's Top Learners</h2>
                <p className="opacity-90">Earn points by helping others and completing study sessions</p>
              </div>
              
              <div className="p-6">
                {leaderboard.map((user, index) => (
                  <motion.div
                    key={user.rank}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className={`flex items-center p-4 rounded-lg mb-3 transition-colors ${
                      user.name === 'You' 
                        ? 'bg-primary-50 border border-primary-200' 
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm mr-4 ${
                      user.rank === 1 ? 'bg-yellow-500 text-white' :
                      user.rank === 2 ? 'bg-gray-400 text-white' :
                      user.rank === 3 ? 'bg-orange-500 text-white' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {user.rank}
                    </div>
                    
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-12 h-12 rounded-full mr-4"
                    />
                    
                    <div className="flex-1">
                      <h3 className={`font-semibold ${user.name === 'You' ? 'text-primary-700' : 'text-gray-900'}`}>
                        {user.name}
                      </h3>
                      <div className="flex items-center text-sm text-gray-600">
                        <Zap className="h-3 w-3 mr-1" />
                        {user.streak} day streak
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="flex items-center">
                        <Award className="h-4 w-4 text-yellow-500 mr-2" />
                        <span className="font-bold text-gray-900">{user.points.toLocaleString()}</span>
                      </div>
                      <div className="text-xs text-gray-500">points</div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Weekly Challenge */}
              <div className="border-t border-gray-200 p-6 bg-gradient-to-r from-accent-50 to-warning-50">
                <h3 className="font-semibold text-gray-900 mb-2">Weekly Challenge</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Help 5 study partners this week to earn bonus points!
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-accent-500 to-warning-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                </div>
                <div className="flex justify-between text-xs text-gray-600 mt-1">
                  <span>3/5 partners helped</span>
                  <span>+500 bonus points</span>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SocialHub;