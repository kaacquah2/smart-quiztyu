"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  ArrowLeft, 
  ArrowRight,
  Timer,
  AlertCircle
} from "lucide-react"
import { ROUTES, createResultsRoute } from "@/lib/routes"

interface Question {
  id: string
  text: string
  options: string[]
  correctAnswer: string
  explanation?: string
}

interface Quiz {
  id: string
  title: string
  description: string
  questions: Question[]
  timeLimit: number
  difficulty: string
}

export default function QuizPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { data: session, status } = useSession()
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [timeLeft, setTimeLeft] = useState(0)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [courseTitle, setCourseTitle] = useState("")

  // Check authentication
  useEffect(() => {
    if (status === "loading") return
    
    if (!session) {
      router.push(ROUTES.LOGIN)
      return
    }
  }, [session, status, router])

  // Fetch quiz data
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch(`/api/quizzes/${id}`)
        if (response.ok) {
          const data = await response.json()
          setQuiz(data)
          setTimeLeft(data.timeLimit * 60) // Convert minutes to seconds
          setAnswers(new Array(data.questions.length).fill(-1))
        } else {
          throw new Error('Failed to fetch quiz')
        }
      } catch (error) {
        console.error('Error fetching quiz:', error)
        setError(error instanceof Error ? error.message : 'Failed to fetch quiz')
      } finally {
        setLoading(false)
      }
    }

    if (session) {
      fetchQuiz()
    }
  }, [id, session])

  // Timer countdown
  useEffect(() => {
    if (!quiz || isSubmitted || timeLeft <= 0) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleSubmit()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [quiz, isSubmitted, timeLeft])

  const handleAnswerSelect = (answerIndex: number) => {
    if (isSubmitted) return
    
    const newAnswers = [...answers]
    newAnswers[currentQuestionIndex] = answerIndex
    setAnswers(newAnswers)
  }

  const handleNext = () => {
    if (currentQuestionIndex < (quiz?.questions.length || 0) - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const handleSubmit = async () => {
    if (!quiz) return

    setIsSubmitted(true)
    
    try {
      const response = await fetch('/api/quiz-results', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quizId: quiz.id,
          answers: answers,
          timeSpent: quiz.timeLimit * 60 - timeLeft,
        }),
      })

      if (response.ok) {
        const result = await response.json()
        router.push(createResultsRoute(result.id))
      } else {
        throw new Error('Failed to submit quiz results')
      }
    } catch (error) {
      console.error('Error submitting quiz results:', error)
      setError('Failed to submit quiz results')
    }
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const getProgress = () => {
    if (!quiz) return 0
    return ((currentQuestionIndex + 1) / quiz.questions.length) * 100
  }

  const getScore = () => {
    if (!quiz) return 0
    let correct = 0
    quiz.questions.forEach((question, index) => {
      if (answers[index] === parseInt(question.correctAnswer)) {
        correct++
      }
    })
    return Math.round((correct / quiz.questions.length) * 100)
  }

  if (status === "loading" || loading) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading quiz...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center p-4">
        <Alert className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button onClick={() => router.push(ROUTES.DASHBOARD)} className="mt-4">
          Return to Dashboard
        </Button>
      </div>
    )
  }

  if (!quiz) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center p-4">
        <Alert className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Quiz not found</AlertDescription>
        </Alert>
        <Button onClick={() => router.push(ROUTES.DASHBOARD)} className="mt-4">
          Return to Dashboard
        </Button>
      </div>
    )
  }

  const currentQuestion = quiz.questions[currentQuestionIndex]
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1

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
              <h1 className="text-lg font-semibold">{quiz.title}</h1>
              <p className="text-sm text-muted-foreground">{courseTitle}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant={timeLeft < 60 ? "destructive" : "secondary"}>
              <Timer className="h-3 w-3 mr-1" />
              {formatTime(timeLeft)}
            </Badge>
            <Badge variant="outline">
              {currentQuestionIndex + 1} / {quiz.questions.length}
            </Badge>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="border-b">
        <div className="container py-2">
          <Progress value={getProgress()} className="h-2" />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow container max-w-4xl mx-auto p-4">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">
                Question {currentQuestionIndex + 1}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="outline">{quiz.difficulty}</Badge>
              </div>
            </div>
            <CardDescription>
              {currentQuestion.text}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <RadioGroup
              value={answers[currentQuestionIndex]?.toString() || ""}
              onValueChange={(value) => handleAnswerSelect(parseInt(value))}
              disabled={isSubmitted}
            >
              {currentQuestion.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                    {option}
                  </Label>
                  {isSubmitted && (
                    <div className="ml-2">
                      {index === parseInt(currentQuestion.correctAnswer) ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : answers[currentQuestionIndex] === index ? (
                        <XCircle className="h-4 w-4 text-red-500" />
                      ) : null}
                    </div>
                  )}
                </div>
              ))}
            </RadioGroup>

            {isSubmitted && currentQuestion.explanation && (
              <Alert>
                <AlertDescription>
                  <strong>Explanation:</strong> {currentQuestion.explanation}
                </AlertDescription>
              </Alert>
            )}

            {/* Navigation */}
            <div className="flex justify-between pt-4">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>

              {isLastQuestion ? (
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitted || answers.some(answer => answer === -1)}
                >
                  {isSubmitted ? "Submitting..." : "Submit Quiz"}
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  disabled={answers[currentQuestionIndex] === -1}
                >
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Question Navigation */}
        <div className="mt-6">
          <h3 className="text-sm font-medium mb-3">Question Navigation</h3>
          <div className="grid grid-cols-5 gap-2">
            {quiz.questions.map((_, index) => (
              <Button
                key={index}
                variant={index === currentQuestionIndex ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentQuestionIndex(index)}
                className="h-8 w-8 p-0"
              >
                {index + 1}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
