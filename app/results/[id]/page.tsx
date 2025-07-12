"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  TrendingUp, 
  BookOpen,
  ArrowLeft,
  AlertCircle,
  Play,
  ExternalLink,
  Lightbulb,
  Target,
  Calendar,
  Video,
  FileText,
  Star,
  Brain,
  GraduationCap,
  MessageSquare,
  Focus,
  Sparkles,
  Flag
} from "lucide-react"
import { ROUTES, createQuizRoute } from "@/lib/routes"

interface QuizResult {
  id: string
  quizId: string
  score: number
  totalQuestions: number
  timeSpent: number
  answers: number[]
  submittedAt: string
  quiz: {
    id: string
    title: string
    description: string
    questions: Question[]
    difficulty: string
  }
}

interface Question {
  id: string
  text: string
  options: string[]
  correctAnswer: string
  explanation?: string
}

interface StudyPlan {
  courseTitle: string
  currentLevel: string
  targetScore: number
  recommendations: any[]
  studySteps: string[]
  programId: string
  personalizedAdvice?: string
  focusAreas?: string[]
  timeAllocation?: {
    conceptReview: number
    practiceProblems: number
    advancedTopics: number
    realWorldApplications: number
  }
  weeklyGoals?: string[]
  resources?: {
    primary: string[]
    supplementary: string[]
    practice: string[]
  }
  estimatedImprovement?: string
  nextMilestone?: string
  generatedBy?: string
  enhanced?: boolean
  personalizedSchedule?: { session: number; topic: string }[]
}

interface Recommendation {
  id: string
  title: string
  description: string
  url: string
  type: string
  tags: string[]
  difficulty: string
  platform?: string
  thumbnail?: string
  channelTitle?: string
  duration?: string
  viewCount?: string
  publishedAt?: string
  reason?: string
  priority?: number
  personalizedSession?: { session: number; topic: string }
  personalizedAdvice?: string
}

