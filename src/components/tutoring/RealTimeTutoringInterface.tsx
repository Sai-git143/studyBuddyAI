import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  Zap, 
  Target, 
  TrendingUp, 
  Eye, 
  MessageCircle,
  Lightbulb,
  BarChart3,
  Clock,
  CheckCircle,
  AlertCircle,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';
import { useRealTimeTutoring } from '../../hooks/useRealTimeTutoring';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';

interface RealTimeTutoringInterfaceProps {
  subject: string;
  topic: string;
  onEmotionChange: (emotion: string) => void;
}

const RealTimeTutoringInterface: React.FC<RealTimeTutoringInterfaceProps> = ({
  subject,
  topic,
  onEmotionChange
}) => {
  const { user } = useAuthStore();
  const {
    session,
    currentContent,
    feedback,
    understanding,
    engagement,
    isLoading,
    startTutoringSession,
    generateContent,
    generateProblem,
    generateVisual,
    adaptContent,
    endSession,
    updateUnderstanding,
    updateEngagement
  } = useRealTimeTutoring();

  const [userInput, setUserInput] = useState('');
  const [sessionStarted, setSessionStarted] = useState(false);
  const [currentProblem, setCurrentProblem] = useState<any>(null);
  const [visualExplanation, setVisualExplanation] = useState<any>(null);
  const [sessionTime, setSessionTime] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Session timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (sessionStarted && !isPaused) {
      interval = setInterval(() => {
        setSessionTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [sessionStarted, isPaused]);

  const handleStartSession = async () => {
    await startTutoringSession(subject, topic);
    setSessionStarted(true);
    toast.success('Real-time tutoring session started!');
  };

  const handleUserInput = async () => {
    if (!userInput.trim()) return;

    await generateContent(userInput, user?.emotionalState || 'calm');
    setUserInput('');
    
    // Simulate understanding update based on interaction
    const newUnderstanding = Math.min(100, understanding + Math.random() * 10);
    updateUnderstanding(newUnderstanding);
  };

  const handleGenerateProblem = async () => {
    const problem = await generateProblem(topic, feedback?.confusion_points || []);
    setCurrentProblem(problem);
  };

  const handleGenerateVisual = async () => {
    const visual = await generateVisual(topic);
    setVisualExplanation(visual);
  };

  const handleProblemAnswer = async (answer: string, isCorrect: boolean) => {
    const performance = isCorrect ? 90 : 40;
    await adaptContent(performance, 30);
    
    if (isCorrect) {
      toast.success('Correct! Content adapted to challenge you more.');
      updateUnderstanding(Math.min(100, understanding + 10));
    } else {
      toast.error('Not quite right. Let me explain this differently.');
      updateUnderstanding(Math.max(0, understanding - 5));
    }
    
    setCurrentProblem(null);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getUnderstandingColor = (level: number) => {
    if (level >= 80) return 'text-green-600 bg-green-100';
    if (level >= 60) return 'text-blue-600 bg-blue-100';
    if (level >= 40) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getEngagementColor = (level: number) => {
    if (level >= 80) return 'text-purple-600 bg-purple-100';
    if (level >= 60) return 'text-indigo-600 bg-indigo-100';
    if (level >= 40) return 'text-orange-600 bg-orange-100';
    return 'text-gray-600 bg-gray-100';
  };

  if (!sessionStarted) {
    return (
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
        <Brain className="h-16 w-16 text-primary-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Start Real-Time Tutoring
        </h2>
        <p className="text-gray-600 mb-6">
          Begin an interactive, AI-powered tutoring session for <strong>{topic}</strong> in {subject}
        </p>
        <button
          onClick={handleStartSession}
          disabled={isLoading}
          className="bg-primary-600 text-white px-8 py-3 rounded-xl hover:bg-primary-700 transition-colors disabled:opacity-50 flex items-center mx-auto"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Starting...
            </>
          ) : (
            <>
              <Play className="h-5 w-5 mr-2" />
              Start Session
            </>
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Session Header */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Brain className="h-6 w-6 text-primary-600 mr-3" />
            <div>
              <h2 className="text-xl font-bold text-gray-900">Live Tutoring Session</h2>
              <p className="text-gray-600">{topic} • {subject}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="h-4 w-4 mr-1" />
              {formatTime(sessionTime)}
            </div>
            
            <button
              onClick={() => setIsPaused(!isPaused)}
              className={`p-2 rounded-lg transition-colors ${
                isPaused ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'
              }`}
            >
              {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
            </button>
            
            <button
              onClick={endSession}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
            >
              End Session
            </button>
          </div>
        </div>

        {/* Real-time Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className={`p-3 rounded-lg ${getUnderstandingColor(understanding)}`}>
            <div className="flex items-center justify-between">
              <TrendingUp className="h-5 w-5" />
              <span className="text-lg font-bold">{understanding}%</span>
            </div>
            <div className="text-xs mt-1">Understanding</div>
          </div>
          
          <div className={`p-3 rounded-lg ${getEngagementColor(engagement)}`}>
            <div className="flex items-center justify-between">
              <Zap className="h-5 w-5" />
              <span className="text-lg font-bold">{engagement}%</span>
            </div>
            <div className="text-xs mt-1">Engagement</div>
          </div>
          
          <div className="p-3 rounded-lg bg-indigo-100 text-indigo-700">
            <div className="flex items-center justify-between">
              <Target className="h-5 w-5" />
              <span className="text-lg font-bold">{currentContent?.metadata.difficulty || 5}</span>
            </div>
            <div className="text-xs mt-1">Difficulty</div>
          </div>
          
          <div className="p-3 rounded-lg bg-emerald-100 text-emerald-700">
            <div className="flex items-center justify-between">
              <BarChart3 className="h-5 w-5" />
              <span className="text-lg font-bold">Live</span>
            </div>
            <div className="text-xs mt-1">Status</div>
          </div>
        </div>
      </div>

      {/* Current Content */}
      <AnimatePresence mode="wait">
        {currentContent && (
          <motion.div
            key={currentContent.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className={`p-2 rounded-lg mr-3 ${
                  currentContent.type === 'explanation' ? 'bg-blue-100 text-blue-600' :
                  currentContent.type === 'example' ? 'bg-green-100 text-green-600' :
                  currentContent.type === 'practice' ? 'bg-orange-100 text-orange-600' :
                  currentContent.type === 'quiz' ? 'bg-purple-100 text-purple-600' :
                  'bg-gray-100 text-gray-600'
                }`}>
                  {currentContent.type === 'explanation' && <MessageCircle className="h-5 w-5" />}
                  {currentContent.type === 'example' && <Lightbulb className="h-5 w-5" />}
                  {currentContent.type === 'practice' && <Target className="h-5 w-5" />}
                  {currentContent.type === 'quiz' && <CheckCircle className="h-5 w-5" />}
                  {currentContent.type === 'visual' && <Eye className="h-5 w-5" />}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 capitalize">
                    {currentContent.type}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Est. time: {currentContent.metadata.estimatedTime} min
                  </p>
                </div>
              </div>
              
              <div className="text-xs text-gray-500">
                {currentContent.timestamp.toLocaleTimeString()}
              </div>
            </div>
            
            <div className="prose max-w-none">
              <p className="text-gray-800 leading-relaxed">{currentContent.content}</p>
            </div>
            
            {currentContent.metadata.learningObjectives.length > 0 && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <h4 className="text-sm font-medium text-blue-900 mb-2">Learning Objectives:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  {currentContent.metadata.learningObjectives.map((objective, index) => (
                    <li key={index} className="flex items-center">
                      <CheckCircle className="h-3 w-3 mr-2 text-blue-600" />
                      {objective}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Interactive Problem */}
      <AnimatePresence>
        {currentProblem && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-2xl border border-purple-200"
          >
            <h3 className="text-lg font-semibold text-purple-900 mb-4">
              Interactive Problem
            </h3>
            <p className="text-purple-800 mb-4">{currentProblem.question}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
              {currentProblem.options?.map((option: string, index: number) => (
                <button
                  key={index}
                  onClick={() => handleProblemAnswer(option, option === currentProblem.correctAnswer)}
                  className="p-3 text-left bg-white border border-purple-200 rounded-lg hover:bg-purple-50 transition-colors"
                >
                  {option}
                </button>
              ))}
            </div>
            
            {currentProblem.hints && (
              <div className="text-sm text-purple-700">
                <strong>Hints:</strong> {currentProblem.hints.join(', ')}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Visual Explanation */}
      <AnimatePresence>
        {visualExplanation && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-2xl border border-green-200"
          >
            <h3 className="text-lg font-semibold text-green-900 mb-4">
              Visual Explanation
            </h3>
            <p className="text-green-800 mb-4">{visualExplanation.description}</p>
            <div className="bg-white p-4 rounded-lg border border-green-200">
              <p className="text-sm text-gray-700">{visualExplanation.instructions}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Live Feedback */}
      {feedback && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Live AI Feedback</h3>
          
          {feedback.confusion_points.length > 0 && (
            <div className="mb-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="flex items-center mb-2">
                <AlertCircle className="h-4 w-4 text-yellow-600 mr-2" />
                <span className="text-sm font-medium text-yellow-800">Areas of Confusion</span>
              </div>
              <ul className="text-sm text-yellow-700 space-y-1">
                {feedback.confusion_points.map((point, index) => (
                  <li key={index}>• {point}</li>
                ))}
              </ul>
            </div>
          )}
          
          {feedback.suggested_actions.length > 0 && (
            <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center mb-2">
                <Lightbulb className="h-4 w-4 text-blue-600 mr-2" />
                <span className="text-sm font-medium text-blue-800">Suggested Actions</span>
              </div>
              <ul className="text-sm text-blue-700 space-y-1">
                {feedback.suggested_actions.map((action, index) => (
                  <li key={index}>• {action}</li>
                ))}
              </ul>
            </div>
          )}
          
          {feedback.next_topics.length > 0 && (
            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center mb-2">
                <Target className="h-4 w-4 text-green-600 mr-2" />
                <span className="text-sm font-medium text-green-800">Next Topics</span>
              </div>
              <ul className="text-sm text-green-700 space-y-1">
                {feedback.next_topics.map((topic, index) => (
                  <li key={index}>• {topic}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Input Area */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex space-x-4 mb-4">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleUserInput()}
            placeholder="Ask a question or request help..."
            className="flex-1 p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
            disabled={isLoading}
          />
          <button
            onClick={handleUserInput}
            disabled={isLoading || !userInput.trim()}
            className="bg-primary-600 text-white px-6 py-3 rounded-xl hover:bg-primary-700 transition-colors disabled:opacity-50"
          >
            Send
          </button>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={handleGenerateProblem}
            disabled={isLoading}
            className="flex-1 bg-purple-500 text-white py-2 px-4 rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50 flex items-center justify-center"
          >
            <Target className="h-4 w-4 mr-2" />
            Generate Problem
          </button>
          
          <button
            onClick={handleGenerateVisual}
            disabled={isLoading}
            className="flex-1 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 flex items-center justify-center"
          >
            <Eye className="h-4 w-4 mr-2" />
            Visual Explanation
          </button>
          
          <button
            onClick={() => adaptContent(understanding, sessionTime)}
            disabled={isLoading}
            className="flex-1 bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 flex items-center justify-center"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Adapt Content
          </button>
        </div>
      </div>
    </div>
  );
};

export default RealTimeTutoringInterface;