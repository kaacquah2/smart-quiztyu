import { NextResponse } from "next/server"
import { generateGeminiStudyPlan, generateMultiCourseStudyPlan, generateProgramStudyPlan, QuizContext } from "@/lib/gemini-study-plan-service"
import { generateRuleBasedStudyPlan, generateMultiCourseRuleBasedStudyPlan, generateProgramRuleBasedStudyPlan } from "@/lib/rule-based-study-plan-service"
import { quizToCourseMapping } from "@/lib/resource-service"
import { getAllPrograms, type Program, type Course } from "@/lib/program-service"

export async function POST(request: Request) {
  try {
    const { 
      quizId, 
      score, 
      totalQuestions, 
      programId,
      courseId,
      courseTitle,
      timeSpent,
      difficulty,
      incorrectAnswers,
      // For multi-course or program-wide plans
      multipleQuizzes,
      programWide,
      userId // Accept userId at the top level for single course
    } = await request.json()

    // Ensure userId is present for personalization
    if (!userId) {
      console.warn("[Personalization] userId missing from quizContext. Personalization will be skipped.");
    }

    // Validate required parameters
    if (!quizId && !multipleQuizzes && !programWide) {
      return NextResponse.json({ error: "Quiz ID or multiple quizzes data is required" }, { status: 400 })
    }

    // Check if API key is configured
    const hasApiKey = process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "your-gemini-api-key-here"
    
    if (!hasApiKey) {
      console.log("Gemini API key not configured, using rule-based fallback")
      return await generateFallbackStudyPlan(quizId, score, totalQuestions, programId, courseId, courseTitle, timeSpent, difficulty, incorrectAnswers, multipleQuizzes, programWide, userId)
    }

    // Try AI study plan first
    try {
      // Generate single course study plan
      if (quizId && !multipleQuizzes && !programWide) {
        if (!score || !totalQuestions) {
          return NextResponse.json({ error: "Score and total questions are required" }, { status: 400 })
        }

        // Determine course ID if not provided
        let actualCourseId = courseId
        if (!actualCourseId) {
          actualCourseId = quizToCourseMapping[quizId]
        }

        if (!actualCourseId) {
          return NextResponse.json({ error: "Could not determine course for this quiz" }, { status: 404 })
        }

        // Determine program ID if not provided
        let actualProgramId = programId
        if (!actualProgramId) {
          actualProgramId = await findProgramByCourseId(actualCourseId) || "computer-science"
        }

        // Get course title if not provided
        let actualCourseTitle = courseTitle
        if (!actualCourseTitle) {
          const course = await getCourseByIdLocal(actualProgramId, actualCourseId)
          actualCourseTitle = course?.title || "Unknown Course"
        }

        const quizContext: QuizContext = {
          quizId,
          score,
          totalQuestions,
          courseId: actualCourseId,
          programId: actualProgramId,
          courseTitle: actualCourseTitle,
          timeSpent,
          difficulty,
          incorrectAnswers
        }

        const studyPlan = await generateGeminiStudyPlan(quizContext)
        
        if (!studyPlan) {
          return NextResponse.json({ error: "Could not generate study plan for this quiz" }, { status: 404 })
        }

        return NextResponse.json({
          success: true,
          studyPlan,
          generatedBy: "Gemini AI"
        })
      }

      // Generate multi-course study plan
      if (multipleQuizzes && Array.isArray(multipleQuizzes)) {
        const studyPlans = await generateMultiCourseStudyPlan(multipleQuizzes)
        
        return NextResponse.json({
          success: true,
          studyPlans,
          generatedBy: "Gemini AI",
          totalCourses: Object.keys(studyPlans).length
        })
      }

      // Generate program-wide study plan
      if (programWide && programWide.programId && programWide.quizResults) {
        const programPlan = await generateProgramStudyPlan(
          programWide.programId,
          programWide.quizResults
        )
        
        return NextResponse.json({
          success: true,
          programPlan,
          generatedBy: "Gemini AI",
          programId: programWide.programId,
          totalCourses: Object.keys(programPlan.coursePlans).length
        })
      }

      return NextResponse.json({ error: "Invalid request format" }, { status: 400 })
    } catch (aiError) {
      console.error("AI study plan generation failed, falling back to rule-based system:", aiError)
      return await generateFallbackStudyPlan(quizId, score, totalQuestions, programId, courseId, courseTitle, timeSpent, difficulty, incorrectAnswers, multipleQuizzes, programWide, userId)
    }

  } catch (error) {
    console.error("Error generating study plan:", error)
    return NextResponse.json({ error: "Failed to generate study plan. Please try again." }, { status: 500 })
  }
}

