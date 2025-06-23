import { NextResponse } from "next/server"
import { generateStudyPlan } from "@/lib/resource-service"
import { generateGeminiStudyPlan, QuizContext } from "@/lib/gemini-study-plan-service"
import { quizToCourseMapping } from "@/lib/resource-service"
import { programs } from "@/lib/program-data"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const quizId = searchParams.get("quizId")
    const score = Number.parseInt(searchParams.get("score") || "0")
    const total = Number.parseInt(searchParams.get("total") || "1")
    const programId = searchParams.get("programId") || undefined
    const useGemini = searchParams.get("useGemini") === "true"

    if (!quizId) {
      return NextResponse.json({ error: "Quiz ID is required" }, { status: 400 })
    }

    // Try Gemini first if requested and available
    if (useGemini && process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "your-gemini-api-key-here") {
      try {
        // Determine course ID
        const courseId = quizToCourseMapping[quizId]
        if (!courseId) {
          return NextResponse.json({ error: "Could not determine course for this quiz" }, { status: 404 })
        }

        // Determine program ID if not provided
        let actualProgramId = programId
        if (!actualProgramId) {
          actualProgramId = findProgramByCourseId(courseId) || "computer-science"
        }

        // Get course title
        const course = getCourseById(actualProgramId, courseId)
        const courseTitle = course?.title || "Unknown Course"

        const quizContext: QuizContext = {
          quizId,
          score,
          totalQuestions: total,
          courseId,
          programId: actualProgramId,
          courseTitle
        }

        const geminiStudyPlan = await generateGeminiStudyPlan(quizContext)
        
        if (geminiStudyPlan) {
          return NextResponse.json({
            ...geminiStudyPlan,
            generatedBy: "Gemini AI",
            enhanced: true
          })
        }
      } catch (error) {
        console.warn("Gemini study plan generation failed, falling back to basic plan:", error)
        // Continue to fallback
      }
    }

    // Fallback to original study plan generation
    const studyPlan = generateStudyPlan(quizId, score, total, programId)

    if (!studyPlan) {
      return NextResponse.json({ error: "Could not generate study plan for this quiz" }, { status: 404 })
    }

    return NextResponse.json({
      ...studyPlan,
      generatedBy: "Basic Algorithm",
      enhanced: false
    })
  } catch (error) {
    console.error("Error generating study plan:", error)
    return NextResponse.json({ error: "Failed to generate study plan" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { 
      quizId, 
      score, 
      totalQuestions, 
      programId,
      useGemini = true // Default to using Gemini
    } = await request.json()

    if (!quizId || score === undefined || !totalQuestions) {
      return NextResponse.json({ error: "Quiz ID, score, and total questions are required" }, { status: 400 })
    }

    // Try Gemini first if requested and available
    if (useGemini && process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "your-gemini-api-key-here") {
      try {
        // Determine course ID
        const courseId = quizToCourseMapping[quizId]
        if (!courseId) {
          return NextResponse.json({ error: "Could not determine course for this quiz" }, { status: 404 })
        }

        // Determine program ID if not provided
        let actualProgramId = programId
        if (!actualProgramId) {
          actualProgramId = findProgramByCourseId(courseId) || "computer-science"
        }

        // Get course title
        const course = getCourseById(actualProgramId, courseId)
        const courseTitle = course?.title || "Unknown Course"

        const quizContext: QuizContext = {
          quizId,
          score,
          totalQuestions,
          courseId,
          programId: actualProgramId,
          courseTitle
        }

        const geminiStudyPlan = await generateGeminiStudyPlan(quizContext)
        
        if (geminiStudyPlan) {
          return NextResponse.json({
            success: true,
            studyPlan: geminiStudyPlan,
            generatedBy: "Gemini AI",
            enhanced: true
          })
        }
      } catch (error) {
        console.warn("Gemini study plan generation failed, falling back to basic plan:", error)
        // Continue to fallback
      }
    }

    // Fallback to original study plan generation
    const studyPlan = generateStudyPlan(quizId, score, totalQuestions, programId)

    if (!studyPlan) {
      return NextResponse.json({ error: "Could not generate study plan for this quiz" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      studyPlan,
      generatedBy: "Basic Algorithm",
      enhanced: false
    })
  } catch (error) {
    console.error("Error generating study plan:", error)
    return NextResponse.json({ error: "Failed to generate study plan" }, { status: 500 })
  }
}

// Helper function to find which program a course belongs to
function findProgramByCourseId(courseId: string): string | null {
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
}

// Helper function to get course by ID
function getCourseById(programId: string, courseId: string) {
  const program = programs.find(p => p.id === programId)
  if (!program) return null
  
  for (const year of program.years) {
    for (const semester of year.semesters) {
      const course = semester.courses.find(c => c.id === courseId)
      if (course) return course
    }
  }
  return null
} 