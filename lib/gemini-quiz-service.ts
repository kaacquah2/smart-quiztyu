import { prisma } from "./prisma"
import { programs } from "./program-data"

export interface QuizQuestion {
  text: string
  options: string[]
  correctAnswer: string
  explanation?: string
  difficulty?: string
}

export interface CourseInfo {
  id: string
  title: string
  description: string
  programId: string
  year: number
  semester: number
  difficulty: string
}

// Get course information for all courses
export function getAllCourses(): CourseInfo[] {
  const courses: CourseInfo[] = []
  
  for (const program of programs) {
    for (const year of program.years) {
      for (const semester of year.semesters) {
        for (const course of semester.courses) {
          courses.push({
            id: course.id,
            title: course.title,
            description: course.description || `Course covering ${course.title}`,
            programId: program.id,
            year: year.year,
            semester: semester.semester,
            difficulty: year.year === 1 ? "Beginner" : year.year === 2 ? "Intermediate" : "Advanced"
          })
        }
      }
    }
  }
  
  return courses
}

// Generate quiz questions using Gemini AI
export async function generateQuizQuestionsWithGemini(
  courseInfo: CourseInfo,
  questionCount: number = 10,
  difficulty?: string
): Promise<QuizQuestion[]> {
  try {
    // Check if Gemini API key is configured
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "your-gemini-api-key-here") {
      console.warn("Gemini API key not configured, falling back to basic questions")
      return generateBasicQuestions(courseInfo, questionCount)
    }

    const model = process.env.GEMINI_MODEL || "gemini-2.0-flash"
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`
    
    const actualDifficulty = difficulty || courseInfo.difficulty
    
    const prompt = createQuizGenerationPrompt(courseInfo, questionCount, actualDifficulty)
    
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
      console.error("Gemini API error:", errorData.error?.message || response.statusText)
      return generateBasicQuestions(courseInfo, questionCount)
    }

    const data = await response.json()
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ""
    
    // Parse Gemini response
    const questions = parseGeminiQuizResponse(text, courseInfo)
    
    // Ensure we have the right number of questions
    if (questions.length >= questionCount) {
      return questions.slice(0, questionCount)
    } else {
      // Fill with basic questions if needed
      const basicQuestions = generateBasicQuestions(courseInfo, questionCount - questions.length)
      return [...questions, ...basicQuestions]
    }
    
  } catch (error) {
    console.error("Error generating quiz questions with Gemini:", error)
    return generateBasicQuestions(courseInfo, questionCount)
  }
}

function createQuizGenerationPrompt(courseInfo: CourseInfo, questionCount: number, difficulty: string): string {
  const programName = programs.find(p => p.id === courseInfo.programId)?.name || courseInfo.programId
  
  return `
You are an expert educational AI assistant. Generate ${questionCount} multiple-choice quiz questions for a ${difficulty.toLowerCase()} level course.

COURSE INFORMATION:
- Course Title: ${courseInfo.title}
- Course Description: ${courseInfo.description}
- Program: ${programName}
- Year: ${courseInfo.year}
- Semester: ${courseInfo.semester}
- Difficulty Level: ${difficulty}

REQUIREMENTS:
1. Generate exactly ${questionCount} questions
2. Each question should have 4 multiple-choice options (A, B, C, D)
3. Questions should be appropriate for ${difficulty.toLowerCase()} level students
4. Include a mix of theoretical and practical questions
5. Make questions engaging and relevant to the course content
6. Ensure correct answers are well-distributed (not all A, B, C, or D)
7. Include brief explanations for correct answers

FORMAT YOUR RESPONSE AS JSON:
{
  "questions": [
    {
      "text": "Question text here?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": "Option A",
      "explanation": "Brief explanation of why this is correct"
    }
  ]
}

Make sure the JSON is valid and complete. Focus on creating questions that test understanding rather than just memorization.
`
}

function parseGeminiQuizResponse(text: string, courseInfo: CourseInfo): QuizQuestion[] {
  try {
    // Extract JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error("No JSON found in response")
    }
    
    const parsed = JSON.parse(jsonMatch[0])
    
    if (!parsed.questions || !Array.isArray(parsed.questions)) {
      throw new Error("Invalid questions format in response")
    }
    
    // Validate and sanitize each question
    const validQuestions: QuizQuestion[] = []
    
    for (const q of parsed.questions) {
      if (q.text && q.options && Array.isArray(q.options) && q.options.length === 4 && q.correctAnswer) {
        // Ensure correct answer is one of the options
        if (q.options.includes(q.correctAnswer)) {
          validQuestions.push({
            text: q.text.trim(),
            options: q.options.map((opt: string) => opt.trim()),
            correctAnswer: q.correctAnswer.trim(),
            explanation: q.explanation?.trim(),
            difficulty: courseInfo.difficulty
          })
        }
      }
    }
    
    return validQuestions
    
  } catch (error) {
    console.error("Error parsing Gemini quiz response:", error)
    return []
  }
}

function generateBasicQuestions(courseInfo: CourseInfo, questionCount: number): QuizQuestion[] {
  const templates = [
    {
      text: `What is the main focus of ${courseInfo.title}?`,
      options: ["Theory and concepts", "Practical applications", "Historical development", "All of the above"],
      correctAnswer: "All of the above"
    },
    {
      text: `Which of the following is most important in ${courseInfo.title}?`,
      options: ["Memorization", "Understanding concepts", "Speed", "Creativity"],
      correctAnswer: "Understanding concepts"
    },
    {
      text: `What skill is most valuable for ${courseInfo.title}?`,
      options: ["Critical thinking", "Memorization", "Speed reading", "Artistic ability"],
      correctAnswer: "Critical thinking"
    },
    {
      text: `Which approach is best for learning ${courseInfo.title}?`,
      options: ["Passive reading", "Active practice", "Memorization only", "Avoiding difficult topics"],
      correctAnswer: "Active practice"
    },
    {
      text: `What is the primary goal of ${courseInfo.title}?`,
      options: ["To pass exams", "To develop practical skills", "To understand fundamental principles", "All of the above"],
      correctAnswer: "All of the above"
    },
    {
      text: `In ${courseInfo.title}, what is the best way to approach problem-solving?`,
      options: ["Memorize solutions", "Understand the underlying principles", "Skip difficult problems", "Rely on intuition only"],
      correctAnswer: "Understand the underlying principles"
    },
    {
      text: `What type of assessment is most effective for ${courseInfo.title}?`,
      options: ["Multiple choice only", "Practical projects", "Oral presentations", "A combination of methods"],
      correctAnswer: "A combination of methods"
    },
    {
      text: `Which resource is most helpful for ${courseInfo.title}?`,
      options: ["Textbooks only", "Online tutorials", "Practice exercises", "All available resources"],
      correctAnswer: "All available resources"
    },
    {
      text: `What is the key to success in ${courseInfo.title}?`,
      options: ["Natural talent", "Consistent effort", "Last-minute cramming", "Avoiding challenges"],
      correctAnswer: "Consistent effort"
    },
    {
      text: `How should students approach ${courseInfo.title}?`,
      options: ["Independently only", "In study groups", "With instructor guidance", "A balanced approach"],
      correctAnswer: "A balanced approach"
    }
  ]
  
  const questions: QuizQuestion[] = []
  for (let i = 0; i < questionCount; i++) {
    const template = templates[i % templates.length]
    questions.push({
      text: template.text + (i >= templates.length ? ` (variant ${Math.floor(i/templates.length)+1})` : ''),
      options: template.options,
      correctAnswer: template.correctAnswer,
      difficulty: courseInfo.difficulty
    })
  }
  
  return questions
}

// Generate and save new quiz questions for a course
export async function generateAndSaveQuizQuestions(
  courseId: string,
  questionCount: number = 10,
  difficulty?: string
): Promise<boolean> {
  try {
    const courseInfo = getAllCourses().find(c => c.id === courseId)
    if (!courseInfo) {
      console.error(`Course not found: ${courseId}`)
      return false
    }

    // Generate new questions
    const questions = await generateQuizQuestionsWithGemini(courseInfo, questionCount, difficulty)
    
    if (questions.length === 0) {
      console.error(`Failed to generate questions for course: ${courseId}`)
      return false
    }

    // Check if quiz exists, create if not
    let quiz = await prisma.quiz.findUnique({
      where: { id: courseId }
    })

    if (!quiz) {
      quiz = await prisma.quiz.create({
        data: {
          id: courseId,
          title: courseInfo.title,
          description: courseInfo.description,
          difficulty: difficulty || courseInfo.difficulty,
          timeLimit: 15,
          tags: [courseInfo.programId, `year-${courseInfo.year}`, `semester-${courseInfo.semester}`]
        }
      })
      console.log(`Created new quiz for course: ${courseInfo.title}`)
    }

    // Clear existing questions
    await prisma.question.deleteMany({
      where: { quizId: courseId }
    })

    // Add new questions
    for (const questionData of questions) {
      await prisma.question.create({
        data: {
          text: questionData.text,
          options: questionData.options,
          correctAnswer: questionData.correctAnswer,
          quizId: courseId
        }
      })
    }

    console.log(`Generated ${questions.length} new questions for course: ${courseInfo.title}`)
    return true

  } catch (error) {
    console.error(`Error generating and saving quiz questions for ${courseId}:`, error)
    return false
  }
}

// Generate new questions for all courses
export async function generateQuestionsForAllCourses(
  questionCount: number = 10
): Promise<{ success: number; failed: number; total: number }> {
  const courses = getAllCourses()
  let success = 0
  let failed = 0

  console.log(`Generating new questions for ${courses.length} courses...`)

  for (const course of courses) {
    const result = await generateAndSaveQuizQuestions(course.id, questionCount)
    if (result) {
      success++
    } else {
      failed++
    }
  }

  return { success, failed, total: courses.length }
}

// Get a random subset of questions for a quiz (for randomization)
export async function getRandomQuizQuestions(
  courseId: string,
  questionCount: number = 5
): Promise<QuizQuestion[]> {
  try {
    const questions = await prisma.question.findMany({
      where: { quizId: courseId }
    })

    if (questions.length === 0) {
      return []
    }

    // Shuffle questions and take the requested number
    const shuffled = questions.sort(() => 0.5 - Math.random())
    return shuffled.slice(0, Math.min(questionCount, questions.length)).map(q => ({
      text: q.text,
      options: q.options,
      correctAnswer: q.correctAnswer,
      difficulty: q.quiz?.difficulty
    }))

  } catch (error) {
    console.error(`Error getting random questions for ${courseId}:`, error)
    return []
  }
} 