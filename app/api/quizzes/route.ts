import { NextResponse } from "next/server"
import { getQuizzes } from "@/lib/quiz-service"

export async function GET() {
  try {
    const quizzes = await getQuizzes()
    return NextResponse.json(quizzes)
  } catch (error) {
    console.error("Error fetching quizzes:", error)
    return NextResponse.json({ error: "Failed to fetch quizzes" }, { status: 500 })
  }
}
