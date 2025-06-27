import React from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, 
  Heart, 
  Users, 
  Zap, 
  Star, 
  ArrowRight, 
  Mic, 
  Video, 
  Trophy,
  Shield,
  Sparkles,
  BookOpen
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const LandingPage = () => {
  const { setShowAuthModal } = useAuthStore();

  const features = [
    {
      icon: <Brain className="h-8 w-8" />,
      title: "Emotional Intelligence",
      description: "AI that understands how you feel while learning and adapts accordingly"
    },
    {
      icon: <Mic className="h-8 w-8" />,
      title: "Voice Learning",
      description: "Hands-free learning with natural voice interactions and explanations"
    },
    {
      icon: <Video className="h-8 w-8" />,
      title: "AI Video Tutor",
      description: "Personal AI avatar that teaches with expressions and engagement"
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Study Partners",
      description: "AI-matched study buddies for collaborative learning experiences"
    },
    {
      icon: <Trophy className="h-8 w-8" />,
      title: "Blockchain Rewards",
      description: "Earn verified achievements and tokens for your learning progress"
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Adaptive Learning",
      description: "Personalized study paths that evolve with your learning style"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "High School Student",
      quote: "StudyBuddy helped me overcome my math anxiety. The AI actually cares about how I'm feeling!",
      rating: 5
    },
    {
      name: "Alex Rodriguez",
      role: "Pre-Med Student",
      quote: "The voice learning feature is a game-changer. I can study while walking or doing other activities.",
      rating: 5
    },
    {
      name: "Dr. Emily Watson",
      role: "Education Professor",
      quote: "This is the future of personalized education. The emotional intelligence aspect is revolutionary.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md fixed w-full z-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-primary-500 to-secondary-500 p-2 rounded-lg">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">StudyBuddy AI</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-primary-600 transition-colors">Features</a>
              <a href="#testimonials" className="text-gray-600 hover:text-primary-600 transition-colors">Testimonials</a>
              <a href="#pricing" className="text-gray-600 hover:text-primary-600 transition-colors">Pricing</a>
              <button
                onClick={() => setShowAuthModal(true)}
                className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
                Your
                <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent"> AI Learning </span>
                Companion
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
                Experience the future of education with emotional intelligence, voice interaction, and personalized learning paths that adapt to your unique needs.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
            >
              <button
                onClick={() => setShowAuthModal(true)}
                className="bg-primary-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-primary-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                Start Learning Free
                <ArrowRight className="h-5 w-5" />
              </button>
              <button className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl text-lg font-semibold hover:border-primary-600 hover:text-primary-600 transition-all duration-300">
                Watch Demo
              </button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto"
            >
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600 mb-2">3x</div>
                <div className="text-gray-600">Faster Learning</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-secondary-600 mb-2">90%</div>
                <div className="text-gray-600">Completion Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent-600 mb-2">50%</div>
                <div className="text-gray-600">Less Anxiety</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Revolutionary Learning Features</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Powered by cutting-edge AI technology and designed with empathy at its core
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                <div className="text-primary-600 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-gradient-to-br from-primary-50 to-secondary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Loved by Students Worldwide</h2>
            <p className="text-xl text-gray-600">See how StudyBuddy AI is transforming education</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-2xl shadow-lg"
              >
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">"{testimonial.quote}"</p>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-gray-600 text-sm">{testimonial.role}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-secondary-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Transform Your Learning?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Join thousands of students who are already learning smarter, not harder.
            </p>
            <button
              onClick={() => setShowAuthModal(true)}
              className="bg-white text-primary-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl inline-flex items-center gap-2"
            >
              <Sparkles className="h-5 w-5" />
              Start Your Journey
            </button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Brain className="h-8 w-8 text-primary-400" />
                <span className="text-xl font-bold">StudyBuddy AI</span>
              </div>
              <p className="text-gray-400">
                Empowering learners with AI-driven education that cares about your success and wellbeing.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 StudyBuddy AI. All rights reserved. Built with ❤️ for learners everywhere.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;