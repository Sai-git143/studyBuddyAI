export interface Course {
  id: string;
  title: string;
  description: string;
  category: 'ai-ml' | 'programming' | 'data-science' | 'web-dev' | 'cybersecurity' | 'blockchain' | 'design' | 'business';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  modules: CourseModule[];
  prerequisites: string[];
  skills: string[];
  instructor: string;
  rating: number;
  studentsEnrolled: number;
  price: number;
  thumbnail: string;
  tags: string[];
  isPopular?: boolean;
  isNew?: boolean;
}

export interface CourseModule {
  id: string;
  title: string;
  description: string;
  duration: string;
  lessons: Lesson[];
  isCompleted?: boolean;
}

export interface Lesson {
  id: string;
  title: string;
  type: 'video' | 'text' | 'interactive' | 'quiz' | 'project';
  duration: string;
  content?: string;
  isCompleted?: boolean;
  isLocked?: boolean;
}

export interface UserCourseProgress {
  courseId: string;
  enrolledAt: Date;
  lastAccessedAt: Date;
  completedModules: string[];
  completedLessons: string[];
  progressPercentage: number;
  currentModule: string;
  currentLesson: string;
  timeSpent: number;
  certificateEarned?: boolean;
}