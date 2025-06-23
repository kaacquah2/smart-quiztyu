import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"

interface UserLocation {
  city?: string | null
  country?: string | null
  region?: string | null
  timezone?: string | null
  coordinates?: {
    lat: number
    lng: number
  } | null
}

interface UserProfile {
  id: string
  name: string
  email: string
  image?: string
  location?: UserLocation
}

export function useUserProfile() {
  const { data: session, status } = useSession()
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Don't fetch if still loading session
    if (status === "loading") {
      setLoading(true)
      return
    }

    // If not authenticated, set loading to false and return
    if (status === "unauthenticated" || !session?.user?.id) {
      setLoading(false)
      setUserProfile(null)
      setError(null)
      return
    }

    const fetchUserProfile = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch("/api/user/profile", {
          credentials: "include", // Ensure cookies are sent
        })
        
        if (!response.ok) {
          if (response.status === 401) {
            // User is not authenticated, clear profile
            setUserProfile(null)
            setError("Not authenticated")
          } else {
            throw new Error("Failed to fetch user profile")
          }
          return
        }
        
        const data = await response.json()
        setUserProfile(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
        console.error("Error fetching user profile:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchUserProfile()
  }, [session?.user?.id, status])

  const updateUserProfile = async (updates: Partial<UserProfile>) => {
    try {
      setError(null)
      
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Ensure cookies are sent
        body: JSON.stringify(updates),
      })
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Not authenticated")
        }
        throw new Error("Failed to update user profile")
      }
      
      const updatedProfile = await response.json()
      setUserProfile(updatedProfile)
      return updatedProfile
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      console.error("Error updating user profile:", err)
    }
  }

  return {
    userProfile,
    loading,
    error,
    updateUserProfile,
    isAuthenticated: status === "authenticated" && !!session?.user?.id,
  }
} 