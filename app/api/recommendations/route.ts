import { NextResponse } from "next/server"
import { getRecommendations } from "@/lib/quiz-service"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const quizId = searchParams.get("quizId")
    const score = Number.parseInt(searchParams.get("score") || "0")
    const total = Number.parseInt(searchParams.get("total") || "1")

    if (!quizId) {
      return NextResponse.json({ error: "Quiz ID is required" }, { status: 400 })
    }

    const recommendations = await getRecommendations(quizId, score, total)
    return NextResponse.json(recommendations)
  } catch (error) {
    console.error("Error fetching recommendations:", error)
    return NextResponse.json({ error: "Failed to fetch recommendations" }, { status: 500 })
  }
}
