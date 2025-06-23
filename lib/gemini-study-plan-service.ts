import { programs } from "./program-data"
import { getResourcesForCourse } from "./resource-service"

export interface GeminiStudyPlan {
  courseTitle: string
  currentLevel: string
  targetScore: number
  programId: string
  studySteps: string[]
  personalizedAdvice: string
  focusAreas: string[]
  timeAllocation: {
    conceptReview: number
    practiceProblems: number
    advancedTopics: number
    realWorldApplications: number
  }
  weeklyGoals: string[]
  resources: {
    primary: string[]
    supplementary: string[]
    practice: string[]
  }
  estimatedImprovement: string
  nextMilestone: string
}

export interface QuizContext {
  quizId: string
  score: number
  totalQuestions: number
  courseId: string
  programId: string
  courseTitle: string
  incorrectAnswers?: string[]
  timeSpent?: number
  difficulty?: string
}

// Generate personalized study plan using Gemini AI
export async function generateGeminiStudyPlan(quizContext: QuizContext): Promise<GeminiStudyPlan | null> {
  try {
    // Check if Gemini API key is configured
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "your-gemini-api-key-here") {
      console.warn("Gemini API key not configured, falling back to basic study plan")
      return generateBasicStudyPlan(quizContext)
    }

    const percentage = (quizContext.score / quizContext.totalQuestions) * 100
    const courseResources = getResourcesForCourse(quizContext.courseId)
    
    // Create comprehensive prompt for Gemini
    const prompt = createStudyPlanPrompt(quizContext, courseResources, percentage)
    
    // Call Gemini API
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
      console.error("Gemini API error:", errorData.error?.message || response.statusText)
      return generateBasicStudyPlan(quizContext)
    }

    const data = await response.json()
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ""
    
    // Parse Gemini response
    const studyPlan = parseGeminiResponse(text, quizContext)
    
    return studyPlan
  } catch (error) {
    console.error("Error generating Gemini study plan:", error)
    return generateBasicStudyPlan(quizContext)
  }
}

function createStudyPlanPrompt(quizContext: QuizContext, courseResources: any[], percentage: number): string {
  const course = getCourseById(quizContext.programId, quizContext.courseId)
  const availableResources = courseResources.map(r => ({
    title: r.title,
    type: r.type,
    difficulty: r.tags.find(tag => ['beginner', 'intermediate', 'advanced'].includes(tag.toLowerCase())) || 'intermediate',
    rating: r.rating,
    duration: r.duration
  }))

  return `
You are an expert educational AI assistant. Generate a comprehensive, personalized study plan for a student based on their quiz performance.

STUDENT PERFORMANCE:
- Course: ${quizContext.courseTitle}
- Quiz Score: ${quizContext.score}/${quizContext.totalQuestions} (${percentage.toFixed(1)}%)
- Program: ${quizContext.programId}
- Time Spent: ${quizContext.timeSpent || 'Unknown'} seconds
- Difficulty Level: ${quizContext.difficulty || 'Standard'}

AVAILABLE RESOURCES:
${availableResources.map(r => `- ${r.title} (${r.type}, ${r.difficulty}, ${r.rating}/5, ${r.duration})`).join('\n')}

TASK: Create a detailed study plan in the following JSON format:

{
  "courseTitle": "${quizContext.courseTitle}",
  "currentLevel": "Beginner/Intermediate/Advanced",
  "targetScore": ${Math.min(100, percentage + 20)},
  "programId": "${quizContext.programId}",
  "studySteps": [
    "5 specific, actionable study steps tailored to the student's performance level"
  ],
  "personalizedAdvice": "2-3 sentences of personalized advice based on their score",
  "focusAreas": [
    "3 specific areas the student should focus on based on their performance"
  ],
  "timeAllocation": {
    "conceptReview": 25,
    "practiceProblems": 35,
    "advancedTopics": 25,
    "realWorldApplications": 15
  },
  "weeklyGoals": [
    "3 specific weekly goals to achieve the target score"
  ],
  "resources": {
    "primary": ["3 most important resource titles"],
    "supplementary": ["2 additional helpful resource titles"],
    "practice": ["2 practice-focused resource titles"]
  },
  "estimatedImprovement": "Expected improvement with this plan (e.g., '15-20% improvement in 2 weeks')",
  "nextMilestone": "Next achievement to aim for (e.g., 'Master intermediate concepts')"
}

GUIDELINES:
- If score < 40%: Focus on foundational concepts, basic terminology, and building confidence
- If score 40-70%: Focus on practice problems, concept connections, and filling knowledge gaps
- If score > 70%: Focus on advanced applications, real-world projects, and mastery
- Make advice specific to the course subject matter
- Ensure study steps are actionable and time-bound
- Consider the student's current level when recommending resources
- Be encouraging but realistic about improvement expectations

Respond only with the JSON object, no additional text.
`
}

