import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Star, 
  Users, 
  Clock, 
  BookOpen, 
  Play,
  Award,
  TrendingUp,
  Zap,
  Heart,
  Share2
} from 'lucide-react';
import Navigation from '../components/layout/Navigation';
import { useCourseStore } from '../store/courseStore';
import { courseCategories } from '../data/courses';
import { Course } from '../types/course';
import toast from 'react-hot-toast';

const Courses = () => {
  const {
    selectedCategory,
    searchQuery,
    setSelectedCategory,
    setSearchQuery,
    getFilteredCourses,
    enrollInCourse,
    getCourseProgress
  } = useCourseStore();

  const [sortBy, setSortBy] = useState<'popular' | 'rating' | 'newest' | 'price'>('popular');
  const [showFilters, setShowFilters] = useState(false);

  const filteredCourses = getFilteredCourses();

  const sortedCourses = [...filteredCourses].sort((a, b) => {
    switch (sortBy) {
      case 'popular':
        return b.studentsEnrolled - a.studentsEnrolled;
      case 'rating':
        return b.rating - a.rating;
      case 'newest':
        return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
      case 'price':
        return a.price - b.price;
      default:
        return 0;
    }
  });

  const handleEnrollCourse = (courseId: string) => {
    enrollInCourse(courseId);
    toast.success('Successfully enrolled in course! 🎉');
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const CourseCard: React.FC<{ course: Course }> = ({ course }) => {
    const progress = getCourseProgress(course.id);
    const isEnrolled = !!progress;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -5, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:border-primary-200"
      >
        {/* Course Image */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 left-4 flex space-x-2">
            {course.isPopular && (
              <span className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                🔥 Popular
              </span>
            )}
            {course.isNew && (
              <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                ✨ New
              </span>
            )}
          </div>
          <div className="absolute top-4 right-4">
            <button className="p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors">
              <Heart className="h-4 w-4 text-gray-600" />
            </button>
          </div>
          {isEnrolled && (
            <div className="absolute bottom-4 left-4 right-4">
              <div className="bg-white/90 backdrop-blur-sm rounded-lg p-2">
                <div className="flex justify-between text-xs text-gray-700 mb-1">
                  <span>Progress</span>
                  <span>{Math.round(progress.progressPercentage)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress.progressPercentage}%` }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Course Content */}
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(course.difficulty)}`}>
                {course.difficulty}
              </span>
              <span className="text-xs text-gray-500">{course.category}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Star className="h-4 w-4 text-yellow-500 mr-1" />
              {course.rating}
            </div>
          </div>

          {/* Title and Description */}
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
            {course.title}
          </h3>
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {course.description}
          </p>

          {/* Instructor */}
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mr-3">
              <span className="text-white text-xs font-medium">
                {course.instructor.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{course.instructor}</p>
              <p className="text-xs text-gray-500">Course Instructor</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-4 text-center">
            <div>
              <div className="flex items-center justify-center mb-1">
                <Users className="h-4 w-4 text-gray-500 mr-1" />
                <span className="text-xs text-gray-600">{course.studentsEnrolled.toLocaleString()}</span>
              </div>
              <div className="text-xs text-gray-500">Students</div>
            </div>
            <div>
              <div className="flex items-center justify-center mb-1">
                <Clock className="h-4 w-4 text-gray-500 mr-1" />
                <span className="text-xs text-gray-600">{course.duration}</span>
              </div>
              <div className="text-xs text-gray-500">Duration</div>
            </div>
            <div>
              <div className="flex items-center justify-center mb-1">
                <BookOpen className="h-4 w-4 text-gray-500 mr-1" />
                <span className="text-xs text-gray-600">{course.modules.length}</span>
              </div>
              <div className="text-xs text-gray-500">Modules</div>
            </div>
          </div>

          {/* Skills */}
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {course.skills.slice(0, 3).map((skill, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-primary-50 text-primary-700 text-xs rounded-full"
                >
                  {skill}
                </span>
              ))}
              {course.skills.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                  +{course.skills.length - 3} more
                </span>
              )}
            </div>
          </div>

          {/* Price and Action */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-2xl font-bold text-gray-900">${course.price}</span>
              <span className="text-sm text-gray-500 ml-1">USD</span>
            </div>
            
            {isEnrolled ? (
              <button className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center">
                <Play className="h-4 w-4 mr-2" />
                Continue
              </button>
            ) : (
              <button
                onClick={() => handleEnrollCourse(course.id)}
                className="bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-600 transition-colors"
              >
                Enroll Now
              </button>
            )}
          </div>
        </div>
      </motion.div>
    );
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
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Discover Your Next
                <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent"> Learning Adventure</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Master cutting-edge technologies with AI-powered courses designed for the future of work
              </p>
            </div>

            {/* Search and Filters */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Search */}
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Search courses, skills, or topics..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="popular">Most Popular</option>
                  <option value="rating">Highest Rated</option>
                  <option value="newest">Newest</option>
                  <option value="price">Price: Low to High</option>
                </select>

                {/* Filter Toggle */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <Filter className="h-5 w-5 mr-2" />
                  Filters
                </button>
              </div>

              {/* Category Filters */}
              <div className="mt-6 flex flex-wrap gap-2">
                {courseCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex items-center px-4 py-2 rounded-xl transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <span className="mr-2">{category.icon}</span>
                    {category.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
                <div className="text-3xl font-bold text-primary-600 mb-2">{filteredCourses.length}</div>
                <div className="text-gray-600">Available Courses</div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
                <div className="text-3xl font-bold text-secondary-600 mb-2">50K+</div>
                <div className="text-gray-600">Active Students</div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
                <div className="text-3xl font-bold text-accent-600 mb-2">4.8</div>
                <div className="text-gray-600">Average Rating</div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
                <div className="text-3xl font-bold text-success-600 mb-2">95%</div>
                <div className="text-gray-600">Completion Rate</div>
              </div>
            </div>
          </motion.div>

          {/* Course Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedCourses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <CourseCard course={course} />
              </motion.div>
            ))}
          </div>

          {/* Empty State */}
          {sortedCourses.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No courses found</h3>
              <p className="text-gray-600 mb-6">Try adjusting your search or filter criteria</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition-colors"
              >
                Clear Filters
              </button>
            </motion.div>
          )}

          {/* Featured Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-3xl p-8 text-white text-center"
          >
            <h2 className="text-3xl font-bold mb-4">Ready to Start Learning?</h2>
            <p className="text-xl opacity-90 mb-6">
              Join thousands of students mastering the skills of tomorrow
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-primary-600 px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors">
                Browse All Courses
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-xl font-semibold hover:bg-white/10 transition-colors">
                Get Learning Path
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Courses;