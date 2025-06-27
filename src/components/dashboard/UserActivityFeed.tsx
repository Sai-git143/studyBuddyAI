import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, 
  Clock, 
  Trophy, 
  Users, 
  BookOpen, 
  Zap,
  RefreshCw,
  Filter
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useUserDataStore } from '../../store/userDataStore';

const UserActivityFeed = () => {
  const { user } = useAuthStore();
  const { getUserActivities, addActivity, syncUserData } = useUserDataStore();
  const [activities, setActivities] = useState<any[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'study_session' | 'achievement' | 'social_interaction'>('all');

  useEffect(() => {
    if (user) {
      loadActivities();
      // Simulate real-time updates
      const interval = setInterval(() => {
        simulateRealTimeActivity();
      }, 30000); // Add new activity every 30 seconds

      return () => clearInterval(interval);
    }
  }, [user, filter]);

  const loadActivities = () => {
    if (!user) return;
    
    const userActivities = getUserActivities(user.id, 20);
    const filteredActivities = filter === 'all' 
      ? userActivities 
      : userActivities.filter(activity => activity.type === filter);
    
    setActivities(filteredActivities);
  };

  const simulateRealTimeActivity = () => {
    if (!user) return;

    const activityTypes = [
      {
        type: 'study_session' as const,
        description: 'Completed a 25-minute study session on Calculus',
        metadata: { subject: 'Mathematics', duration: 25 }
      },
      {
        type: 'achievement' as const,
        description: 'Unlocked "Consistent Learner" achievement',
        metadata: { achievement: 'consistent-learner', xp: 50 }
      },
      {
        type: 'social_interaction' as const,
        description: 'Connected with a new study partner',
        metadata: { partnerId: 'user-123', subject: 'Physics' }
      }
    ];

    const randomActivity = activityTypes[Math.floor(Math.random() * activityTypes.length)];
    
    addActivity(user.id, randomActivity);
    loadActivities();
  };

  const handleRefresh = async () => {
    if (!user) return;
    
    setIsRefreshing(true);
    try {
      await syncUserData(user.id);
      loadActivities();
    } finally {
      setIsRefreshing(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'study_session': return BookOpen;
      case 'achievement': return Trophy;
      case 'social_interaction': return Users;
      case 'course_enrollment': return Zap;
      default: return Activity;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'study_session': return 'text-blue-600 bg-blue-100';
      case 'achievement': return 'text-yellow-600 bg-yellow-100';
      case 'social_interaction': return 'text-green-600 bg-green-100';
      case 'course_enrollment': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const activityTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - activityTime.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  if (!user) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Activity className="h-6 w-6 text-primary-600 mr-3" />
          <h3 className="text-xl font-semibold text-gray-900">Recent Activity</h3>
        </div>
        
        <div className="flex items-center space-x-3">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Activities</option>
            <option value="study_session">Study Sessions</option>
            <option value="achievement">Achievements</option>
            <option value="social_interaction">Social</option>
          </select>
          
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        <AnimatePresence>
          {activities.length > 0 ? (
            activities.map((activity, index) => {
              const IconComponent = getActivityIcon(activity.type);
              const colorClasses = getActivityColor(activity.type);
              
              return (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="flex items-start p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className={`p-2 rounded-lg mr-4 ${colorClasses}`}>
                    <IconComponent className="h-4 w-4" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 mb-1">
                      {activity.description}
                    </p>
                    
                    <div className="flex items-center text-xs text-gray-500">
                      <Clock className="h-3 w-3 mr-1" />
                      {formatTimeAgo(activity.timestamp)}
                      
                      {activity.metadata && (
                        <>
                          <span className="mx-2">•</span>
                          <span className="capitalize">
                            {activity.type.replace('_', ' ')}
                          </span>
                        </>
                      )}
                    </div>
                    
                    {activity.metadata && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {Object.entries(activity.metadata).map(([key, value]) => (
                          <span
                            key={key}
                            className="px-2 py-1 bg-white text-xs text-gray-600 rounded-full border"
                          >
                            {key}: {String(value)}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <div className="text-center py-8">
              <Activity className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-2">No activities yet</p>
              <p className="text-sm text-gray-400">
                Start studying to see your activity feed come to life!
              </p>
            </div>
          )}
        </AnimatePresence>
      </div>

      {activities.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Showing {activities.length} recent activities</span>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              <span>Live updates enabled</span>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default UserActivityFeed;