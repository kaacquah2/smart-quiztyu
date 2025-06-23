import { NextResponse } from "next/server"
import { generateGeminiStudyPlan, generateMultiCourseStudyPlan, generateProgramStudyPlan, QuizContext } from "@/lib/gemini-study-plan-service"
import { quizToCourseMapping } from "@/lib/resource-service"
import { programs } from "@/lib/program-data"

export async function POST(request: Request) {
  try {
    // Check if API key is configured
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "your-gemini-api-key-here") {
      return NextResponse.json({ 
        error: "Gemini API key not configured. Please set GEMINI_API_KEY in your .env file." 
      }, { status: 500 })
    }

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
      programWide
    } = await request.json()

    // Validate required parameters
    if (!quizId && !multipleQuizzes && !programWide) {
      return NextResponse.json({ error: "Quiz ID or multiple quizzes data is required" }, { status: 400 })
    }

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
        actualProgramId = findProgramByCourseId(actualCourseId) || "computer-science"
      }

      // Get course title if not provided
      let actualCourseTitle = courseTitle
      if (!actualCourseTitle) {
        const course = getCourseById(actualProgramId, actualCourseId)
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

  } catch (error) {
    console.error("Error generating Gemini study plan:", error)
    
    // Provide more specific error messages
    if (error.message?.includes('401')) {
      return NextResponse.json({ 
        error: "Invalid Gemini API key. Please check your API key in the .env file." 
      }, { status: 500 })
    } else if (error.message?.includes('429')) {
      return NextResponse.json({ 
        error: "Gemini API rate limit exceeded. Please try again later." 
      }, { status: 500 })
    } else if (error.message?.includes('402')) {
      return NextResponse.json({ 
        error: "Gemini API quota exceeded. Please check your account balance." 
      }, { status: 500 })
    } else {
      return NextResponse.json({ 
        error: "Failed to generate study plan. Please try again." 
      }, { status: 500 })
    }
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
      actualProgramId = findProgramByCourseId(actualCourseId) || "computer-science"
    }

    // Get course title if not provided
    let actualCourseTitle = courseTitle
    if (!actualCourseTitle) {
      const course = getCourseById(actualProgramId, actualCourseId)
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
  } catch (error) {
    console.error("Error generating Gemini study plan:", error)
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