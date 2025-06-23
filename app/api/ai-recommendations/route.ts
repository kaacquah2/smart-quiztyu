import { NextResponse } from "next/server"
import { programs } from "@/lib/program-data"
import { generateAIRecommendations, getResourcesForCourse } from "@/lib/resource-service"

// Define types for quiz results and recommendations
interface QuizResult {
  quizId: string;
  courseId: string;
  quizTitle?: string;
  score: number;
  total: number;
  strengths?: string[];
  weaknesses?: string[];
}

interface Recommendation {
  title: string;
  description: string;
  resourceType: string;
  difficulty: string;
  url: string;
}

export async function POST(request: Request) {
  try {
    // Check if API key is configured
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "your-gemini-api-key-here") {
      return NextResponse.json({ 
        error: "Gemini API key not configured. Please set GEMINI_API_KEY in your .env file." 
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
      selectedSemester = "all" 
    } = await request.json()

    // If courseId is provided, generate course-specific recommendations
    if (courseId) {
      return await generateCourseSpecificRecommendations(courseId, quizResults as QuizResult[])
    }

    // If program/year/semester filters are provided, generate filtered recommendations
    if (selectedProgram !== "all" || selectedYear !== "all" || selectedSemester !== "all") {
      return await generateFilteredRecommendations(selectedProgram, selectedYear, selectedSemester, quizResults as QuizResult[])
    }

    // Default: Generate general recommendations based on user data
    return await generateGeneralRecommendations(quizResults as QuizResult[], program, interests, recentTopics)
  } catch (error: unknown) {
    console.error("Error generating AI recommendations:", error)
    if (error instanceof Error && error.message?.includes('401')) {
      return NextResponse.json({ error: "Gemini API key not configured. Please check your API key in the .env file." }, { status: 500 })
    } else if (error instanceof Error && error.message?.includes('429')) {
      return NextResponse.json({ error: "Gemini API rate limit exceeded. Please try again later." }, { status: 500 })
    } else if (error instanceof Error && error.message?.includes('402')) {
      return NextResponse.json({ error: "Gemini API quota exceeded. Please check your account balance." }, { status: 500 })
    } else {
      return NextResponse.json({ error: "Failed to generate recommendations. Please try again." }, { status: 500 })
    }
  }
}

// Generate course-specific recommendations
async function generateCourseSpecificRecommendations(courseId: string, quizResults: QuizResult[]) {
  try {
    console.log('[DEBUG] generateCourseSpecificRecommendations called with:', { courseId, quizResults });
    // Find the course in the program data
    const course = findCourseById(courseId)
    console.log('[DEBUG] Course found:', course);
    if (!course) {
      console.log('[ERROR] Course not found for ID:', courseId);
      return NextResponse.json({ error: "Course not found" }, { status: 404 })
    }

    // Get existing resources for this course
    const existingResources = getResourcesForCourse(courseId)
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

    // Use existing AI recommendation service
    console.log('[DEBUG] Calling generateAIRecommendations with:', {
      quizId: courseQuizResults[0]?.quizId || courseId,
      score: performance?.score || 0,
      total: performance?.total || 1
    });
    
    const recommendations = generateAIRecommendations(
      courseQuizResults[0]?.quizId || courseId,
      performance?.score || 0,
      performance?.total || 1
    )
    console.log('[DEBUG] AI recommendations:', recommendations);

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
      performance
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
  quizResults: QuizResult[]
) {
  try {
    console.log('[DEBUG] generateFilteredRecommendations called with:', { selectedProgram, selectedYear, selectedSemester, quizResults });
    // Get all courses from all programs
    const allCourses = programs.flatMap(program => 
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
    console.log('[DEBUG] allCourses count:', allCourses.length);

    // Filter courses based on selection
    const filteredCourses = allCourses.filter(course => {
      const matchesProgram = selectedProgram === "all" || course.programId === selectedProgram
      const matchesYear = selectedYear === "all" || course.year === parseInt(selectedYear)
      const matchesSemester = selectedSemester === "all" || course.semester === parseInt(selectedSemester)
      
      return matchesProgram && matchesYear && matchesSemester
    })
    console.log('[DEBUG] filteredCourses count:', filteredCourses.length);

    const courseRecommendations = []

    for (const course of filteredCourses) {
      // Find quiz results for this course
      const courseQuizResults = quizResults.filter(quiz => quiz.courseId === course.id)
      console.log(`[DEBUG] Course ${course.id} quiz results:`, courseQuizResults);
      
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
      console.log(`[DEBUG] Course ${course.id} performance:`, performance);

      // Generate recommendations
      let recommendations: Recommendation[] = []
      if (performance) {
        const aiRecs = generateAIRecommendations(
          courseQuizResults[0]?.quizId || course.id,
          performance.score,
          performance.total
        )
        recommendations = aiRecs.map(rec => ({
          title: rec.title,
          description: rec.description,
          resourceType: rec.type,
          difficulty: 'Intermediate', // Optionally map from rec.tags or rec.reason
          url: rec.url,
        }))
      } else {
        // Generate general recommendations for courses without quiz history
        const resources = getResourcesForCourse(course.id)
        recommendations = resources
          .sort((a, b) => b.rating - a.rating)
          .slice(0, 3)
          .map((resource, index) => ({
            title: resource.title,
            description: resource.description,
            resourceType: resource.type,
            difficulty: 'Intermediate', // Default or map from tags if available
            url: resource.url,
          }))
      }
      console.log(`[DEBUG] Course ${course.id} recommendations:`, recommendations);

      courseRecommendations.push({
        courseId: course.id,
        courseTitle: course.title,
        programTitle: course.programTitle,
        year: course.year,
        semester: course.semester,
        recommendations,
        performance,
        difficulty: performance ? 
          (performance.percentage < 40 ? 'beginner' : performance.percentage > 80 ? 'advanced' : 'intermediate') :
          (course.year === 1 ? 'beginner' : course.year >= 3 ? 'advanced' : 'intermediate'),
        priority: performance ? 
          (performance.percentage < 40 ? 5 : performance.percentage > 80 ? 2 : 3) :
          (course.year === 1 ? 4 : course.year >= 3 ? 2 : 3)
      })
    }

    // Sort by priority
    courseRecommendations.sort((a, b) => {
      if (a.priority !== b.priority) {
        return b.priority - a.priority
      }
      return a.year - b.year
    })
    console.log('[DEBUG] Final courseRecommendations:', courseRecommendations);

    return NextResponse.json({ courseRecommendations })
  } catch (error: unknown) {
    console.error('[ERROR] Error generating filtered recommendations:', error)
    if (error instanceof Error) console.error('[ERROR] Error stack:', error.stack)
    return NextResponse.json({ error: "Failed to generate filtered recommendations" }, { status: 500 })
  }
}

// Generate general recommendations (original functionality)
async function generateGeneralRecommendations(quizResults: QuizResult[], program: string, interests: string[], recentTopics: string[]) {
  try {
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

    // Generate recommendations using the Gemini REST API
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
    const recommendations = parseAIResponse(text)

    return NextResponse.json({ recommendations, rawResponse: text })
  } catch (error) {
    console.error("Error generating general recommendations:", error)
    throw error
  }
}

// Helper function to find a course by ID
function findCourseById(courseId: string) {
  for (const program of programs) {
    for (const year of program.years) {
      for (const semester of year.semesters) {
        const course = semester.courses.find(c => c.id === courseId)
        if (course) {
          return {
            ...course,
            programId: program.id,
            programTitle: program.title,
            year: year.year,
            semester: semester.semester
          }
        }
      }
    }
  }
  return null
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
