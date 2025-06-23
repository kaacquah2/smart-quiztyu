require('dotenv').config()
const fs = require('fs')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

// Get all courses from program data
function getAllCourses() {
  const courses = [
    // Computer Science Courses
    { id: "intro-to-cs", title: "Introduction to Computer Science", description: "Basic computer science concepts and programming fundamentals", programId: "computer-science", year: 1, semester: 1, difficulty: "Beginner" },
    { id: "programming-fundamentals", title: "Programming Fundamentals", description: "Basic programming concepts and problem-solving", programId: "computer-science", year: 1, semester: 1, difficulty: "Beginner" },
    { id: "data-structures", title: "Data Structures and Algorithms", description: "Fundamental data structures and algorithm design", programId: "computer-science", year: 1, semester: 2, difficulty: "Intermediate" },
    { id: "discrete-math", title: "Discrete Mathematics", description: "Mathematical structures for computer science", programId: "computer-science", year: 1, semester: 2, difficulty: "Intermediate" },
    { id: "database-systems", title: "Database Systems I", description: "Introduction to database design and SQL", programId: "computer-science", year: 1, semester: 2, difficulty: "Intermediate" },
    { id: "computer-organization", title: "Computer Organization", description: "Computer architecture and organization", programId: "computer-science", year: 1, semester: 2, difficulty: "Intermediate" },
    { id: "intro-software-eng", title: "Introduction to Software Engineering", description: "Software development methodologies and practices", programId: "computer-science", year: 1, semester: 2, difficulty: "Intermediate" },
    { id: "algorithms", title: "Algorithms and Complexity", description: "Algorithm design and analysis", programId: "computer-science", year: 2, semester: 1, difficulty: "Advanced" },
    { id: "operating-systems", title: "Operating Systems", description: "Operating system concepts and design", programId: "computer-science", year: 2, semester: 1, difficulty: "Advanced" },
    { id: "computer-networks", title: "Computer Networks", description: "Network protocols and architecture", programId: "computer-science", year: 2, semester: 1, difficulty: "Advanced" },
    { id: "software-engineering", title: "Software Engineering", description: "Advanced software development practices", programId: "computer-science", year: 2, semester: 1, difficulty: "Advanced" },
    { id: "artificial-intelligence", title: "Artificial Intelligence", description: "AI concepts, machine learning, and intelligent systems", programId: "computer-science", year: 2, semester: 2, difficulty: "Advanced" },
    { id: "machine-learning", title: "Machine Learning", description: "Machine learning algorithms and applications", programId: "computer-science", year: 2, semester: 2, difficulty: "Advanced" },
    { id: "computer-graphics", title: "Computer Graphics", description: "Graphics programming and visualization", programId: "computer-science", year: 2, semester: 2, difficulty: "Advanced" },
    { id: "cybersecurity", title: "Cybersecurity", description: "Security principles and practices", programId: "computer-science", year: 2, semester: 2, difficulty: "Advanced" },
    
    // Electrical Engineering Courses
    { id: "circuit-analysis", title: "Circuit Analysis", description: "Electrical circuit theory and analysis techniques", programId: "electrical-engineering", year: 1, semester: 1, difficulty: "Beginner" },
    { id: "electronics-1", title: "Electronics I", description: "Basic electronic components and circuits", programId: "electrical-engineering", year: 1, semester: 1, difficulty: "Beginner" },
    { id: "digital-logic", title: "Digital Logic Design", description: "Digital circuit design and logic gates", programId: "electrical-engineering", year: 1, semester: 2, difficulty: "Intermediate" },
    { id: "electromagnetics", title: "Electromagnetics", description: "Electromagnetic field theory", programId: "electrical-engineering", year: 1, semester: 2, difficulty: "Intermediate" },
    { id: "electronics-2", title: "Electronics II", description: "Advanced electronic circuits and systems", programId: "electrical-engineering", year: 2, semester: 1, difficulty: "Advanced" },
    { id: "power-systems", title: "Power Systems", description: "Electrical power generation and distribution", programId: "electrical-engineering", year: 2, semester: 1, difficulty: "Advanced" },
    { id: "control-systems", title: "Control Systems", description: "Feedback control theory and applications", programId: "electrical-engineering", year: 2, semester: 2, difficulty: "Advanced" },
    { id: "communications", title: "Communications Engineering", description: "Signal processing and communication systems", programId: "electrical-engineering", year: 2, semester: 2, difficulty: "Advanced" },
    
    // Business Administration Courses
    { id: "intro-business", title: "Introduction to Business", description: "Business fundamentals and management principles", programId: "business-admin", year: 1, semester: 1, difficulty: "Beginner" },
    { id: "accounting-principles", title: "Accounting Principles", description: "Basic accounting concepts and practices", programId: "business-admin", year: 1, semester: 1, difficulty: "Beginner" },
    { id: "marketing-principles", title: "Marketing Principles", description: "Marketing concepts and strategies", programId: "business-admin", year: 1, semester: 2, difficulty: "Intermediate" },
    { id: "financial-accounting", title: "Financial Accounting", description: "Financial reporting and analysis", programId: "business-admin", year: 1, semester: 2, difficulty: "Intermediate" },
    { id: "business-statistics", title: "Business Statistics", description: "Statistical methods for business decision making", programId: "business-admin", year: 1, semester: 2, difficulty: "Intermediate" },
    { id: "management-principles", title: "Management Principles", description: "Management theory and organizational behavior", programId: "business-admin", year: 2, semester: 1, difficulty: "Advanced" },
    { id: "finance", title: "Corporate Finance", description: "Financial management and investment analysis", programId: "business-admin", year: 2, semester: 1, difficulty: "Advanced" },
    { id: "marketing", title: "Marketing Management", description: "Advanced marketing strategies and management", programId: "business-admin", year: 2, semester: 1, difficulty: "Advanced" },
    { id: "operations-management", title: "Operations Management", description: "Production and operations management", programId: "business-admin", year: 2, semester: 2, difficulty: "Advanced" },
    { id: "business-strategy", title: "Business Strategy", description: "Strategic management and competitive analysis", programId: "business-admin", year: 2, semester: 2, difficulty: "Advanced" },
    
    // Nursing Courses
    { id: "intro-nursing", title: "Introduction to Nursing", description: "Nursing fundamentals and professional practice", programId: "nursing", year: 1, semester: 1, difficulty: "Beginner" },
    { id: "anatomy-physiology-1", title: "Anatomy and Physiology I", description: "Human anatomy and physiological systems", programId: "nursing", year: 1, semester: 1, difficulty: "Beginner" },
    { id: "nursing-fundamentals", title: "Nursing Fundamentals", description: "Basic nursing skills and patient care", programId: "nursing", year: 1, semester: 2, difficulty: "Intermediate" },
    { id: "anatomy-physiology-2", title: "Anatomy and Physiology II", description: "Advanced human anatomy and physiology", programId: "nursing", year: 1, semester: 2, difficulty: "Intermediate" },
    { id: "health-assessment", title: "Health Assessment", description: "Patient assessment and health evaluation", programId: "nursing", year: 1, semester: 2, difficulty: "Intermediate" },
    { id: "medical-surgical-nursing", title: "Medical-Surgical Nursing", description: "Adult health and illness nursing care", programId: "nursing", year: 2, semester: 1, difficulty: "Advanced" },
    { id: "pharmacology", title: "Pharmacology", description: "Drug therapy and medication management", programId: "nursing", year: 2, semester: 1, difficulty: "Advanced" },
    { id: "maternal-child-nursing", title: "Maternal-Child Nursing", description: "Women's health and pediatric nursing", programId: "nursing", year: 2, semester: 2, difficulty: "Advanced" },
    { id: "mental-health-nursing", title: "Mental Health Nursing", description: "Psychiatric and mental health nursing", programId: "nursing", year: 2, semester: 2, difficulty: "Advanced" },
    { id: "community-health", title: "Community Health Nursing", description: "Public health and community nursing", programId: "nursing", year: 2, semester: 2, difficulty: "Advanced" }
  ]
  
  return courses
}

