import { NextResponse } from "next/server"
import { PrismaClient } from "@/lib/generated/prisma"

const prisma = new PrismaClient()

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true
      }
    })

    const userAnalytics = await prisma.userAnalytics.findMany({
      select: {
        id: true,
        userId: true,
        createdAt: true
      }
    })

    return NextResponse.json({
      users,
      userAnalytics,
      userCount: users.length,
      analyticsCount: userAnalytics.length
    })
  } catch (error) {
    console.error("Error fetching debug data:", error)
    return NextResponse.json(
      { error: "Failed to fetch debug data" },
      { status: 500 }
    )
  }
} 