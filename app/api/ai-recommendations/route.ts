import { NextResponse } from "next/server"
import { getAllPrograms, getCourseById, type Program, type Course } from "@/lib/program-service"
import { generateAIRecommendations, getResourcesForCourse } from "@/lib/resource-service"
import { 
  generateDeepSeekRecommendations, 
  generateFilteredDeepSeekRecommendations,
  QuizResult,
  UserProfile
} from "@/lib/deepseek-recommendations-service"

// Define types for recommendations
interface Recommendation {
  title: string;
  description: string;
  resourceType: string;
  difficulty: string;
  url: string;
}

// Extended course interface with program context
interface ExtendedCourse extends Course {
  programTitle: string;
  year: number;
  semester: number;
}

export async function POST(request: Request) {
  try {
    // Check if DeepSeek API key is configured
    if (!process.env.DEEPSEEK_API_KEY || process.env.DEEPSEEK_API_KEY === "your-deepseek-api-key-here") {
      return NextResponse.json({ 
        error: "DeepSeek API key not configured. Please set DEEPSEEK_API_KEY in your .env file." 
      }, { status: 500 })
    }

    const { 
      quizResults, 
      program, 
      interests, 
      recentTopics, 
      courseId,
      selectedProgram = "all",
      selectedYear = "all", 
      selectedSemester = "all",
      useDeepSeek = true // Default to using DeepSeek
    } = await request.json()

    // If courseId is provided, generate course-specific recommendations
    if (courseId) {
      return await generateCourseSpecificRecommendations(courseId, quizResults as QuizResult[], useDeepSeek)
    }

    // If program/year/semester filters are provided, generate filtered recommendations
    if (selectedProgram !== "all" || selectedYear !== "all" || selectedSemester !== "all") {
      return await generateFilteredRecommendations(selectedProgram, selectedYear, selectedSemester, quizResults as QuizResult[], useDeepSeek)
    }

    // Default: Generate general recommendations based on user data
    return await generateGeneralRecommendations(quizResults as QuizResult[], program, interests, recentTopics, useDeepSeek)
  } catch (error) {
    console.error("Error generating AI recommendations:", error)
    if (error instanceof Error && error.message?.includes('401')) {
      return NextResponse.json({ error: "DeepSeek API key not configured. Please check your API key in the .env file." }, { status: 500 })
    } else if (error instanceof Error && error.message?.includes('429')) {
      return NextResponse.json({ error: "DeepSeek API rate limit exceeded. Please try again later." }, { status: 500 })
    } else if (error instanceof Error && error.message?.includes('402')) {
      return NextResponse.json({ error: "DeepSeek API quota exceeded. Please check your account balance." }, { status: 500 })
    } else {
      return NextResponse.json({ error: "Failed to generate recommendations. Please try again." }, { status: 500 })
    }
  }
}

