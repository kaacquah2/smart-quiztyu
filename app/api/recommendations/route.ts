import { NextRequest, NextResponse } from 'next/server'
import { CONFIG } from '@/lib/config'
import { getQuizById } from '@/lib/quiz-service'
import { youtubeService } from '@/lib/youtube-service'
import { getResourcesForQuiz, getResourcesForCourse, getResourcesForProgram } from '@/lib/resource-service-db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const quizId = searchParams.get('quizId')
    const courseId = searchParams.get('courseId')
    const programId = searchParams.get('programId')
    const score = parseInt(searchParams.get('score') || '0')
    const total = parseInt(searchParams.get('total') || '10')
    const includeYouTube = searchParams.get('includeYouTube') === 'true'
    const includeCurated = searchParams.get('includeCurated') === 'true'
    const limit = parseInt(searchParams.get('limit') || CONFIG.API.DEFAULT_LIMIT.toString())

    let allRecommendations: any[] = []

    // Get curated resources if requested
    if (includeCurated) {
      try {
        let curatedResources = []
        
        if (quizId) {
          curatedResources = await getResourcesForQuiz(quizId)
        } else if (courseId) {
          curatedResources = await getResourcesForCourse(courseId)
        } else if (programId) {
          curatedResources = await getResourcesForProgram(programId)
        } else {
          // Get general resources if no specific context
          curatedResources = await getResourcesForQuiz('general')
        }

        allRecommendations = [...allRecommendations, ...curatedResources]
      } catch (curatedError) {
        console.error("Error fetching curated resources:", curatedError)
        // Continue with other recommendations
      }
    }

    // Get YouTube recommendations if requested
    if (includeYouTube && quizId) {
      try {
        const quiz = await getQuizById(quizId)
        if (quiz) {
          const percentage = (score / total) * 100
          let difficulty: 'beginner' | 'intermediate' | 'advanced' = 'beginner'
          
          if (percentage >= 80) {
            difficulty = 'advanced'
          } else if (percentage >= 60) {
            difficulty = 'intermediate'
          } else {
            difficulty = 'beginner'
          }

          // Build enhanced query from title, tags, and description using configuration
          const queryParts = [quiz.title, quiz.tags?.join(' '), quiz.description].filter(Boolean)
          let enhancedQuery = queryParts.join(' ').replace(/[^\w\s-]/g, '').replace(/\s+/g, ' ').trim()
          if (enhancedQuery.length > CONFIG.API.MAX_QUERY_LENGTH) {
            const base = [quiz.title, quiz.tags?.join(' ')].filter(Boolean).join(' ')
            const remaining = CONFIG.API.MAX_QUERY_LENGTH - base.length
            enhancedQuery = base + ' ' + (quiz.description ? quiz.description.slice(0, Math.max(0, remaining)) : '')
            enhancedQuery = enhancedQuery.slice(0, CONFIG.API.MAX_QUERY_LENGTH)
            enhancedQuery = enhancedQuery.replace(/[^\w\s-]/g, '').replace(/\s+/g, ' ').trim()
          }
          if (!enhancedQuery) {
            enhancedQuery = quiz.title || 'education'
          }

          // Get YouTube recommendations directly from the service
          const youtubeVideos = await youtubeService.getEducationalVideos(
            enhancedQuery,
            difficulty,
            CONFIG.YOUTUBE.DEFAULT_MAX_RESULTS
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
