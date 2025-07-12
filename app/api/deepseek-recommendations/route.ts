import { NextResponse } from "next/server"
import { 
  generateDeepSeekRecommendations, 
  generateFilteredDeepSeekRecommendations,
  QuizResult,
  UserProfile
} from "@/lib/deepseek-recommendations-service"
import {
  generateRuleBasedRecommendations,
  generateFilteredRuleBasedRecommendations,
  RuleBasedRecommendation
} from "@/lib/rule-based-recommendations-service"
import { getAllPrograms } from "@/lib/program-service"

// NOTE: userId is required in userProfile for advanced personalization
export async function POST(request: Request) {
  try {
    const { 
      quizResults, 
      userProfile,
      courseId,
      selectedProgram = "all",
      selectedYear = "all", 
      selectedSemester = "all" 
    } = await request.json()

    // Ensure userId is present for personalization
    if (!userProfile.userId) {
      console.warn("[Personalization] userId missing from userProfile. Personalization will be skipped.");
    }

    // Check if API key is configured
    const hasApiKey = process.env.DEEPSEEK_API_KEY && process.env.DEEPSEEK_API_KEY !== "your-deepseek-api-key-here"
    
    if (!hasApiKey) {
      console.log("DeepSeek API key not configured, using rule-based fallback")
      return await generateFallbackRecommendations(quizResults, userProfile, courseId, selectedProgram, selectedYear, selectedSemester)
    }

    // Try AI recommendations first
    try {
      // If courseId is provided, generate course-specific recommendations
      if (courseId) {
        return await generateCourseSpecificRecommendations(courseId, quizResults as QuizResult[])
      }

      // If program/year/semester filters are provided, generate filtered recommendations
      if (selectedProgram !== "all" || selectedYear !== "all" || selectedSemester !== "all") {
        return await generateFilteredRecommendations(selectedProgram, selectedYear, selectedSemester, quizResults as QuizResult[])
      }

      // Default: Generate general recommendations based on user data
      return await generateGeneralRecommendations(quizResults as QuizResult[], userProfile as UserProfile)
    } catch (aiError) {
      console.error("AI recommendation generation failed, falling back to rule-based system:", aiError)
      return await generateFallbackRecommendations(quizResults, userProfile, courseId, selectedProgram, selectedYear, selectedSemester)
    }
  } catch (error) {
    console.error("Error generating recommendations:", error)
    return NextResponse.json({ error: "Failed to generate recommendations. Please try again." }, { status: 500 })
  }
}

// Generate fallback recommendations using rule-based system
async function generateFallbackRecommendations(
  quizResults: QuizResult[],
  userProfile: UserProfile,
  courseId?: string,
  selectedProgram?: string,
  selectedYear?: string,
  selectedSemester?: string
) {
  try {
    let recommendations: RuleBasedRecommendation[]
    let courseRecommendations: any[]

    if (courseId) {
      recommendations = await generateRuleBasedRecommendations(quizResults, userProfile, courseId)
      return NextResponse.json({ 
        recommendations,
        courseId,
        generatedBy: "Rule-Based System",
        enhanced: false,
        fallback: true
      })
    }

    if (selectedProgram !== "all" || selectedYear !== "all" || selectedSemester !== "all") {
      const programs = await getAllPrograms()
      courseRecommendations = await generateFilteredRuleBasedRecommendations(
        selectedProgram || "all",
        selectedYear || "all",
        selectedSemester || "all",
        quizResults
      )
      return NextResponse.json({ 
        courseRecommendations,
        generatedBy: "Rule-Based System",
        enhanced: false,
        fallback: true
      })
    }

    recommendations = await generateRuleBasedRecommendations(quizResults, userProfile)
    return NextResponse.json({ 
      recommendations,
      generatedBy: "Rule-Based System",
      enhanced: false,
      fallback: true
    })
  } catch (error) {
    console.error("Error generating fallback recommendations:", error)
    return NextResponse.json({ error: "Failed to generate recommendations. Please try again." }, { status: 500 })
  }
}

// Generate course-specific recommendations
async function generateCourseSpecificRecommendations(courseId: string, quizResults: QuizResult[]) {
  try {
    console.log('[DEBUG] generateCourseSpecificRecommendations called with:', { courseId, quizResults })
    
    const recommendations = await generateDeepSeekRecommendations(quizResults, {
      program: "Unknown Program",
      interests: [],
      recentTopics: []
    }, courseId)

    return NextResponse.json({ 
      recommendations,
      courseId,
      generatedBy: "DeepSeek AI",
      enhanced: true
    })
  } catch (error: unknown) {
    console.error('[ERROR] Error generating course-specific recommendations:', error)
    if (error instanceof Error) console.error('[ERROR] Error stack:', error.stack)
    throw error
  }
}

// Generate filtered recommendations based on program/year/semester
async function generateFilteredRecommendations(
  selectedProgram: string, 
  selectedYear: string, 
  selectedSemester: string, 
  quizResults: QuizResult[]
) {
  try {
    console.log('[DEBUG] generateFilteredRecommendations called with:', { selectedProgram, selectedYear, selectedSemester, quizResults })
    
    const programs = await getAllPrograms()
    const courseRecommendations = await generateFilteredDeepSeekRecommendations(
      selectedProgram,
      selectedYear,
      selectedSemester,
      quizResults,
      programs
    )

    return NextResponse.json({ 
      courseRecommendations,
      generatedBy: "DeepSeek AI",
      enhanced: true
    })
  } catch (error: unknown) {
    console.error('[ERROR] Error generating filtered recommendations:', error)
    if (error instanceof Error) console.error('[ERROR] Error stack:', error.stack)
    throw error
  }
}

// Generate general recommendations (original functionality)
async function generateGeneralRecommendations(quizResults: QuizResult[], userProfile: UserProfile) {
  try {
    const recommendations = await generateDeepSeekRecommendations(quizResults, userProfile)

    return NextResponse.json({ 
      recommendations,
      generatedBy: "DeepSeek AI",
      enhanced: true
    })
  } catch (error) {
    console.error("Error generating general recommendations:", error)
    throw error
  }
} 