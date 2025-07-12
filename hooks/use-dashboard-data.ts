import { useMemo, useCallback } from 'react'
import useSWR from 'swr'
import type { Program, Year, Semester, Course } from '@/lib/program-service'

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
  createdAt?: string
  updatedAt?: string
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

interface DashboardStats {
  totalQuizzes: number
  totalQuestions: number
  totalResources: number
  programs: number
  courses: number
}

interface DashboardData {
  programs: Program[]
  quizzes: Quiz[]
  resources: Resource[]
  stats: DashboardStats
  isLoading: boolean
  hasError: boolean
  errors: {
    programError: any
    quizError: any
    resourceError: any
  }
  refreshAll: () => void
}

// Enhanced fetcher with retry logic and error handling
const enhancedFetcher = async (url: string) => {
  const maxRetries = 3
  let lastError: Error | null = null

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      })
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      const data = await response.json()
      
      // Handle paginated responses
      if (data.quizzes && Array.isArray(data.quizzes)) {
        return data.quizzes
      }
      
      if (data.resources && Array.isArray(data.resources)) {
        return data.resources
      }
      
      return data
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error')
      
      if (attempt === maxRetries) {
        throw lastError
      }
      
      // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000))
    }
  }
}

// SWR configuration
const swrConfig = {
  revalidateOnFocus: false,
  revalidateOnReconnect: true,
  dedupingInterval: 30000, // 30 seconds
  errorRetryCount: 3,
  errorRetryInterval: 5000,
  refreshInterval: 0, // Disable auto-refresh
  shouldRetryOnError: true
}

export function useDashboardData(selectedProgram: string): DashboardData {
  // Fetch programs
  const { 
    data: programs, 
    error: programError, 
    mutate: refreshPrograms,
    isLoading: programsLoading 
  } = useSWR(
    "/api/programs", 
    enhancedFetcher,
    swrConfig
  )

  // Fetch quizzes
  const { 
    data: quizzes, 
    error: quizError, 
    mutate: refreshQuizzes,
    isLoading: quizzesLoading 
  } = useSWR(
    "/api/quizzes",
    enhancedFetcher,
    swrConfig
  )

  // Fetch resources (only when program is selected)
  const { 
    data: resourcesData, 
    error: resourceError, 
    mutate: refreshResources,
    isLoading: resourcesLoading 
  } = useSWR(
    selectedProgram ? `/api/resources?programId=${selectedProgram}&limit=6` : null,
    enhancedFetcher,
    swrConfig
  )

  const resources = resourcesData || []

  // Calculate stats
  const stats = useMemo((): DashboardStats => {
    if (!programs || !quizzes) {
      return {
        totalQuizzes: 0,
        totalQuestions: 0,
        totalResources: 0,
        programs: 0,
        courses: 0
      }
    }

    const totalQuizzes = quizzes.length
    const totalQuestions = quizzes.reduce((sum: number, quiz: Quiz) => sum + quiz.questionCount, 0)
    const totalResources = resources.length
    const programsCount = programs.length
    const coursesCount = programs.reduce((sum: number, program: Program) =>
      sum + program.years.reduce((yearSum: number, year: Year) =>
        yearSum + year.semesters.reduce((semesterSum: number, semester: Semester) =>
          semesterSum + semester.courses.length, 0), 0), 0)

    return {
      totalQuizzes,
      totalQuestions,
      totalResources,
      programs: programsCount,
      courses: coursesCount
    }
  }, [programs, quizzes, resources])

  // Loading state
  const isLoading = (programsLoading || quizzesLoading || resourcesLoading) && 
                   (!programs && !programError && !quizzes && !quizError)

  // Error state
  const hasError = programError || quizError || resourceError

  // Refresh all data
  const refreshAll = useCallback(() => {
    refreshPrograms()
    refreshQuizzes()
    refreshResources()
  }, [refreshPrograms, refreshQuizzes, refreshResources])

  return {
    programs: programs || [],
    quizzes: quizzes || [],
    resources,
    stats,
    isLoading,
    hasError,
    errors: { programError, quizError, resourceError },
    refreshAll
  }
}

// Hook for filtered quizzes with memoization
export function useFilteredQuizzes(
  quizzes: Quiz[],
  programs: Program[],
  filters: {
    selectedProgram: string
    selectedYear: string
    selectedSemester: string
    searchQuery: string
    difficultyFilter: string
  }
) {
  return useMemo(() => {
    if (!quizzes || !programs) return []

    return quizzes.filter((quiz: Quiz) => {
      // Search filter
      const matchesSearch = quiz.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
                           quiz.description.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
                           quiz.tags.some((tag: string) => tag.toLowerCase().includes(filters.searchQuery.toLowerCase()))
      
      // Difficulty filter
      const matchesDifficulty = filters.difficultyFilter === "all" || 
                               quiz.difficulty.toLowerCase() === filters.difficultyFilter.toLowerCase()
      
      // Program filter
      const selectedProgram = programs.find((p: Program) => p.id === filters.selectedProgram)
      const availableCourseIds = selectedProgram?.years
        .find((y: Year) => y.year.toString() === filters.selectedYear)?.semesters
        .find((s: Semester) => s.semester.toString() === filters.selectedSemester)?.courses
        .map((c: Course) => c.id) || []
      
      const matchesProgram = availableCourseIds.length > 0 ? 
        (quiz.courseId && availableCourseIds.includes(quiz.courseId)) : true
      
      return matchesSearch && matchesDifficulty && matchesProgram
    })
  }, [quizzes, programs, filters])
}

// Hook for course selection
export function useCourseSelection() {
  const getAvailableCourses = useCallback((programs: Program[], selectedProgram: string, selectedYear: string, selectedSemester: string) => {
    const program = programs.find((p: Program) => p.id === selectedProgram)
    if (!program) return []

    const year = program.years.find((y: Year) => y.year.toString() === selectedYear)
    if (!year) return []

    const semester = year.semesters.find((s: Semester) => s.semester.toString() === selectedSemester)
    if (!semester) return []

    return semester.courses
  }, [])

  return { getAvailableCourses }
} 