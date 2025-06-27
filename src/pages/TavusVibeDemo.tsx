import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Video, 
  Brain, 
  Users, 
  BookOpen, 
  ArrowLeft,
  Settings,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/layout/Navigation';
import TavusVibeStudySession from '../components/study/TavusVibeStudySession';
import TavusVibeChat from '../components/tavus/TavusVibeChat';
import { API_CONFIG } from '../config/api';

const TavusVibeDemo = () => {
  const navigate = useNavigate();
  const [selectedDemo, setSelectedDemo] = useState<'study' | 'chat' | null>(null);
  const [demoSubject, setDemoSubject] = useState('Mathematics');
  const [demoTopic, setDemoTopic] = useState('Calculus Fundamentals');

  const subjects = [
    'Mathematics',
    'Physics', 
    'Chemistry',
    'Biology',
    'Computer Science',
    'History',
    'Literature',
    'Psychology'
  ];

  const topics = {
    'Mathematics': ['Calculus Fundamentals', 'Linear Algebra', 'Statistics', 'Geometry'],
    'Physics': ['Mechanics', 'Thermodynamics', 'Quantum Physics', 'Electromagnetism'],
    'Chemistry': ['Organic Chemistry', 'Inorganic Chemistry', 'Physical Chemistry', 'Biochemistry'],
    'Biology': ['Cell Biology', 'Genetics', 'Evolution', 'Ecology'],
    'Computer Science': ['Algorithms', 'Data Structures', 'Machine Learning', 'Web Development'],
    'History': ['World History', 'American History', 'Ancient Civilizations', 'Modern History'],
    'Literature': ['Classic Literature', 'Poetry Analysis', 'Creative Writing', 'Literary Theory'],
    'Psychology': ['Cognitive Psychology', 'Social Psychology', 'Developmental Psychology', 'Abnormal Psychology']
  };

  const isConfigured = !!(API_CONFIG.TAVUS.API_KEY && API_CONFIG.TAVUS.REPLICA_ID);

  const handleBackToSelection = () => {
    setSelectedDemo(null);
  };

  if (selectedDemo === 'study') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Navigation />
        <div className="pt-16 px-4 sm:px-6 lg:px-8 pb-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6">
              <button
                onClick={handleBackToSelection}
                className="flex items-center text-primary-600 hover:text-primary-700 transition-colors mb-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Demo Selection
              </button>
              <h1 className="text-3xl font-bold text-gray-900">Tavus Vibecode Study Session Demo</h1>
              <p className="text-gray-600 mt-2">Experience AI-powered video tutoring with real-time interaction</p>
            </div>
            
            <TavusVibeStudySession
              subject={demoSubject}
              topic={demoTopic}
              onSessionEnd={() => console.log('Demo session ended')}
            />
          </div>
        </div>
      </div>
    );
  }

  if (selectedDemo === 'chat') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Navigation />
        <div className="pt-16 px-4 sm:px-6 lg:px-8 pb-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <button
                onClick={handleBackToSelection}
                className="flex items-center text-primary-600 hover:text-primary-700 transition-colors mb-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Demo Selection
              </button>
              <h1 className="text-3xl font-bold text-gray-900">Tavus Vibecode Chat Demo</h1>
              <p className="text-gray-600 mt-2">Direct video conversation with your AI tutor</p>
            </div>
            
            <TavusVibeChat
              personaId={API_CONFIG.TAVUS.REPLICA_ID}
              conversationName={`Demo_${demoSubject}_${demoTopic}`}
              subject={demoSubject}
              topic={demoTopic}
              className="h-[600px]"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navigation />
      
      <div className="pt-16 px-4 sm:px-6 lg:px-8 pb-8">
        <div className="max-w-6xl mx-auto">
          
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Tavus Vibecode Integration
              <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent"> Demo</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the power of AI video conversations integrated directly from the Tavus Vibecode quickstart repository
            </p>
          </motion.div>

          {/* Configuration Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={`mb-8 p-6 rounded-2xl border-2 ${
              isConfigured 
                ? 'bg-green-50 border-green-200' 
                : 'bg-yellow-50 border-yellow-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-3 ${
                  isConfigured ? 'bg-green-500' : 'bg-yellow-500'
                }`}></div>
                <div>
                  <h3 className={`font-semibold ${
                    isConfigured ? 'text-green-800' : 'text-yellow-800'
                  }`}>
                    Tavus API Configuration
                  </h3>
                  <p className={`text-sm ${
                    isConfigured ? 'text-green-700' : 'text-yellow-700'
                  }`}>
                    {isConfigured 
                      ? 'API keys configured and ready for video conversations'
                      : 'API keys required - check your .env file'
                    }
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                <div className={`text-sm font-mono ${
                  isConfigured ? 'text-green-700' : 'text-yellow-700'
                }`}>
                  <div>API Key: {API_CONFIG.TAVUS.API_KEY ? '✓ Set' : '✗ Missing'}</div>
                  <div>Replica ID: {API_CONFIG.TAVUS.REPLICA_ID ? '✓ Set' : '✗ Missing'}</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Demo Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            
            {/* Study Session Demo */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow"
            >
              <div className="text-center mb-6">
                <div className="bg-gradient-to-r from-primary-500 to-secondary-500 p-4 rounded-2xl w-fit mx-auto mb-4">
                  <BookOpen className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Study Session Demo</h3>
                <p className="text-gray-600">
                  Full-featured study session with AI video tutor, session management, and learning tools
                </p>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                  <select
                    value={demoSubject}
                    onChange={(e) => setDemoSubject(e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    {subjects.map(subject => (
                      <option key={subject} value={subject}>{subject}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Topic</label>
                  <select
                    value={demoTopic}
                    onChange={(e) => setDemoTopic(e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    {topics[demoSubject as keyof typeof topics]?.map(topic => (
                      <option key={topic} value={topic}>{topic}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                onClick={() => setSelectedDemo('study')}
                disabled={!isConfigured}
                className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                <Play className="h-5 w-5 mr-2" />
                Start Study Session
              </button>
            </motion.div>

            {/* Direct Chat Demo */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow"
            >
              <div className="text-center mb-6">
                <div className="bg-gradient-to-r from-secondary-500 to-accent-500 p-4 rounded-2xl w-fit mx-auto mb-4">
                  <Video className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Direct Chat Demo</h3>
                <p className="text-gray-600">
                  Simple video chat interface directly integrated from Tavus Vibecode quickstart
                </p>
              </div>

              <div className="space-y-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Features:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Real-time video conversation</li>
                    <li>• AI persona interaction</li>
                    <li>• Recording & transcription</li>
                    <li>• Session management</li>
                  </ul>
                </div>
              </div>

              <button
                onClick={() => setSelectedDemo('chat')}
                disabled={!isConfigured}
                className="w-full bg-secondary-600 text-white py-3 rounded-lg hover:bg-secondary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                <Video className="h-5 w-5 mr-2" />
                Start Video Chat
              </button>
            </motion.div>
          </div>

          {/* Integration Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-4">Integration Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Repository Integration</h4>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>✅ Cloned Tavus Vibecode quickstart</li>
                  <li>✅ Extracted core components</li>
                  <li>✅ Integrated with StudyBuddy AI</li>
                  <li>✅ Added custom styling & features</li>
                  <li>✅ Maintained original functionality</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">New Components</h4>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• <code>TavusVibeChat</code> - Core video chat</li>
                  <li>• <code>TavusVibeStudySession</code> - Study wrapper</li>
                  <li>• <code>useTavusVibecode</code> - React hook</li>
                  <li>• Enhanced API configuration</li>
                  <li>• StudyBuddy UI integration</li>
                </ul>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-700">
                <strong>Note:</strong> This integration maintains the core Tavus Vibecode functionality while seamlessly 
                integrating with StudyBuddy AI's design system and educational features.
              </p>
            </div>
          </motion.div>

          {/* Back to Dashboard */}
          <div className="mt-8 text-center">
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors flex items-center mx-auto"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TavusVibeDemo;