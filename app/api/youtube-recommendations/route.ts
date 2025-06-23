import { NextResponse } from "next/server"
import { youtubeService } from "@/lib/youtube-service"
import { getQuizById } from "@/lib/quiz-service"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const quizId = searchParams.get("quizId")
    const score = Number.parseInt(searchParams.get("score") || "0")
    const total = Number.parseInt(searchParams.get("total") || "1")
    const maxResults = Number.parseInt(searchParams.get("maxResults") || "5")

    if (!quizId) {
      return NextResponse.json({ error: "Quiz ID is required" }, { status: 400 })
    }

    // Check if YouTube API key is configured
    if (!process.env.YOUTUBE_API_KEY || process.env.YOUTUBE_API_KEY === "your-youtube-api-key-here") {
      return NextResponse.json({ 
        error: "YouTube API key not configured. Please set YOUTUBE_API_KEY in your .env file.",
        recommendations: []
      }, { status: 200 })
    }

    // Get quiz details to understand the topic
    const quiz = await getQuizById(quizId)
    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 })
    }

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

    // Get YouTube recommendations
    const recommendations = await youtubeService.getEducationalVideos(
      enhancedQuery,
      difficulty,
      maxResults
    )

    // Format the recommendations
    const formattedRecommendations = recommendations.map(video => ({
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

    return NextResponse.json({
      recommendations: formattedRecommendations,
      topic: quiz.title,
      difficulty: difficulty,
      performance: {
        score,
        total,
        percentage: Math.round(percentage)
      }
    })

  } catch (error) {
    console.error("Error fetching YouTube recommendations:", error)
    
    // Return empty recommendations instead of error to prevent breaking the UI
    return NextResponse.json({ 
      error: "Failed to fetch YouTube recommendations",
      recommendations: []
    }, { status: 200 })
  }
}

export async function POST(request: Request) {
  try {
    const { topic, difficulty = 'beginner', maxResults = 5, type = 'educational', quizId } = await request.json()

    if (!topic && !quizId) {
      return NextResponse.json({ error: "Topic or quizId is required" }, { status: 400 })
    }

    // Check if YouTube API key is configured
    if (!process.env.YOUTUBE_API_KEY || process.env.YOUTUBE_API_KEY === "your-youtube-api-key-here") {
      return NextResponse.json({ 
        error: "YouTube API key not configured. Please set YOUTUBE_API_KEY in your .env file.",
        recommendations: []
      }, { status: 200 })
    }

    let enhancedQuery = topic
    let tags = [topic]
    // If quizId is provided, use all metadata
    if (quizId) {
      const quiz = await getQuizById(quizId)
      if (quiz) {
        const queryParts = [quiz.title, quiz.tags?.join(' '), quiz.description].filter(Boolean)
        enhancedQuery = queryParts.join(' ').replace(/[^\w\s-]/g, '').replace(/\s+/g, ' ').trim()
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
        tags = quiz.tags || [quiz.title]
      }
    }

    let recommendations
    switch (type) {
      case 'educational':
        recommendations = await youtubeService.getEducationalVideos(enhancedQuery, difficulty, maxResults)
        break
      case 'popular':
        recommendations = await youtubeService.getPopularVideos(enhancedQuery, maxResults)
        break
      case 'recent':
        recommendations = await youtubeService.getRecentVideos(enhancedQuery, maxResults)
        break
      default:
        recommendations = await youtubeService.getEducationalVideos(enhancedQuery, difficulty, maxResults)
    }

    // Format the recommendations
    const formattedRecommendations = recommendations.map(video => ({
      id: video.id,
      title: video.title,
      description: video.description,
      url: video.url,
      type: 'video',
      tags: tags,
      difficulty: difficulty,
      thumbnail: video.thumbnail,
      channelTitle: video.channelTitle,
      duration: youtubeService.formatDuration(video.duration),
      viewCount: youtubeService.formatViewCount(video.viewCount),
      publishedAt: new Date(video.publishedAt).toLocaleDateString(),
      platform: 'youtube'
    }))

    return NextResponse.json({
      recommendations: formattedRecommendations,
      topic: enhancedQuery,
      difficulty,
      type
    })

  } catch (error) {
    console.error("Error fetching YouTube recommendations:", error)
    
    return NextResponse.json({ 
      error: "Failed to fetch YouTube recommendations",
      recommendations: []
    }, { status: 200 })
  }
} 