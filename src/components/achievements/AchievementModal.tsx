import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trophy, Star, Zap, Target, Award, Calendar } from 'lucide-react';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt: Date;
  progress?: number;
  maxProgress?: number;
  category: 'learning' | 'social' | 'streak' | 'mastery';
}

interface AchievementModalProps {
  achievement: Achievement | null;
  isOpen: boolean;
  onClose: () => void;
}

const AchievementModal: React.FC<AchievementModalProps> = ({ 
  achievement, 
  isOpen, 
  onClose 
}) => {
  const { width, height } = useWindowSize();

  if (!achievement) return null;

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'from-gray-400 to-gray-600';
      case 'rare': return 'from-blue-400 to-blue-600';
      case 'epic': return 'from-purple-400 to-purple-600';
      case 'legendary': return 'from-yellow-400 to-orange-500';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const getRarityBorder = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'border-gray-300';
      case 'rare': return 'border-blue-300';
      case 'epic': return 'border-purple-300';
      case 'legendary': return 'border-yellow-300';
      default: return 'border-gray-300';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'learning': return Target;
      case 'social': return Star;
      case 'streak': return Zap;
      case 'mastery': return Award;
      default: return Trophy;
    }
  };

  const CategoryIcon = getCategoryIcon(achievement.category);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Confetti Effect */}
          <Confetti
            width={width}
            height={height}
            recycle={false}
            numberOfPieces={200}
            gravity={0.3}
          />

          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm"
              />

              {/* Modal */}
              <motion.div
                initial={{ opacity: 0, scale: 0.5, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.5, y: 50 }}
                transition={{ 
                  type: "spring", 
                  damping: 25, 
                  stiffness: 300,
                  duration: 0.6 
                }}
                className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 text-center"
              >
                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>

                {/* Achievement Icon */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2, type: "spring", damping: 15 }}
                  className={`mx-auto mb-6 w-24 h-24 rounded-full bg-gradient-to-br ${getRarityColor(achievement.rarity)} flex items-center justify-center border-4 ${getRarityBorder(achievement.rarity)} shadow-lg`}
                >
                  <div className="text-4xl">{achievement.icon}</div>
                </motion.div>

                {/* Achievement Title */}
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-2xl font-bold text-gray-900 mb-2"
                >
                  Achievement Unlocked!
                </motion.h2>

                <motion.h3
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-xl font-semibold text-gray-800 mb-4"
                >
                  {achievement.title}
                </motion.h3>

                {/* Achievement Description */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-gray-600 mb-6 leading-relaxed"
                >
                  {achievement.description}
                </motion.p>

                {/* Achievement Details */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="bg-gray-50 rounded-2xl p-4 mb-6"
                >
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center justify-center">
                      <CategoryIcon className="h-4 w-4 text-primary-600 mr-2" />
                      <span className="text-gray-700 capitalize">{achievement.category}</span>
                    </div>
                    <div className="flex items-center justify-center">
                      <Star className="h-4 w-4 text-yellow-500 mr-2" />
                      <span className="text-gray-700 capitalize">{achievement.rarity}</span>
                    </div>
                  </div>
                  
                  <div className="mt-3 flex items-center justify-center text-xs text-gray-500">
                    <Calendar className="h-3 w-3 mr-1" />
                    Unlocked {achievement.unlockedAt.toLocaleDateString()}
                  </div>
                </motion.div>

                {/* Progress Bar (if applicable) */}
                {achievement.progress !== undefined && achievement.maxProgress && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="mb-6"
                  >
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Progress</span>
                      <span>{achievement.progress}/{achievement.maxProgress}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                        transition={{ delay: 0.8, duration: 1 }}
                        className={`bg-gradient-to-r ${getRarityColor(achievement.rarity)} h-2 rounded-full`}
                      />
                    </div>
                  </motion.div>
                )}

                {/* Action Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="flex space-x-3"
                >
                  <button
                    onClick={onClose}
                    className="flex-1 bg-primary-600 text-white py-3 rounded-xl font-semibold hover:bg-primary-700 transition-colors"
                  >
                    Awesome!
                  </button>
                  <button className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors">
                    Share
                  </button>
                </motion.div>

                {/* Decorative Elements */}
                <div className="absolute top-8 left-8 w-2 h-2 bg-yellow-400 rounded-full animate-bounce"></div>
                <div className="absolute top-12 right-12 w-1 h-1 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }}></div>
                <div className="absolute bottom-12 left-12 w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
              </motion.div>
            </div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AchievementModal;