import { NextResponse } from "next/server"
import { getRecommendations, getQuizById } from "@/lib/quiz-service"
import { youtubeService } from "@/lib/youtube-service"
import { generateAIRecommendations, getResourcesForQuiz } from "@/lib/resource-service"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const quizId = searchParams.get("quizId")
    const score = Number.parseInt(searchParams.get("score") || "0")
    const total = Number.parseInt(searchParams.get("total") || "1")
    const includeYouTube = searchParams.get("includeYouTube") !== "false"
    const includeCurated = searchParams.get("includeCurated") !== "false"

    if (!quizId) {
      return NextResponse.json({ error: "Quiz ID is required" }, { status: 400 })
    }

    // Get static recommendations
    const staticRecommendations = await getRecommendations(quizId, score, total)
    
    let allRecommendations = [...staticRecommendations]

    // Add curated resources from our resource database
    if (includeCurated) {
      try {
        const curatedRecommendations = generateAIRecommendations(quizId, score, total)
        
        // Convert to the format expected by the frontend
        const formattedCurated = curatedRecommendations.map(rec => ({
          id: rec.id,
          title: rec.title,
          description: rec.description,
          url: rec.url,
          type: rec.type,
          tags: rec.tags,
          difficulty: rec.rating >= 4.7 ? "advanced" : rec.rating >= 4.5 ? "intermediate" : "beginner",
          platform: rec.platform,
          thumbnail: rec.platform === "youtube" ? `https://img.youtube.com/vi/${rec.url.split('v=')[1]}/maxresdefault.jpg` : undefined,
          channelTitle: rec.platform === "youtube" ? "YouTube" : rec.platform,
          duration: rec.duration,
          viewCount: rec.views?.toString() || "0",
          publishedAt: "",
          reason: rec.reason,
          priority: rec.priority
        }))

        allRecommendations = [...allRecommendations, ...formattedCurated]
      } catch (curatedError) {
        console.error("Error fetching curated recommendations:", curatedError)
        // Continue with other recommendations
      }
    }

    // Add YouTube recommendations if enabled and API key is configured
    if (includeYouTube && process.env.YOUTUBE_API_KEY && process.env.YOUTUBE_API_KEY !== "your-youtube-api-key-here") {
      try {
        // Get quiz details to understand the topic
        const quiz = await getQuizById(quizId)
        if (quiz) {
          const percentage = (score / total) * 100
          
          // Determine difficulty based on performance
          let difficulty: 'beginner' | 'intermediate' | 'advanced'
          if (percentage < 40) {
            difficulty = 'beginner'
          } else if (percentage < 70) {
            difficulty = 'intermediate'
          } else {
            difficulty = 'advanced'
          }

          // Build enhanced query from title, tags, and description
          const queryParts = [quiz.title, quiz.tags?.join(' '), quiz.description].filter(Boolean)
          let enhancedQuery = queryParts.join(' ').replace(/[^\w\s-]/g, '').replace(/\s+/g, ' ').trim()
          if (enhancedQuery.length > 120) {
            const base = [quiz.title, quiz.tags?.join(' ')].filter(Boolean).join(' ')
            const remaining = 120 - base.length
            enhancedQuery = base + ' ' + (quiz.description ? quiz.description.slice(0, Math.max(0, remaining)) : '')
            enhancedQuery = enhancedQuery.slice(0, 120)
            enhancedQuery = enhancedQuery.replace(/[^\w\s-]/g, '').replace(/\s+/g, ' ').trim()
          }
          if (!enhancedQuery) {
            enhancedQuery = quiz.title || 'education'
          }

          // Get YouTube recommendations directly from the service
          const youtubeVideos = await youtubeService.getEducationalVideos(
            enhancedQuery,
            difficulty,
            3
          )

          // Format the recommendations
          const youtubeRecommendations = youtubeVideos.map(video => ({
            id: video.id,
            title: video.title,
            description: video.description,
            url: video.url,
            type: 'video',
            tags: quiz.tags || [quiz.title],
            difficulty: difficulty,
            thumbnail: video.thumbnail,
            channelTitle: video.channelTitle,
            duration: youtubeService.formatDuration(video.duration),
            viewCount: youtubeService.formatViewCount(video.viewCount),
            publishedAt: new Date(video.publishedAt).toLocaleDateString(),
            platform: 'youtube'
          }))

          if (youtubeRecommendations.length > 0) {
            allRecommendations = [...allRecommendations, ...youtubeRecommendations]
          }
        }
      } catch (youtubeError) {
        console.error("Error fetching YouTube recommendations:", youtubeError)
        // Continue with static recommendations only
      }
    }

    // Sort recommendations by priority (curated resources first, then others)
    allRecommendations.sort((a, b) => {
      const aPriority = (a as any).priority || 0
      const bPriority = (b as any).priority || 0
      return bPriority - aPriority
    })

    return NextResponse.json(allRecommendations)
  } catch (error) {
    console.error("Error fetching recommendations:", error)
    return NextResponse.json({ error: "Failed to fetch recommendations" }, { status: 500 })
  }
}
