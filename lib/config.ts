// Centralized configuration for the Smart Quiz System
// All hardcoded values should be moved here and made configurable via environment variables

export const CONFIG = {
  // API Configuration
  API: {
    // External service URLs
    YOUTUBE_BASE_URL: process.env.YOUTUBE_API_BASE_URL || 'https://www.googleapis.com/youtube/v3',
    GEMINI_BASE_URL: process.env.GEMINI_API_BASE_URL || 'https://generativelanguage.googleapis.com/v1beta/models',
    UI_AVATARS_URL: process.env.UI_AVATARS_URL || 'https://ui-avatars.com/api',
    
    // Internal API configuration
    BASE_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    SOCKET_URL: process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001',
    
    // API limits and timeouts
    MAX_QUERY_LENGTH: parseInt(process.env.MAX_QUERY_LENGTH || '120'),
    DEFAULT_MAX_RESULTS: parseInt(process.env.DEFAULT_MAX_RESULTS || '3'),
    DEFAULT_LIMIT: parseInt(process.env.DEFAULT_LIMIT || '5'),
    API_TIMEOUT: parseInt(process.env.API_TIMEOUT || '10000'),
  },

  // UI Configuration
  UI: {
    // Toast configuration
    TOAST_LIMIT: parseInt(process.env.TOAST_LIMIT || '1'),
    TOAST_REMOVE_DELAY: parseInt(process.env.TOAST_REMOVE_DELAY || '1000000'),
    
    // Responsive breakpoints
    MOBILE_BREAKPOINT: parseInt(process.env.MOBILE_BREAKPOINT || '768'),
    TABLET_BREAKPOINT: parseInt(process.env.TABLET_BREAKPOINT || '1024'),
    
    // Avatar configuration
    AVATAR_SIZE: parseInt(process.env.AVATAR_SIZE || '128'),
    AVATAR_BOLD: process.env.AVATAR_BOLD === 'true',
    
    // Sidebar configuration
    SIDEBAR_COOKIE_MAX_AGE: parseInt(process.env.SIDEBAR_COOKIE_MAX_AGE || '604800'), // 7 days in seconds
  },

  // Quiz Configuration
  QUIZ: {
    DEFAULT_TIME_LIMIT: parseInt(process.env.DEFAULT_TIME_LIMIT || '15'), // minutes
    MIN_QUESTIONS: parseInt(process.env.MIN_QUESTIONS || '5'),
    MAX_QUESTIONS: parseInt(process.env.MAX_QUESTIONS || '50'),
  },

  // AI Configuration
  AI: {
    GEMINI_MODEL: process.env.GEMINI_MODEL || 'gemini-2.0-flash',
    DEEPSEEK_MODEL: process.env.DEEPSEEK_MODEL || 'deepseek-chat',
    MAX_TOKENS: parseInt(process.env.MAX_TOKENS || '1000'),
    TEMPERATURE: parseFloat(process.env.TEMPERATURE || '0.7'),
  },

  // YouTube Configuration
  YOUTUBE: {
    DEFAULT_MAX_RESULTS: parseInt(process.env.YOUTUBE_DEFAULT_MAX_RESULTS || '5'),
    VIDEO_DURATION: process.env.YOUTUBE_VIDEO_DURATION || 'medium',
    RELEVANCE_LANGUAGE: process.env.YOUTUBE_RELEVANCE_LANGUAGE || 'en',
  },

  // Performance Configuration
  PERFORMANCE: {
    CACHE_TTL: parseInt(process.env.CACHE_TTL || '3600'), // 1 hour in seconds
    DEBOUNCE_DELAY: parseInt(process.env.DEBOUNCE_DELAY || '300'), // milliseconds
    SUCCESS_MESSAGE_DURATION: parseInt(process.env.SUCCESS_MESSAGE_DURATION || '3000'), // milliseconds
  },

  // Development Configuration
  DEV: {
    ENABLE_DEBUG_LOGGING: process.env.ENABLE_DEBUG_LOGGING === 'true',
    MOCK_API_RESPONSES: process.env.MOCK_API_RESPONSES === 'true',
    SKIP_AUTHENTICATION: process.env.SKIP_AUTHENTICATION === 'true',
  }
} as const

// Helper function to get configuration with type safety
export function getConfig<T extends keyof typeof CONFIG>(section: T): typeof CONFIG[T] {
  return CONFIG[section]
}

// Helper function to get a specific config value
export function getConfigValue<T extends keyof typeof CONFIG, K extends keyof typeof CONFIG[T]>(
  section: T,
  key: K
): typeof CONFIG[T][K] {
  return CONFIG[section][key]
}

// Type exports for use in other files
export type Config = typeof CONFIG
export type APIConfig = typeof CONFIG.API
export type UIConfig = typeof CONFIG.UI
export type QuizConfig = typeof CONFIG.QUIZ
export type AIConfig = typeof CONFIG.AI
export type YouTubeConfig = typeof CONFIG.YOUTUBE
export type PerformanceConfig = typeof CONFIG.PERFORMANCE
export type DevConfig = typeof CONFIG.DEV 