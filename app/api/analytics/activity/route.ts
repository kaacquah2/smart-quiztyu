import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth-options"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { activityType, metadata, sessionId, page, duration } = body

    // Verify the user exists in the database
    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Create new user activity record
    const userActivity = await prisma.userActivity.create({
      data: {
        userId: session.user.id,
        activityType: activityType || "page_view",
        metadata: metadata || {},
        sessionId: sessionId || null,
        page: page || "unknown",
        duration: duration || null,
        timestamp: new Date()
      }
    })

    return NextResponse.json({ 
      success: true, 
      activity: userActivity 
    })

  } catch (error) {
    console.error("Error creating user activity:", error)
    return NextResponse.json(
      { error: "Internal server error" }, 
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get("limit") || "50")
    const activityType = searchParams.get("activityType")

    // Get user activities with optional filtering
    const userActivities = await prisma.userActivity.findMany({
      where: {
        userId: session.user.id,
        ...(activityType && { activityType })
      },
      orderBy: { timestamp: "desc" },
      take: limit
    })

    return NextResponse.json({ 
      activities: userActivities 
    })

  } catch (error) {
    console.error("Error fetching user activities:", error)
    return NextResponse.json(
      { error: "Internal server error" }, 
      { status: 500 }
    )
  }
} 