// Generate course-specific recommendations
async function generateCourseSpecificRecommendations(courseId: string, quizResults: QuizResult[], useDeepSeek: boolean) {
  try {
    console.log('[DEBUG] generateCourseSpecificRecommendations called with:', { courseId, quizResults, useDeepSeek });
    // Find the course in the program data
    const course = await findCourseById(courseId)
    console.log('[DEBUG] Course found:', course);
    if (!course) {
      console.log('[ERROR] Course not found for ID:', courseId);
      return NextResponse.json({ error: "Course not found" }, { status: 404 })
    }

    // Get existing resources for this course
    const existingResources = await getResourcesForCourse(courseId)
    console.log('[DEBUG] Existing resources:', existingResources);
    
    // Find quiz results for this specific course
    const courseQuizResults = quizResults.filter(quiz => quiz.courseId === courseId)
    console.log('[DEBUG] courseQuizResults:', courseQuizResults);
    
    let performance = null
    if (courseQuizResults.length > 0) {
      const totalScore = courseQuizResults.reduce((sum, quiz) => sum + quiz.score, 0)
      const totalQuestions = courseQuizResults.reduce((sum, quiz) => sum + quiz.total, 0)
      const percentage = (totalScore / totalQuestions) * 100
      
      performance = {
        score: totalScore,
        total: totalQuestions,
        percentage: Math.round(percentage)
      }
    }
    console.log('[DEBUG] Calculated performance:', performance);

    let recommendations: any[] = []
    let generatedBy = "Basic Algorithm"

    if (useDeepSeek) {
      try {
        // Use DeepSeek for AI recommendations
        const deepSeekRecs = await generateDeepSeekRecommendations(courseQuizResults, {
          program: course.programTitle,
          interests: [],
          recentTopics: [course.title]
        }, courseId)
        
        recommendations = deepSeekRecs.map(rec => ({
          title: rec.title,
          description: rec.description,
          resourceType: rec.resourceType,
          difficulty: rec.difficulty,
          url: rec.url,
          reasoning: rec.reasoning,
          priority: rec.priority,
          estimatedTime: rec.estimatedTime,
          tags: rec.tags
        }))
        generatedBy = "DeepSeek AI"
      } catch (deepSeekError) {
        console.warn("DeepSeek recommendation generation failed, falling back to basic:", deepSeekError)
        // Fallback to basic recommendations
        const basicRecs = await generateAIRecommendations(
          courseQuizResults[0]?.quizId || courseId,
          performance?.score || 0,
          performance?.total || 1
        )
        recommendations = basicRecs
        generatedBy = "Basic Algorithm (DeepSeek fallback)"
      }
    } else {
      // Use existing basic AI recommendation service
      console.log('[DEBUG] Calling generateAIRecommendations with:', {
        quizId: courseQuizResults[0]?.quizId || courseId,
        score: performance?.score || 0,
        total: performance?.total || 1
      });
      
      const basicRecs = await generateAIRecommendations(
        courseQuizResults[0]?.quizId || courseId,
        performance?.score || 0,
        performance?.total || 1
      )
      recommendations = basicRecs
      generatedBy = "Basic Algorithm"
    }

    console.log('[DEBUG] Final recommendations:', recommendations);

    return NextResponse.json({ 
      recommendations,
      course: {
        id: course.id,
        title: course.title,
        description: course.description,
        programTitle: course.programTitle,
        year: course.year,
        semester: course.semester
      },
      performance,
      generatedBy,
      enhanced: useDeepSeek
    })
  } catch (error: unknown) {
    console.error('[ERROR] Error generating course-specific recommendations:', error)
    if (error instanceof Error) console.error('[ERROR] Error stack:', error.stack)
    return NextResponse.json({ error: "Failed to generate course-specific recommendations" }, { status: 500 })
  }
}

// Generate filtered recommendations based on program/year/semester
async function generateFilteredRecommendations(
  selectedProgram: string, 
  selectedYear: string, 
  selectedSemester: string, 
  quizResults: QuizResult[],
  useDeepSeek: boolean
) {
  try {
    console.log('[DEBUG] generateFilteredRecommendations called with:', { selectedProgram, selectedYear, selectedSemester, quizResults, useDeepSeek });
    
    let courseRecommendations = []
    let generatedBy = "Basic Algorithm"

    if (useDeepSeek) {
      try {
        // Use DeepSeek for filtered recommendations
        const programs = await getAllPrograms()
        courseRecommendations = await generateFilteredDeepSeekRecommendations(
          selectedProgram,
          selectedYear,
          selectedSemester,
          quizResults,
          programs
        )
        generatedBy = "DeepSeek AI"
      } catch (deepSeekError) {
        console.warn("DeepSeek filtered recommendations failed, falling back to basic:", deepSeekError)
        // Fallback to basic logic
        courseRecommendations = await generateBasicFilteredRecommendations(selectedProgram, selectedYear, selectedSemester, quizResults)
        generatedBy = "Basic Algorithm (DeepSeek fallback)"
      }
    } else {
      // Use basic logic
      courseRecommendations = await generateBasicFilteredRecommendations(selectedProgram, selectedYear, selectedSemester, quizResults)
      generatedBy = "Basic Algorithm"
    }

    console.log('[DEBUG] Final courseRecommendations:', courseRecommendations);

    return NextResponse.json({ 
      courseRecommendations,
      generatedBy,
      enhanced: useDeepSeek
    })
  } catch (error: unknown) {
    console.error('[ERROR] Error generating filtered recommendations:', error)
    if (error instanceof Error) console.error('[ERROR] Error stack:', error.stack)
    return NextResponse.json({ error: "Failed to generate filtered recommendations" }, { status: 500 })
  }
}

