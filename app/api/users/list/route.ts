import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const location = searchParams.get('location')
    const country = searchParams.get('country')
    const region = searchParams.get('region')
    const program = searchParams.get('program')
    const limit = parseInt(searchParams.get('limit') || '50')

    // Build where clause for filtering
    const whereClause: any = {
      id: { not: session.user.id } // Exclude current user
    }

    if (location) {
      whereClause.OR = [
        { city: { contains: location, mode: 'insensitive' } },
        { country: { contains: location, mode: 'insensitive' } },
        { region: { contains: location, mode: 'insensitive' } }
      ]
    }

    if (country && country !== 'all') {
      whereClause.country = country
    }

    if (region && region !== 'all') {
      whereClause.region = region
    }

    if (program && program !== 'all') {
      whereClause.program = program
    }

    // Get users with their basic info
    const users = await prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        program: true,
        year: true,
        bio: true,
        city: true,
        country: true,
        region: true
      },
      take: limit,
      orderBy: { name: 'asc' }
    })

    // Get analytics for all users in one query
    const userIds = users.map(user => user.id)
    const analytics = await prisma.userAnalytics.findMany({
      where: { userId: { in: userIds } },
      select: {
        userId: true,
        totalQuizzes: true,
        averageScore: true
      }
    })

    // Get study sessions for all users
    const studySessions = await prisma.studySession.findMany({
      where: { userId: { in: userIds } },
      select: {
        userId: true,
        startTime: true,
        endTime: true
      }
    })

    // Get streaks for all users
    const streaks = await prisma.userStreak.findMany({
      where: { userId: { in: userIds } },
      select: {
        userId: true,
        currentStreak: true
      }
    })

    // Get achievements for all users
    const achievements = await prisma.userAchievement.findMany({
      where: { userId: { in: userIds } },
      select: {
        userId: true,
        title: true
      },
      orderBy: { earnedAt: 'desc' }
    })

    // Get following relationships for current user
    const following = await prisma.follows.findMany({
      where: { followerId: session.user.id },
      select: { followingId: true }
    })
    const followingIds = new Set(following.map(f => f.followingId))

    // Transform users to match expected format
    const transformedUsers = users.map(user => {
      const userAnalytics = analytics.find(a => a.userId === user.id)
      const userStudySessions = studySessions.filter(s => s.userId === user.id)
      const userStreaks = streaks.filter(s => s.userId === user.id)
      const userAchievements = achievements.filter(a => a.userId === user.id)

      // Calculate study hours
      const totalStudyHours = userStudySessions.reduce((total, session) => {
        const start = new Date(`2000-01-01T${session.startTime}`)
        const end = new Date(`2000-01-01T${session.endTime}`)
        const duration = (end.getTime() - start.getTime()) / (1000 * 60 * 60)
        return total + duration
      }, 0)

      return {
        id: user.id,
        name: user.name,
        username: user.name.toLowerCase().replace(/\s+/g, ''),
        avatar: user.image,
        program: user.program || 'Not specified',
        year: user.year || 1,
        bio: user.bio || '',
        location: {
          city: user.city,
          country: user.country,
          region: user.region,
          timezone: null,
          coordinates: null
        },
        stats: {
          quizzesTaken: userAnalytics?.totalQuizzes || 0,
          avgScore: userAnalytics?.averageScore || 0,
          studyHours: Math.round(totalStudyHours * 100) / 100,
          streak: Math.max(...userStreaks.map(s => s.currentStreak), 0)
        },
        badges: userAchievements.slice(0, 3).map(a => a.title),
        isFollowing: followingIds.has(user.id)
      }
    })

    return NextResponse.json(transformedUsers)

  } catch (error) {
    console.error('Error fetching users list:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 