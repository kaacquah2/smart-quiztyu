"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { DashboardHeader } from "@/components/dashboard-header"
import { AlertCircle, Clock } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import type { Quiz } from "@/lib/types"
import { getCourseById } from "@/lib/program-data"

export default function QuizPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [timeLeft, setTimeLeft] = useState(0)
  const [error, setError] = useState("")
  const [courseTitle, setCourseTitle] = useState("")

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await fetch(`/api/quizzes/${params.id}`)
        if (!response.ok) {
          throw new Error("Failed to fetch quiz")
        }
        const data = await response.json()
        setQuiz(data)
        setTimeLeft(data.timeLimit * 60) // Convert minutes to seconds

        // Try to get course title from program data
        const course = getCourseById("computer-science", params.id)
        if (course) {
          setCourseTitle(course.title)
        } else {
          setCourseTitle(data.title)
        }

        setLoading(false)
      } catch (error) {
        setError("Failed to load quiz. Please try again.")
        setLoading(false)
      }
    }

    fetchQuiz()
  }, [params.id])

  useEffect(() => {
    if (!timeLeft || !quiz) return

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer)
          handleSubmit()
          return 0
        }
        return prevTime - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft, quiz])

  const handleAnswerChange = (value: string) => {
    setAnswers({
      ...answers,
      [currentQuestionIndex]: value,
    })
  }

  const handleNext = () => {
    if (currentQuestionIndex < quiz!.questions.length - 1) {
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

    try {
      const response = await fetch("/api/submit-quiz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          quizId: quiz.id,
          answers: Object.entries(answers).map(([index, answer]) => ({
            questionIndex: Number.parseInt(index),
            answer,
          })),
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to submit quiz")
      }

      const result = await response.json()

      // Store the result in localStorage
      localStorage.setItem(
        `quiz_${quiz.id}_result`,
        JSON.stringify({
          score: result.score,
          totalQuestions: quiz.questions.length,
          timestamp: new Date().toISOString(),
        }),
      )

      // Navigate to results page
      router.push(`/results/${quiz.id}?score=${result.score}&total=${quiz.questions.length}`)
    } catch (error) {
      setError("Failed to submit quiz. Please try again.")
    }
  }

  if (loading) {
    return (
      <>
        <DashboardHeader />
        <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p>Loading quiz...</p>
          </div>
        </div>
      </>
    )
  }

  if (error) {
    return (
      <>
        <DashboardHeader />
        <div className="container mx-auto px-4 py-8">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <div className="mt-4">
            <Button onClick={() => router.push("/dashboard")}>Return to Dashboard</Button>
          </div>
        </div>
      </>
    )
  }

  if (!quiz) {
    return null
  }

  const currentQuestion = quiz.questions[currentQuestionIndex]
  const progress = (currentQuestionIndex / quiz.questions.length) * 100

  // Format time left
  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60
  const formattedTime = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`

  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1
  const hasAnsweredCurrent = answers[currentQuestionIndex] !== undefined
  const answeredCount = Object.keys(answers).length
  const totalQuestions = quiz.questions.length

  return (
    <>
      <DashboardHeader />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-2xl font-semibold">{courseTitle || quiz.title}</h2>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{formattedTime}</span>
            </div>
          </div>
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between text-sm mt-1">
            <span>
              Question {currentQuestionIndex + 1} of {quiz.questions.length}
            </span>
            <span>
              {answeredCount} of {totalQuestions} answered
            </span>
          </div>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl">
              {currentQuestionIndex + 1}. {currentQuestion.text}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={answers[currentQuestionIndex] || ""}
              onValueChange={handleAnswerChange}
              className="space-y-3"
            >
              {currentQuestion.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2 rounded-md border p-3 hover:bg-muted">
                  <RadioGroupItem value={option} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="flex-grow cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={handlePrevious} disabled={currentQuestionIndex === 0}>
              Previous
            </Button>
            <div className="flex gap-2">
              {isLastQuestion ? (
                <Button onClick={handleSubmit} disabled={answeredCount < totalQuestions}>
                  Submit Quiz
                </Button>
              ) : (
                <Button onClick={handleNext} disabled={!hasAnsweredCurrent}>
                  Next
                </Button>
              )}
            </div>
          </CardFooter>
        </Card>

        <div className="flex justify-between items-center">
          <Button variant="ghost" onClick={() => router.push("/dashboard")}>
            Exit Quiz
          </Button>
          {!isLastQuestion && (
            <Button variant="outline" onClick={handleSubmit} disabled={answeredCount < 1}>
              Submit Early
            </Button>
          )}
        </div>
      </div>
    </>
  )
}
