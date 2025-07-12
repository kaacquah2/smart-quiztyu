"use client"

import type React from "react"
import { useState, useEffect, Suspense, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Search, 
  BookOpen, 
  GraduationCap, 
  BarChart3, 
  Clock, 
  AlertCircle,
  RefreshCw,
  ExternalLink,
  Star,
  TrendingUp,
  Bookmark,
  Target, 
  Award, 
  Calendar,
  CheckCircle,
  XCircle,
  Users,
  Eye,
  Play,
  FileText,
  Globe
} from "lucide-react"
import { useOffline } from "@/hooks/use-offline"
import { ROUTES, API_ROUTES, createQuizRoute } from "@/lib/routes"
import { Label } from "@/components/ui/label"
import type { Program, Year, Semester, Course } from "@/lib/program-service"
import { CourseAutocomplete, CourseSuggestion } from "@/components/course-autocomplete"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ErrorBoundary } from "@/components/error-boundary"
import { useDashboardData, useFilteredQuizzes } from "@/hooks/use-dashboard-data"

// Types
interface Quiz {
  id: string
  title: string
  description: string
  difficulty: string
  timeLimit: number
  tags: string[]
  questionCount: number
  courseId?: string
}

interface Resource {
  id: string
  title: string
  description: string
  url: string
  platform: string
  type: string
  category: string
  tags: string[]
  duration: string
  rating: number
  views?: number
  courseIds: string[]
}

interface DashboardState {
  selectedProgram: string
  selectedYear: string
  selectedSemester: string
  searchQuery: string
  difficultyFilter: string
}

// Stats Cards Component
function StatsCards({ stats }: { stats: any }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Quizzes</CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalQuizzes}</div>
          <p className="text-xs text-muted-foreground">
            {stats.totalQuestions} total questions
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Learning Resources</CardTitle>
          <BookOpen className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalResources}</div>
          <p className="text-xs text-muted-foreground">
            Available for your program
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Programs</CardTitle>
          <GraduationCap className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.programs}</div>
          <p className="text-xs text-muted-foreground">
            {stats.courses} total courses
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Study Time</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">0h</div>
          <p className="text-xs text-muted-foreground">
            This week
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

