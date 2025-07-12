import { prisma } from "./prisma"
import { getAllPrograms, getCourseById, type Program, type Course } from "./program-service"

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
export async function getAllCourses(): Promise<CourseInfo[]> {
  try {
    const programs = await getAllPrograms()
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
  } catch (error) {
    console.error('Error fetching courses:', error)
    return []
  }
}

// Generate basic quiz questions without AI
export function generateBasicQuestions(
  courseInfo: CourseInfo,
  questionCount: number = 10
): QuizQuestion[] {
  const questions: QuizQuestion[] = []
  
  // Template questions based on course type and difficulty
  const templates = [
    {
      text: `What is the main focus of ${courseInfo.title}?`,
      options: ["Theory and concepts", "Practical applications", "Historical development", "All of the above"],
      correctAnswer: "All of the above",
      explanation: "This course covers multiple aspects including theory, practical applications, and historical context."
    },
    {
      text: `Which of the following is most important in ${courseInfo.title}?`,
      options: ["Memorization", "Understanding concepts", "Speed", "Creativity"],
      correctAnswer: "Understanding concepts",
      explanation: "Understanding core concepts is fundamental to mastering this subject."
    },
    {
      text: `What type of skills does ${courseInfo.title} primarily develop?`,
      options: ["Technical skills", "Analytical thinking", "Communication skills", "All of the above"],
      correctAnswer: "All of the above",
      explanation: "This course develops a combination of technical, analytical, and communication skills."
    },
    {
      text: `In ${courseInfo.title}, what is the best approach to problem-solving?`,
      options: ["Memorizing solutions", "Understanding the problem first", "Guessing quickly", "Avoiding difficult problems"],
      correctAnswer: "Understanding the problem first",
      explanation: "Always start by understanding the problem thoroughly before attempting to solve it."
    },
    {
      text: `What is a key principle in ${courseInfo.title}?`,
      options: ["Speed over accuracy", "Accuracy over speed", "Balance of both", "Neither matters"],
      correctAnswer: "Balance of both",
      explanation: "Both speed and accuracy are important, but they should be balanced appropriately."
    },
    {
      text: `Which of the following best describes ${courseInfo.title}?`,
      options: ["A theoretical course only", "A practical course only", "A combination of theory and practice", "An optional course"],
      correctAnswer: "A combination of theory and practice",
      explanation: "This course combines theoretical knowledge with practical applications."
    },
    {
      text: `What is the primary goal of studying ${courseInfo.title}?`,
      options: ["To pass exams", "To get a good grade", "To develop skills and knowledge", "To avoid other courses"],
      correctAnswer: "To develop skills and knowledge",
      explanation: "The main goal is to develop relevant skills and knowledge for future use."
    },
    {
      text: `In ${courseInfo.title}, what should you do when you encounter a difficult concept?`,
      options: ["Skip it entirely", "Ask for help and practice", "Memorize it without understanding", "Ignore it"],
      correctAnswer: "Ask for help and practice",
      explanation: "When facing difficult concepts, seek help and practice to improve understanding."
    },
    {
      text: `What is the best way to prepare for ${courseInfo.title} assessments?`,
      options: ["Cramming the night before", "Regular study and practice", "Avoiding the material", "Relying on luck"],
      correctAnswer: "Regular study and practice",
      explanation: "Consistent study and practice over time is the most effective preparation method."
    },
    {
      text: `Which of the following is true about ${courseInfo.title}?`,
      options: ["It's only for advanced students", "It's only for beginners", "It's suitable for all levels", "It's not important"],
      correctAnswer: "It's suitable for all levels",
      explanation: "This course is designed to accommodate students at different levels of experience."
    }
  ]

  // Generate questions based on templates and course info
  for (let i = 0; i < Math.min(questionCount, templates.length); i++) {
    const template = templates[i]
    questions.push({
      text: template.text,
      options: template.options,
      correctAnswer: template.correctAnswer,
      explanation: template.explanation,
      difficulty: courseInfo.difficulty
    })
  }

  // If we need more questions, generate additional ones
  if (questions.length < questionCount) {
    const additionalQuestions = generateAdditionalQuestions(courseInfo, questionCount - questions.length)
    questions.push(...additionalQuestions)
  }

  return questions.slice(0, questionCount)
}