function parseGeminiResponse(text: string, quizContext: QuizContext): GeminiStudyPlan {
  try {
    // Extract JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error("No JSON found in response")
    }
    
    const parsed = JSON.parse(jsonMatch[0])
    
    // Validate and sanitize the response
    return {
      courseTitle: parsed.courseTitle || quizContext.courseTitle,
      currentLevel: parsed.currentLevel || "Intermediate",
      targetScore: parsed.targetScore || Math.min(100, (quizContext.score / quizContext.totalQuestions) * 100 + 20),
      programId: parsed.programId || quizContext.programId,
      studySteps: Array.isArray(parsed.studySteps) ? parsed.studySteps : [],
      personalizedAdvice: parsed.personalizedAdvice || "Focus on understanding core concepts and practice regularly.",
      focusAreas: Array.isArray(parsed.focusAreas) ? parsed.focusAreas : [],
      timeAllocation: parsed.timeAllocation || {
        conceptReview: 25,
        practiceProblems: 35,
        advancedTopics: 25,
        realWorldApplications: 15
      },
      weeklyGoals: Array.isArray(parsed.weeklyGoals) ? parsed.weeklyGoals : [],
      resources: {
        primary: Array.isArray(parsed.resources?.primary) ? parsed.resources.primary : [],
        supplementary: Array.isArray(parsed.resources?.supplementary) ? parsed.resources.supplementary : [],
        practice: Array.isArray(parsed.resources?.practice) ? parsed.resources.practice : []
      },
      estimatedImprovement: parsed.estimatedImprovement || "10-15% improvement with consistent study",
      nextMilestone: parsed.nextMilestone || "Achieve intermediate level proficiency"
    }
  } catch (error) {
    console.error("Error parsing Gemini response:", error)
    return generateBasicStudyPlan(quizContext)
  }
}

