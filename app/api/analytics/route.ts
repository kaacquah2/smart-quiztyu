import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { PrismaClient } from "@/lib/generated/prisma"
import { authOptions } from "@/lib/auth-options"

const prisma = new PrismaClient()

// Minimal interfaces for analytics
interface Submission {
  createdAt: Date;
  quiz: { title: string };
  result?: { score?: number; totalQuestions?: number };
}

interface StudySession {
  date: Date;
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    console.log("Session in analytics API:", session) // Debug log
    
    if (!session?.user?.id) {
      console.log("No session or user ID found in analytics API") // Debug log
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log("User ID from session:", session.user.id) // Debug log

    // First, verify the user exists in the database
    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    })

    if (!user) {
      console.log("User not found in database for ID:", session.user.id) // Debug log
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    console.log("User found in database:", user.id) // Debug log

    const { searchParams } = new URL(request.url)
    const timeRange = searchParams.get("timeRange") || "all"
    const date = searchParams.get("date")

    // Get user's quiz submissions
    const submissions = await prisma.quizSubmission.findMany({
      where: {
        userId: session.user.id,
        ...(timeRange !== "all" && {
          createdAt: {
            gte: getDateRangeFilter(timeRange)
          }
        })
      },
      include: {
        quiz: true,
        result: true
      },
      orderBy: {
        createdAt: "desc"
      }
    }) as Submission[]

    // Get user's study sessions
    const studySessions = await prisma.studySession.findMany({
      where: {
        userId: session.user.id,
        ...(timeRange !== "all" && {
          date: {
            gte: getDateRangeFilter(timeRange)
          }
        })
      },
      orderBy: {
        date: "desc"
      }
    }) as StudySession[]

    // Get user analytics
    const userAnalytics = await prisma.userAnalytics.findUnique({
      where: {
        userId: session.user.id
      }
    })

    // Calculate analytics
    const analytics = {
      averageScore: userAnalytics?.averageScore || 0,
      totalQuizzes: userAnalytics?.totalQuizzes || 0,
      totalQuestions: userAnalytics?.totalQuestions || 0,
      totalStudyHours: userAnalytics?.totalStudyHours || 0,
      improvementRate: userAnalytics?.improvementRate || 0,
      weakAreas: userAnalytics?.weakAreas || [],
      strongAreas: userAnalytics?.strongAreas || [],
      lastUpdated: userAnalytics?.lastUpdated || new Date(),
      isRealTime: true
    }

    // Generate chart data
    const charts = {
      weeklyData: generateWeeklyData(submissions, timeRange),
      courseData: generateCourseData(submissions),
      subjectData: generateSubjectData(submissions),
      topicStrengthData: generateTopicStrengthData(submissions),
      monthlyActivityData: generateMonthlyActivityData(submissions, studySessions, timeRange)
    }

    return NextResponse.json({
      analytics,
      charts
    })
  } catch (error: unknown) {
    console.error("Error fetching analytics:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

function getDateRangeFilter(timeRange: string): Date {
  const now = new Date()
  switch (timeRange) {
    case "week":
      return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    case "month":
      return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    case "quarter":
      return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
    case "year":
      return new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
    default:
      return new Date(0) // All time
  }
}

// Helper functions to generate chart data
function generateWeeklyData(submissions: Submission[], timeRange: string) {
  const weeks = []
  const now = new Date()
  
  for (let i = 0; i < 10; i++) {
    const weekStart = new Date(now.getTime() - (9 - i) * 7 * 24 * 60 * 60 * 1000)
    const weekEnd = new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000)
    
    const weekSubmissions = submissions.filter(sub => 
      sub.createdAt >= weekStart && sub.createdAt < weekEnd
    )
    
    const avgScore = weekSubmissions.length > 0
      ? weekSubmissions.reduce((sum, sub) => sum + (sub.result?.score || 0), 0) / weekSubmissions.length
      : 0
    
    weeks.push({
      name: `Week ${i + 1}`,
      score: Math.round(avgScore),
      avgScore: Math.round(avgScore * 0.8) // Mock average for comparison
    })
  }
  
  return weeks
}

function generateCourseData(submissions: Submission[]) {
  const coursePerformance = submissions.reduce((acc, sub) => {
    const courseName = sub.quiz.title
    if (!acc[courseName]) {
      acc[courseName] = { total: 0, correct: 0, count: 0 }
    }
    acc[courseName].total += sub.result?.totalQuestions || 0
    acc[courseName].correct += sub.result?.score || 0
    acc[courseName].count += 1
    return acc
  }, {} as Record<string, { total: number; correct: number; count: number }>)

  return Object.entries(coursePerformance).map(([name, data]) => ({
    name,
    score: (data as { total: number; correct: number; count: number }).total > 0 ? Math.round(((data as { total: number; correct: number; count: number }).correct / (data as { total: number; correct: number; count: number }).total) * 100) : 0,
    avg: Math.round(((data as { total: number; correct: number; count: number }).correct / (data as { total: number; correct: number; count: number }).total) * 100 * 0.8), // Mock average
    quizzes: (data as { total: number; correct: number; count: number }).count
  }))
}

function generateSubjectData(submissions: Submission[]) {
  const subjects = ["Programming", "Mathematics", "Theory", "Web Dev", "Databases", "Others"]
  const subjectCounts = subjects.map(subject => ({
    name: subject,
    value: Math.floor(Math.random() * 40) + 5, // Mock data for now
    color: getSubjectColor(subject)
  }))
  
  return subjectCounts
}

function generateTopicStrengthData(submissions: Submission[]) {
  const topics = ["Algorithms", "Data Structures", "OOP Concepts", "Web Security", "Database Design", "UI/UX Design", "Machine Learning", "Networking"]
  
  return topics.map(topic => ({
    name: topic,
    score: Math.floor(Math.random() * 40) + 50 // Mock data between 50-90
  }))
}

function generateMonthlyActivityData(submissions: Submission[], studySessions: StudySession[], timeRange: string) {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  
  return months.map((month, index) => ({
    date: month,
    quizzes: Math.floor(Math.random() * 20) + 10,
    resources: Math.floor(Math.random() * 15) + 5
  }))
}

function getSubjectColor(subject: string): string {
  const colors = {
    "Programming": "#3B82F6",
    "Mathematics": "#10B981", 
    "Theory": "#F59E0B",
    "Web Dev": "#8B5CF6",
    "Databases": "#EF4444",
    "Others": "#6B7280"
  }
  return colors[subject as keyof typeof colors] || "#6B7280"
} 