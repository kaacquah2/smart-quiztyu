// Centralized routing configuration for the Smart Quiz System
import { CONFIG } from './config'

export const ROUTES = {
  // Public routes
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  
  // Protected routes (require authentication)
  DASHBOARD: '/dashboard',
  PROGRAMS: '/programs',
  QUIZZES: '/quizzes',
  QUIZ: (id: string) => `/quiz/${id}`,
  RESULTS: (id: string) => `/results/${id}`,
  RESOURCES: '/resources',
  SCHEDULER: '/scheduler',
  ANALYTICS: '/analytics',
  SOCIAL: '/social',
  PROFILE: '/profile',
} as const

// Route groups for easier management
export const PUBLIC_ROUTES = {
  HOME: ROUTES.HOME,
  LOGIN: ROUTES.LOGIN,
  SIGNUP: ROUTES.SIGNUP,
} as const

export const PROTECTED_ROUTES = {
  DASHBOARD: ROUTES.DASHBOARD,
  PROGRAMS: ROUTES.PROGRAMS,
  QUIZZES: ROUTES.QUIZZES,
  RESOURCES: ROUTES.RESOURCES,
  SCHEDULER: ROUTES.SCHEDULER,
  ANALYTICS: ROUTES.ANALYTICS,
  SOCIAL: ROUTES.SOCIAL,
  PROFILE: ROUTES.PROFILE,
} as const

// Navigation items configuration
export const NAVIGATION_ITEMS = [
  {
    label: 'Dashboard',
    href: ROUTES.DASHBOARD,
    icon: 'LayoutDashboard',
  },
  {
    label: 'Programs',
    href: ROUTES.PROGRAMS,
    icon: 'GraduationCap',
  },
  {
    label: 'Quizzes',
    href: ROUTES.QUIZZES,
    icon: 'BookOpen',
  },
  {
    label: 'Resources',
    href: ROUTES.RESOURCES,
    icon: 'Library',
  },
  {
    label: 'Scheduler',
    href: ROUTES.SCHEDULER,
    icon: 'Calendar',
  },
  {
    label: 'Analytics',
    href: ROUTES.ANALYTICS,
    icon: 'BarChart3',
  },
  {
    label: 'Social',
    href: ROUTES.SOCIAL,
    icon: 'Users',
  },
  {
    label: 'Profile',
    href: ROUTES.PROFILE,
    icon: 'User',
  },
] as const

// API routes
export const API_ROUTES = {
  QUIZZES: '/api/quizzes',
  SESSIONS: '/api/sessions',
  SESSIONS_STREAK: '/api/sessions/streak',
  USERS_LOCATION: '/api/users/location',
  RECOMMENDATIONS: '/api/recommendations',
  YOUTUBE_RECOMMENDATIONS: '/api/youtube-recommendations',
  AI_RECOMMENDATIONS: '/api/ai-recommendations',
  DEEPSEEK_RECOMMENDATIONS: '/api/deepseek-recommendations',
  STUDY_PLAN: '/api/study-plan',
} as const

// External service URLs - now using configuration
export const EXTERNAL_URLS = {
  YOUTUBE_API: CONFIG.API.YOUTUBE_BASE_URL,
  GEMINI_API: CONFIG.API.GEMINI_BASE_URL,
  UI_AVATARS: CONFIG.API.UI_AVATARS_URL,
} as const

// Helper functions
export const createQuizRoute = (id: string) => ROUTES.QUIZ(id)
export const createResultsRoute = (id: string) => ROUTES.RESULTS(id)

// Type definitions
export type RouteKey = keyof typeof ROUTES
export type ProtectedRouteKey = keyof typeof PROTECTED_ROUTES
export type PublicRouteKey = keyof typeof PUBLIC_ROUTES 