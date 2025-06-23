"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Video, FileText, Lightbulb, ExternalLink, Code, GraduationCap, Clock, Star, TrendingUp } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { programs } from "@/lib/program-data"
import { generateAIRecommendations, getResourcesForCourse } from "@/lib/resource-service"
import { Skeleton } from "@/components/ui/skeleton"

interface AIRecommendationsProps {
  userId?: string
  selectedProgram?: string
  selectedYear?: string
  selectedSemester?: string
}

interface CourseRecommendation {
  courseId: string
  courseTitle: string
  programTitle: string
  year: number
  semester: number
  recommendations: any[]
  performance?: {
    score: number
    total: number
    percentage: number
  }
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  priority: number
}

export function AIRecommendations({ 
  userId = "user123", 
  selectedProgram = "all",
  selectedYear = "all",
  selectedSemester = "all"
}: AIRecommendationsProps) {
  const [courseRecommendations, setCourseRecommendations] = useState<CourseRecommendation[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("all-courses")
  const [userQuizHistory, setUserQuizHistory] = useState<any[]>([])

  // Get all courses from all programs
  const getAllCourses = () => {
    return programs.flatMap(program => 
      program.years.flatMap(year => 
        year.semesters.flatMap(semester => 
          semester.courses.map(course => ({
            ...course,
            programId: program.id,
            programTitle: program.title,
            year: year.year,
            semester: semester.semester
          }))
        )
      )
    )
  }

  // Filter courses based on selected program, year, and semester
  const getFilteredCourses = () => {
    const allCourses = getAllCourses()
    
    return allCourses.filter(course => {
      const matchesProgram = selectedProgram === "all" || course.programId === selectedProgram
      const matchesYear = selectedYear === "all" || course.year === parseInt(selectedYear)
      const matchesSemester = selectedSemester === "all" || course.semester === parseInt(selectedSemester)
      
      return matchesProgram && matchesYear && matchesSemester
    })
  }

  // Fetch user's quiz history (simulated for now)
  // const mockQuizHistory = [ ... ];
  // setUserQuizHistory(mockQuizHistory)
  // return mockQuizHistory

  // Generate recommendations for all courses
  const generateCourseRecommendations = async () => {
    setLoading(true)
    setError(null)

    try {
      const quizHistory = userQuizHistory
      const filteredCourses = getFilteredCourses()
      const recommendations: CourseRecommendation[] = []

      for (const course of filteredCourses) {
        // Find quiz results for this course
        const courseQuizResults = quizHistory.filter((quiz: any) => quiz.courseId === course.id)
        
        // Calculate average performance for this course
        let performance: { score: number; total: number; percentage: number } | undefined = undefined
        if (courseQuizResults.length > 0) {
          const totalScore = courseQuizResults.reduce((sum, quiz) => sum + quiz.score, 0)
          const totalQuestions = courseQuizResults.reduce((sum, quiz) => sum + quiz.total, 0)
          const percentage = (totalScore / totalQuestions) * 100
          
          performance = {
            score: totalScore,
            total: totalQuestions,
            percentage: Math.round(percentage)
          }
        }

        // Generate AI recommendations for this course
        let courseRecommendations = []
        if (performance) {
          // Use the existing AI recommendation service
          courseRecommendations = await generateAIRecommendations(
            courseQuizResults[0]?.quizId || course.id,
            performance.score,
            performance.total
          )
        } else {
          // Generate general recommendations for courses without quiz history
          const resources = getResourcesForCourse(course.id)
          courseRecommendations = resources
            .sort((a, b) => b.rating - a.rating)
            .slice(0, 3)
            .map((resource, index) => ({
              ...resource,
              reason: `This highly-rated ${resource.type} is perfect for learning ${course.title}.`,
              priority: 5 - index
            }))
        }

        // Determine difficulty and priority
        let difficulty: 'beginner' | 'intermediate' | 'advanced' = 'intermediate'
        let priority = 3

        if (performance) {
          if (performance.percentage < 40) {
            difficulty = 'beginner'
            priority = 5 // High priority for struggling courses
          } else if (performance.percentage > 80) {
            difficulty = 'advanced'
            priority = 2 // Lower priority for well-performing courses
          }
        } else {
          // For courses without quiz history, prioritize by year
          if (course.year === 1) {
            difficulty = 'beginner'
            priority = 4
          } else if (course.year >= 3) {
            difficulty = 'advanced'
            priority = 2
          }
        }

        recommendations.push({
          courseId: course.id,
          courseTitle: course.title,
          programTitle: course.programTitle,
          year: course.year,
          semester: course.semester,
          recommendations: courseRecommendations,
          performance,
          difficulty,
          priority
        })
      }

      // Sort by priority (struggling courses first, then by year)
      recommendations.sort((a, b) => {
        if (a.priority !== b.priority) {
          return b.priority - a.priority
        }
        return a.year - b.year
      })

      setCourseRecommendations(recommendations)
    } catch (err) {
      console.error("Error generating course recommendations:", err)
      setError("Failed to generate recommendations. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    generateCourseRecommendations()
  }, [selectedProgram, selectedYear, selectedSemester])

  const getResourceIcon = (type: string) => {
    const lowerType = type.toLowerCase()
    if (lowerType.includes("video")) return <Video className="h-4 w-4" />
    if (lowerType.includes("article")) return <FileText className="h-4 w-4" />
    if (lowerType.includes("course")) return <BookOpen className="h-4 w-4" />
    if (lowerType.includes("practice")) return <Code className="h-4 w-4" />
    return <Lightbulb className="h-4 w-4" />
  }

  const getDifficultyColor = (difficulty: string) => {
    const lower = difficulty.toLowerCase()
    if (lower.includes("beginner")) return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300"
    if (lower.includes("advanced")) return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300"
    return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300" // intermediate
  }

  const getPerformanceColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-600 dark:text-green-400"
    if (percentage >= 60) return "text-yellow-600 dark:text-yellow-400"
    return "text-red-600 dark:text-red-400"
  }

  const getPerformanceIcon = (percentage: number) => {
    if (percentage >= 80) return <TrendingUp className="h-4 w-4 text-green-600" />
    if (percentage >= 60) return <Clock className="h-4 w-4 text-yellow-600" />
    return <Lightbulb className="h-4 w-4 text-red-600" />
  }

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>AI-Powered Learning Recommendations</CardTitle>
          <CardDescription>
            Personalized recommendations based on your quiz performance and learning patterns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>AI-Powered Learning Recommendations</CardTitle>
          <CardDescription>
            Personalized recommendations based on your quiz performance and learning patterns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">{error}</p>
            <Button 
              onClick={generateCourseRecommendations} 
              className="mt-4"
              variant="outline"
            >
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>AI-Powered Learning Recommendations</CardTitle>
        <CardDescription>
          Personalized recommendations based on your quiz performance and learning patterns across all courses
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all-courses" className="space-y-4" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 w-full gap-2 p-2">
            <TabsTrigger value="all-courses" className="px-4 py-2 text-sm">All Courses</TabsTrigger>
            <TabsTrigger value="struggling" className="px-4 py-2 text-sm">Need Help</TabsTrigger>
            <TabsTrigger value="excellent" className="px-4 py-2 text-sm">Excelling</TabsTrigger>
            <TabsTrigger value="new" className="px-4 py-2 text-sm">New Topics</TabsTrigger>
          </TabsList>

          <TabsContent value="all-courses" className="space-y-4">
            {courseRecommendations.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No courses found matching your criteria.</p>
              </div>
            ) : (
              courseRecommendations.map((courseRec) => (
                <div key={courseRec.courseId} className="rounded-lg border p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="h-5 w-5 text-primary" />
                      <div>
                        <h3 className="font-medium">{courseRec.courseTitle}</h3>
                        <p className="text-sm text-muted-foreground">
                          {courseRec.programTitle} • Year {courseRec.year}, Semester {courseRec.semester}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {courseRec.performance && (
                        <div className="flex items-center gap-1">
                          {getPerformanceIcon(courseRec.performance.percentage)}
                          <span className={`text-sm font-medium ${getPerformanceColor(courseRec.performance.percentage)}`}>
                            {courseRec.performance.percentage}%
                          </span>
                        </div>
                      )}
                      <Badge variant="outline" className={getDifficultyColor(courseRec.difficulty)}>
                        {courseRec.difficulty}
                      </Badge>
                    </div>
                  </div>

                  {courseRec.recommendations.length > 0 ? (
                    <div className="space-y-3">
                      {courseRec.recommendations.slice(0, 2).map((rec, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                          {getResourceIcon(rec.type)}
                          <div className="flex-1">
                            <p className="font-medium text-sm">{rec.title}</p>
                            <p className="text-xs text-muted-foreground">{rec.description}</p>
                            {rec.reason && (
                              <p className="text-xs text-primary mt-1">{rec.reason}</p>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            {rec.rating && (
                              <div className="flex items-center gap-1">
                                <Star className="h-3 w-3 text-yellow-500 fill-current" />
                                <span className="text-xs">{rec.rating}</span>
                              </div>
                            )}
                            <Button size="sm" variant="outline" asChild>
                              <a href={rec.url} target="_blank" rel="noopener noreferrer">
                                View
                              </a>
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No specific recommendations available for this course yet.
                    </p>
                  )}
                </div>
              ))
            )}
          </TabsContent>

          <TabsContent value="struggling" className="space-y-4">
            {courseRecommendations
              .filter(course => course.performance && course.performance.percentage < 60)
              .map((courseRec) => (
                <div key={courseRec.courseId} className="rounded-lg border p-4 border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-950/20">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Lightbulb className="h-5 w-5 text-red-600" />
                      <div>
                        <h3 className="font-medium">{courseRec.courseTitle}</h3>
                        <p className="text-sm text-muted-foreground">
                          {courseRec.programTitle} • Year {courseRec.year}, Semester {courseRec.semester}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {courseRec.performance && (
                        <div className="flex items-center gap-1">
                          {getPerformanceIcon(courseRec.performance.percentage)}
                          <span className={`text-sm font-medium ${getPerformanceColor(courseRec.performance.percentage)}`}>
                            {courseRec.performance.percentage}%
                          </span>
                        </div>
                      )}
                      <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300">
                        Needs Help
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {courseRec.recommendations.slice(0, 3).map((rec, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg border">
                        {getResourceIcon(rec.type)}
                        <div className="flex-1">
                          <p className="font-medium text-sm">{rec.title}</p>
                          <p className="text-xs text-muted-foreground">{rec.description}</p>
                          {rec.reason && (
                            <p className="text-xs text-red-600 dark:text-red-400 mt-1">{rec.reason}</p>
                          )}
                        </div>
                        <Button size="sm" variant="outline" asChild>
                          <a href={rec.url} target="_blank" rel="noopener noreferrer">
                            Study
                          </a>
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
          </TabsContent>

          <TabsContent value="excellent" className="space-y-4">
            {courseRecommendations
              .filter(course => course.performance && course.performance.percentage >= 80)
              .map((courseRec) => (
                <div key={courseRec.courseId} className="rounded-lg border p-4 border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/20">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                      <div>
                        <h3 className="font-medium">{courseRec.courseTitle}</h3>
                        <p className="text-sm text-muted-foreground">
                          {courseRec.programTitle} • Year {courseRec.year}, Semester {courseRec.semester}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {courseRec.performance && (
                        <div className="flex items-center gap-1">
                          {getPerformanceIcon(courseRec.performance.percentage)}
                          <span className={`text-sm font-medium ${getPerformanceColor(courseRec.performance.percentage)}`}>
                            {courseRec.performance.percentage}%
                          </span>
                        </div>
                      )}
                      <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300">
                        Excelling
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {courseRec.recommendations.slice(0, 2).map((rec, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg border">
                        {getResourceIcon(rec.type)}
                        <div className="flex-1">
                          <p className="font-medium text-sm">{rec.title}</p>
                          <p className="text-xs text-muted-foreground">{rec.description}</p>
                          {rec.reason && (
                            <p className="text-xs text-green-600 dark:text-green-400 mt-1">{rec.reason}</p>
                          )}
                        </div>
                        <Button size="sm" variant="outline" asChild>
                          <a href={rec.url} target="_blank" rel="noopener noreferrer">
                            Explore
                          </a>
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
          </TabsContent>

          <TabsContent value="new" className="space-y-4">
            {courseRecommendations
              .filter(course => !course.performance) // Courses without quiz history
              .map((courseRec) => (
                <div key={courseRec.courseId} className="rounded-lg border p-4 border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/20">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-blue-600" />
                      <div>
                        <h3 className="font-medium">{courseRec.courseTitle}</h3>
                        <p className="text-sm text-muted-foreground">
                          {courseRec.programTitle} • Year {courseRec.year}, Semester {courseRec.semester}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
                        New Topic
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {courseRec.recommendations.slice(0, 2).map((rec, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg border">
                        {getResourceIcon(rec.type)}
                        <div className="flex-1">
                          <p className="font-medium text-sm">{rec.title}</p>
                          <p className="text-xs text-muted-foreground">{rec.description}</p>
                          {rec.reason && (
                            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">{rec.reason}</p>
                          )}
                        </div>
                        <Button size="sm" variant="outline" asChild>
                          <a href={rec.url} target="_blank" rel="noopener noreferrer">
                            Start Learning
                          </a>
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">
          <ExternalLink className="mr-2 h-4 w-4" />
          View All {activeTab.charAt(0).toUpperCase() + activeTab.slice(1).replace('-', ' ')}
        </Button>
      </CardFooter>
    </Card>
  )
}
