import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Brain, 
  Users, 
  BookOpen, 
  Zap, 
  Target, 
  MessageCircle,
  Video,
  Award
} from 'lucide-react';

const QuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    {
      icon: Brain,
      label: 'Start AI Session',
      description: 'Begin learning with your AI tutor',
      color: 'bg-primary-500',
      hoverColor: 'hover:bg-primary-600',
      onClick: () => navigate('/study')
    },
    {
      icon: Users,
      label: 'Find Study Partner',
      description: 'Connect with other learners',
      color: 'bg-secondary-500',
      hoverColor: 'hover:bg-secondary-600',
      onClick: () => navigate('/social')
    },
    {
      icon: Target,
      label: 'Practice Problems',
      description: 'Solve adaptive exercises',
      color: 'bg-accent-500',
      hoverColor: 'hover:bg-accent-600',
      onClick: () => navigate('/study')
    },
    {
      icon: Video,
      label: 'Join Study Room',
      description: 'Collaborative learning session',
      color: 'bg-success-500',
      hoverColor: 'hover:bg-success-600',
      onClick: () => navigate('/social')
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
        <Zap className="h-5 w-5 text-yellow-500" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {actions.map((action, index) => (
          <motion.button
            key={index}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={action.onClick}
            className={`${action.color} ${action.hoverColor} text-white p-6 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg text-left group`}
          >
            <div className="flex items-start justify-between mb-4">
              <action.icon className="h-8 w-8 group-hover:scale-110 transition-transform duration-300" />
              <div className="w-2 h-2 bg-white/30 rounded-full group-hover:bg-white/50 transition-colors"></div>
            </div>
            <h3 className="font-semibold text-lg mb-2">{action.label}</h3>
            <p className="text-white/90 text-sm">{action.description}</p>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export default QuickActions;