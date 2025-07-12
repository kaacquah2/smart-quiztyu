"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { 
  BookOpen, 
  Clock, 
  BarChart3, 
  Search, 
  Filter,
  Play,
  Star,
  TrendingUp,
  Target,
  Award
} from "lucide-react"
import useSWR from "swr"
import { ROUTES, createQuizRoute } from "@/lib/routes"
import { useRouter } from "next/navigation"

const fetcher = (url: string) => fetch(url).then(res => res.json())

interface Quiz {
  id: string
  title: string
  description: string
  difficulty: string
  timeLimit: number
  tags: string[]
  questionCount: number
  courseId?: string
  programId?: string
}

interface Program {
  id: string
  title: string
  years: any[]
}

export default function QuizzesPage() {
  const router = useRouter()
  const { data: quizzesResponse, error: quizzesError, isLoading: quizzesLoading } = useSWR<{quizzes: Quiz[], pagination: any}>("/api/quizzes", fetcher)
  const { data: programs, error: programsError, isLoading: programsLoading } = useSWR<Program[]>("/api/programs", fetcher)
  
  const [searchQuery, setSearchQuery] = useState("")
  const [difficultyFilter, setDifficultyFilter] = useState("all")
  const [programFilter, setProgramFilter] = useState("all")
  const [timeFilter, setTimeFilter] = useState("all")
  const [sortBy, setSortBy] = useState("title")

  const isLoading = quizzesLoading || programsLoading
  const error = quizzesError || programsError

  // Extract quizzes array from response
  const quizzes = quizzesResponse?.quizzes || []

  if (isLoading) {
    return (
      <>
        <DashboardHeader />
        <DashboardShell>
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Loading quizzes...</p>
          </div>
        </DashboardShell>
      </>
    )
  }

  if (error) {
    return (
      <>
        <DashboardHeader />
        <DashboardShell>
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Error loading quizzes. Please try again.</p>
          </div>
        </DashboardShell>
      </>
    )
  }

  if (!quizzesResponse || !programs) return null

  // Filter quizzes based on search and filters
  const filteredQuizzes = quizzes.filter((quiz) => {
    const matchesSearch = quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         quiz.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         quiz.tags.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesDifficulty = difficultyFilter === "all" || 
                             quiz.difficulty.toLowerCase() === difficultyFilter.toLowerCase()
    
    const matchesProgram = programFilter === "all" || 
                          quiz.programId === programFilter
    
    const matchesTime = timeFilter === "all" || 
                       (timeFilter === "short" && quiz.timeLimit <= 15) ||
                       (timeFilter === "medium" && quiz.timeLimit > 15 && quiz.timeLimit <= 30) ||
                       (timeFilter === "long" && quiz.timeLimit > 30)
    
    return matchesSearch && matchesDifficulty && matchesProgram && matchesTime
  })

  // Sort quizzes
  const sortedQuizzes = [...filteredQuizzes].sort((a, b) => {
    switch (sortBy) {
      case "title":
        return a.title.localeCompare(b.title)
      case "difficulty":
        const difficultyOrder = { "beginner": 1, "intermediate": 2, "advanced": 3 }
        return difficultyOrder[a.difficulty as keyof typeof difficultyOrder] - difficultyOrder[b.difficulty as keyof typeof difficultyOrder]
      case "time":
        return a.timeLimit - b.timeLimit
      case "questions":
        return a.questionCount - b.questionCount
      default:
        return 0
    }
  })

  // Categorize quizzes by difficulty (case-insensitive)
  const quizCategories = {
    "beginner": sortedQuizzes.filter(q => q.difficulty.toLowerCase() === "beginner"),
    "intermediate": sortedQuizzes.filter(q => q.difficulty.toLowerCase() === "intermediate"),
    "advanced": sortedQuizzes.filter(q => q.difficulty.toLowerCase() === "advanced")
  }

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

  // Calculate statistics
  const stats = {
    totalQuizzes: quizzes.length,
    totalQuestions: quizzes.reduce((sum, quiz) => sum + quiz.questionCount, 0),
    averageTime: quizzes.length > 0 ? Math.round(quizzes.reduce((sum, quiz) => sum + quiz.timeLimit, 0) / quizzes.length) : 0,
    beginnerCount: quizzes.filter(q => q.difficulty === "beginner").length,
    intermediateCount: quizzes.filter(q => q.difficulty === "intermediate").length,
    advancedCount: quizzes.filter(q => q.difficulty === "advanced").length,
  }

  return (
    <>
      <DashboardHeader />
      <DashboardShell>
        <div className="flex flex-col gap-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Quizzes</h1>
            <p className="text-muted-foreground">Test your knowledge with interactive quizzes across all programs.</p>
          </div>

          {/* Statistics Cards */}
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
                <CardTitle className="text-sm font-medium">Average Time</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.averageTime} min</div>
                <p className="text-xs text-muted-foreground">
                  Per quiz
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Beginner</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.beginnerCount}</div>
                <p className="text-xs text-muted-foreground">
                  Easy quizzes
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Advanced</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.advancedCount}</div>
                <p className="text-xs text-muted-foreground">
                  Challenging quizzes
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Search & Filter Quizzes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                <div className="space-y-2">
                  <Label htmlFor="search">Search</Label>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="search"
                      placeholder="Search quizzes..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="difficulty">Difficulty</Label>
                  <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All difficulties" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Difficulties</SelectItem>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="program">Program</Label>
                  <Select value={programFilter} onValueChange={setProgramFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All programs" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Programs</SelectItem>
                      {programs.map((program) => (
                        <SelectItem key={program.id} value={program.id}>
                          {program.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Time</Label>
                  <Select value={timeFilter} onValueChange={setTimeFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Any time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any Time</SelectItem>
                      <SelectItem value="short">Short (≤15 min)</SelectItem>
                      <SelectItem value="medium">Medium (16-30 min)</SelectItem>
                      <SelectItem value="long">Long (&gt;30 min)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sort">Sort By</Label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="title">Title</SelectItem>
                      <SelectItem value="difficulty">Difficulty</SelectItem>
                      <SelectItem value="time">Time</SelectItem>
                      <SelectItem value="questions">Questions</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quiz Categories */}
          <Tabs defaultValue="all" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4 gap-2 p-2">
              <TabsTrigger value="all" className="px-4 py-2 text-sm">
                All Quizzes ({sortedQuizzes.length})
              </TabsTrigger>
              <TabsTrigger value="beginner" className="px-4 py-2 text-sm">
                Beginner ({quizCategories.beginner.length})
              </TabsTrigger>
              <TabsTrigger value="intermediate" className="px-4 py-2 text-sm">
                Intermediate ({quizCategories.intermediate.length})
              </TabsTrigger>
              <TabsTrigger value="advanced" className="px-4 py-2 text-sm">
                Advanced ({quizCategories.advanced.length})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {sortedQuizzes.map((quiz) => (
                  <Card key={quiz.id} className="h-full hover:bg-muted/50 transition-colors">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        {quiz.title}
                        <Badge className={getDifficultyColor(quiz.difficulty)}>
                          {quiz.difficulty}
                        </Badge>
                      </CardTitle>
                      <CardDescription>
                        {quiz.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <BarChart3 className="h-3 w-3" />
                          <span>{quiz.questionCount} questions</span>
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>{quiz.timeLimit} min</span>
                        </div>
                      </div>
                      {quiz.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {quiz.tags.slice(0, 3).map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {quiz.tags.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{quiz.tags.length - 3} more
                            </Badge>
                          )}
                        </div>
                      )}
                    </CardContent>
                    <CardFooter>
                      <Button onClick={() => handleStartQuiz(quiz.id)} className="w-full">
                        <Play className="h-4 w-4 mr-2" />
                        Start Quiz
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {Object.entries(quizCategories).map(([difficulty, categoryQuizzes]) => (
              <TabsContent key={difficulty} value={difficulty} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {categoryQuizzes.map((quiz) => (
                    <Card key={quiz.id} className="h-full hover:bg-muted/50 transition-colors">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          {quiz.title}
                          <Badge className={getDifficultyColor(quiz.difficulty)}>
                            {quiz.difficulty}
                          </Badge>
                        </CardTitle>
                        <CardDescription>
                          {quiz.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <BarChart3 className="h-3 w-3" />
                            <span>{quiz.questionCount} questions</span>
                          </div>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>{quiz.timeLimit} min</span>
                          </div>
                        </div>
                        {quiz.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {quiz.tags.slice(0, 3).map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                            {quiz.tags.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{quiz.tags.length - 3} more
                              </Badge>
                            )}
                          </div>
                        )}
                      </CardContent>
                      <CardFooter>
                        <Button onClick={() => handleStartQuiz(quiz.id)} className="w-full">
                          <Play className="h-4 w-4 mr-2" />
                          Start Quiz
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>

          {sortedQuizzes.length === 0 && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No quizzes found</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Try adjusting your search criteria or filters to find more quizzes.
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchQuery("")
                    setDifficultyFilter("all")
                    setProgramFilter("all")
                    setTimeFilter("all")
                  }}
                >
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </DashboardShell>
    </>
  )
} 