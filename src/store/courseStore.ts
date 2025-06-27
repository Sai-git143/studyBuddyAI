import { create } from 'zustand';
import { Course, UserCourseProgress } from '../types/course';
import { courses } from '../data/courses';

interface CourseState {
  allCourses: Course[];
  enrolledCourses: UserCourseProgress[];
  selectedCategory: string;
  searchQuery: string;
  currentCourse: Course | null;
  
  // Actions
  setCourses: (courses: Course[]) => void;
  enrollInCourse: (courseId: string) => void;
  setSelectedCategory: (category: string) => void;
  setSearchQuery: (query: string) => void;
  setCurrentCourse: (course: Course | null) => void;
  updateCourseProgress: (courseId: string, progress: Partial<UserCourseProgress>) => void;
  getFilteredCourses: () => Course[];
  getCourseProgress: (courseId: string) => UserCourseProgress | undefined;
  markLessonComplete: (courseId: string, lessonId: string) => void;
}

export const useCourseStore = create<CourseState>((set, get) => ({
  allCourses: courses,
  enrolledCourses: [],
  selectedCategory: 'all',
  searchQuery: '',
  currentCourse: null,

  setCourses: (courses) => set({ allCourses: courses }),

  enrollInCourse: (courseId) => {
    const { enrolledCourses, allCourses } = get();
    const course = allCourses.find(c => c.id === courseId);
    
    if (course && !enrolledCourses.find(ec => ec.courseId === courseId)) {
      const newProgress: UserCourseProgress = {
        courseId,
        enrolledAt: new Date(),
        lastAccessedAt: new Date(),
        completedModules: [],
        completedLessons: [],
        progressPercentage: 0,
        currentModule: course.modules[0]?.id || '',
        currentLesson: course.modules[0]?.lessons[0]?.id || '',
        timeSpent: 0,
        certificateEarned: false
      };
      
      set({ 
        enrolledCourses: [...enrolledCourses, newProgress]
      });
    }
  },

  setSelectedCategory: (category) => set({ selectedCategory: category }),
  
  setSearchQuery: (query) => set({ searchQuery: query }),
  
  setCurrentCourse: (course) => set({ currentCourse: course }),

  updateCourseProgress: (courseId, progress) => {
    const { enrolledCourses } = get();
    const updatedCourses = enrolledCourses.map(course =>
      course.courseId === courseId
        ? { ...course, ...progress, lastAccessedAt: new Date() }
        : course
    );
    set({ enrolledCourses: updatedCourses });
  },

  getFilteredCourses: () => {
    const { allCourses, selectedCategory, searchQuery } = get();
    
    let filtered = allCourses;
    
    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(course => course.category === selectedCategory);
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(query) ||
        course.description.toLowerCase().includes(query) ||
        course.tags.some(tag => tag.toLowerCase().includes(query)) ||
        course.skills.some(skill => skill.toLowerCase().includes(query))
      );
    }
    
    return filtered;
  },

  getCourseProgress: (courseId) => {
    const { enrolledCourses } = get();
    return enrolledCourses.find(course => course.courseId === courseId);
  },

  markLessonComplete: (courseId, lessonId) => {
    const { enrolledCourses, allCourses } = get();
    const course = allCourses.find(c => c.id === courseId);
    const progress = enrolledCourses.find(p => p.courseId === courseId);
    
    if (course && progress) {
      const totalLessons = course.modules.reduce((total, module) => total + module.lessons.length, 0);
      const completedLessons = [...progress.completedLessons];
      
      if (!completedLessons.includes(lessonId)) {
        completedLessons.push(lessonId);
      }
      
      const progressPercentage = (completedLessons.length / totalLessons) * 100;
      
      get().updateCourseProgress(courseId, {
        completedLessons,
        progressPercentage,
        timeSpent: progress.timeSpent + 30 // Add 30 minutes for lesson completion
      });
    }
  }
}));