export default function ResultsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [result, setResult] = useState<QuizResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [courseTitle, setCourseTitle] = useState("")
  const [studyPlan, setStudyPlan] = useState<StudyPlan | null>(null)
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [youtubeVideos, setYoutubeVideos] = useState<Recommendation[]>([])
  const [studyResources, setStudyResources] = useState<Recommendation[]>([])
  const [aiRecommendations, setAiRecommendations] = useState<Recommendation[]>([])
  const [loadingStudyPlan, setLoadingStudyPlan] = useState(false)
  const [loadingRecommendations, setLoadingRecommendations] = useState(false)

  useEffect(() => {
    const fetchResult = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch(`/api/quiz-results/${id}`)
        if (response.ok) {
          const data = await response.json()
          setResult(data)
          
          // Fetch study plan and recommendations after getting quiz result
          if (data) {
            fetchStudyPlan(data.quizId, data.score, data.totalQuestions)
            fetchRecommendations(data.quizId, data.score, data.totalQuestions)
          }
        } else {
          throw new Error('Failed to fetch quiz result')
        }
      } catch (error) {
        console.error('Error fetching quiz result:', error)
        setError(error instanceof Error ? error.message : 'Failed to fetch quiz result')
      } finally {
        setLoading(false)
      }
    }

    fetchResult()
  }, [id])

  const fetchStudyPlan = async (quizId: string, score: number, total: number) => {
    try {
      setLoadingStudyPlan(true)
      
      // Try Gemini study plan first (enhanced)
      const geminiResponse = await fetch(`/api/study-plan?quizId=${quizId}&score=${score}&total=${total}&useGemini=true`)
      if (geminiResponse.ok) {
        const data = await geminiResponse.json()
        setStudyPlan(data)
        return
      }
      
      // Fallback to basic study plan
      const response = await fetch(`/api/study-plan?quizId=${quizId}&score=${score}&total=${total}&useGemini=false`)
      if (response.ok) {
        const data = await response.json()
        setStudyPlan(data)
      }
    } catch (error) {
      console.error('Error fetching study plan:', error)
    } finally {
      setLoadingStudyPlan(false)
    }
  }

  const fetchRecommendations = async (quizId: string, score: number, total: number) => {
    try {
      setLoadingRecommendations(true)
      
      // Fetch combined recommendations (includes YouTube and curated resources)
      const response = await fetch(`/api/recommendations?quizId=${quizId}&score=${score}&total=${total}&includeYouTube=true&includeCurated=true`)
      if (response.ok) {
        const data = await response.json()
        
        // Separate different types of recommendations
        const youtube = data.filter((rec: Recommendation) => rec.platform === 'youtube')
        const resources = data.filter((rec: Recommendation) => rec.platform !== 'youtube')
        const aiRecs = data.filter((rec: Recommendation) => rec.reason && rec.reason.includes('%'))
        
        setYoutubeVideos(youtube)
        setStudyResources(resources)
        setAiRecommendations(aiRecs)
        setRecommendations(data)
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error)
    } finally {
      setLoadingRecommendations(false)
    }
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const getScorePercentage = () => {
    if (!result) return 0
    return Math.round((result.score / result.totalQuestions) * 100)
  }

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-600"
    if (percentage >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreBadgeVariant = (percentage: number) => {
    if (percentage >= 80) return "default"
    if (percentage >= 60) return "secondary"
    return "destructive"
  }

  const getWrongQuestions = () => {
    if (!result) return []
    return result.quiz.questions.filter((question, index) => {
      const userAnswer = result.answers[index]
      return userAnswer !== parseInt(question.correctAnswer)
    })
  }

  const getResourceIcon = (type: string) => {
    const lowerType = type.toLowerCase()
    if (lowerType.includes("video")) return <Video className="h-4 w-4" />
    if (lowerType.includes("article")) return <FileText className="h-4 w-4" />
    if (lowerType.includes("course")) return <BookOpen className="h-4 w-4" />
    if (lowerType.includes("practice")) return <Brain className="h-4 w-4" />
    return <Lightbulb className="h-4 w-4" />
  }

  const getDifficultyColor = (difficulty: string) => {
    const lower = difficulty.toLowerCase()
    if (lower.includes("beginner")) return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300"
    if (lower.includes("advanced")) return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300"
    return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300"
  }

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading results...</p>
        </div>
      </div>
    )
  }

  if (error || !result) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center p-4">
        <Alert className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error || "Result not found"}</AlertDescription>
        </Alert>
        <Button onClick={() => router.push(ROUTES.DASHBOARD)} className="mt-4">
          Return to Dashboard
        </Button>
      </div>
    )
  }

  const scorePercentage = getScorePercentage()
  const wrongQuestions = getWrongQuestions()

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => router.push(ROUTES.DASHBOARD)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-lg font-semibold">Quiz Results</h1>
              <p className="text-sm text-muted-foreground">{courseTitle}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow container max-w-6xl mx-auto p-4">
        <div className="grid gap-6">
          {/* Score Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Quiz Results</CardTitle>
              <CardDescription>
                {result.quiz.title}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <div className="text-center">
                  <div className={`text-3xl font-bold ${getScoreColor(scorePercentage)}`}>
                    {result.score}/{result.totalQuestions}
                  </div>
                  <p className="text-sm text-muted-foreground">Score</p>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold">
                    {scorePercentage}%
                  </div>
                  <p className="text-sm text-muted-foreground">Percentage</p>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold">
                    {formatTime(result.timeSpent)}
                  </div>
                  <p className="text-sm text-muted-foreground">Time Spent</p>
                </div>
                
                <div className="text-center">
                  <Badge variant={getScoreBadgeVariant(scorePercentage)} className="text-lg px-4 py-2">
                    {scorePercentage >= 80 ? "Excellent" : 
                     scorePercentage >= 60 ? "Good" : "Needs Improvement"}
                  </Badge>
                  <p className="text-sm text-muted-foreground mt-2">Performance</p>
                </div>
              </div>
              
              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Progress</span>
                  <span className="text-sm text-muted-foreground">{scorePercentage}%</span>
                </div>
                <Progress value={scorePercentage} className="h-3" />
              </div>
            </CardContent>
          </Card>

          {/* Wrong Questions Section */}
          {wrongQuestions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <XCircle className="h-5 w-5 text-red-500" />
                  Questions You Got Wrong ({wrongQuestions.length})
                </CardTitle>
                <CardDescription>
                  Review these questions with detailed explanations, study plans, and learning resources to improve your understanding
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {wrongQuestions.map((question, index) => {
                    const originalIndex = result.quiz.questions.findIndex(q => q.id === question.id)
                    const userAnswer = result.answers[originalIndex]
                    
                    return (
                      <div key={question.id} className="border rounded-lg p-6 border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-950/20">
                        {/* Question Header */}
                        <div className="flex items-start justify-between mb-4">
                          <h4 className="font-semibold text-lg">Question {originalIndex + 1}</h4>
                          <Badge variant="destructive" className="text-sm">Incorrect</Badge>
                        </div>
                        
                        {/* Question Text */}
                        <div className="mb-6">
                          <p className="text-lg font-medium mb-4">{question.text}</p>
                          
                          {/* Answer Options */}
                          <div className="space-y-3">
                            {question.options.map((option, optionIndex) => (
                              <div
                                key={optionIndex}
                                className={`p-4 rounded-lg border-2 ${
                                  optionIndex === parseInt(question.correctAnswer)
                                    ? "bg-green-50 border-green-300 dark:bg-green-950/30 dark:border-green-700"
                                    : optionIndex === userAnswer
                                    ? "bg-red-50 border-red-300 dark:bg-red-950/30 dark:border-red-700"
                                    : "bg-muted/50 border-muted"
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  {optionIndex === parseInt(question.correctAnswer) && (
                                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                                  )}
                                  {optionIndex === userAnswer && (
                                    <XCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                                  )}
                                  <span className={`
                                    ${optionIndex === parseInt(question.correctAnswer) ? "font-semibold text-green-800 dark:text-green-200" : ""}
                                    ${optionIndex === userAnswer ? "line-through text-red-600 dark:text-red-400" : ""}
                                  `}>
                                    {option}
                                  </span>
                                  <div className="ml-auto flex gap-2">
                                    {optionIndex === parseInt(question.correctAnswer) && (
                                      <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-200 dark:border-green-700">
                                        ✓ Correct Answer
                                      </Badge>
                                    )}
                                    {optionIndex === userAnswer && (
                                      <Badge variant="destructive" className="text-xs">
                                        ✗ Your Answer
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Explanation Section */}
                        {question.explanation && (
                          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                            <h5 className="font-semibold text-blue-800 dark:text-blue-200 mb-2 flex items-center gap-2">
                              <Lightbulb className="h-4 w-4" />
                              Explanation
                            </h5>
                            <p className="text-blue-700 dark:text-blue-300">{question.explanation}</p>
                          </div>
                        )}

                        {/* Quick Study Plan for This Question */}
                        <div className="mb-6 p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-purple-200 dark:border-purple-800">
                          <h5 className="font-semibold text-purple-800 dark:text-purple-200 mb-3 flex items-center gap-2">
                            <Target className="h-4 w-4" />
                            Study Plan for This Topic
                          </h5>
                          <div className="space-y-2">
                            <div className="flex items-start gap-2">
                              <div className="flex-shrink-0 w-5 h-5 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-medium mt-0.5">
                                1
                              </div>
                              <p className="text-sm text-purple-700 dark:text-purple-300">Review the core concepts related to this question</p>
                            </div>
                            <div className="flex items-start gap-2">
                              <div className="flex-shrink-0 w-5 h-5 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-medium mt-0.5">
                                2
                              </div>
                              <p className="text-sm text-purple-700 dark:text-purple-300">Practice similar problems to reinforce understanding</p>
                            </div>
                            <div className="flex items-start gap-2">
                              <div className="flex-shrink-0 w-5 h-5 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-medium mt-0.5">
                                3
                              </div>
                              <p className="text-sm text-purple-700 dark:text-purple-300">Watch educational videos on this topic</p>
                            </div>
                            <div className="flex items-start gap-2">
                              <div className="flex-shrink-0 w-5 h-5 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-medium mt-0.5">
                                4
                              </div>
                              <p className="text-sm text-purple-700 dark:text-purple-300">Take a practice quiz focusing on this area</p>
                            </div>
                          </div>
                        </div>

                        {/* Related Resources and Recommendations */}
                        <div className="mb-6">
                          <h5 className="font-semibold mb-3 flex items-center gap-2">
                            <BookOpen className="h-4 w-4" />
                            Learning Resources for This Topic
                          </h5>
                          
                          {/* YouTube Videos */}
                          {youtubeVideos.length > 0 && (
                            <div className="mb-4">
                              <h6 className="font-medium text-sm mb-2 flex items-center gap-2 text-red-700 dark:text-red-300">
                                <Video className="h-4 w-4" />
                                YouTube Videos
                              </h6>
                              <div className="grid gap-3 md:grid-cols-2">
                                {youtubeVideos.slice(0, 2).map((video, videoIndex) => (
                                  <div key={videoIndex} className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg border">
                                    {video.thumbnail && (
                                      <div className="relative w-16 h-12 bg-muted rounded overflow-hidden flex-shrink-0">
                                        <img 
                                          src={video.thumbnail} 
                                          alt={video.title}
                                          className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                          <div className="bg-black/50 rounded-full p-1">
                                            <Play className="h-3 w-3 text-white" />
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                      <p className="font-medium text-sm line-clamp-2">{video.title}</p>
                                      <p className="text-xs text-muted-foreground">{video.channelTitle}</p>
                                      <p className="text-xs text-muted-foreground">{video.duration}</p>
                                    </div>
                                    <Button size="sm" variant="outline" asChild>
                                      <a href={video.url} target="_blank" rel="noopener noreferrer">
                                        <Play className="h-3 w-3 mr-1" />
                                        Watch
                                      </a>
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Study Resources */}
                          {studyResources.length > 0 && (
                            <div className="mb-4">
                              <h6 className="font-medium text-sm mb-2 flex items-center gap-2 text-blue-700 dark:text-blue-300">
                                <FileText className="h-4 w-4" />
                                Study Resources
                              </h6>
                              <div className="grid gap-2">
                                {studyResources.slice(0, 3).map((resource, resourceIndex) => (
                                  <div key={resourceIndex} className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border">
                                    <div className="flex items-center gap-3">
                                      {getResourceIcon(resource.type)}
                                      <div>
                                        <p className="font-medium text-sm">{resource.title}</p>
                                        <p className="text-xs text-muted-foreground">{resource.description}</p>
                                      </div>
                                    </div>
                                    <Button size="sm" variant="outline" asChild>
                                      <a href={resource.url} target="_blank" rel="noopener noreferrer">
                                        <ExternalLink className="h-3 w-3 mr-1" />
                                        Study
                                      </a>
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* AI Recommendations */}
                          {aiRecommendations.length > 0 && (
                            <div>
                              <h6 className="font-medium text-sm mb-2 flex items-center gap-2 text-green-700 dark:text-green-300">
                                <Brain className="h-4 w-4" />
                                AI Recommendations
                              </h6>
                              <div className="grid gap-2">
                                {aiRecommendations.slice(0, 2).map((rec, recIndex) => (
                                  <div key={recIndex} className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border">
                                    <div className="flex items-center gap-3">
                                      {getResourceIcon(rec.type)}
                                      <div>
                                        <p className="font-medium text-sm">{rec.title}</p>
                                        {rec.reason && (
                                          <p className="text-xs text-primary italic">{rec.reason}</p>
                                        )}
                                      </div>
                                    </div>
                                    <Button size="sm" variant="outline" asChild>
                                      <a href={rec.url} target="_blank" rel="noopener noreferrer">
                                        <ExternalLink className="h-3 w-3 mr-1" />
                                        View
                                      </a>
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Action Buttons for This Question */}
                        <div className="flex flex-wrap gap-2">
                          <Button size="sm" variant="outline" onClick={() => router.push(createQuizRoute(result.quizId))}>
                            <BookOpen className="h-3 w-3 mr-1" />
                            Practice Similar Questions
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => window.open('https://www.youtube.com/results?search_query=' + encodeURIComponent(question.text), '_blank')}>
                            <Video className="h-3 w-3 mr-1" />
                            Search YouTube
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => window.open('https://www.google.com/search?q=' + encodeURIComponent(question.text), '_blank')}>
                            <ExternalLink className="h-3 w-3 mr-1" />
                            Search Web
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* All Questions with Correct Answers Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                Complete Quiz Review ({result.quiz.questions.length} Questions)
              </CardTitle>
              <CardDescription>
                Review all questions with their correct answers to understand what you got right and what you need to improve
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {result.quiz.questions.map((question, index) => {
                  const userAnswer = result.answers[index]
                  const isCorrect = userAnswer === parseInt(question.correctAnswer)
                  
                  return (
                    <div key={question.id} className={`border rounded-lg p-4 ${
                      isCorrect 
                        ? "border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/20" 
                        : "border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-950/20"
                    }`}>
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="font-medium">Question {index + 1}</h4>
                        <Badge variant={isCorrect ? "default" : "destructive"}>
                          {isCorrect ? "Correct" : "Incorrect"}
                        </Badge>
                      </div>
                      
                      <p className="mb-4 font-medium">{question.text}</p>
                      
                      <div className="space-y-2">
                        {question.options.map((option, optionIndex) => (
                          <div
                            key={optionIndex}
                            className={`p-3 rounded-md border ${
                              optionIndex === parseInt(question.correctAnswer)
                                ? "bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800"
                                : optionIndex === userAnswer && !isCorrect
                                ? "bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-800"
                                : "bg-muted/50"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              {optionIndex === parseInt(question.correctAnswer) && (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              )}
                              {optionIndex === userAnswer && !isCorrect && (
                                <XCircle className="h-4 w-4 text-red-500" />
                              )}
                              <span className={`
                                ${optionIndex === parseInt(question.correctAnswer) ? "font-medium" : ""}
                                ${optionIndex === userAnswer && !isCorrect ? "line-through" : ""}
                              `}>
                                {option}
                              </span>
                              {optionIndex === parseInt(question.correctAnswer) && (
                                <Badge variant="outline" className="ml-auto text-xs">
                                  Correct Answer
                                </Badge>
                              )}
                              {optionIndex === userAnswer && !isCorrect && (
                                <Badge variant="destructive" className="ml-auto text-xs">
                                  Your Answer
                                </Badge>
                              )}
                              {optionIndex === userAnswer && isCorrect && (
                                <Badge variant="default" className="ml-auto text-xs">
                                  Your Answer ✓
                                </Badge>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {question.explanation && (
                        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-md">
                          <p className="text-sm">
                            <strong>Explanation:</strong> {question.explanation}
                          </p>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Study Plan Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Personalized Study Plan
                {studyPlan?.enhanced && (
                  <Badge variant="secondary" className="ml-2">
                    <Sparkles className="h-3 w-3 mr-1" />
                    AI Enhanced
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>
                Based on your performance, here's a customized plan to help you improve
                {studyPlan?.generatedBy && (
                  <span className="block text-xs text-muted-foreground mt-1">
                    Generated by {studyPlan.generatedBy}
                  </span>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadingStudyPlan ? (
                <div className="space-y-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ) : studyPlan ? (
                <div className="space-y-6">
                  {/* Basic Info */}
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <GraduationCap className="h-4 w-4 text-primary" />
                        <h3 className="font-medium">{studyPlan.courseTitle}</h3>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-muted/50 rounded-lg">
                          <div className="text-2xl font-bold text-primary">{studyPlan.currentLevel}</div>
                          <p className="text-sm text-muted-foreground">Current Level</p>
                        </div>
                        <div className="text-center p-3 bg-muted/50 rounded-lg">
                          <div className="text-2xl font-bold text-primary">{studyPlan.targetScore}%</div>
                          <p className="text-sm text-muted-foreground">Target Score</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <h4 className="font-medium flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Study Steps
                      </h4>
                      <div className="space-y-2">
                        {studyPlan.studySteps.map((step, index) => (
                          <div key={index} className="flex items-start gap-2 p-2 bg-muted/30 rounded">
                            <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium">
                              {index + 1}
                            </div>
                            <p className="text-sm">{step}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Enhanced Gemini Features */}
                  {studyPlan.enhanced && (
                    <>
                      {/* Personalized Advice */}
                      {studyPlan.personalizedAdvice && (
                        <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                          <h4 className="font-medium flex items-center gap-2 mb-2">
                            <MessageSquare className="h-4 w-4 text-blue-600" />
                            Personalized Advice
                          </h4>
                          <p className="text-sm text-blue-800 dark:text-blue-200">{studyPlan.personalizedAdvice}</p>
                        </div>
                      )}

                      {/* Focus Areas */}
                      {studyPlan.focusAreas && studyPlan.focusAreas.length > 0 && (
                        <div>
                          <h4 className="font-medium flex items-center gap-2 mb-3">
                            <Focus className="h-4 w-4" />
                            Focus Areas
                          </h4>
                          <div className="grid gap-2 md:grid-cols-3">
                            {studyPlan.focusAreas.map((area, index) => (
                              <div key={index} className="p-3 bg-muted/30 rounded-lg">
                                <p className="text-sm font-medium">{area}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Time Allocation */}
                      {studyPlan.timeAllocation && (
                        <div>
                          <h4 className="font-medium flex items-center gap-2 mb-3">
                            <Clock className="h-4 w-4" />
                            Recommended Time Allocation
                          </h4>
                          <div className="grid gap-3 md:grid-cols-4">
                            <div className="text-center p-3 bg-muted/30 rounded-lg">
                              <div className="text-lg font-bold text-primary">{studyPlan.timeAllocation.conceptReview}%</div>
                              <p className="text-xs text-muted-foreground">Concept Review</p>
                            </div>
                            <div className="text-center p-3 bg-muted/30 rounded-lg">
                              <div className="text-lg font-bold text-primary">{studyPlan.timeAllocation.practiceProblems}%</div>
                              <p className="text-xs text-muted-foreground">Practice Problems</p>
                            </div>
                            <div className="text-center p-3 bg-muted/30 rounded-lg">
                              <div className="text-lg font-bold text-primary">{studyPlan.timeAllocation.advancedTopics}%</div>
                              <p className="text-xs text-muted-foreground">Advanced Topics</p>
                            </div>
                            <div className="text-center p-3 bg-muted/30 rounded-lg">
                              <div className="text-lg font-bold text-primary">{studyPlan.timeAllocation.realWorldApplications}%</div>
                              <p className="text-xs text-muted-foreground">Real World Apps</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Weekly Goals */}
                      {studyPlan.weeklyGoals && studyPlan.weeklyGoals.length > 0 && (
                        <div>
                          <h4 className="font-medium flex items-center gap-2 mb-3">
                            <Target className="h-4 w-4" />
                            Weekly Goals
                          </h4>
                          <div className="space-y-2">
                            {studyPlan.weeklyGoals.map((goal, index) => (
                              <div key={index} className="flex items-start gap-2 p-2 bg-muted/30 rounded">
                                <div className="flex-shrink-0 w-5 h-5 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-medium">
                                  ✓
                                </div>
                                <p className="text-sm">{goal}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Resource Recommendations */}
                      {studyPlan.resources && (
                        <div>
                          <h4 className="font-medium flex items-center gap-2 mb-3">
                            <BookOpen className="h-4 w-4" />
                            Recommended Resources
                          </h4>
                          <div className="grid gap-4 md:grid-cols-3">
                            {studyPlan.resources.primary && studyPlan.resources.primary.length > 0 && (
                              <div>
                                <h5 className="font-medium text-sm mb-2 text-primary">Primary Resources</h5>
                                <div className="space-y-1">
                                  {studyPlan.resources.primary.map((resource, index) => (
                                    <div key={index} className="text-sm p-2 bg-muted/20 rounded">
                                      {resource}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                            {studyPlan.resources.supplementary && studyPlan.resources.supplementary.length > 0 && (
                              <div>
                                <h5 className="font-medium text-sm mb-2 text-blue-600">Supplementary</h5>
                                <div className="space-y-1">
                                  {studyPlan.resources.supplementary.map((resource, index) => (
                                    <div key={index} className="text-sm p-2 bg-muted/20 rounded">
                                      {resource}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                            {studyPlan.resources.practice && studyPlan.resources.practice.length > 0 && (
                              <div>
                                <h5 className="font-medium text-sm mb-2 text-green-600">Practice</h5>
                                <div className="space-y-1">
                                  {studyPlan.resources.practice.map((resource, index) => (
                                    <div key={index} className="text-sm p-2 bg-muted/20 rounded">
                                      {resource}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Progress Indicators */}
                      <div className="grid gap-4 md:grid-cols-2">
                        {studyPlan.estimatedImprovement && (
                          <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                            <h5 className="font-medium text-sm mb-1 text-green-700 dark:text-green-300">
                              <TrendingUp className="h-4 w-4 inline mr-1" />
                              Estimated Improvement
                            </h5>
                            <p className="text-sm text-green-800 dark:text-green-200">{studyPlan.estimatedImprovement}</p>
                          </div>
                        )}
                        {studyPlan.nextMilestone && (
                          <div className="p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                            <h5 className="font-medium text-sm mb-1 text-purple-700 dark:text-purple-300">
                              <Flag className="h-4 w-4 inline mr-1" />
                              Next Milestone
                            </h5>
                            <p className="text-sm text-purple-800 dark:text-purple-200">{studyPlan.nextMilestone}</p>
                          </div>
                        )}
                      </div>
                      {studyPlan.personalizedSchedule && studyPlan.personalizedSchedule.length > 0 && (
                        <div className="p-4 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg mt-4">
                          <h4 className="font-medium flex items-center gap-2 mb-2">
                            <Calendar className="h-4 w-4 text-yellow-600" />
                            Personalized Study Schedule
                          </h4>
                          <ul className="list-decimal ml-6 space-y-1">
                            {studyPlan.personalizedSchedule.map((session, idx) => (
                              <li key={idx} className="text-sm text-yellow-800 dark:text-yellow-200">
                                Session {session.session}: {session.topic}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </>
                  )}
                </div>
              ) : (
                <p className="text-muted-foreground">Unable to generate study plan for this quiz.</p>
              )}
            </CardContent>
          </Card>

          {/* AI Recommendations and Resources */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-primary" />
                AI-Powered Recommendations & Resources
              </CardTitle>
              <CardDescription>
                Personalized learning resources to help you improve based on your performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadingRecommendations ? (
                <div className="space-y-4">
                  <Skeleton className="h-32 w-full" />
                  <Skeleton className="h-32 w-full" />
                  <Skeleton className="h-32 w-full" />
                </div>
              ) : (
                <Tabs defaultValue="all" className="space-y-4">
                  <TabsList className="grid grid-cols-4 w-full">
                    <TabsTrigger value="all">All Resources</TabsTrigger>
                    <TabsTrigger value="youtube">YouTube Videos</TabsTrigger>
                    <TabsTrigger value="ai">AI Recommendations</TabsTrigger>
                    <TabsTrigger value="resources">Study Resources</TabsTrigger>
                  </TabsList>

                  <TabsContent value="all" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {recommendations.slice(0, 6).map((rec, index) => (
                        <Card key={index} className="overflow-hidden">
                          {rec.thumbnail && (
                            <div className="relative h-32 bg-muted">
                              <img 
                                src={rec.thumbnail} 
                                alt={rec.title}
                                className="w-full h-full object-cover"
                              />
                              {rec.platform === 'youtube' && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <div className="bg-black/50 rounded-full p-2">
                                    <Play className="h-6 w-6 text-white" />
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center gap-2">
                                {getResourceIcon(rec.type)}
                                <Badge variant="outline" className={getDifficultyColor(rec.difficulty)}>
                                  {rec.difficulty}
                                </Badge>
                              </div>
                              {rec.platform && (
                                <Badge variant="secondary" className="text-xs">
                                  {rec.platform}
                                </Badge>
                              )}
                            </div>
                            
                            <h4 className="font-medium text-sm mb-1 line-clamp-2">{rec.title}</h4>
                            <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{rec.description}</p>
                            
                            {rec.reason && (
                              <p className="text-xs text-primary mb-3 italic">{rec.reason}</p>
                            )}
                            {rec.personalizedSession && (
                              <p className="text-xs text-yellow-700 mb-1">Personalized Session: Session {rec.personalizedSession.session} - {rec.personalizedSession.topic}</p>
                            )}
                            {rec.personalizedAdvice && (
                              <p className="text-xs text-yellow-800 italic mb-1">Personalized Advice: {rec.personalizedAdvice}</p>
                            )}
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                {rec.duration && <span>{rec.duration}</span>}
                                {rec.viewCount && <span>• {rec.viewCount}</span>}
                                {rec.channelTitle && <span>• {rec.channelTitle}</span>}
                              </div>
                              <Button size="sm" variant="outline" asChild>
                                <a href={rec.url} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="h-3 w-3 mr-1" />
                                  View
                                </a>
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="youtube" className="space-y-4">
                    {youtubeVideos.length > 0 ? (
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {youtubeVideos.map((video, index) => (
                          <Card key={index} className="overflow-hidden">
                            <div className="relative h-32 bg-muted">
                              <img 
                                src={video.thumbnail} 
                                alt={video.title}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="bg-black/50 rounded-full p-2">
                                  <Play className="h-6 w-6 text-white" />
                                </div>
                              </div>
                            </div>
                            <CardContent className="p-4">
                              <h4 className="font-medium text-sm mb-1 line-clamp-2">{video.title}</h4>
                              <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{video.description}</p>
                              
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  {video.duration && <span>{video.duration}</span>}
                                  {video.viewCount && <span>• {video.viewCount}</span>}
                                  {video.channelTitle && <span>• {video.channelTitle}</span>}
                                </div>
                                <Button size="sm" variant="outline" asChild>
                                  <a href={video.url} target="_blank" rel="noopener noreferrer">
                                    <Play className="h-3 w-3 mr-1" />
                                    Watch
                                  </a>
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-center py-8">
                        No YouTube videos available for this topic.
                      </p>
                    )}
                  </TabsContent>

                  <TabsContent value="ai" className="space-y-4">
                    {aiRecommendations.length > 0 ? (
                      <div className="space-y-4">
                        {aiRecommendations.map((rec, index) => (
                          <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                            {getResourceIcon(rec.type)}
                            <div className="flex-1">
                              <h4 className="font-medium">{rec.title}</h4>
                              <p className="text-sm text-muted-foreground">{rec.description}</p>
                              {rec.reason && (
                                <p className="text-sm text-primary mt-1 italic">{rec.reason}</p>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className={getDifficultyColor(rec.difficulty)}>
                                {rec.difficulty}
                              </Badge>
                              <Button size="sm" variant="outline" asChild>
                                <a href={rec.url} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="h-3 w-3 mr-1" />
                                  View
                                </a>
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-center py-8">
                        No AI recommendations available for this quiz.
                      </p>
                    )}
                  </TabsContent>

                  <TabsContent value="resources" className="space-y-4">
                    {studyResources.length > 0 ? (
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {studyResources.map((resource, index) => (
                          <Card key={index} className="overflow-hidden">
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  {getResourceIcon(resource.type)}
                                  <Badge variant="outline" className={getDifficultyColor(resource.difficulty)}>
                                    {resource.difficulty}
                                  </Badge>
                                </div>
                                {resource.platform && (
                                  <Badge variant="secondary" className="text-xs">
                                    {resource.platform}
                                  </Badge>
                                )}
                              </div>
                              
                              <h4 className="font-medium text-sm mb-1 line-clamp-2">{resource.title}</h4>
                              <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{resource.description}</p>
                              
                              {resource.reason && (
                                <p className="text-xs text-primary mb-3 italic">{resource.reason}</p>
                              )}
                              
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1">
                                  <Star className="h-3 w-3 text-yellow-500 fill-current" />
                                  <span className="text-xs text-muted-foreground">4.5</span>
                                </div>
                                <Button size="sm" variant="outline" asChild>
                                  <a href={resource.url} target="_blank" rel="noopener noreferrer">
                                    <ExternalLink className="h-3 w-3 mr-1" />
                                    Study
                                  </a>
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-center py-8">
                        No study resources available for this topic.
                      </p>
                    )}
                  </TabsContent>
                </Tabs>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={() => router.push(createQuizRoute(result.quizId))} className="w-full">
              Retake Quiz
            </Button>
            <Button variant="outline" onClick={() => router.push(ROUTES.DASHBOARD)} className="w-full">
              Return to Dashboard
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
