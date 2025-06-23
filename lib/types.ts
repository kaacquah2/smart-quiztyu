export interface Quiz {
  id: string
  title: string
  description: string
  difficulty: string
  timeLimit: number // in minutes
  questionCount: number
  questions: Question[]
  tags?: string[]
}

export interface Question {
  text: string
  options: string[]
  correctAnswer: string
}

export interface Recommendation {
  id: string
  title: string
  description: string
  url: string
  type: string // video, article, exercise, etc.
  tags: string[]
  difficulty: string
  // YouTube-specific properties
  platform?: string
  thumbnail?: string
  channelTitle?: string
  duration?: string
  viewCount?: string
  publishedAt?: string
}

export interface QuizSubmission {
  quizId: string
  answers: {
    questionIndex: number
    answer: string
  }[]
}

export interface QuizResult {
  score: number
  totalQuestions: number
  correctAnswers: number[]
  incorrectAnswers: number[]
}

export interface User {
  id: string
  name: string
  email: string
  image?: string
}