function generateAdditionalQuestions(courseInfo: CourseInfo, count: number): QuizQuestion[] {
  const questions: QuizQuestion[] = []
  
  const additionalTemplates = [
    {
      text: `What is a common challenge in ${courseInfo.title}?`,
      options: ["Lack of resources", "Complex concepts", "Time management", "All of the above"],
      correctAnswer: "All of the above",
      explanation: "Students often face multiple challenges including resource limitations, complex concepts, and time management."
    },
    {
      text: `How should you approach learning ${courseInfo.title}?`,
      options: ["Passively", "Actively and consistently", "Only when required", "Never"],
      correctAnswer: "Actively and consistently",
      explanation: "Active and consistent engagement is key to successful learning."
    },
    {
      text: `What is the role of practice in ${courseInfo.title}?`,
      options: ["Unnecessary", "Essential for mastery", "Optional", "Harmful"],
      correctAnswer: "Essential for mastery",
      explanation: "Practice is crucial for developing proficiency and understanding."
    }
  ]

  for (let i = 0; i < Math.min(count, additionalTemplates.length); i++) {
    const template = additionalTemplates[i]
    questions.push({
      text: template.text,
      options: template.options,
      correctAnswer: template.correctAnswer,
      explanation: template.explanation,
      difficulty: courseInfo.difficulty
    })
  }

  return questions
}

// Generate and save quiz questions for a specific course
export async function generateBasicQuestionsForCourse(
  courseId: string,
  questionCount: number = 10,
  difficulty?: string
): Promise<boolean> {
  try {
    // Find course info
    const courseInfo = await findCourseById(courseId)
    if (!courseInfo) {
      console.error(`Course not found: ${courseId}`)
      return false
    }

    // Generate questions
    const questions = generateBasicQuestions(courseInfo, questionCount)
    
    // Save to database
    for (const question of questions) {
      await prisma.question.create({
        data: {
          quizId: courseId,
          text: question.text,
          options: question.options,
          correctAnswer: question.correctAnswer,
          explanation: question.explanation || "",
          difficulty: question.difficulty || "Medium"
        }
      })
    }

    console.log(`Generated ${questions.length} questions for course: ${courseId}`)
    return true

  } catch (error) {
    console.error(`Error generating questions for course ${courseId}:`, error)
    return false
  }
}

// Generate questions for all courses
export async function generateBasicQuestionsForAllCourses(
  questionCount: number = 10
): Promise<{ success: number; failed: number; total: number }> {
  const courses = await getAllCourses()
  let success = 0
  let failed = 0

  for (const course of courses) {
    const result = await generateBasicQuestionsForCourse(course.id, questionCount)
    if (result) {
      success++
    } else {
      failed++
    }
  }

  return {
    success,
    failed,
    total: courses.length
  }
}

// Get random quiz questions for a course
export async function getRandomQuizQuestions(
  courseId: string,
  questionCount: number = 5
): Promise<QuizQuestion[]> {
  try {
    const questions = await prisma.question.findMany({
      where: {
        quizId: courseId
      }
    })

    // Shuffle and return requested number
    const shuffled = questions.sort(() => 0.5 - Math.random())
    return shuffled.slice(0, Math.min(questionCount, shuffled.length))

  } catch (error) {
    console.error(`Error fetching random questions for course ${courseId}:`, error)
    return []
  }
}

// Helper function to find course by ID
async function findCourseById(courseId: string): Promise<CourseInfo | null> {
  try {
    const programs = await getAllPrograms()
    
    for (const program of programs) {
      for (const year of program.years) {
        for (const semester of year.semesters) {
          const course = semester.courses.find(c => c.id === courseId)
          if (course) {
            return {
              id: course.id,
              title: course.title,
              description: course.description || `Course covering ${course.title}`,
              programId: program.id,
              year: year.year,
              semester: semester.semester,
              difficulty: year.year === 1 ? "Beginner" : year.year === 2 ? "Intermediate" : "Advanced"
            }
          }
        }
      }
    }
    return null
  } catch (error) {
    console.error('Error finding course by ID:', error)
    return null
  }
} 