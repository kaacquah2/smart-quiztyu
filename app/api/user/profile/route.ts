import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { PrismaClient } from "@/lib/generated/prisma"
import { authOptions } from "@/lib/auth-options"

const prisma = new PrismaClient()

// Define the type for user with location fields
type UserWithLocation = {
  id: string
  name: string
  email: string
  image: string | null
  city: string | null
  country: string | null
  region: string | null
  timezone: string | null
  latitude: number | null
  longitude: number | null
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    console.log("Session in profile API:", session) // Debug log
    
    if (!session?.user?.id) {
      console.log("No session or user ID found") // Debug log
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const selectFields = {
      id: true,
      name: true,
      email: true,
      image: true,
      city: true,
      country: true,
      region: true,
      timezone: true,
      latitude: true,
      longitude: true,
    } as any

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: selectFields
    }) as UserWithLocation | null

    if (!user) {
      console.log("User not found in database for ID:", session.user.id) // Debug log
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Transform the data to include location
    const userProfile = {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      location: {
        city: user.city,
        country: user.country || null,
        region: user.region || null,
        timezone: user.timezone || null,
        coordinates: user.latitude && user.longitude ? {
          lat: user.latitude,
          lng: user.longitude
        } : null
      }
    }

    console.log("User profile fetched successfully:", user.id) // Debug log
    return NextResponse.json(userProfile)
  } catch (error) {
    console.error("Error fetching user profile:", error)
    return NextResponse.json(
      { error: "Failed to fetch user profile" },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { name, email, image } = await request.json()

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        ...(name && { name }),
        ...(email && { email }),
        ...(image && { image }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
      }
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error("Error updating user profile:", error)
    return NextResponse.json(
      { error: "Failed to update user profile" },
      { status: 500 }
    )
  }
} 