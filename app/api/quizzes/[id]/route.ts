import { NextResponse } from "next/server"
import { getQuizById, getQuizWithRandomQuestions } from "@/lib/quiz-service"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { searchParams } = new URL(request.url)
    const randomize = searchParams.get('randomize') === 'true'
    const questionCount = Number.parseInt(searchParams.get('questionCount') || '5')

    let quiz
    if (randomize) {
      quiz = await getQuizWithRandomQuestions(id, questionCount)
    } else {
      quiz = await getQuizById(id)
    }

    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 })
    }

    return NextResponse.json(quiz)
  } catch (error) {
    const { id } = await params
    console.error(`Error fetching quiz ${id}:`, error)
    return NextResponse.json({ error: "Failed to fetch quiz" }, { status: 500 })
  }
}
