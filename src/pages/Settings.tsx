import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Brain, 
  Mic, 
  Video, 
  Bell, 
  Shield, 
  CreditCard,
  Download,
  Moon,
  Sun,
  Globe,
  Volume2,
  Eye,
  Heart,
  Zap
} from 'lucide-react';
import Navigation from '../components/layout/Navigation';
import { useAuthStore } from '../store/authStore';

const Settings = () => {
  const { user, updateUser } = useAuthStore();
  const [activeSection, setActiveSection] = useState('profile');

  const sections = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'ai-tutor', label: 'AI Tutor', icon: Brain },
    { id: 'learning', label: 'Learning Preferences', icon: Zap },
    { id: 'privacy', label: 'Privacy & Security', icon: Shield },
    { id: 'subscription', label: 'Subscription', icon: CreditCard },
    { id: 'notifications', label: 'Notifications', icon: Bell }
  ];

  const emotionalStates = [
    { id: 'calm', label: 'Calm', color: 'bg-blue-500', description: 'Steady and focused learning' },
    { id: 'excited', label: 'Excited', color: 'bg-yellow-500', description: 'High energy and enthusiasm' },
    { id: 'frustrated', label: 'Frustrated', color: 'bg-red-500', description: 'Need extra patience and support' },
    { id: 'confident', label: 'Confident', color: 'bg-green-500', description: 'Ready for challenges' },
    { id: 'anxious', label: 'Anxious', color: 'bg-purple-500', description: 'Need reassurance and breaks' }
  ];

  const learningStyles = [
    { id: 'visual', label: 'Visual', icon: Eye, description: 'Learn best with diagrams and visual aids' },
    { id: 'auditory', label: 'Auditory', icon: Volume2, description: 'Prefer spoken explanations and discussions' },
    { id: 'kinesthetic', label: 'Kinesthetic', icon: Heart, description: 'Learn through hands-on activities' },
    { id: 'reading', label: 'Reading/Writing', icon: User, description: 'Prefer text-based learning' }
  ];

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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
            <p className="text-lg text-gray-600">Customize your StudyBuddy AI experience</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                <nav className="space-y-2">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center px-4 py-3 text-left rounded-xl transition-colors ${
                        activeSection === section.id
                          ? 'bg-primary-50 text-primary-700 border border-primary-200'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <section.icon className="h-5 w-5 mr-3" />
                      {section.label}
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                
                {activeSection === 'profile' && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Profile Settings</h2>
                    
                    <div className="space-y-6">
                      <div className="flex items-center space-x-6">
                        <img
                          src={user?.avatar}
                          alt="Profile"
                          className="w-20 h-20 rounded-full"
                        />
                        <div>
                          <button className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors mr-3">
                            Change Avatar
                          </button>
                          <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                            Remove
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                          <input
                            type="text"
                            value={user?.name || ''}
                            onChange={(e) => updateUser({ name: e.target.value })}
                            className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                          <input
                            type="email"
                            value={user?.email || ''}
                            onChange={(e) => updateUser({ email: e.target.value })}
                            className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Current Emotional State</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {emotionalStates.map((state) => (
                            <button
                              key={state.id}
                              onClick={() => updateUser({ emotionalState: state.id as any })}
                              className={`p-4 rounded-lg border-2 text-left transition-colors ${
                                user?.emotionalState === state.id
                                  ? 'border-primary-500 bg-primary-50'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <div className="flex items-center mb-2">
                                <div className={`w-4 h-4 rounded-full ${state.color} mr-3`}></div>
                                <span className="font-medium text-gray-900">{state.label}</span>
                              </div>
                              <p className="text-sm text-gray-600">{state.description}</p>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeSection === 'ai-tutor' && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">AI Tutor Settings</h2>
                    
                    <div className="space-y-8">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Voice Settings</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <label className="text-sm font-medium text-gray-700">Voice Recognition</label>
                              <p className="text-sm text-gray-600">Enable voice commands and questions</p>
                            </div>
                            <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-primary-600 transition-colors">
                              <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6" />
                            </button>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Voice Speed</label>
                            <input
                              type="range"
                              min="0.5"
                              max="2"
                              step="0.1"
                              className="w-full"
                            />
                            <div className="flex justify-between text-xs text-gray-600 mt-1">
                              <span>Slow</span>
                              <span>Normal</span>
                              <span>Fast</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Avatar Settings</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <label className="text-sm font-medium text-gray-700">Video Avatar</label>
                              <p className="text-sm text-gray-600">Show AI tutor avatar during sessions</p>
                            </div>
                            <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-primary-600 transition-colors">
                              <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6" />
                            </button>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Avatar Personality</label>
                            <select className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                              <option>Encouraging & Supportive</option>
                              <option>Professional & Direct</option>
                              <option>Friendly & Casual</option>
                              <option>Patient & Gentle</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Teaching Style</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-4 border border-gray-200 rounded-lg">
                            <h4 className="font-medium text-gray-900 mb-2">Explanation Depth</h4>
                            <div className="space-y-2">
                              <label className="flex items-center">
                                <input type="radio" name="depth" className="mr-2" />
                                <span className="text-sm">Brief explanations</span>
                              </label>
                              <label className="flex items-center">
                                <input type="radio" name="depth" className="mr-2" defaultChecked />
                                <span className="text-sm">Detailed explanations</span>
                              </label>
                              <label className="flex items-center">
                                <input type="radio" name="depth" className="mr-2" />
                                <span className="text-sm">Step-by-step breakdowns</span>
                              </label>
                            </div>
                          </div>
                          
                          <div className="p-4 border border-gray-200 rounded-lg">
                            <h4 className="font-medium text-gray-900 mb-2">Challenge Level</h4>
                            <div className="space-y-2">
                              <label className="flex items-center">
                                <input type="radio" name="challenge" className="mr-2" />
                                <span className="text-sm">Conservative</span>
                              </label>
                              <label className="flex items-center">
                                <input type="radio" name="challenge" className="mr-2" defaultChecked />
                                <span className="text-sm">Adaptive</span>
                              </label>
                              <label className="flex items-center">
                                <input type="radio" name="challenge" className="mr-2" />
                                <span className="text-sm">Aggressive</span>
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeSection === 'learning' && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Learning Preferences</h2>
                    
                    <div className="space-y-8">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Preferred Learning Style</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {learningStyles.map((style) => (
                            <button
                              key={style.id}
                              onClick={() => updateUser({ learningStyle: style.id as any })}
                              className={`p-6 rounded-lg border-2 text-left transition-colors ${
                                user?.learningStyle === style.id
                                  ? 'border-primary-500 bg-primary-50'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <div className="flex items-center mb-3">
                                <style.icon className="h-6 w-6 text-primary-600 mr-3" />
                                <span className="font-medium text-gray-900">{style.label}</span>
                              </div>
                              <p className="text-sm text-gray-600">{style.description}</p>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Study Schedule</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Daily Study Goal</label>
                            <select className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                              <option>30 minutes</option>
                              <option>1 hour</option>
                              <option>2 hours</option>
                              <option>3+ hours</option>
                            </select>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Best Study Time</label>
                            <select className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                              <option>Morning (6AM - 12PM)</option>
                              <option>Afternoon (12PM - 6PM)</option>
                              <option>Evening (6PM - 10PM)</option>
                              <option>Night (10PM - 6AM)</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Break Preferences</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <label className="text-sm font-medium text-gray-700">Smart Break Reminders</label>
                              <p className="text-sm text-gray-600">AI suggests breaks based on your attention level</p>
                            </div>
                            <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-primary-600 transition-colors">
                              <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6" />
                            </button>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Break Frequency</label>
                            <input
                              type="range"
                              min="15"
                              max="120"
                              step="15"
                              defaultValue="45"
                              className="w-full"
                            />
                            <div className="flex justify-between text-xs text-gray-600 mt-1">
                              <span>15 min</span>
                              <span>60 min</span>
                              <span>120 min</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeSection === 'subscription' && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Subscription</h2>
                    
                    <div className="space-y-8">
                      <div className="bg-gradient-to-r from-primary-50 to-secondary-50 p-6 rounded-2xl border border-primary-200">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">Current Plan: Free</h3>
                            <p className="text-gray-600">Limited features • 5 AI sessions per day</p>
                          </div>
                          <button className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors">
                            Upgrade Now
                          </button>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div>
                            <div className="text-2xl font-bold text-primary-600">5</div>
                            <div className="text-sm text-gray-600">Daily Sessions</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-secondary-600">Basic</div>
                            <div className="text-sm text-gray-600">AI Features</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-accent-600">Limited</div>
                            <div className="text-sm text-gray-600">Social Features</div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="border border-gray-200 rounded-2xl p-6">
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">Premium</h3>
                          <div className="text-3xl font-bold text-primary-600 mb-4">$9.99<span className="text-sm text-gray-600">/month</span></div>
                          <ul className="space-y-3 mb-6">
                            <li className="flex items-center text-sm text-gray-700">
                              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                              Unlimited AI sessions
                            </li>
                            <li className="flex items-center text-sm text-gray-700">
                              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                              Advanced emotional intelligence
                            </li>
                            <li className="flex items-center text-sm text-gray-700">
                              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                              Voice & video features
                            </li>
                            <li className="flex items-center text-sm text-gray-700">
                              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                              Progress analytics
                            </li>
                          </ul>
                          <button className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition-colors">
                            Upgrade to Premium
                          </button>
                        </div>

                        <div className="border-2 border-secondary-500 rounded-2xl p-6 relative">
                          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-secondary-500 text-white px-4 py-1 rounded-full text-xs font-medium">
                            Most Popular
                          </div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">Pro</h3>
                          <div className="text-3xl font-bold text-secondary-600 mb-4">$19.99<span className="text-sm text-gray-600">/month</span></div>
                          <ul className="space-y-3 mb-6">
                            <li className="flex items-center text-sm text-gray-700">
                              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                              Everything in Premium
                            </li>
                            <li className="flex items-center text-sm text-gray-700">
                              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                              Unlimited study partners
                            </li>
                            <li className="flex items-center text-sm text-gray-700">
                              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                              Custom AI personality
                            </li>
                            <li className="flex items-center text-sm text-gray-700">
                              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                              Priority support
                            </li>
                          </ul>
                          <button className="w-full bg-secondary-600 text-white py-3 rounded-lg hover:bg-secondary-700 transition-colors">
                            Upgrade to Pro
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;