// Basic filtered recommendations fallback
async function generateBasicFilteredRecommendations(
  selectedProgram: string, 
  selectedYear: string, 
  selectedSemester: string, 
  quizResults: QuizResult[]
) {
  // Get all courses from all programs
  const allCourses = await getAllPrograms().then(programs => 
    programs.flatMap(program => 
      program.years.flatMap(year => 
        year.semesters.flatMap(semester => 
          semester.courses.map(course => ({
            ...course,
            programId: program.id,
            programTitle: program.title,
            year: year.year,
            semester: semester.semester
          }))
        )
      )
    )
  )

  // Filter courses based on selection
  const filteredCourses = allCourses.filter(course => {
    const matchesProgram = selectedProgram === "all" || course.programId === selectedProgram
    const matchesYear = selectedYear === "all" || course.year === parseInt(selectedYear)
    const matchesSemester = selectedSemester === "all" || course.semester === parseInt(selectedSemester)
    
    return matchesProgram && matchesYear && matchesSemester
  })

  const courseRecommendations = []

  for (const course of filteredCourses) {
    // Find quiz results for this course
    const courseQuizResults = quizResults.filter(quiz => quiz.courseId === course.id)
    
    // Calculate performance
    let performance = null
    if (courseQuizResults.length > 0) {
      const totalScore = courseQuizResults.reduce((sum, quiz) => sum + quiz.score, 0)
      const totalQuestions = courseQuizResults.reduce((sum, quiz) => sum + quiz.total, 0)
      const percentage = (totalScore / totalQuestions) * 100
      
      performance = {
        score: totalScore,
        total: totalQuestions,
        percentage: Math.round(percentage)
      }
    }

    // Generate recommendations
    let recommendations: Recommendation[] = []
    if (performance) {
      const aiRecs = await generateAIRecommendations(
        courseQuizResults[0]?.quizId || course.id,
        performance.score,
        performance.total
      )
      recommendations = aiRecs.map(rec => ({
        title: rec.title,
        description: rec.description,
        resourceType: rec.type,
        difficulty: 'Intermediate',
        url: rec.url,
      }))
    } else {
      // Generate general recommendations for courses without quiz history
      const resources = await getResourcesForCourse(course.id)
      recommendations = resources
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 3)
        .map((resource, index) => ({
          title: resource.title,
          description: resource.description,
          resourceType: resource.type,
          difficulty: 'Intermediate',
          url: resource.url,
        }))
    }

    const difficulty = performance ? 
      (performance.percentage < 40 ? 'beginner' : performance.percentage > 80 ? 'advanced' : 'intermediate') :
      (course.year === 1 ? 'beginner' : course.year >= 3 ? 'advanced' : 'intermediate')
    
    const priority = performance ? 
      (performance.percentage < 40 ? 5 : performance.percentage > 80 ? 2 : 3) :
      (course.year === 1 ? 4 : course.year >= 3 ? 2 : 3)

    courseRecommendations.push({
      courseId: course.id,
      courseTitle: course.title,
      programTitle: course.programTitle,
      year: course.year,
      semester: course.semester,
      recommendations,
      performance,
      difficulty,
      priority
    })
  }

  // Sort by priority
  return courseRecommendations.sort((a, b) => {
    if (a.priority !== b.priority) {
      return b.priority - a.priority
    }
    return a.year - b.year
  })
}

