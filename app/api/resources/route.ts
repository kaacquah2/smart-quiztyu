import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const programId = searchParams.get('programId')
    const courseId = searchParams.get('courseId')
    const category = searchParams.get('category')
    const platform = searchParams.get('platform')
    const type = searchParams.get('type')
    const difficulty = searchParams.get('difficulty')
    const search = searchParams.get('search') || ''
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')
    
    // Validate pagination parameters
    const validLimit = Math.min(100, Math.max(1, limit)) // Max 100 items per page
    const validOffset = Math.max(0, offset)

    // Build where clause
    const where: any = {}
    
    if (programId) {
      try {
        // Get all courses for the program
        const program = await prisma.program.findUnique({
          where: { id: programId },
          include: {
            years: {
              include: {
                semesters: {
                  include: {
                    courses: true
                  }
                }
              }
            }
          }
        })
        
        if (program) {
          const courseIds = program.years.flatMap(year =>
            year.semesters.flatMap(semester =>
              semester.courses.map(course => course.id)
            )
          )
          where.courseIds = {
            hasSome: courseIds
          }
        } else {
          // Program not found, return empty results
          return NextResponse.json({
            resources: [],
            pagination: {
              total: 0,
              limit: validLimit,
              offset: validOffset,
              hasMore: false
            }
          }, {
            status: 200,
            headers: {
              'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600'
            }
          })
        }
      } catch (error) {
        console.error('Error fetching program courses:', error)
        // Continue without program filtering if there's an error
      }
    }

    if (courseId) {
      where.courseIds = {
        has: courseId
      }
    }

    if (category && category !== 'all') {
      where.category = { equals: category, mode: 'insensitive' }
    }

    if (platform && platform !== 'all') {
      where.platform = { equals: platform, mode: 'insensitive' }
    }

    if (type && type !== 'all') {
      where.type = { equals: type, mode: 'insensitive' }
    }

    if (difficulty && difficulty !== 'all') {
      where.tags = {
        has: difficulty
      }
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { tags: { hasSome: [search] } }
      ]
    }

    const resources = await prisma.resource.findMany({
      where,
      orderBy: [
        { rating: 'desc' },
        { views: 'desc' },
        { createdAt: 'desc' }
      ],
      take: validLimit,
      skip: validOffset
    })

    // Get total count for pagination
    const totalCount = await prisma.resource.count({ where })

    return NextResponse.json({
      resources,
      pagination: {
        total: totalCount,
        limit: validLimit,
        offset: validOffset,
        hasMore: validOffset + validLimit < totalCount,
        totalPages: Math.ceil(totalCount / validLimit),
        currentPage: Math.floor(validOffset / validLimit) + 1
      }
    }, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600'
      }
    })
  } catch (error) {
    console.error('Error fetching resources:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch resources',
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
    const { title, description, url, platform, type, category, tags, duration, rating, courseIds } = body

    // Validate required fields
    if (!title || !description || !url || !platform || !type || !category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate URL format
    try {
      new URL(url)
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      )
    }

    // Validate rating range
    const validRating = rating ? Math.max(0, Math.min(5, rating)) : 0

    const resource = await prisma.resource.create({
      data: {
        title: title.trim(),
        description: description.trim(),
        url: url.trim(),
        platform: platform.trim(),
        type: type.trim(),
        category: category.trim(),
        tags: Array.isArray(tags) ? tags : [],
        duration: duration || null,
        rating: validRating,
        courseIds: Array.isArray(courseIds) ? courseIds : [],
        views: 0
      }
    })

    return NextResponse.json(resource, { 
      status: 201,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    })
  } catch (error) {
    console.error('Error creating resource:', error)
    return NextResponse.json(
      { 
        error: 'Failed to create resource',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
} 