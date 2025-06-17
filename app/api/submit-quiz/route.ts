import { NextResponse } from "next/server"
import { submitQuiz } from "@/lib/quiz-service"
import type { QuizSubmission } from "@/lib/types"

export async function POST(request: Request) {
  try {
    const submission: QuizSubmission = await request.json()

    if (!submission.quizId || !submission.answers) {
      return NextResponse.json({ error: "Invalid submission data" }, { status: 400 })
    }

    const result = await submitQuiz(submission)
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error submitting quiz:", error)
    return NextResponse.json({ error: "Failed to submit quiz" }, { status: 500 })
  }
}