// Generate general recommendations (original functionality)
async function generateGeneralRecommendations(quizResults: QuizResult[], program: string, interests: string[], recentTopics: string[], useDeepSeek: boolean) {
  try {
    let recommendations: any[] = []
    let generatedBy = "Basic Algorithm"
    let rawResponse = ""

    if (useDeepSeek) {
      try {
        // Use DeepSeek for general recommendations
        const userProfile: UserProfile = {
          program,
          interests,
          recentTopics
        }
        
        const deepSeekRecs = await generateDeepSeekRecommendations(quizResults, userProfile)
        recommendations = deepSeekRecs.map(rec => ({
          title: rec.title,
          description: rec.description,
          resourceType: rec.resourceType,
          difficulty: rec.difficulty,
          url: rec.url,
          reasoning: rec.reasoning,
          priority: rec.priority,
          estimatedTime: rec.estimatedTime,
          tags: rec.tags
        }))
        generatedBy = "DeepSeek AI"
      } catch (deepSeekError) {
        console.warn("DeepSeek general recommendations failed, falling back to basic:", deepSeekError)
        // Fallback to basic recommendations
        recommendations = await generateBasicGeneralRecommendations(quizResults, program, interests, recentTopics)
        generatedBy = "Basic Algorithm (DeepSeek fallback)"
      }
    } else {
      // Use basic recommendations
      recommendations = await generateBasicGeneralRecommendations(quizResults, program, interests, recentTopics)
      generatedBy = "Basic Algorithm"
    }

    return NextResponse.json({ 
      recommendations, 
      rawResponse,
      generatedBy,
      enhanced: useDeepSeek
    })
  } catch (error) {
    console.error("Error generating general recommendations:", error)
    throw error
  }
}

// Basic general recommendations fallback
async function generateBasicGeneralRecommendations(quizResults: QuizResult[], program: string, interests: string[], recentTopics: string[]) {
  // Create a prompt for the AI based on user data
  const prompt = `
    As an AI educational assistant, provide personalized learning recommendations for a student with the following profile:
    
    Program: ${program}
    Interests: ${interests.join(", ")}
    Recent Topics: ${recentTopics.join(", ")}
    
    Recent Quiz Results:
    ${quizResults.map((result) => `- ${result.quizTitle}: ${result.score}% (Strengths: ${result.strengths?.join(", ") || "N/A"}, Weaknesses: ${result.weaknesses?.join(", ") || "N/A"})`).join("\n")}
    
    Based on this information, provide:
    1. 3 specific learning resources (videos, articles, or courses) that would help this student improve in their weak areas
    2. 2 advanced resources for topics they're already strong in
    3. 1 recommendation for a new topic they might be interested in exploring
    
    Format each recommendation with a title, brief description (1-2 sentences), resource type (Video, Article, Course, etc.), difficulty level, and a URL (use example.com if needed).
  `

  // Generate recommendations using the Gemini REST API (fallback)
  const model = process.env.GEMINI_MODEL || "gemini-2.0-flash"
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`
  
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: prompt
            }
          ]
        }
      ]
    })
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(`Gemini API error: ${response.status} - ${errorData.error?.message || response.statusText}`)
  }

  const data = await response.json()
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ""

  // Parse the AI response to extract structured recommendations
  return parseAIResponse(text)
}

// Helper function to parse the AI response into structured data
function parseAIResponse(text: string): Recommendation[] {
  const recommendations: Recommendation[] = []

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

// Helper function to find course by ID
async function findCourseById(courseId: string): Promise<ExtendedCourse | null> {
  try {
    const programs = await getAllPrograms()
    for (const program of programs) {
      for (const year of program.years) {
        for (const semester of year.semesters) {
          const course = semester.courses.find(c => c.id === courseId)
          if (course) {
            return {
              ...course,
              programTitle: program.title,
              year: year.year,
              semester: semester.semester
            }
          }
        }
      }
    }
    return null
  } catch (error) {
    console.error("Error finding course by ID:", error)
    return null
  }
}