function generateBasicStudyPlan(quizContext: QuizContext): GeminiStudyPlan {
  const percentage = (quizContext.score / quizContext.totalQuestions) * 100
  
  return {
    courseTitle: quizContext.courseTitle,
    currentLevel: percentage < 40 ? "Beginner" : percentage < 70 ? "Intermediate" : "Advanced",
    targetScore: Math.min(100, percentage + 20),
    programId: quizContext.programId,
    studySteps: [
      "Review foundational concepts and basic principles",
      "Practice with relevant examples and exercises",
      "Focus on areas where you made mistakes",
      "Connect different topics together",
      "Take practice quizzes to reinforce learning"
    ],
    personalizedAdvice: `Based on your score of ${percentage.toFixed(1)}%, focus on building a strong foundation and practicing regularly to improve your understanding.`,
    focusAreas: [
      "Core concepts and terminology",
      "Problem-solving techniques",
      "Practical applications"
    ],
    timeAllocation: {
      conceptReview: 30,
      practiceProblems: 40,
      advancedTopics: 20,
      realWorldApplications: 10
    },
    weeklyGoals: [
      "Complete 3 practice sessions",
      "Review 2 key concepts thoroughly",
      "Take 1 practice quiz"
    ],
    resources: {
      primary: ["Course materials", "Practice exercises", "Study guides"],
      supplementary: ["Online tutorials", "Reference materials"],
      practice: ["Mock quizzes", "Problem sets"]
    },
    estimatedImprovement: "10-15% improvement with consistent study",
    nextMilestone: "Achieve intermediate level proficiency"
  }
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

// Generate study plan for multiple courses
export async function generateMultiCourseStudyPlan(
  quizResults: Array<{ quizId: string; score: number; totalQuestions: number; courseId: string; programId: string; courseTitle: string }>
): Promise<{ [courseId: string]: GeminiStudyPlan }> {
  const studyPlans: { [courseId: string]: GeminiStudyPlan } = {}
  
  for (const result of quizResults) {
    const quizContext: QuizContext = {
      quizId: result.quizId,
      score: result.score,
      totalQuestions: result.totalQuestions,
      courseId: result.courseId,
      programId: result.programId,
      courseTitle: result.courseTitle
    }
    
    const studyPlan = await generateGeminiStudyPlan(quizContext)
    if (studyPlan) {
      studyPlans[result.courseId] = studyPlan
    }
  }
  
  return studyPlans
}

// Generate comprehensive program-wide study plan
export async function generateProgramStudyPlan(
  programId: string,
  quizResults: Array<{ quizId: string; score: number; totalQuestions: number; courseId: string; courseTitle: string }>
): Promise<{
  programOverview: string
  coursePlans: { [courseId: string]: GeminiStudyPlan }
  overallStrategy: string
  programGoals: string[]
}> {
  const coursePlans: { [courseId: string]: GeminiStudyPlan } = {}
  
  // Generate individual course plans
  for (const result of quizResults) {
    const quizContext: QuizContext = {
      quizId: result.quizId,
      score: result.score,
      totalQuestions: result.totalQuestions,
      courseId: result.courseId,
      programId: programId,
      courseTitle: result.courseTitle
    }
    
    const studyPlan = await generateGeminiStudyPlan(quizContext)
    if (studyPlan) {
      coursePlans[result.courseId] = studyPlan
    }
  }
  
  // Calculate overall performance
  const totalScore = quizResults.reduce((sum, result) => sum + result.score, 0)
  const totalQuestions = quizResults.reduce((sum, result) => sum + result.totalQuestions, 0)
  const overallPercentage = (totalScore / totalQuestions) * 100
  
  // Generate program overview using Gemini
  const programOverview = await generateProgramOverview(programId, quizResults, overallPercentage)
  
  return {
    programOverview,
    coursePlans,
    overallStrategy: generateOverallStrategy(overallPercentage, quizResults.length),
    programGoals: generateProgramGoals(overallPercentage, quizResults.length)
  }
}

async function generateProgramOverview(
  programId: string,
  quizResults: Array<{ quizId: string; score: number; totalQuestions: number; courseId: string; courseTitle: string }>,
  overallPercentage: number
): Promise<string> {
  try {
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "your-gemini-api-key-here") {
      return `Overall performance across ${quizResults.length} courses: ${overallPercentage.toFixed(1)}%. Focus on consistent study habits and regular practice.`
    }
    
    const model = process.env.GEMINI_MODEL || "gemini-2.0-flash"
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`
    
    const prompt = `
Generate a brief program overview for a student with the following performance:

Program: ${programId}
Overall Score: ${overallPercentage.toFixed(1)}%
Courses Taken: ${quizResults.length}
Course Performance:
${quizResults.map(r => `- ${r.courseTitle}: ${((r.score/r.totalQuestions)*100).toFixed(1)}%`).join('\n')}

Provide a 2-3 sentence overview of their overall academic standing and general study approach needed.
`
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    })
    
    if (response.ok) {
      const data = await response.json()
      return data.candidates?.[0]?.content?.parts?.[0]?.text || 
        `Overall performance: ${overallPercentage.toFixed(1)}%. Focus on consistent study habits.`
    }
  } catch (error) {
    console.error("Error generating program overview:", error)
  }
  
  return `Overall performance across ${quizResults.length} courses: ${overallPercentage.toFixed(1)}%. Focus on consistent study habits and regular practice.`
}

function generateOverallStrategy(overallPercentage: number, courseCount: number): string {
  if (overallPercentage < 50) {
    return "Focus on building strong foundations in each course. Prioritize understanding over memorization and seek help when needed."
  } else if (overallPercentage < 75) {
    return "Maintain consistent study habits while focusing on areas of weakness. Connect concepts across courses for deeper understanding."
  } else {
    return "Excellent performance! Focus on advanced applications and real-world projects. Consider mentoring others to reinforce your knowledge."
  }
}

function generateProgramGoals(overallPercentage: number, courseCount: number): string[] {
  if (overallPercentage < 50) {
    return [
      "Improve overall performance to 60% within 4 weeks",
      "Complete all foundational course materials",
      "Establish consistent daily study routine"
    ]
  } else if (overallPercentage < 75) {
    return [
      "Achieve 80% overall performance within 6 weeks",
      "Master intermediate concepts across all courses",
      "Develop advanced problem-solving skills"
    ]
  } else {
    return [
      "Maintain 85%+ performance across all courses",
      "Complete advanced projects and applications",
      "Prepare for professional certification or advanced studies"
    ]
  }
} 