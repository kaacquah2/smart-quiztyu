import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const quizzes = await prisma.quiz.findMany({
      include: {
        questions: true
      },
      orderBy: {
        id: 'desc'
      }
    })

    // Transform the data to match the expected format
    const transformedQuizzes = quizzes.map((quiz: any) => ({
      id: quiz.id,
      title: quiz.title,
      description: quiz.description,
      difficulty: quiz.difficulty,
      timeLimit: quiz.timeLimit,
      tags: quiz.tags || [],
      questionCount: quiz.questions.length
    }))

    return NextResponse.json(transformedQuizzes)
  } catch (error) {
    console.error('Error fetching quizzes:', error)
    return NextResponse.json(
      { error: 'Failed to fetch quizzes' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, difficulty, timeLimit, tags, questions } = body

    // Create the quiz
    const quiz = await prisma.quiz.create({
      data: {
        title,
        description,
        difficulty,
        timeLimit,
        tags: tags || [],
        questions: {
          create: questions.map((question: any) => ({
            text: question.text,
            options: question.options,
            correctAnswer: question.correctAnswer
          }))
        }
      },
      include: {
        questions: true
      }
    })

    return NextResponse.json(quiz, { status: 201 })
  } catch (error) {
    console.error('Error creating quiz:', error)
    return NextResponse.json(
      { error: 'Failed to create quiz' },
      { status: 500 }
    )
  }
}