// Generate fallback study plan using rule-based system
async function generateFallbackStudyPlan(
  quizId?: string,
  score?: number,
  totalQuestions?: number,
  programId?: string,
  courseId?: string,
  courseTitle?: string,
  timeSpent?: number,
  difficulty?: string,
  incorrectAnswers?: string[],
  multipleQuizzes?: any[],
  programWide?: any,
  userId?: string // Accept userId for fallback
) {
  try {
    // Generate single course study plan
    if (quizId && !multipleQuizzes && !programWide) {
      if (!score || !totalQuestions) {
        return NextResponse.json({ error: "Score and total questions are required" }, { status: 400 })
      }

      // Determine course ID if not provided
      let actualCourseId = courseId
      if (!actualCourseId) {
        actualCourseId = quizToCourseMapping[quizId]
      }

      if (!actualCourseId) {
        return NextResponse.json({ error: "Could not determine course for this quiz" }, { status: 404 })
      }

      // Determine program ID if not provided
      let actualProgramId = programId
      if (!actualProgramId) {
        actualProgramId = await findProgramByCourseId(actualCourseId) || "computer-science"
      }

      // Get course title if not provided
      let actualCourseTitle = courseTitle
      if (!actualCourseTitle) {
        const course = await getCourseByIdLocal(actualProgramId, actualCourseId)
        actualCourseTitle = course?.title || "Unknown Course"
      }

      const quizContext = {
        quizId,
        score,
        totalQuestions,
        courseId: actualCourseId,
        programId: actualProgramId,
        courseTitle: actualCourseTitle,
        timeSpent,
        difficulty,
        incorrectAnswers,
        userId // Pass userId for personalization
      }

      const studyPlan = await generateRuleBasedStudyPlan(quizContext)
      
      if (!studyPlan) {
        return NextResponse.json({ error: "Could not generate study plan for this quiz" }, { status: 404 })
      }

      return NextResponse.json({
        success: true,
        studyPlan,
        generatedBy: "Rule-Based System",
        fallback: true
      })
    }

    // Generate multi-course study plan
    if (multipleQuizzes && Array.isArray(multipleQuizzes)) {
      const studyPlans = await generateMultiCourseRuleBasedStudyPlan(multipleQuizzes)
      
      return NextResponse.json({
        success: true,
        studyPlans,
        generatedBy: "Rule-Based System",
        totalCourses: Object.keys(studyPlans).length,
        fallback: true
      })
    }

    // Generate program-wide study plan
    if (programWide && programWide.programId && programWide.quizResults) {
      const programPlan = await generateProgramRuleBasedStudyPlan(
        programWide.programId,
        programWide.quizResults
      )
      
      return NextResponse.json({
        success: true,
        programPlan,
        generatedBy: "Rule-Based System",
        programId: programWide.programId,
        totalCourses: Object.keys(programPlan.coursePlans).length,
        fallback: true
      })
    }

    return NextResponse.json({ error: "Invalid request format" }, { status: 400 })
  } catch (error) {
    console.error("Error generating fallback study plan:", error)
    return NextResponse.json({ error: "Failed to generate study plan. Please try again." }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const quizId = searchParams.get("quizId")
    const score = Number.parseInt(searchParams.get("score") || "0")
    const total = Number.parseInt(searchParams.get("total") || "1")
    const programId = searchParams.get("programId") || undefined
    const courseId = searchParams.get("courseId") || undefined
    const courseTitle = searchParams.get("courseTitle") || undefined

    if (!quizId) {
      return NextResponse.json({ error: "Quiz ID is required" }, { status: 400 })
    }

    // Check if API key is configured
    const hasApiKey = process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "your-gemini-api-key-here"
    
    if (!hasApiKey) {
      console.log("Gemini API key not configured, using rule-based fallback")
      return await generateFallbackStudyPlan(quizId, score, total, programId, courseId, courseTitle)
    }

    // Try AI study plan first
    try {
      // Determine course ID if not provided
      let actualCourseId = courseId
      if (!actualCourseId) {
        actualCourseId = quizToCourseMapping[quizId]
      }

      if (!actualCourseId) {
        return NextResponse.json({ error: "Could not determine course for this quiz" }, { status: 404 })
      }

      // Determine program ID if not provided
      let actualProgramId = programId
      if (!actualProgramId) {
        actualProgramId = await findProgramByCourseId(actualCourseId) || "computer-science"
      }

      // Get course title if not provided
      let actualCourseTitle = courseTitle
      if (!actualCourseTitle) {
        const course = await getCourseByIdLocal(actualProgramId, actualCourseId)
        actualCourseTitle = course?.title || "Unknown Course"
      }

      const quizContext: QuizContext = {
        quizId,
        score,
        totalQuestions: total,
        courseId: actualCourseId,
        programId: actualProgramId,
        courseTitle: actualCourseTitle
      }

      const studyPlan = await generateGeminiStudyPlan(quizContext)

      if (!studyPlan) {
        return NextResponse.json({ error: "Could not generate study plan for this quiz" }, { status: 404 })
      }

      return NextResponse.json({
        success: true,
        studyPlan,
        generatedBy: "Gemini AI"
      })
    } catch (aiError) {
      console.error("AI study plan generation failed, falling back to rule-based system:", aiError)
      return await generateFallbackStudyPlan(quizId, score, total, programId, courseId, courseTitle)
    }
  } catch (error) {
    console.error("Error generating study plan:", error)
    return NextResponse.json({ error: "Failed to generate study plan. Please try again." }, { status: 500 })
  }
}

// Helper function to find which program a course belongs to
async function findProgramByCourseId(courseId: string): Promise<string | null> {
  try {
    const programs = await getAllPrograms()
    for (const program of programs) {
      for (const year of program.years) {
        for (const semester of year.semesters) {
          const course = semester.courses.find(c => c.id === courseId)
          if (course) {
            return program.id
          }
        }
      }
    }
    return null
  } catch (error) {
    console.error("Error finding program by course ID:", error)
    return null
  }
}

// Helper function to get course by ID
async function getCourseByIdLocal(programId: string, courseId: string): Promise<Course | null> {
  try {
    const programs = await getAllPrograms()
    const program = programs.find(p => p.id === programId)
    if (!program) return null
    
    for (const year of program.years) {
      for (const semester of year.semesters) {
        const course = semester.courses.find(c => c.id === courseId)
        if (course) return course
      }
    }
    return null
  } catch (error) {
    console.error("Error getting course by ID:", error)
    return null
  }
} 