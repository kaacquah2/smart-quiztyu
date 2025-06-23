import type { Quiz, Recommendation, QuizSubmission, QuizResult } from "./types"
import { PrismaClient } from "./generated/prisma"

const prisma = new PrismaClient()

// Get all quizzes (without questions for the listing page)
export async function getQuizzes(): Promise<Omit<Quiz, "questions">[]> {
  const quizzes = await prisma.quiz.findMany({
    include: {
      questions: true
    }
  })
  
  return quizzes.map(({ questions, ...quiz }) => ({
    ...quiz,
    questionCount: questions.length,
  }))
}

// Get a specific quiz by ID (with questions)
export async function getQuizById(id: string): Promise<Quiz | null> {
  const quiz = await prisma.quiz.findUnique({
    where: { id },
    include: {
      questions: true
    }
  })
  
  if (!quiz) return null
  
  return {
    ...quiz,
    questionCount: quiz.questions.length
  }
}

// Get a specific quiz by ID with random questions
export async function getQuizWithRandomQuestions(
  id: string, 
  questionCount: number = 5
): Promise<Quiz | null> {
  const quiz = await prisma.quiz.findUnique({
    where: { id },
    include: {
      questions: true
    }
  })
  
  if (!quiz) return null
  
  // Shuffle questions and take the requested number
  const shuffledQuestions = quiz.questions
    .sort(() => 0.5 - Math.random())
    .slice(0, Math.min(questionCount, quiz.questions.length))
  
  return {
    ...quiz,
    questions: shuffledQuestions,
    questionCount: shuffledQuestions.length
  }
}

// Submit a quiz and calculate the score
export async function submitQuiz(submission: QuizSubmission, userId: string): Promise<QuizResult> {
  const quiz = await getQuizById(submission.quizId)

  if (!quiz) {
    throw new Error(`Quiz with ID ${submission.quizId} not found`)
  }

  let score = 0
  const correctAnswers: number[] = []
  const incorrectAnswers: number[] = []

  submission.answers.forEach(({ questionIndex, answer }) => {
    const question = quiz.questions[questionIndex]

    if (!question) {
      throw new Error(`Question at index ${questionIndex} not found`)
    }

    if (question.correctAnswer === answer) {
      score++
      correctAnswers.push(questionIndex)
    } else {
      incorrectAnswers.push(questionIndex)
    }
  })

  // Save submission and result to database
  const _quizSubmission = await prisma.quizSubmission.create({
    data: {
      userId,
      quizId: submission.quizId,
      answers: submission.answers,
      result: {
        create: {
          score,
          totalQuestions: quiz.questions.length,
          correctAnswers,
          incorrectAnswers
        }
      }
    },
    include: {
      result: true
    }
  })

  return {
    score,
    totalQuestions: quiz.questions.length,
    correctAnswers,
    incorrectAnswers,
  }
}

// Get personalized recommendations based on quiz performance
export async function getRecommendations(
  quizId: string,
  score: number,
  totalQuestions: number,
): Promise<Recommendation[]> {
  const allRecommendations = await prisma.recommendation.findMany()

  const quiz = await getQuizById(quizId)
  if (!quiz) {
    throw new Error(`Quiz with ID ${quizId} not found`)
  }

  const percentage = (score / totalQuestions) * 100

  // Filter recommendations based on performance
  let difficulty: string
  if (percentage < 40) {
    difficulty = "beginner"
  } else if (percentage < 70) {
    difficulty = "intermediate"
  } else {
    difficulty = "advanced"
  }

  // Filter recommendations by quiz tags, course ID, and appropriate difficulty
  return allRecommendations.filter((rec) => {
    // Match by quiz tags
    const matchesTags = quiz.tags?.some((tag) => rec.tags.includes(tag)) || false
    // Match by course/quiz ID
    const matchesCourseId = rec.tags.includes(quiz.id)
    // Match by difficulty (show easier content for low scores, more advanced for high scores)
    const matchesDifficulty = rec.difficulty === difficulty

    return (matchesTags || matchesCourseId) && matchesDifficulty
  })
}
