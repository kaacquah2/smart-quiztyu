"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Search, 
  Filter, 
  BookOpen, 
  GraduationCap, 
  BarChart3, 
  Clock, 
  AlertCircle,
  RefreshCw
} from "lucide-react"
import { programs, getCourseById } from "@/lib/program-data"
import { useOffline } from "@/hooks/use-offline"
import { ROUTES, API_ROUTES, createQuizRoute } from "@/lib/routes"
import { Label } from "@/components/ui/label"
import { TestDropdown } from "@/components/test-dropdown"

interface Quiz {
  id: string
  title: string
  description: string
  difficulty: string
  timeLimit: number
  tags: string[]
  questionCount: number
}

export default function DashboardPage() {
  const router = useRouter()
  const [selectedProgram, setSelectedProgram] = useState("computer-science")
  const [selectedYear, setSelectedYear] = useState("1")
  const [selectedSemester, setSelectedSemester] = useState("1")
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [difficultyFilter, setDifficultyFilter] = useState("all")
  const [stats, setStats] = useState({
    totalQuizzes: 0,
    totalQuestions: 0,
    programs: 0,
    courses: 0
  })

  // Use offline functionality
  const { isOnline, pendingCount } = useOffline()

  // Debug programs data
  useEffect(() => {
    console.log('Programs data loaded:', {
      programsCount: programs.length,
      programs: programs.map(p => ({ id: p.id, title: p.title, years: p.years.length })),
      programsType: typeof programs,
      programsIsArray: Array.isArray(programs),
      firstProgram: programs[0] ? {
        id: programs[0].id,
        title: programs[0].title,
        yearsCount: programs[0].years.length,
        firstYear: programs[0].years[0] ? {
          year: programs[0].years[0].year,
          semestersCount: programs[0].years[0].semesters.length
        } : null
      } : null
    })
  }, [])

  // Debug program selection changes
  useEffect(() => {
    const availableCourseIds = getAvailableCourseIds()
    console.log('Program selection changed:', {
      selectedProgram,
      selectedYear,
      selectedSemester,
      availableCourseIds
    })
  }, [selectedProgram, selectedYear, selectedSemester])

  // Reset year and semester when program changes
  useEffect(() => {
    const program = programs.find(p => p.id === selectedProgram)
    if (program) {
      // Reset to first year if current year doesn't exist in new program
      const yearExists = program.years.some(y => y.year.toString() === selectedYear)
      if (!yearExists) {
        setSelectedYear(program.years[0]?.year.toString() || "1")
      }
      
      // Reset to first semester if current semester doesn't exist in selected year
      const year = program.years.find(y => y.year.toString() === selectedYear)
      if (year) {
        const semesterExists = year.semesters.some(s => s.semester.toString() === selectedSemester)
        if (!semesterExists) {
          setSelectedSemester(year.semesters[0]?.semester.toString() || "1")
        }
      }
    }
  }, [selectedProgram, selectedYear, selectedSemester])

  // Helper function to get all course IDs across all programs (for debugging)
  const getAllCourseIds = () => {
    const allCourseIds: string[] = []
    programs.forEach(program => {
      program.years.forEach(year => {
        year.semesters.forEach(semester => {
          semester.courses.forEach(course => {
            allCourseIds.push(course.id)
          })
        })
      })
    })
    return allCourseIds
  }

  // Get available course IDs for the selected program, year, and semester
  const getAvailableCourseIds = () => {
    const program = programs.find(p => p.id === selectedProgram)
    if (!program) return []
    
    const year = program.years.find(y => y.year.toString() === selectedYear)
    if (!year) return []
    
    const semester = year.semesters.find(s => s.semester.toString() === selectedSemester)
    if (!semester) return []
    
    return semester.courses.map(course => course.id)
  }

  // Fetch quizzes from the database
  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch(API_ROUTES.QUIZZES)
        if (response.ok) {
          const data = await response.json()
          setQuizzes(data)
          setStats({
            totalQuizzes: data.length,
            totalQuestions: data.reduce((sum: number, quiz: Quiz) => sum + quiz.questionCount, 0),
            programs: programs.length,
            courses: programs.reduce((sum, program) => 
              sum + program.years.reduce((yearSum, year) => 
                yearSum + year.semesters.reduce((semesterSum, semester) => 
                  semesterSum + semester.courses.length, 0), 0), 0)
          })
        } else {
          throw new Error('Failed to fetch quizzes')
        }
      } catch (error) {
        console.error('Error fetching quizzes:', error)
        setError(error instanceof Error ? error.message : 'Failed to fetch quizzes')
      } finally {
        setLoading(false)
      }
    }

    fetchQuizzes()
  }, [])

  // Filter quizzes based on search, difficulty, and program selection
  const filteredQuizzes = quizzes.filter(quiz => {
    const matchesSearch = quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         quiz.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         quiz.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    
    // Fix case sensitivity issue with difficulty matching
    const matchesDifficulty = difficultyFilter === "all" || 
                             quiz.difficulty.toLowerCase() === difficultyFilter.toLowerCase()
    
    // Filter by program selection - only show quizzes that match the selected program's courses
    const availableCourseIds = getAvailableCourseIds()
    // Only filter by program if we have valid course IDs, otherwise show all quizzes
    const matchesProgram = availableCourseIds.length > 0 ? availableCourseIds.includes(quiz.id) : true
    
    // Debug logging for quiz filtering
    if (process.env.NODE_ENV === 'development') {
      console.log(`Quiz "${quiz.title}" (${quiz.id}):`, {
        matchesSearch,
        matchesDifficulty,
        matchesProgram,
        availableCourseIds,
        quizDifficulty: quiz.difficulty,
        filterDifficulty: difficultyFilter
      })
    }
    
    return matchesSearch && matchesDifficulty && matchesProgram
  })

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
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

  if (loading) {
    return (
      <>
        <DashboardHeader />
        <main className="flex-grow">
          <DashboardShell>
            <div className="flex flex-col gap-8">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                  <p className="text-muted-foreground">Welcome back! Here's an overview of your learning progress.</p>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {Array(4).fill(0).map((_, i) => (
                  <Card key={i}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                      <div className="h-4 w-4 bg-muted animate-pulse rounded" />
                    </CardHeader>
                    <CardContent>
                      <div className="h-8 w-16 bg-muted animate-pulse rounded mb-2" />
                      <div className="h-4 w-full bg-muted animate-pulse rounded" />
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {Array(6).fill(0).map((_, i) => (
                  <Card key={i}>
                    <CardHeader>
                      <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                      <div className="h-3 w-48 bg-muted animate-pulse rounded" />
                    </CardHeader>
                    <CardContent>
                      <div className="h-20 w-full bg-muted animate-pulse rounded" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </DashboardShell>
        </main>
      </>
    )
  }

  if (error) {
    return (
      <>
        <DashboardHeader />
        <main className="flex-grow">
          <DashboardShell>
            <div className="flex flex-col items-center justify-center gap-4 py-12">
              <AlertCircle className="h-12 w-12 text-destructive" />
              <h2 className="text-2xl font-bold">Error Loading Dashboard</h2>
              <p className="text-muted-foreground">{error}</p>
              <Button onClick={() => window.location.reload()}>Try Again</Button>
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
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground">Welcome back! Here's an overview of your learning progress.</p>
              </div>
              {!isOnline && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <AlertCircle className="h-4 w-4" />
                  Offline mode {pendingCount > 0 && `(${pendingCount} pending)`}
                </div>
              )}
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Quizzes</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalQuizzes}</div>
                  <p className="text-xs text-muted-foreground">Available quizzes</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Program Quizzes</CardTitle>
                  <GraduationCap className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{filteredQuizzes.length}</div>
                  <p className="text-xs text-muted-foreground">For your program</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Questions</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalQuestions}</div>
                  <p className="text-xs text-muted-foreground">Across all quizzes</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.courses}</div>
                  <p className="text-xs text-muted-foreground">Available courses</p>
                </CardContent>
              </Card>
            </div>

            {/* Program Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Program Selection</CardTitle>
                <CardDescription>
                  Select your program, year, and semester to see relevant quizzes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TestDropdown />
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="program">Program</Label>
                    <Select value={selectedProgram} onValueChange={setSelectedProgram}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select program" />
                      </SelectTrigger>
                      <SelectContent>
                        {programs && programs.length > 0 ? (
                          programs.map((program) => (
                            <SelectItem key={program.id} value={program.id}>
                              {program.title}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="computer-science" disabled>
                            Loading programs...
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="year">Year</Label>
                    <Select value={selectedYear} onValueChange={setSelectedYear}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select year" />
                      </SelectTrigger>
                      <SelectContent>
                        {(() => {
                          const currentProgram = programs.find(p => p.id === selectedProgram)
                          const years = currentProgram?.years || []
                          return years.length > 0 ? (
                            years.map((year) => (
                              <SelectItem key={year.year} value={year.year.toString()}>
                                Year {year.year}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="1" disabled>
                              No years available
                            </SelectItem>
                          )
                        })()}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="semester">Semester</Label>
                    <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select semester" />
                      </SelectTrigger>
                      <SelectContent>
                        {(() => {
                          const currentProgram = programs.find(p => p.id === selectedProgram)
                          const currentYear = currentProgram?.years.find(y => y.year.toString() === selectedYear)
                          const semesters = currentYear?.semesters || []
                          return semesters.length > 0 ? (
                            semesters.map((semester) => (
                              <SelectItem key={semester.semester} value={semester.semester.toString()}>
                                Semester {semester.semester}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="1" disabled>
                              No semesters available
                            </SelectItem>
                          )
                        })()}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {/* Show available courses for debugging */}
                {process.env.NODE_ENV === 'development' && (
                  <div className="mt-4 p-3 bg-muted rounded-md">
                    <p className="text-sm font-medium mb-2">Debug Information:</p>
                    <div className="text-xs text-muted-foreground space-y-2">
                      <div>
                        <strong>Programs loaded:</strong> {programs.length}
                      </div>
                      <div>
                        <strong>Selected Program:</strong> {selectedProgram}
                      </div>
                      <div>
                        <strong>Selected Year:</strong> {selectedYear}
                      </div>
                      <div>
                        <strong>Selected Semester:</strong> {selectedSemester}
                      </div>
                      <div>
                        <strong>Current Program Years:</strong> {programs.find(p => p.id === selectedProgram)?.years.length || 0}
                      </div>
                      <div>
                        <strong>Current Year Semesters:</strong> {programs.find(p => p.id === selectedProgram)?.years.find(y => y.year.toString() === selectedYear)?.semesters.length || 0}
                      </div>
                      <div>
                        <strong>Available Courses:</strong> {getAvailableCourseIds().length}
                      </div>
                      {getAvailableCourseIds().length > 0 ? (
                        <div>
                          <strong>Course IDs:</strong>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {getAvailableCourseIds().map(courseId => (
                              <Badge key={courseId} variant="outline" className="text-xs">
                                {courseId}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <p className="text-red-500">No courses found for the selected program/year/semester</p>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Search and Filter */}
            <Card>
              <CardHeader>
                <CardTitle>Available Quizzes</CardTitle>
                <CardDescription>
                  Find and take quizzes for your selected program
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        placeholder="Search quizzes..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Levels</SelectItem>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Quiz Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {filteredQuizzes.map((quiz) => (
                    <Card key={quiz.id} className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-lg">{quiz.title}</CardTitle>
                          <Badge className={getDifficultyColor(quiz.difficulty)}>
                            {quiz.difficulty}
                          </Badge>
                        </div>
                        <CardDescription className="line-clamp-2">
                          {quiz.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                          <span>{quiz.questionCount} questions</span>
                          <span>{quiz.timeLimit} min</span>
                        </div>
                        <div className="flex flex-wrap gap-1 mb-4">
                          {quiz.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {quiz.tags.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{quiz.tags.length - 3} more
                            </Badge>
                          )}
                        </div>
                        <Button 
                          onClick={() => handleStartQuiz(quiz.id)} 
                          className="w-full"
                        >
                          Start Quiz
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Filter Summary */}
                <div className="mt-4 p-3 bg-muted rounded-md">
                  <p className="text-sm text-muted-foreground">
                    Showing {filteredQuizzes.length} of {quizzes.length} total quizzes
                    {searchQuery && ` matching "${searchQuery}"`}
                    {difficultyFilter !== "all" && ` with ${difficultyFilter} difficulty`}
                    {getAvailableCourseIds().length > 0 && ` for ${selectedProgram} Year ${selectedYear} Semester ${selectedSemester}`}
                  </p>
                </div>

                {filteredQuizzes.length === 0 && (
                  <div className="text-center py-8">
                    <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No quizzes found</h3>
                    <p className="text-muted-foreground">
                      Try adjusting your search or program selection
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </DashboardShell>
      </main>
    </>
  )
}
