import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { PrismaClient } from '@/lib/generated/prisma'
import { authOptions } from '@/lib/auth-options'

const prisma = new PrismaClient()

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    // Find the quiz result
    const quizResult = await prisma.quizResult.findUnique({
      where: { id: id },
      include: {
        submission: {
          include: {
            quiz: {
              include: {
                questions: true
              }
            }
          }
        }
      }
    })

    if (!quizResult) {
      return NextResponse.json({ error: "Quiz result not found" }, { status: 404 })
    }

    // Check if the user owns this result
    if (quizResult.submission.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Parse the answers JSON and extract the answer values
    const answersData = quizResult.submission.answers as any[]
    const answers = answersData ? answersData.map((a: any) => a.answer) : []

    // Transform the data to match the expected format
    const result = {
      id: quizResult.id,
      quizId: quizResult.submission.quizId,
      score: quizResult.score,
      totalQuestions: quizResult.totalQuestions,
      timeSpent: quizResult.submission.timeSpent || 0,
      answers: answers,
      submittedAt: quizResult.submission.createdAt.toISOString(),
      quiz: {
        id: quizResult.submission.quiz.id,
        title: quizResult.submission.quiz.title,
        description: quizResult.submission.quiz.description,
        questions: quizResult.submission.quiz.questions,
        difficulty: quizResult.submission.quiz.difficulty
      }
    }

    return NextResponse.json(result)

  } catch (error) {
    console.error('Error fetching quiz result:', error)
    return NextResponse.json(
      { error: 'Failed to fetch quiz result' },
      { status: 500 }
    )
  }
} 