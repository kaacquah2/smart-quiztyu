import { useState, useEffect, useCallback } from "react"
import { useSession } from "next-auth/react"

interface SocialActivity {
  id: string
  type: string
  user: {
    id: string
    name: string
    username: string
    avatar: string | null
  }
  content: any
  timestamp: string
  likes: number
  comments: number
  isRealTime: boolean
  isNew: boolean
}

interface LeaderboardEntry {
  id: string
  rank: number
  user: {
    id: string
    name: string
    username: string
    avatar: string | null
    program: string
  }
  score: number
  quizzesTaken: number
  avgScore: number
}

interface StudyGroup {
  id: string
  name: string
  description: string | null
  members: number
  category: string
  isJoined: boolean
  avatar: string | null
  recentActivity: string
}

interface UseSocialReturn {
  activities: SocialActivity[]
  leaderboard: LeaderboardEntry[]
  studyGroups: StudyGroup[]
  loading: boolean
  error: string | null
  refreshData: () => Promise<void>
  likeActivity: (activityId: string) => Promise<void>
  createActivity: (type: string, content: any) => Promise<void>
  toggleJoinGroup: (groupId: string) => Promise<void>
}

export function useSocial(filter: string = "all", limit: number = 20): UseSocialReturn {
  const { data: session } = useSession()
  const [activities, setActivities] = useState<SocialActivity[]>([])
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [studyGroups, setStudyGroups] = useState<StudyGroup[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSocialData = useCallback(async () => {
    if (!session?.user?.id) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams({
        filter,
        limit: limit.toString()
      })

      const response = await fetch(`/api/social?${params}`)
      
      if (!response.ok) {
        throw new Error("Failed to fetch social data")
      }

      const data = await response.json()
      
      setActivities(data.activities)
      setLeaderboard(data.leaderboard)
      setStudyGroups(data.studyGroups)
    } catch (err) {
      console.error("Error fetching social data:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch social data")
    } finally {
      setLoading(false)
    }
  }, [session?.user?.id, filter, limit])

  const refreshData = useCallback(async () => {
    await fetchSocialData()
  }, [fetchSocialData])

  const likeActivity = useCallback(async (activityId: string) => {
    try {
      // Optimistic update
      setActivities(prev => prev.map(activity => 
        activity.id === activityId ? { ...activity, likes: activity.likes + 1 } : activity
      ))

      // Send like to server
      await fetch(`/api/social/activity/${activityId}/like`, {
        method: "POST"
      })
    } catch (error) {
      console.error("Error liking activity:", error)
      // Revert optimistic update on error
      setActivities(prev => prev.map(activity => 
        activity.id === activityId ? { ...activity, likes: activity.likes - 1 } : activity
      ))
    }
  }, [])

  const createActivity = useCallback(async (type: string, content: any) => {
    if (!session?.user?.id) return

    try {
      const response = await fetch("/api/social", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          type,
          content,
          isPublic: true
        })
      })

      if (!response.ok) {
        throw new Error("Failed to create activity")
      }

      const newActivity = await response.json()
      
      // Add new activity to the beginning of the list
      setActivities(prev => [newActivity, ...prev])
    } catch (error) {
      console.error("Error creating activity:", error)
      throw error
    }
  }, [session?.user?.id])

  const toggleJoinGroup = useCallback(async (groupId: string) => {
    try {
      // Optimistic update
      setStudyGroups(prev => prev.map(group => 
        group.id === groupId ? { ...group, isJoined: !group.isJoined } : group
      ))

      // Send join/leave request to server
      const group = studyGroups.find(g => g.id === groupId)
      const isJoining = !group?.isJoined

      await fetch(`/api/social/groups/${groupId}/${isJoining ? 'join' : 'leave'}`, {
        method: "POST"
      })
    } catch (error) {
      console.error("Error toggling group membership:", error)
      // Revert optimistic update on error
      setStudyGroups(prev => prev.map(group => 
        group.id === groupId ? { ...group, isJoined: !group.isJoined } : group
      ))
    }
  }, [studyGroups])

  // Fetch social data on mount and when dependencies change
  useEffect(() => {
    fetchSocialData()
  }, [fetchSocialData])

  return {
    activities,
    leaderboard,
    studyGroups,
    loading,
    error,
    refreshData,
    likeActivity,
    createActivity,
    toggleJoinGroup
  }
} 