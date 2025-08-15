// Mock backend service - easily replaceable with real API later
export interface User {
  id: string;
  email: string;
  name: string;
}

export interface FlashcardSide {
  phrase: string;
  exampleSentence?: string;
  image?: string;
  mp3?: string;
}

export interface Flashcard {
  id: string;
  sideA: FlashcardSide;
  sideB: FlashcardSide;
}

export interface CourseLevel {
  id: string;
  name: string;
  items: Flashcard[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  language: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  imageUrl?: string;
  levels: CourseLevel[];
  createdBy: string;
  isPublic: boolean;
}

export interface UserProgress {
  userId: string;
  courseId: string;
  flashcardsLearned: number;
  repetitionsDone: number;
  currentLevel: number;
  lastAccessed: Date;
}

export interface UserStats {
  totalFlashcardsLearned: number;
  totalRepetitions: number;
  coursesStarted: number;
  coursesCompleted: number;
  streakDays: number;
}

// Mock data
const mockUsers: User[] = [
  { id: '1', email: 'demo@example.com', name: 'Demo User' }
];

const mockCourses: Course[] = [
  {
    id: '1',
    title: 'Spanish Basics',
    description: 'Learn fundamental Spanish phrases and vocabulary',
    language: 'Spanish',
    difficulty: 'beginner',
    imageUrl: '/placeholder.svg',
    createdBy: 'system',
    isPublic: true,
    levels: [
      {
        id: '1',
        name: 'Greetings',
        items: [
          {
            id: '1',
            sideA: { phrase: 'Hello', exampleSentence: 'Hello, how are you?' },
            sideB: { phrase: 'Hola', exampleSentence: 'Hola, ¿cómo estás?' }
          },
          {
            id: '2',
            sideA: { phrase: 'Goodbye', exampleSentence: 'Goodbye, see you later!' },
            sideB: { phrase: 'Adiós', exampleSentence: '¡Adiós, hasta luego!' }
          }
        ]
      }
    ]
  },
  {
    id: '2',
    title: 'French Essentials',
    description: 'Essential French words and phrases for beginners',
    language: 'French',
    difficulty: 'beginner',
    imageUrl: '/placeholder.svg',
    createdBy: 'system',
    isPublic: true,
    levels: [
      {
        id: '1',
        name: 'Basic Phrases',
        items: [
          {
            id: '1',
            sideA: { phrase: 'Thank you', exampleSentence: 'Thank you very much!' },
            sideB: { phrase: 'Merci', exampleSentence: 'Merci beaucoup!' }
          }
        ]
      }
    ]
  }
];

let mockUserProgress: UserProgress[] = [];
let mockUserStats: UserStats = {
  totalFlashcardsLearned: 0,
  totalRepetitions: 0,
  coursesStarted: 0,
  coursesCompleted: 0,
  streakDays: 0
};

// Mock authentication state
let currentUser: User | null = null;

// Backend service functions
export const backendService = {
  // Authentication
  async login(email: string, password: string): Promise<User | null> {
    // Mock login - accepts demo@example.com with any password
    if (email === 'demo@example.com') {
      currentUser = mockUsers[0];
      return currentUser;
    }
    return null;
  },

  async logout(): Promise<void> {
    currentUser = null;
  },

  async getCurrentUser(): Promise<User | null> {
    return currentUser;
  },

  // Courses
  async getCourses(): Promise<Course[]> {
    return mockCourses.filter(course => course.isPublic);
  },

  async getCourse(id: string): Promise<Course | null> {
    return mockCourses.find(course => course.id === id) || null;
  },

  async createCourse(course: Omit<Course, 'id' | 'createdBy'>): Promise<Course> {
    const newCourse: Course = {
      ...course,
      id: Date.now().toString(),
      createdBy: currentUser?.id || 'unknown'
    };
    mockCourses.push(newCourse);
    return newCourse;
  },

  // User Progress
  async getUserProgress(userId: string, courseId: string): Promise<UserProgress | null> {
    return mockUserProgress.find(p => p.userId === userId && p.courseId === courseId) || null;
  },

  async updateUserProgress(progress: Omit<UserProgress, 'lastAccessed'>): Promise<UserProgress> {
    const existingIndex = mockUserProgress.findIndex(
      p => p.userId === progress.userId && p.courseId === progress.courseId
    );
    
    const updatedProgress = { ...progress, lastAccessed: new Date() };
    
    if (existingIndex >= 0) {
      mockUserProgress[existingIndex] = updatedProgress;
    } else {
      mockUserProgress.push(updatedProgress);
    }
    
    return updatedProgress;
  },

  // User Statistics
  async getUserStats(userId: string): Promise<UserStats> {
    // Calculate stats from progress data
    const userProgressData = mockUserProgress.filter(p => p.userId === userId);
    
    mockUserStats = {
      totalFlashcardsLearned: userProgressData.reduce((sum, p) => sum + p.flashcardsLearned, 0),
      totalRepetitions: userProgressData.reduce((sum, p) => sum + p.repetitionsDone, 0),
      coursesStarted: userProgressData.length,
      coursesCompleted: userProgressData.filter(p => p.currentLevel === 0).length, // Mock completion logic
      streakDays: 5 // Mock streak
    };
    
    return mockUserStats;
  },

  async updateUserStats(userId: string, stats: Partial<UserStats>): Promise<UserStats> {
    mockUserStats = { ...mockUserStats, ...stats };
    return mockUserStats;
  }
};