import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth-options"

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { city, country, region, timezone, latitude, longitude } = body

    // Validate required fields
    if (!city || !country) {
      return NextResponse.json(
        { error: "City and country are required" },
        { status: 400 }
      )
    }

    // Update user's location information
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        city,
        country,
        region: region || null,
        timezone: timezone || null,
        latitude: latitude || null,
        longitude: longitude || null,
      },
      select: {
        id: true,
        name: true,
        city: true,
        country: true,
        region: true,
        timezone: true,
        latitude: true,
        longitude: true,
      }
    })

    return NextResponse.json({
      message: "Location updated successfully",
      location: {
        city: updatedUser.city,
        country: updatedUser.country,
        region: updatedUser.region,
        timezone: updatedUser.timezone,
        coordinates: updatedUser.latitude && updatedUser.longitude ? {
          lat: updatedUser.latitude,
          lng: updatedUser.longitude
        } : null
      }
    })
  } catch (error) {
    console.error("Error updating user location:", error)
    return NextResponse.json(
      { error: "Failed to update location" },
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

    // Get user's current location information
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        city: true,
        country: true,
        region: true,
        timezone: true,
        latitude: true,
        longitude: true,
      }
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      location: {
        city: user.city,
        country: user.country,
        region: user.region,
        timezone: user.timezone,
        coordinates: user.latitude && user.longitude ? {
          lat: user.latitude,
          lng: user.longitude
        } : null
      }
    })
  } catch (error) {
    console.error("Error fetching user location:", error)
    return NextResponse.json(
      { error: "Failed to fetch location" },
      { status: 500 }
    )
  }
} 