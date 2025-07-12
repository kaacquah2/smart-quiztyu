import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const search = searchParams.get('search') || ''
    const difficulty = searchParams.get('difficulty') || ''
    const courseId = searchParams.get('courseId') || ''
    
    // Validate pagination parameters
    const validPage = Math.max(1, page)
    const validLimit = Math.min(100, Math.max(1, limit)) // Max 100 items per page
    const skip = (validPage - 1) * validLimit

    // Build where clause
    const where: any = {}
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { tags: { hasSome: [search] } }
      ]
    }
    
    if (difficulty && difficulty !== 'all') {
      where.difficulty = { equals: difficulty, mode: 'insensitive' }
    }
    
    if (courseId) {
      where.courseId = courseId
    }

    // Get total count for pagination
    const totalCount = await prisma.quiz.count({ where })

    const quizzes = await prisma.quiz.findMany({
      where,
      include: {
        questions: {
          select: {
            id: true
          }
        }
      },
      orderBy: [
        { createdAt: 'desc' },
        { title: 'asc' }
      ],
      skip,
      take: validLimit
    })

    // Transform the data to match the expected format
    const transformedQuizzes = quizzes.map((quiz: any) => ({
      id: quiz.id,
      title: quiz.title,
      description: quiz.description,
      difficulty: quiz.difficulty,
      timeLimit: quiz.timeLimit,
      tags: quiz.tags || [],
      questionCount: quiz.questions.length,
      courseId: quiz.courseId,
      createdAt: quiz.createdAt,
      updatedAt: quiz.updatedAt
    }))

    return NextResponse.json({
      quizzes: transformedQuizzes,
      pagination: {
        page: validPage,
        limit: validLimit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / validLimit),
        hasNext: validPage * validLimit < totalCount,
        hasPrev: validPage > 1
      }
    }, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600'
      }
    })
  } catch (error) {
    console.error('Error fetching quizzes:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch quizzes',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { 
        status: 500,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        }
      }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, difficulty, timeLimit, tags, questions, courseId } = body

    // Validate required fields
    if (!title || !description || !difficulty || !timeLimit || !questions) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate questions array
    if (!Array.isArray(questions) || questions.length === 0) {
      return NextResponse.json(
        { error: 'At least one question is required' },
        { status: 400 }
      )
    }

    // Validate each question
    for (const question of questions) {
      if (!question.text || !Array.isArray(question.options) || question.options.length < 2) {
        return NextResponse.json(
          { error: 'Each question must have text and at least 2 options' },
          { status: 400 }
        )
      }
    }

    // Create the quiz
    const quiz = await prisma.quiz.create({
      data: {
        title: title.trim(),
        description: description.trim(),
        difficulty: difficulty.toLowerCase(),
        timeLimit: Math.max(1, Math.min(120, timeLimit)), // Between 1 and 120 minutes
        tags: Array.isArray(tags) ? tags : [],
        courseId: courseId || null,
        questions: {
          create: questions.map((question: any) => ({
            text: question.text.trim(),
            options: question.options,
            correctAnswer: question.correctAnswer
          }))
        }
      },
      include: {
        questions: true
      }
    })

    return NextResponse.json(quiz, { 
      status: 201,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    })
  } catch (error) {
    console.error('Error creating quiz:', error)
    return NextResponse.json(
      { 
        error: 'Failed to create quiz',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}
