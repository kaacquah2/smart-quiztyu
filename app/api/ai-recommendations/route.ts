import { NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(request: Request) {
  try {
    const { quizResults, program, interests, recentTopics } = await request.json()

    // Create a prompt for the AI based on user data
    const prompt = `
      As an AI educational assistant, provide personalized learning recommendations for a student with the following profile:
      
      Program: ${program}
      Interests: ${interests.join(", ")}
      Recent Topics: ${recentTopics.join(", ")}
      
      Recent Quiz Results:
      ${quizResults.map((result: any) => `- ${result.quizTitle}: ${result.score}% (Strengths: ${result.strengths.join(", ")}, Weaknesses: ${result.weaknesses.join(", ")})`).join("\n")}
      
      Based on this information, provide:
      1. 3 specific learning resources (videos, articles, or courses) that would help this student improve in their weak areas
      2. 2 advanced resources for topics they're already strong in
      3. 1 recommendation for a new topic they might be interested in exploring
      
      Format each recommendation with a title, brief description (1-2 sentences), resource type (Video, Article, Course, etc.), difficulty level, and a URL (use example.com if needed).
    `

    // Generate recommendations using the AI model
    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt: prompt,
      temperature: 0.7,
      maxTokens: 1000,
    })

    // Parse the AI response to extract structured recommendations
    // This is a simplified parsing approach - in a real app, you'd want more robust parsing
    const recommendations = parseAIResponse(text)

    return NextResponse.json({ recommendations, rawResponse: text })
  } catch (error) {
    console.error("Error generating AI recommendations:", error)
    return NextResponse.json({ error: "Failed to generate recommendations" }, { status: 500 })
  }
}

// Helper function to parse the AI response into structured data
function parseAIResponse(text: string): any[] {
  // This is a simplified parsing approach
  // In a production app, you'd want more robust parsing logic

  const recommendations: any[] = []

  // Split the text by numbered items
  const sections = text.split(/\d\.\s/).filter(Boolean)

  sections.forEach((section) => {
    const lines = section.trim().split("\n").filter(Boolean)

    if (lines.length >= 1) {
      const title = lines[0].replace(/^[^a-zA-Z0-9]+/, "").trim()
      const description = lines.length > 1 ? lines[1].trim() : ""

      // Extract resource type if it exists
      let resourceType = "Resource"
      const typeMatch = section.match(/Type:\s*([A-Za-z\s]+)/i)
      if (typeMatch) resourceType = typeMatch[1].trim()

      // Extract difficulty if it exists
      let difficulty = "Intermediate"
      const difficultyMatch = section.match(/Difficulty:\s*([A-Za-z\s]+)/i)
      if (difficultyMatch) difficulty = difficultyMatch[1].trim()

      // Extract URL if it exists
      let url = "https://example.com"
      const urlMatch = section.match(/https?:\/\/[^\s]+/i)
      if (urlMatch) url = urlMatch[0].trim()

      recommendations.push({
        title,
        description,
        resourceType,
        difficulty,
        url,
      })
    }
  })

  return recommendations
}
