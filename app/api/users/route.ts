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
    const userId = searchParams.get('userId') || session.user.id

    // Get user profile
    const user = await prisma.user.findUnique({
      where: { id: userId },
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
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get user analytics
    const analytics = await prisma.userAnalytics.findUnique({
      where: { userId }
    })

    // Get user achievements
    const achievements = await prisma.userAchievement.findMany({
      where: { userId },
      orderBy: { earnedAt: 'desc' },
      take: 5
    })

    // Get user streaks
    const streaks = await prisma.userStreak.findMany({
      where: { userId }
    })

    // Get quiz submissions count
    const quizSubmissions = await prisma.quizSubmission.count({
      where: { userId }
    })

    // Get study sessions count
    const studySessions = await prisma.studySession.count({
      where: { userId }
    })

    // Calculate total study hours from study sessions
    const studySessionsData = await prisma.studySession.findMany({
      where: { userId },
      select: { startTime: true, endTime: true }
    })

    const totalStudyHours = studySessionsData.reduce((total, session) => {
      const start = new Date(`2000-01-01T${session.startTime}`)
      const end = new Date(`2000-01-01T${session.endTime}`)
      const duration = (end.getTime() - start.getTime()) / (1000 * 60 * 60)
      return total + duration
    }, 0)

    // Get followers and following counts
    const followersCount = await prisma.follows.count({
      where: { followingId: userId }
    })

    const followingCount = await prisma.follows.count({
      where: { followerId: userId }
    })

    // Check if current user is following this user
    const isFollowing = await prisma.follows.findUnique({
      where: {
        followerId_followingId: {
          followerId: session.user.id,
          followingId: userId
        }
      }
    })

    const userStats = {
      quizzesTaken: analytics?.totalQuizzes || 0,
      avgScore: analytics?.averageScore || 0,
      studyHours: Math.round(totalStudyHours * 100) / 100,
      streak: Math.max(...streaks.map(s => s.currentStreak), 0),
      achievements: achievements.length,
      followers: followersCount,
      following: followingCount,
      badges: achievements.map(a => a.title).slice(0, 3), // Top 3 achievements as badges
      isFollowing: !!isFollowing
    }

    return NextResponse.json({
      user,
      stats: userStats,
      achievements: achievements.slice(0, 5), // Return top 5 achievements
      streaks: streaks
    })

  } catch (error) {
    console.error('Error fetching user data:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 