import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { submitQuiz } from "@/lib/quiz-service"

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const submission = await request.json()
    
    if (submission.quizId !== params.id) {
      return NextResponse.json({ error: "Quiz ID mismatch" }, { status: 400 })
    }

    const result = await submitQuiz(submission, session.user.id)
    
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error submitting quiz:", error)
    return NextResponse.json(
      { error: "Failed to submit quiz" },
      { status: 500 }
    )
  }
} 