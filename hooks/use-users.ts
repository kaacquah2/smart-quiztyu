import { useState, useEffect, useCallback, useMemo } from "react"
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

interface User {
  id: string
  name: string
  username: string
  avatar: string
  program: string
  year: number
  bio: string
  location: UserLocation
  stats: {
    quizzesTaken: number
    avgScore: number
    studyHours: number
    streak: number
  }
  badges: string[]
  isFollowing: boolean
}

interface UseUsersFilters {
  location?: string
  country?: string
  region?: string
  program?: string
}

export function useUsers(filters: UseUsersFilters = {}) {
  const { data: session, status } = useSession()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Memoize the filters to prevent unnecessary re-renders
  const memoizedFilters = useMemo(() => filters, [
    filters.location,
    filters.country,
    filters.region,
    filters.program
  ])

  const fetchUsers = useCallback(async (filterParams: UseUsersFilters = {}) => {
    try {
      setLoading(true)
      setError(null)
      
      // Build query parameters
      const params = new URLSearchParams()
      if (filterParams.location) params.append('location', filterParams.location)
      if (filterParams.country) params.append('country', filterParams.country)
      if (filterParams.region) params.append('region', filterParams.region)
      if (filterParams.program) params.append('program', filterParams.program)
      
      const response = await fetch(`/api/users/list?${params.toString()}`, {
        credentials: "include",
      })
      
      if (!response.ok) {
        if (response.status === 401) {
          setUsers([])
          setError("Not authenticated")
        } else {
          throw new Error("Failed to fetch users")
        }
        return
      }
      
      const data = await response.json()
      // Ensure data is always an array
      setUsers(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      console.error("Error fetching users:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // Don't fetch if still loading session
    if (status === "loading") {
      setLoading(true)
      return
    }

    // If not authenticated, set loading to false and return
    if (status === "unauthenticated" || !session?.user?.id) {
      setLoading(false)
      setUsers([])
      setError(null)
      return
    }

    fetchUsers(memoizedFilters)
  }, [session?.user?.id, status, fetchUsers, memoizedFilters])

  const toggleFollow = (userId: string) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, isFollowing: !user.isFollowing } : user
    ))
  }

  const refreshUsers = () => {
    fetchUsers(memoizedFilters)
  }

  return {
    users,
    loading,
    error,
    toggleFollow,
    refreshUsers,
    isAuthenticated: status === "authenticated" && !!session?.user?.id,
  }
} 