// Generate basic questions as fallback
function generateBasicQuestions(courseInfo, questionCount) {
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
  
  const questions = []
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

// Generate questions using Gemini AI
async function generateQuizQuestionsWithGemini(courseInfo, questionCount = 10) {
  try {
    // Check if Gemini API key is configured
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "your-gemini-api-key-here") {
      console.warn("Gemini API key not configured, falling back to basic questions")
      return generateBasicQuestions(courseInfo, questionCount)
    }

    const model = process.env.GEMINI_MODEL || "gemini-2.0-flash"
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`
    
    const prompt = `
You are an expert educational AI assistant. Generate ${questionCount} multiple-choice quiz questions for a ${courseInfo.difficulty.toLowerCase()} level course.

COURSE INFORMATION:
- Course Title: ${courseInfo.title}
- Course Description: ${courseInfo.description}
- Program: ${courseInfo.programId}
- Year: ${courseInfo.year}
- Semester: ${courseInfo.semester}
- Difficulty Level: ${courseInfo.difficulty}

REQUIREMENTS:
1. Generate exactly ${questionCount} questions
2. Each question should have 4 multiple-choice options (A, B, C, D)
3. Questions should be appropriate for ${courseInfo.difficulty.toLowerCase()} level students
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
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error("No JSON found in response")
      }
      
      const parsed = JSON.parse(jsonMatch[0])
      
      if (!parsed.questions || !Array.isArray(parsed.questions)) {
        throw new Error("Invalid questions format in response")
      }
      
      // Validate and sanitize each question
      const validQuestions = []
      
      for (const q of parsed.questions) {
        if (q.text && q.options && Array.isArray(q.options) && q.options.length === 4 && q.correctAnswer) {
          // Ensure correct answer is one of the options
          if (q.options.includes(q.correctAnswer)) {
            validQuestions.push({
              text: q.text.trim(),
              options: q.options.map((opt) => opt.trim()),
              correctAnswer: q.correctAnswer.trim(),
              explanation: q.explanation?.trim(),
              difficulty: courseInfo.difficulty
            })
          }
        }
      }
      
      // Ensure we have the right number of questions
      if (validQuestions.length >= questionCount) {
        return validQuestions.slice(0, questionCount)
      } else {
        // Fill with basic questions if needed
        const basicQuestions = generateBasicQuestions(courseInfo, questionCount - validQuestions.length)
        return [...validQuestions, ...basicQuestions]
      }
      
    } catch (error) {
      console.error("Error parsing Gemini response:", error)
      return generateBasicQuestions(courseInfo, questionCount)
    }
    
  } catch (error) {
    console.error("Error generating quiz questions with Gemini:", error)
    return generateBasicQuestions(courseInfo, questionCount)
  }
}