// Quiz Section Component
function QuizSection({ 
  programs, 
  quizzes, 
  state, 
  onStateChange 
}: { 
  programs: Program[]
  quizzes: Quiz[]
  state: DashboardState
  onStateChange: (updates: Partial<DashboardState>) => void
}) {
  const router = useRouter()

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "beginner":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300"
      case "intermediate":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300"
      case "advanced":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300"
    }
  }

  const handleStartQuiz = (quizId: string) => {
    router.push(createQuizRoute(quizId))
  }

  // Use the custom hook for filtered quizzes
  const filteredQuizzes = useFilteredQuizzes(quizzes, programs, state)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Available Quizzes
        </CardTitle>
        <CardDescription>
          Test your knowledge with interactive quizzes
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Program Selection */}
        <div className="space-y-2">
          <Label htmlFor="program-select">Select Program</Label>
          <Select 
            value={state.selectedProgram} 
            onValueChange={(value) => onStateChange({ selectedProgram: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choose a program" />
            </SelectTrigger>
            <SelectContent>
              {programs?.map((program: Program) => (
                <SelectItem key={program.id} value={program.id}>
                  {program.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Year and Semester Selection */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="year-select">Year</Label>
            <Select 
              value={state.selectedYear} 
              onValueChange={(value) => onStateChange({ selectedYear: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {programs?.find((p: Program) => p.id === state.selectedProgram)?.years.map((year: Year) => (
                  <SelectItem key={year.year} value={year.year.toString()}>
                    Year {year.year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="semester-select">Semester</Label>
            <Select 
              value={state.selectedSemester} 
              onValueChange={(value) => onStateChange({ selectedSemester: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {programs?.find((p: Program) => p.id === state.selectedProgram)?.years
                  .find((y: Year) => y.year.toString() === state.selectedYear)?.semesters.map((semester: Semester) => (
                  <SelectItem key={semester.semester} value={semester.semester.toString()}>
                    Semester {semester.semester}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="space-y-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search quizzes..."
              className="pl-8"
              value={state.searchQuery}
              onChange={(e) => onStateChange({ searchQuery: e.target.value })}
            />
          </div>
          <Select 
            value={state.difficultyFilter} 
            onValueChange={(value) => onStateChange({ difficultyFilter: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Difficulties</SelectItem>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Quiz List */}
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {filteredQuizzes.length > 0 ? (
            filteredQuizzes.map((quiz: Quiz) => (
              <div key={quiz.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex-1">
                  <h4 className="font-medium">{quiz.title}</h4>
                  <p className="text-sm text-muted-foreground">{quiz.description}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className={getDifficultyColor(quiz.difficulty)}>
                      {quiz.difficulty}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {quiz.questionCount} questions • {quiz.timeLimit} min
                    </span>
                  </div>
                </div>
                <Button size="sm" onClick={() => handleStartQuiz(quiz.id)}>
                  Start Quiz
                </Button>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No quizzes found for the selected criteria.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Resources Section Component
function ResourcesSection({ 
  programs, 
  resources, 
  selectedProgram 
}: { 
  programs: Program[]
  resources: Resource[]
  selectedProgram: string
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Recommended Resources
        </CardTitle>
        <CardDescription>
          High-quality learning materials for your program
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            Top resources for {programs?.find((p: Program) => p.id === selectedProgram)?.title}
          </span>
          <Button variant="ghost" size="sm" asChild>
            <a href={`/resources?programId=${selectedProgram}`}>
              View All
            </a>
          </Button>
        </div>

        <div className="space-y-3 max-h-64 overflow-y-auto">
          {resources.length > 0 ? (
            resources.map((resource: Resource) => (
              <div key={resource.id} className="flex items-start gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Star className="h-3 w-3 fill-current" />
                  <span>{resource.rating.toFixed(1)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm truncate">{resource.title}</h4>
                  <p className="text-xs text-muted-foreground line-clamp-2">{resource.description}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">
                      {resource.platform}
                    </Badge>
                    {resource.duration && (
                      <span className="text-xs text-muted-foreground">{resource.duration}</span>
                    )}
                  </div>
                </div>
                <Button size="sm" variant="ghost" asChild>
                  <a href={resource.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </Button>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No resources available for this program.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Loading Skeleton Component
function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <Skeleton className="h-10 w-24" />
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-3 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {[...Array(2)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-32 mb-2" />
              <Skeleton className="h-4 w-64" />
            </CardHeader>
            <CardContent className="space-y-4">
              {[...Array(3)].map((_, j) => (
                <Skeleton key={j} className="h-20 w-full" />
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

// Error Fallback Component
function DashboardErrorFallback({ error, resetError }: { error: Error; resetError: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12">
      <AlertCircle className="h-12 w-12 text-destructive" />
      <h2 className="text-2xl font-bold">Dashboard Error</h2>
      <p className="text-muted-foreground text-center max-w-md">
        {error.message || "An unexpected error occurred while loading the dashboard."}
      </p>
      <div className="flex gap-2">
        <Button onClick={resetError}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Reload Page
        </Button>
      </div>
    </div>
  )
}

// Main Dashboard Content Component
function DashboardContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialProgram = searchParams.get('program') || ""
  
  const [state, setState] = useState<DashboardState>({
    selectedProgram: initialProgram,
    selectedYear: "1",
    selectedSemester: "1",
    searchQuery: "",
    difficultyFilter: "all"
  })

  // Use offline functionality
  const { isOnline, pendingCount } = useOffline()

  // Use enhanced data fetching with custom hook
  const { 
    programs, 
    quizzes, 
    resources, 
    stats, 
    isLoading, 
    hasError, 
    errors, 
    refreshAll 
  } = useDashboardData(state.selectedProgram)

  // Set default program if none selected and programs are available
  useEffect(() => {
    if (!state.selectedProgram && programs && programs.length > 0) {
      setState(prev => ({ ...prev, selectedProgram: programs[0].id }))
    }
  }, [programs, state.selectedProgram])

  // Handler for course selection
  const handleCourseSelect = useCallback((course: CourseSuggestion) => {
    setState(prev => ({
      ...prev,
      selectedProgram: course.programId,
      selectedYear: course.year.toString(),
      selectedSemester: course.semester.toString()
    }))
  }, [])

  // State update handler
  const handleStateChange = useCallback((updates: Partial<DashboardState>) => {
    setState(prev => ({ ...prev, ...updates }))
  }, [])

  // Error handling
  if (hasError) {
    const errorMessages = []
    if (errors.programError) errorMessages.push("Failed to load programs")
    if (errors.quizError) errorMessages.push("Failed to load quizzes")
    if (errors.resourceError) errorMessages.push("Failed to load resources")

    return (
      <>
        <DashboardHeader />
        <main className="flex-grow">
          <DashboardShell>
            <div className="flex flex-col items-center justify-center gap-4 py-12">
              <AlertCircle className="h-12 w-12 text-destructive" />
              <h2 className="text-2xl font-bold">Error Loading Dashboard</h2>
              <div className="text-center">
                {errorMessages.map((msg, i) => (
                  <p key={i} className="text-muted-foreground">{msg}</p>
                ))}
              </div>
              <div className="flex gap-2">
                <Button onClick={refreshAll}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Retry
                </Button>
                <Button variant="outline" onClick={() => window.location.reload()}>
                  Reload Page
                </Button>
              </div>
            </div>
          </DashboardShell>
        </main>
      </>
    )
  }

  // Loading state
  if (isLoading) {
    return (
      <>
        <DashboardHeader />
        <main className="flex-grow">
          <DashboardShell>
            <DashboardSkeleton />
          </DashboardShell>
        </main>
      </>
    )
  }

  // No programs available
  if (!programs || programs.length === 0) {
    return (
      <>
        <DashboardHeader />
        <main className="flex-grow">
          <DashboardShell>
            <div className="flex flex-col items-center justify-center gap-4 py-12">
              <AlertCircle className="h-12 w-12 text-muted-foreground" />
              <h2 className="text-2xl font-bold">No Programs Available</h2>
              <p className="text-muted-foreground">No programs have been configured yet.</p>
            </div>
          </DashboardShell>
        </main>
      </>
    )
  }

  return (
    <>
      <DashboardHeader />
      <main className="flex-grow">
        <DashboardShell>
          <div className="flex flex-col gap-8">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground">Welcome back! Here's an overview of your learning progress.</p>
              </div>
              <div className="flex items-center gap-2">
                {!isOnline && (
                  <Badge variant="destructive" className="flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    Offline
                    {pendingCount > 0 && (
                      <span className="ml-1">({pendingCount} pending)</span>
                    )}
                  </Badge>
                )}
                <Button variant="outline" size="sm" onClick={refreshAll}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </div>

            {/* Offline Alert */}
            {!isOnline && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Offline Mode</AlertTitle>
                <AlertDescription>
                  You're currently offline. Some features may be limited. 
                  {pendingCount > 0 && ` (${pendingCount} items pending sync)`}
                </AlertDescription>
              </Alert>
            )}

            {/* Stats Cards */}
            <StatsCards stats={stats} />

            {/* Quick Actions */}
            <div className="grid gap-6 md:grid-cols-2">
              <QuizSection 
                programs={programs}
                quizzes={quizzes}
                state={state}
                onStateChange={handleStateChange}
              />
              <ResourcesSection 
                programs={programs}
                resources={resources}
                selectedProgram={state.selectedProgram}
              />
            </div>

            {/* Course Autocomplete */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Course Search</CardTitle>
                <CardDescription>
                  Find any course across all programs quickly
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CourseAutocomplete programs={programs} onCourseSelect={handleCourseSelect} />
              </CardContent>
            </Card>
          </div>
        </DashboardShell>
      </main>
    </>
  )
}

// Main Dashboard Page Component with Error Boundary
export default function DashboardPage() {
  return (
    <ErrorBoundary fallback={DashboardErrorFallback}>
      <Suspense fallback={
        <div className="flex flex-col items-center justify-center gap-4 py-12">
          <div className="h-12 w-12 text-muted-foreground animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <h2 className="text-2xl font-bold">Loading Dashboard...</h2>
        </div>
      }>
        <DashboardContent />
      </Suspense>
    </ErrorBoundary>
  )
}
