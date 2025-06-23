import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { PrismaClient } from "@/lib/generated/prisma"
import { authOptions } from "@/lib/auth-options"

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const filter = searchParams.get("filter") || "all"
    const limit = parseInt(searchParams.get("limit") || "20")

    // Get social activities from database
    const activities = await prisma.socialActivity.findMany({
      where: {
        isPublic: true,
        ...(filter !== "all" && { type: filter })
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true
          }
        }
      },
      orderBy: { createdAt: "desc" },
      take: limit
    })

    // Transform activities to match expected format
    const transformedActivities = activities.map(activity => ({
      id: activity.id,
      type: activity.type,
      user: {
        id: activity.user.id,
        name: activity.user.name,
        username: activity.user.name.toLowerCase().replace(/\s+/g, ''),
        avatar: activity.user.image
      },
      content: activity.content,
      timestamp: activity.createdAt.toISOString(),
      likes: activity.likes,
      comments: activity.comments,
      isRealTime: true,
      isNew: new Date(activity.createdAt).getTime() > Date.now() - 24 * 60 * 60 * 1000 // New if within 24 hours
    }))

    // Get leaderboard data
    const leaderboard = await generateLeaderboard()

    // Get study groups
    const studyGroups = await prisma.studyGroup.findMany({
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: "desc" }
    })

    // Transform study groups
    const transformedStudyGroups = studyGroups.map(group => ({
      id: group.id,
      name: group.name,
      description: group.description,
      members: group.members.length,
      category: group.category,
      isJoined: group.members.some(member => member.userId === session.user.id),
      avatar: group.avatar,
      recentActivity: "Recent activity placeholder" // TODO: Add recent activity tracking
    }))

    return NextResponse.json({
      activities: transformedActivities,
      leaderboard,
      studyGroups: transformedStudyGroups,
      total: activities.length
    })
  } catch (error) {
    console.error("Error fetching social data:", error)
    return NextResponse.json(
      { error: "Failed to fetch social data" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { type, content, isPublic = true } = body

    // Create new social activity
    const activity = await prisma.socialActivity.create({
      data: {
        userId: session.user.id,
        type,
        content,
        isPublic,
        likes: 0,
        comments: 0
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true
          }
        }
      }
    })

    // Transform activity to match expected format
    const transformedActivity = {
      id: activity.id,
      type: activity.type,
      user: {
        id: activity.user.id,
        name: activity.user.name,
        username: activity.user.name.toLowerCase().replace(/\s+/g, ''),
        avatar: activity.user.image
      },
      content: activity.content,
      timestamp: activity.createdAt.toISOString(),
      likes: activity.likes,
      comments: activity.comments,
      isRealTime: true,
      isNew: true
    }

    return NextResponse.json(transformedActivity)
  } catch (error) {
    console.error("Error creating social activity:", error)
    return NextResponse.json(
      { error: "Failed to create social activity" },
      { status: 500 }
    )
  }
}

// Helper functions
function isRecentActivity(timestamp: Date): boolean {
  const now = new Date()
  const diffInHours = (now.getTime() - timestamp.getTime()) / (1000 * 60 * 60)
  return diffInHours < 24 // Consider activity recent if within 24 hours
}

async function generateLeaderboard() {
  // Get users with their quiz performance
  const users = await prisma.user.findMany({
    include: {
      submissions: {
        include: {
          result: true
        }
      }
    }
  })

  // Calculate scores for each user
  const userScores = users.map(user => {
    const totalScore = user.submissions.reduce((sum, sub) => 
      sum + (sub.result?.score || 0), 0
    )
    const totalQuestions = user.submissions.reduce((sum, sub) => 
      sum + (sub.result?.totalQuestions || 0), 0
    )
    const avgScore = totalQuestions > 0 ? (totalScore / totalQuestions) * 100 : 0

    return {
      id: user.id,
      rank: 0, // Will be calculated below
      user: {
        id: user.id,
        name: user.name,
        username: user.name.toLowerCase().replace(/\s+/g, ''),
        avatar: user.image,
        program: user.program || "Not specified",
      },
      score: Math.round(totalScore),
      quizzesTaken: user.submissions.length,
      avgScore: Math.round(avgScore)
    }
  })

  // Sort by score and assign ranks
  userScores.sort((a, b) => b.score - a.score)
  userScores.forEach((user, index) => {
    user.rank = index + 1
  })

  return userScores.slice(0, 10) // Return top 10
} 