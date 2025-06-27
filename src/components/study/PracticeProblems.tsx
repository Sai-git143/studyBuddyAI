import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Target, 
  CheckCircle, 
  XCircle, 
  Lightbulb, 
  RotateCcw, 
  ArrowRight,
  Brain,
  Trophy,
  Clock
} from 'lucide-react';

interface Problem {
  id: string;
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  topic: string;
}

interface PracticeProblemsProps {
  subject: string;
  onComplete: (score: number) => void;
}

const PracticeProblems: React.FC<PracticeProblemsProps> = ({ subject, onComplete }) => {
  const [currentProblem, setCurrentProblem] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);
  const [startTime] = useState(Date.now());

  // Mock problems - in real app, these would be AI-generated based on user's learning progress
  const problems: Problem[] = [
    {
      id: '1',
      question: 'What is the derivative of f(x) = 3x² + 2x - 1?',
      options: ['6x + 2', '6x² + 2x', '3x + 2', '6x - 1'],
      correctAnswer: '6x + 2',
      explanation: 'Using the power rule: d/dx(3x²) = 6x, d/dx(2x) = 2, d/dx(-1) = 0. So the derivative is 6x + 2.',
      difficulty: 'medium',
      topic: 'Derivatives'
    },
    {
      id: '2',
      question: 'If f(x) = sin(x), what is f\'(π/2)?',
      options: ['1', '0', '-1', 'π/2'],
      correctAnswer: '0',
      explanation: 'The derivative of sin(x) is cos(x). At x = π/2, cos(π/2) = 0.',
      difficulty: 'medium',
      topic: 'Trigonometric Derivatives'
    },
    {
      id: '3',
      question: 'What is the integral of 2x dx?',
      options: ['x² + C', '2x² + C', 'x²', '2x'],
      correctAnswer: 'x² + C',
      explanation: 'Using the power rule for integration: ∫2x dx = 2∫x dx = 2(x²/2) + C = x² + C.',
      difficulty: 'easy',
      topic: 'Integration'
    }
  ];

  const currentQ = problems[currentProblem];
  const isLastProblem = currentProblem === problems.length - 1;

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const handleSubmitAnswer = () => {
    setShowResult(true);
    if (selectedAnswer === currentQ.correctAnswer) {
      setScore(score + 1);
    }
    setTimeSpent(Math.floor((Date.now() - startTime) / 1000));
  };

  const handleNextProblem = () => {
    if (isLastProblem) {
      onComplete(Math.round((score / problems.length) * 100));
    } else {
      setCurrentProblem(currentProblem + 1);
      setSelectedAnswer('');
      setShowResult(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Target className="h-6 w-6 text-primary-600 mr-3" />
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Practice Problems</h3>
            <p className="text-sm text-gray-600">{subject} • Problem {currentProblem + 1} of {problems.length}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="h-4 w-4 mr-1" />
            {Math.floor(timeSpent / 60)}:{(timeSpent % 60).toString().padStart(2, '0')}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Trophy className="h-4 w-4 mr-1" />
            {score}/{problems.length}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Progress</span>
          <span>{Math.round(((currentProblem + (showResult ? 1 : 0)) / problems.length) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((currentProblem + (showResult ? 1 : 0)) / problems.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentProblem}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {/* Problem Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(currentQ.difficulty)}`}>
                {currentQ.difficulty.charAt(0).toUpperCase() + currentQ.difficulty.slice(1)}
              </span>
              <span className="text-sm text-gray-600">{currentQ.topic}</span>
            </div>
            
            <h4 className="text-lg font-medium text-gray-900 mb-4">{currentQ.question}</h4>
          </div>

          {/* Answer Options */}
          <div className="space-y-3 mb-6">
            {currentQ.options?.map((option, index) => (
              <motion.button
                key={index}
                onClick={() => !showResult && handleAnswerSelect(option)}
                disabled={showResult}
                whileHover={!showResult ? { scale: 1.02 } : {}}
                whileTap={!showResult ? { scale: 0.98 } : {}}
                className={`w-full p-4 text-left rounded-xl border-2 transition-all ${
                  showResult
                    ? option === currentQ.correctAnswer
                      ? 'border-green-500 bg-green-50 text-green-800'
                      : option === selectedAnswer && option !== currentQ.correctAnswer
                      ? 'border-red-500 bg-red-50 text-red-800'
                      : 'border-gray-200 bg-gray-50 text-gray-600'
                    : selectedAnswer === option
                    ? 'border-primary-500 bg-primary-50 text-primary-800'
                    : 'border-gray-200 hover:border-primary-300 hover:bg-primary-25'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{option}</span>
                  {showResult && (
                    <div>
                      {option === currentQ.correctAnswer && (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      )}
                      {option === selectedAnswer && option !== currentQ.correctAnswer && (
                        <XCircle className="h-5 w-5 text-red-600" />
                      )}
                    </div>
                  )}
                </div>
              </motion.button>
            ))}
          </div>

          {/* Explanation */}
          <AnimatePresence>
            {showResult && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-200"
              >
                <div className="flex items-start">
                  <Lightbulb className="h-5 w-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <h5 className="font-medium text-blue-900 mb-2">Explanation</h5>
                    <p className="text-blue-800 text-sm leading-relaxed">{currentQ.explanation}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Buttons */}
          <div className="flex justify-between">
            <button
              onClick={() => window.location.reload()}
              className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Restart
            </button>

            <div className="space-x-3">
              {!showResult ? (
                <button
                  onClick={handleSubmitAnswer}
                  disabled={!selectedAnswer}
                  className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  Submit Answer
                </button>
              ) : (
                <button
                  onClick={handleNextProblem}
                  className="bg-secondary-600 text-white px-6 py-2 rounded-lg hover:bg-secondary-700 transition-colors flex items-center"
                >
                  {isLastProblem ? 'Finish' : 'Next Problem'}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default PracticeProblems;