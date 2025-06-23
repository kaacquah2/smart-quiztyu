import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { PrismaClient } from '@/lib/generated/prisma'
import { authOptions } from '@/lib/auth-options'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { quizId, answers, timeSpent } = body

    if (!quizId || !answers || timeSpent === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Get the quiz to calculate score
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: { questions: true }
    })

    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 })
    }

    // Calculate score
    let score = 0
    const correctAnswers: number[] = []
    const incorrectAnswers: number[] = []

    answers.forEach((answer: number, index: number) => {
      const question = quiz.questions[index]
      if (question && answer === question.correctAnswer) {
        score++
        correctAnswers.push(index)
      } else {
        incorrectAnswers.push(index)
      }
    })

    // Create quiz submission and result
    const quizSubmission = await prisma.quizSubmission.create({
      data: {
        userId: session.user.id,
        quizId: quizId,
        answers: answers.map((answer: number, index: number) => ({
          questionIndex: index,
          answer: answer
        })),
        timeSpent: timeSpent,
        result: {
          create: {
            score: score,
            totalQuestions: quiz.questions.length,
            correctAnswers: correctAnswers,
            incorrectAnswers: incorrectAnswers
          }
        }
      },
      include: {
        result: true
      }
    })

    return NextResponse.json({
      id: quizSubmission.result?.id || quizSubmission.id,
      score: score,
      totalQuestions: quiz.questions.length,
      timeSpent: timeSpent
    }, { status: 201 })

  } catch (error) {
    console.error('Error submitting quiz results:', error)
    return NextResponse.json(
      { error: 'Failed to submit quiz results' },
      { status: 500 }
    )
  }
} 