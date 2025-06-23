import { NextRequest, NextResponse } from 'next/server'
import { 
  generateAndSaveQuizQuestions, 
  generateQuestionsForAllCourses,
  getAllCourses,
  getRandomQuizQuestions
} from '@/lib/gemini-quiz-service'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      courseId, 
      questionCount = 10, 
      difficulty,
      generateForAll = false,
      randomize = false
    } = body

    // Check if Gemini API key is configured
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "your-gemini-api-key-here") {
      return NextResponse.json({ 
        error: "Gemini API key not configured. Please set GEMINI_API_KEY in your .env file." 
      }, { status: 500 })
    }

    // Generate for all courses
    if (generateForAll) {
      const result = await generateQuestionsForAllCourses(questionCount)
      
      return NextResponse.json({
        success: true,
        message: `Generated questions for ${result.success}/${result.total} courses`,
        result,
        generatedBy: "Gemini AI"
      })
    }

    // Generate for specific course
    if (!courseId) {
      return NextResponse.json({ error: "Course ID is required" }, { status: 400 })
    }

    const success = await generateAndSaveQuizQuestions(courseId, questionCount, difficulty)
    
    if (success) {
      return NextResponse.json({
        success: true,
        message: `Generated ${questionCount} new questions for course: ${courseId}`,
        courseId,
        questionCount,
        generatedBy: "Gemini AI"
      })
    } else {
      return NextResponse.json({ 
        error: "Failed to generate questions for this course" 
      }, { status: 500 })
    }

  } catch (error) {
    console.error('Error generating quiz questions:', error)
    return NextResponse.json(
      { error: 'Failed to generate quiz questions' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const courseId = searchParams.get('courseId')
    const questionCount = Number.parseInt(searchParams.get('questionCount') || '5')
    const randomize = searchParams.get('randomize') === 'true'

    if (!courseId) {
      return NextResponse.json({ error: "Course ID is required" }, { status: 400 })
    }

    if (randomize) {
      // Get random questions for the course
      const questions = await getRandomQuizQuestions(courseId, questionCount)
      
      return NextResponse.json({
        success: true,
        questions,
        count: questions.length,
        courseId
      })
    } else {
      // Get all available courses
      const courses = getAllCourses()
      
      return NextResponse.json({
        success: true,
        courses: courses.map(c => ({
          id: c.id,
          title: c.title,
          description: c.description,
          programId: c.programId,
          difficulty: c.difficulty
        })),
        totalCourses: courses.length
      })
    }

  } catch (error) {
    console.error('Error fetching quiz data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch quiz data' },
      { status: 500 }
    )
  }
} 