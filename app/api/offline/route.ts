import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth-options"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const dataType = searchParams.get("dataType")

    // Get offline data for the user
    const offlineData = await prisma.offlineData.findMany({
      where: {
        userId: session.user.id,
        ...(dataType && { dataType })
      },
      orderBy: { createdAt: "desc" }
    })

    return NextResponse.json(offlineData)
  } catch (error) {
    console.error("Error fetching offline data:", error)
    return NextResponse.json(
      { error: "Failed to fetch offline data" },
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
    const { dataType, data } = body

    // Store offline data
    const offlineData = await prisma.offlineData.create({
      data: {
        userId: session.user.id,
        dataType,
        data,
        syncStatus: "pending"
      }
    })

    return NextResponse.json(offlineData)
  } catch (error) {
    console.error("Error storing offline data:", error)
    return NextResponse.json(
      { error: "Failed to store offline data" },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { id, syncStatus, syncedAt } = body

    // Update offline data sync status
    const offlineData = await prisma.offlineData.update({
      where: {
        id,
        userId: session.user.id
      },
      data: {
        syncStatus,
        ...(syncedAt && { syncedAt: new Date(syncedAt) })
      }
    })

    return NextResponse.json(offlineData)
  } catch (error) {
    console.error("Error updating offline data:", error)
    return NextResponse.json(
      { error: "Failed to update offline data" },
      { status: 500 }
    )
  }
}

// Sync endpoint for processing pending offline data
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get all pending offline data for the user
    const pendingData = await prisma.offlineData.findMany({
      where: {
        userId: session.user.id,
        syncStatus: "pending"
      },
      orderBy: { createdAt: "asc" }
    })

    const syncResults = []

    for (const data of pendingData) {
      try {
        // Process different types of offline data
        switch (data.dataType) {
          case "quiz_submission":
            await processQuizSubmission(data.data)
            break
          case "study_session":
            await processStudySession(data.data)
            break
          case "analytics":
            await processAnalytics(data.data)
            break
          case "social_activity":
            await processSocialActivity(data.data)
            break
          default:
            console.warn(`Unknown data type: ${data.dataType}`)
        }

        // Mark as synced
        await prisma.offlineData.update({
          where: { id: data.id },
          data: {
            syncStatus: "synced",
            syncedAt: new Date()
          }
        })

        syncResults.push({
          id: data.id,
          status: "success"
        })
      } catch (error) {
        console.error(`Error processing offline data ${data.id}:`, error)
        
        // Mark as failed
        await prisma.offlineData.update({
          where: { id: data.id },
          data: {
            syncStatus: "failed"
          }
        })

        syncResults.push({
          id: data.id,
          status: "failed",
          error: error instanceof Error ? error.message : "Unknown error"
        })
      }
    }

    return NextResponse.json({
      synced: syncResults.filter(r => r.status === "success").length,
      failed: syncResults.filter(r => r.status === "failed").length,
      results: syncResults
    })
  } catch (error) {
    console.error("Error syncing offline data:", error)
    return NextResponse.json(
      { error: "Failed to sync offline data" },
      { status: 500 }
    )
  }
}

// Helper functions for processing different data types
async function processQuizSubmission(data: any) {
  // Process quiz submission data
  if (data.quizId && data.answers) {
    await prisma.quizSubmission.create({
      data: {
        userId: data.userId,
        quizId: data.quizId,
        answers: data.answers
      }
    })
  }
}

async function processStudySession(data: any) {
  // Process study session data
  if (data.title && data.date) {
    await prisma.studySession.create({
      data: {
        userId: data.userId,
        title: data.title,
        description: data.description,
        date: new Date(data.date),
        startTime: data.startTime,
        endTime: data.endTime,
        course: data.course,
        priority: data.priority,
        completed: data.completed || false
      }
    })
  }
}

async function processAnalytics(data: any) {
  // Process analytics data
  if (data.userId) {
    await prisma.userActivity.create({
      data: {
        userId: data.userId,
        activityType: data.activityType,
        metadata: data.metadata,
        sessionId: data.sessionId,
        page: data.page,
        duration: data.duration
      }
    })
  }
}

async function processSocialActivity(data: any) {
  // Process social activity data
  if (data.type && data.content) {
    await prisma.socialActivity.create({
      data: {
        userId: data.userId,
        type: data.type,
        content: data.content,
        isPublic: data.isPublic || true
      }
    })
  }
} 