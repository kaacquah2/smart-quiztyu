import { useState, useEffect, useCallback } from "react"
import { useSession } from "next-auth/react"

interface AnalyticsData {
  averageScore: number
  totalQuizzes: number
  totalQuestions: number
  totalStudyHours: number
  improvementRate: number
  weakAreas: string[]
  strongAreas: string[]
  lastUpdated: string
  isRealTime: boolean
}

interface ChartData {
  weeklyData: any[]
  courseData: any[]
  subjectData: any[]
  topicStrengthData: any[]
  monthlyActivityData: any[]
}

interface UserActivity {
  id?: string
  userId?: string
  activityType: string // 'quiz_completed', 'resource_viewed', 'study_session', 'achievement_earned', 'page_view'
  metadata?: any
  timestamp?: Date
  sessionId?: string
  page?: string
  duration?: number // in seconds
}

interface UseAnalyticsReturn {
  analytics: AnalyticsData | null
  charts: ChartData | null
  userActivity: UserActivity | null
  loading: boolean
  error: string | null
  refreshData: () => Promise<void>
  updateUserActivity: (activity: Partial<UserActivity>) => Promise<void>
}

export function useAnalytics(timeRange: string = "all", date?: Date): UseAnalyticsReturn {
  const { data: session } = useSession()
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [charts, setCharts] = useState<ChartData | null>(null)
  const [userActivity, setUserActivity] = useState<UserActivity | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAnalytics = useCallback(async () => {
    if (!session?.user?.id) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams({
        timeRange,
        ...(date && { date: date.toISOString() })
      })

      const response = await fetch(`/api/analytics?${params}`)
      
      if (!response.ok) {
        throw new Error("Failed to fetch analytics")
      }

      const data = await response.json()
      
      setAnalytics(data.analytics)
      setCharts(data.charts)
      setUserActivity({
        activityType: "page_view",
        page: "/analytics",
        timestamp: new Date()
      })
    } catch (err) {
      console.error("Error fetching analytics:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch analytics")
      
      // Fallback to mock data if API fails
      // setAnalytics({
      //   averageScore: 78,
      //   totalQuizzes: 32,
      //   totalQuestions: 150,
      //   totalStudyHours: 45.5,
      //   improvementRate: 12.5,
      //   weakAreas: ["Database Design", "Machine Learning", "Networking"],
      //   strongAreas: ["Programming", "Web Development", "Algorithms"],
      //   lastUpdated: new Date().toISOString(),
      //   isRealTime: false
      // })
      
      setCharts({
        weeklyData: [
          { name: "Week 1", score: 65, avgScore: 60 },
          { name: "Week 2", score: 70, avgScore: 62 },
          { name: "Week 3", score: 75, avgScore: 65 },
          { name: "Week 4", score: 72, avgScore: 68 },
          { name: "Week 5", score: 78, avgScore: 70 },
          { name: "Week 6", score: 82, avgScore: 72 },
          { name: "Week 7", score: 80, avgScore: 73 },
          { name: "Week 8", score: 85, avgScore: 75 },
          { name: "Week 9", score: 90, avgScore: 78 },
          { name: "Week 10", score: 92, avgScore: 80 }
        ],
        courseData: [
          { name: "Introduction to Computer Science", score: 85, avg: 75, quizzes: 3 },
          { name: "Programming in Python", score: 92, avg: 70, quizzes: 4 },
          { name: "Data Structures", score: 78, avg: 72, quizzes: 2 },
          { name: "Discrete Mathematics", score: 65, avg: 68, quizzes: 3 },
          { name: "Web Development", score: 88, avg: 74, quizzes: 2 }
        ],
        subjectData: [
          { name: "Programming", value: 35, color: "#4f46e5" },
          { name: "Mathematics", value: 20, color: "#0ea5e9" },
          { name: "Theory", value: 15, color: "#10b981" },
          { name: "Web Dev", value: 15, color: "#f59e0b" },
          { name: "Databases", value: 10, color: "#ef4444" },
          { name: "Others", value: 5, color: "#8b5cf6" }
        ],
        topicStrengthData: [
          { name: "Algorithms", score: 90 },
          { name: "Data Structures", score: 85 },
          { name: "OOP Concepts", score: 78 },
          { name: "Web Security", score: 65 },
          { name: "Database Design", score: 72 },
          { name: "UI/UX Design", score: 80 },
          { name: "Machine Learning", score: 60 },
          { name: "Networking", score: 55 }
        ],
        monthlyActivityData: [
          { date: "Jan", quizzes: 10, resources: 5 },
          { date: "Feb", quizzes: 12, resources: 8 },
          { date: "Mar", quizzes: 15, resources: 10 },
          { date: "Apr", quizzes: 14, resources: 12 },
          { date: "May", quizzes: 18, resources: 15 },
          { date: "Jun", quizzes: 20, resources: 18 },
          { date: "Jul", quizzes: 22, resources: 20 },
          { date: "Aug", quizzes: 25, resources: 22 },
          { date: "Sep", quizzes: 28, resources: 25 },
          { date: "Oct", quizzes: 30, resources: 28 },
          { date: "Nov", quizzes: 35, resources: 30 },
          { date: "Dec", quizzes: 40, resources: 35 }
        ]
      })
      
      setUserActivity({
        activityType: "page_view",
        page: "/analytics",
        timestamp: new Date()
      })
    } finally {
      setLoading(false)
    }
  }, [session?.user?.id, timeRange, date])

  const refreshData = useCallback(async () => {
    await fetchAnalytics()
  }, [fetchAnalytics])

  const updateUserActivity = useCallback(async (activity: Partial<UserActivity>) => {
    if (!session?.user?.id) return

    try {
      // Send activity update to server
      await fetch("/api/analytics/activity", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          activityType: activity.activityType || "page_view",
          metadata: activity.metadata || {},
          sessionId: activity.sessionId || null,
          page: activity.page || window.location.pathname,
          duration: activity.duration || null
        })
      })
    } catch (error) {
      console.error("Error updating user activity:", error)
      // Don't throw error as this is not critical
    }
  }, [session?.user?.id])

  // Fetch analytics on mount and when dependencies change
  useEffect(() => {
    fetchAnalytics()
  }, [fetchAnalytics])

  return {
    analytics,
    charts,
    userActivity,
    loading,
    error,
    refreshData,
    updateUserActivity
  }
} 