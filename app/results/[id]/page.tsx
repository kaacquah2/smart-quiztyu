"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardHeader } from "@/components/dashboard-header"
import type { Recommendation, Quiz } from "@/lib/types"
import { ExternalLink } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getCourseById } from "@/lib/program-data"

export default function ResultsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const score = Number.parseInt(searchParams.get("score") || "0")
  const total = Number.parseInt(searchParams.get("total") || "1")

  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [loading, setLoading] = useState(true)
  const [previousScore, setPreviousScore] = useState<number | null>(null)
  const [courseTitle, setCourseTitle] = useState("")

  useEffect(() => {
    // Get previous score from localStorage
    const storedResult = localStorage.getItem(`quiz_${params.id}_result`)
    if (storedResult) {
      try {
        const parsedResult = JSON.parse(storedResult)
        // Only use the previous score if it's not the current attempt
        const currentTimestamp = new Date().getTime()
        const resultTimestamp = new Date(parsedResult.timestamp).getTime()

        // If the result is more than 1 minute old, consider it a previous attempt
        if (currentTimestamp - resultTimestamp > 60000) {
          setPreviousScore(parsedResult.score)
        }
      } catch (e) {
        console.error("Error parsing previous result", e)
      }
    }

    const fetchData = async () => {
      try {
        // Fetch quiz details
        const quizResponse = await fetch(`/api/quizzes/${params.id}`)
        if (!quizResponse.ok) throw new Error("Failed to fetch quiz")
        const quizData = await quizResponse.json()
        setQuiz(quizData)

        // Try to get course title from program data
        const course = getCourseById("computer-science", params.id)
        if (course) {
          setCourseTitle(course.title)
        } else {
          setCourseTitle(quizData.title)
        }

        // Fetch recommendations based on score
        const recommendationsResponse = await fetch(
          `/api/recommendations?quizId=${params.id}&score=${score}&total=${total}`,
        )
        if (!recommendationsResponse.ok) throw new Error("Failed to fetch recommendations")
        const recommendationsData = await recommendationsResponse.json()
        setRecommendations(recommendationsData)

        setLoading(false)
      } catch (error) {
        console.error("Error fetching data:", error)
        setLoading(false)
      }
    }

    fetchData()
  }, [params.id, score, total])

  if (loading) {
    return (
      <>
        <DashboardHeader />
        <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p>Loading results...</p>
          </div>
        </div>
      </>
    )
  }

  const percentage = Math.round((score / total) * 100)

  // Determine emoji and message based on score
  let emoji = "🎉"
  let message = "Excellent work!"

  if (percentage < 40) {
    emoji = "😢"
    message = "Keep practicing, you'll get better!"
  } else if (percentage < 70) {
    emoji = "🙂"
    message = "Good effort, but there's room for improvement!"
  } else if (percentage < 90) {
    emoji = "😃"
    message = "Great job!"
  }

  // Group recommendations by type
  const recommendationsByType: Record<string, Recommendation[]> = {}
  recommendations.forEach((rec) => {
    if (!recommendationsByType[rec.type]) {
      recommendationsByType[rec.type] = []
    }
    recommendationsByType[rec.type].push(rec)
  })

  return (
    <>
      <DashboardHeader />
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Quiz Results</CardTitle>
              <CardDescription>{courseTitle || quiz?.title}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center py-4">
                <div className="text-6xl mb-2">{emoji}</div>
                <h3 className="text-xl font-semibold">{message}</h3>
                <p className="text-muted-foreground">
                  You scored {score} out of {total}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Score</span>
                  <span>{percentage}%</span>
                </div>
                <Progress value={percentage} className="h-2" />
              </div>

              {previousScore !== null && (
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <p className="text-sm font-medium">
                    Previous attempt: {previousScore} out of {total} ({Math.round((previousScore / total) * 100)}%)
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {previousScore < score
                      ? "You've improved! 🎉"
                      : previousScore > score
                        ? "You scored better before. Keep practicing!"
                        : "Same score as before."}
                  </p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button onClick={() => router.push("/dashboard")} className="w-full">
                Back to Dashboard
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Personalized Recommendations</CardTitle>
              <CardDescription>Resources to help you improve</CardDescription>
            </CardHeader>
            <CardContent>
              {Object.keys(recommendationsByType).length > 0 ? (
                <Tabs defaultValue={Object.keys(recommendationsByType)[0]}>
                  <TabsList className="w-full mb-4">
                    {Object.keys(recommendationsByType).map((type) => (
                      <TabsTrigger key={type} value={type} className="flex-1 capitalize">
                        {type}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {Object.entries(recommendationsByType).map(([type, recs]) => (
                    <TabsContent key={type} value={type} className="space-y-4">
                      {recs.map((rec, index) => (
                        <div key={index} className="p-4 border rounded-lg hover:bg-muted transition-colors">
                          <h3 className="font-medium">{rec.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">{rec.description}</p>
                          <div className="mt-2">
                            <a
                              href={rec.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-primary inline-flex items-center gap-1 hover:underline"
                            >
                              View Resource <ExternalLink className="h-3 w-3" />
                            </a>
                          </div>
                        </div>
                      ))}
                    </TabsContent>
                  ))}
                </Tabs>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No recommendations available</p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button variant="outline" onClick={() => router.push(`/quiz/${params.id}`)} className="w-full">
                Retake Quiz
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  )
}
