import { NextResponse } from "next/server"
import { getQuizById } from "@/lib/quiz-service"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const quiz = await getQuizById(params.id)

    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 })
    }

    return NextResponse.json(quiz)
  } catch (error) {
    console.error(`Error fetching quiz ${params.id}:`, error)
    return NextResponse.json({ error: "Failed to fetch quiz" }, { status: 500 })
  }
}