// Generate and save quiz questions for a course
async function generateAndSaveQuizQuestions(courseId, questionCount = 10) {
  try {
    const courses = getAllCourses()
    const courseInfo = courses.find(c => c.id === courseId)
    if (!courseInfo) {
      console.error(`Course not found: ${courseId}`)
      return false
    }

    // Generate new questions
    const questions = await generateQuizQuestionsWithGemini(courseInfo, questionCount)
    
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
          difficulty: courseInfo.difficulty,
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

// Generate questions for all courses
async function generateQuestionsForAllCourses(questionCount = 10) {
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

async function generateAllQuizQuestions() {
  try {
    console.log('🚀 Starting quiz question generation for all courses...')
    console.log('=' .repeat(60))
    
    // Check if Gemini API key is configured
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "your-gemini-api-key-here") {
      console.log("❌ GEMINI_API_KEY not configured in .env file")
      console.log("Please set your Gemini API key to generate AI-powered questions")
      console.log("You can get one from: https://makersuite.google.com/app/apikey")
      return
    }
    
    console.log("✅ Gemini API key configured")
    console.log("✅ Starting AI-powered question generation\n")
    
    // Get all courses
    const courses = getAllCourses()
    console.log(`📚 Found ${courses.length} courses across all programs`)
    
    // Generate questions for all courses
    const result = await generateQuestionsForAllCourses(10) // 10 questions per course
    
    console.log("\n" + "=" .repeat(60))
    console.log("📊 QUIZ QUESTION GENERATION RESULTS")
    console.log("=" .repeat(60))
    console.log(`✅ Successfully generated questions for: ${result.success} courses`)
    console.log(`❌ Failed to generate questions for: ${result.failed} courses`)
    console.log(`📈 Success rate: ${((result.success / result.total) * 100).toFixed(1)}%`)
    console.log(`🎯 Total questions generated: ${result.success * 10}`)
    
    if (result.failed > 0) {
      console.log("\n⚠️  Some courses failed to generate questions.")
      console.log("This might be due to:")
      console.log("• API rate limits")
      console.log("• Network connectivity issues")
      console.log("• Invalid course data")
      console.log("\nYou can retry the generation process.")
    }
    
    console.log("\n🎉 Quiz question generation completed!")
    console.log("All generated questions are now available in the database.")
    console.log("Students will get random questions each time they take a quiz.")
    
  } catch (error) {
    console.error('❌ Error generating quiz questions:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

// Run the script
if (require.main === module) {
  generateAllQuizQuestions()
    .then(() => {
      console.log('\n✅ Script completed successfully')
      process.exit(0)
    })
    .catch((error) => {
      console.error('\n❌ Script failed:', error)
      process.exit(1)
    })
}

module.exports = { generateAllQuizQuestions } 