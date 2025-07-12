import { getAllPrograms, getCourseById, type Program, type Course } from "./program-service"
import { getResourcesForCourse } from "./resource-service"
import { cacheService } from "./cache-service"

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

// Generate personalized study plan using Gemini AI with caching
export async function generateGeminiStudyPlan(quizContext: QuizContext, userId?: string): Promise<GeminiStudyPlan | null> {
  const startTime = Date.now()
  
  try {
    // Check if Gemini API key is configured
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "your-gemini-api-key-here") {
      console.warn("Gemini API key not configured, falling back to basic study plan")
      return generateBasicStudyPlan(quizContext)
    }

    // Try to get from cache first
    const cached = await cacheService.getCachedStudyPlan(
      quizContext,
      'gemini',
      userId,
      quizContext.courseId
    )

    if (cached) {
      // Log cache hit
      await cacheService.logAPICall({
        userId,
        apiProvider: 'gemini',
        endpoint: 'study-plan',
        success: true,
        cacheHit: true,
        responseTime: Date.now() - startTime
      })

      return cached.studyPlan as GeminiStudyPlan
    }

    const percentage = (quizContext.score / quizContext.totalQuestions) * 100
    const courseResources = await getResourcesForCourse(quizContext.courseId)
    const course = await getCourseById(quizContext.programId, quizContext.courseId)
    
    // Create comprehensive prompt for Gemini
    const prompt = createStudyPlanPrompt(quizContext, courseResources, percentage, course)
    
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
      
      // Log failed API call
      await cacheService.logAPICall({
        userId,
        apiProvider: 'gemini',
        endpoint: 'study-plan',
        success: false,
        cacheHit: false,
        responseTime: Date.now() - startTime,
        errorMessage: errorData.error?.message || response.statusText
      })
      
      return generateBasicStudyPlan(quizContext)
    }

    const data = await response.json()
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ""
    
    // Parse Gemini response
    const studyPlan = parseGeminiResponse(text, quizContext)
    
    // Cache the successful response
    await cacheService.cacheStudyPlan(
      quizContext,
      'gemini',
      {
        studyPlan,
        quizContext,
        confidence: calculateStudyPlanConfidence(studyPlan, percentage),
        generatedBy: 'Gemini AI'
      },
      userId,
      quizContext.courseId
    )

    // Log successful API call
    await cacheService.logAPICall({
      userId,
      apiProvider: 'gemini',
      endpoint: 'study-plan',
      success: true,
      cacheHit: false,
      responseTime: Date.now() - startTime,
      cost: estimateGeminiCost(text),
      tokens: estimateGeminiTokens(prompt, text)
    })
    
    return studyPlan
  } catch (error) {
    console.error("Error generating Gemini study plan:", error)
    
    // Log failed API call
    await cacheService.logAPICall({
      userId,
      apiProvider: 'gemini',
      endpoint: 'study-plan',
      success: false,
      cacheHit: false,
      responseTime: Date.now() - startTime,
      errorMessage: error instanceof Error ? error.message : 'Unknown error'
    })
    
    return generateBasicStudyPlan(quizContext)
  }
}

/**
 * Calculate study plan confidence based on various factors
 */
function calculateStudyPlanConfidence(studyPlan: GeminiStudyPlan, percentage: number): number {
  let confidence = 70 // Base confidence

  // Factor in study plan completeness
  if (studyPlan.studySteps.length >= 5) confidence += 10
  if (studyPlan.focusAreas.length >= 3) confidence += 10
  if (studyPlan.weeklyGoals.length >= 3) confidence += 10

  // Factor in performance level
  if (percentage > 80) confidence += 5
  else if (percentage > 60) confidence += 10
  else confidence += 15 // Higher confidence for lower performers (more room for improvement)

  // Factor in resource recommendations
  const totalResources = studyPlan.resources.primary.length + 
                        studyPlan.resources.supplementary.length + 
                        studyPlan.resources.practice.length
  if (totalResources >= 5) confidence += 5

  return Math.min(100, confidence)
}

/**
 * Estimate Gemini API cost
 */
function estimateGeminiCost(responseText: string): number {
  // Rough estimation: $0.0005 per 1K characters for Gemini
  const estimatedChars = responseText.length
  return (estimatedChars / 1000) * 0.0005
}

/**
 * Estimate Gemini token count
 */
function estimateGeminiTokens(prompt: string, response: string): number {
  // Rough estimation: 1 token ≈ 4 characters
  const totalChars = prompt.length + response.length
  return Math.round(totalChars / 4)
}

function createStudyPlanPrompt(quizContext: QuizContext, courseResources: any[], percentage: number, course?: any): string {
  const availableResources = courseResources.map(r => ({
    title: r.title,
    type: r.type,
    difficulty: r.tags.find((tag: string) => ['beginner', 'intermediate', 'advanced'].includes(tag.toLowerCase())) || 'intermediate',
    rating: r.rating,
    duration: r.duration
  }))

  // Enhanced context analysis
  const performanceAnalysis = buildDetailedPerformanceAnalysis(quizContext, percentage)
  const learningInsights = analyzeLearningInsights(quizContext)
  const resourceContext = buildResourceContext(availableResources)
  const courseContext = buildCourseContext(course, quizContext)

  return `
You are an expert educational AI assistant. Generate a comprehensive, personalized study plan for a student based on their detailed quiz performance and learning patterns.

STUDENT PERFORMANCE DATA:
- Course: ${quizContext.courseTitle}
- Quiz Score: ${quizContext.score}/${quizContext.totalQuestions} (${percentage.toFixed(1)}%)
- Program: ${quizContext.programId}
- Time Spent: ${quizContext.timeSpent || 'Unknown'} seconds
- Difficulty Level: ${quizContext.difficulty || 'Standard'}

DETAILED PERFORMANCE ANALYSIS:
${performanceAnalysis}

LEARNING INSIGHTS:
${learningInsights}

COURSE CONTEXT:
${courseContext}

AVAILABLE RESOURCES: ${availableResources.length} curated resources
${resourceContext}

TASK: Create a detailed study plan in the following JSON format:

{
  "courseTitle": "${quizContext.courseTitle}",
  "currentLevel": "Beginner/Intermediate/Advanced",
  "targetScore": ${Math.min(100, percentage + 20)},
  "programId": "${quizContext.programId}",
  "studySteps": [
    "5 specific, actionable study steps tailored to the student's performance level and learning patterns"
  ],
  "personalizedAdvice": "2-3 sentences of personalized advice based on their detailed performance analysis",
  "focusAreas": [
    "3 specific areas the student should focus on based on their performance and learning insights"
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
    "primary": ["3 most important resource titles based on performance gaps"],
    "supplementary": ["2 additional helpful resource titles"],
    "practice": ["2 practice-focused resource titles"]
  },
  "estimatedImprovement": "Expected improvement with this plan (e.g., '15-20% improvement in 2 weeks')",
  "nextMilestone": "Next achievement to aim for (e.g., 'Master intermediate concepts')",
  "studySchedule": {
    "recommendedSessionsPerWeek": 3,
    "sessionDuration": 45,
    "breakFrequency": 15,
    "optimalTimeOfDay": "morning/afternoon/evening"
  },
  "learningStrategies": [
    "2-3 specific learning strategies based on the student's performance patterns"
  ],
  "confidence": ${Math.min(100, Math.max(0, percentage + 20))}
}

GUIDELINES:
- If score < 40%: Focus on foundational concepts, basic terminology, and building confidence
- If score 40-70%: Focus on practice problems, concept connections, and filling knowledge gaps
- If score > 70%: Focus on advanced applications, real-world projects, and mastery
- Consider the student's time management patterns and efficiency
- Address specific learning gaps identified in the performance analysis
- Make advice specific to the course subject matter and student's learning style
- Ensure study steps are actionable and time-bound
- Consider the student's current level when recommending resources
- Be encouraging but realistic about improvement expectations
- Include strategies for improving time management if needed

Respond only with the JSON object, no additional text.
`
}

/**
 * Build detailed performance analysis for enhanced context
 */
function buildDetailedPerformanceAnalysis(quizContext: QuizContext, percentage: number): string {
  const timePerQuestion = quizContext.timeSpent ? quizContext.timeSpent / quizContext.totalQuestions : 0
  const timeEfficiency = timePerQuestion > 0 ? percentage / (timePerQuestion / 60) : 0
  
  let analysis = `- Overall Performance: ${percentage.toFixed(1)}%
- Questions Attempted: ${quizContext.totalQuestions}
- Time per Question: ${timePerQuestion > 0 ? `${Math.round(timePerQuestion)}s` : 'Unknown'}
- Time Efficiency: ${timeEfficiency > 0 ? `${Math.round(timeEfficiency * 100) / 100} points per minute` : 'Unknown'}`

  // Add difficulty-specific analysis if available
  if (quizContext.difficulty) {
    analysis += `\n- Quiz Difficulty: ${quizContext.difficulty}`
  }

  // Add incorrect answers analysis if available
  if (quizContext.incorrectAnswers && quizContext.incorrectAnswers.length > 0) {
    analysis += `\n- Incorrect Answers: ${quizContext.incorrectAnswers.length} out of ${quizContext.totalQuestions}`
  }

  // Performance level assessment
  let performanceLevel = 'Intermediate'
  if (percentage < 40) performanceLevel = 'Beginner'
  else if (percentage > 80) performanceLevel = 'Advanced'
  
  analysis += `\n- Performance Level: ${performanceLevel}
- Efficiency Rating: ${timeEfficiency > 2.0 ? 'High' : timeEfficiency > 1.0 ? 'Medium' : 'Low'}`

  return analysis
}

/**
 * Analyze learning insights from quiz context
 */
function analyzeLearningInsights(quizContext: QuizContext): string {
  const percentage = (quizContext.score / quizContext.totalQuestions) * 100
  const timePerQuestion = quizContext.timeSpent ? quizContext.timeSpent / quizContext.totalQuestions : 0
  
  let insights = []

  // Time management insights
  if (timePerQuestion > 0) {
    if (timePerQuestion < 30) {
      insights.push('May be rushing through questions - consider slowing down')
    } else if (timePerQuestion > 120) {
      insights.push('Taking time to think through problems - good for accuracy')
    } else {
      insights.push('Balanced time management approach')
    }
  }

  // Performance insights
  if (percentage < 50) {
    insights.push('Needs foundational concept review')
  } else if (percentage < 70) {
    insights.push('Has basic understanding but needs practice')
  } else {
    insights.push('Strong grasp of concepts - ready for advanced topics')
  }

  // Learning style indicators
  if (quizContext.incorrectAnswers && quizContext.incorrectAnswers.length > 0) {
    insights.push('May benefit from targeted practice on specific topics')
  }

  return insights.length > 0 ? insights.join('\n- ') : 'Standard learning patterns observed'
}

/**
 * Build resource context for better recommendations
 */
function buildResourceContext(availableResources: any[]): string {
  if (availableResources.length === 0) return "No specific resources available"

  const resourceTypes = availableResources.reduce((acc, resource) => {
    acc[resource.type] = (acc[resource.type] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const difficultyLevels = availableResources.reduce((acc, resource) => {
    acc[resource.difficulty] = (acc[resource.difficulty] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const highQualityResources = availableResources.filter(r => r.rating && r.rating > 4.0).length
  const avgDuration = Math.round(availableResources.reduce((sum, r) => sum + (parseInt(r.duration) || 45), 0) / availableResources.length)

  return `
Resource Distribution:
- Types: ${Object.entries(resourceTypes).map(([type, count]) => `${type}: ${count}`).join(', ')}
- Difficulty Levels: ${Object.entries(difficultyLevels).map(([diff, count]) => `${diff}: ${count}`).join(', ')}
- High-Quality Resources (4+ rating): ${highQualityResources}
- Average Duration: ${avgDuration} minutes`
}

/**
 * Build course context for better personalization
 */
function buildCourseContext(course: any, quizContext: QuizContext): string {
  if (!course) return "Course information not available"

  const yearLevel = quizContext.programId.includes('1') ? 'First Year' : 
                   quizContext.programId.includes('2') ? 'Second Year' : 'Advanced'
  
  const semesterFocus = quizContext.programId.includes('1') ? 'Foundation building' : 
                       quizContext.programId.includes('2') ? 'Intermediate concepts' : 'Advanced applications'

  return `- Course Level: ${yearLevel}
- Semester Focus: ${semesterFocus}
- Course Type: ${getCourseType(course.title)}
- Typical Prerequisites: ${getPrerequisites(course.title)}
- Expected Outcomes: ${getExpectedOutcomes(course.title)}`
}

/**
 * Get course type for context
 */
function getCourseType(courseTitle: string): string {
  const title = courseTitle.toLowerCase()
  
  if (title.includes('programming') || title.includes('coding')) return 'Programming/Development'
  if (title.includes('algorithm') || title.includes('data structure')) return 'Computer Science Theory'
  if (title.includes('database') || title.includes('sql')) return 'Database Management'
  if (title.includes('web') || title.includes('frontend') || title.includes('backend')) return 'Web Development'
  if (title.includes('network') || title.includes('security')) return 'Networking/Security'
  if (title.includes('math') || title.includes('calculus') || title.includes('algebra')) return 'Mathematics'
  
  return 'General Computing'
}

/**
 * Get prerequisites for course
 */
function getPrerequisites(courseTitle: string): string {
  const title = courseTitle.toLowerCase()
  
  if (title.includes('advanced') || title.includes('2')) return 'Basic programming concepts'
  if (title.includes('algorithm') || title.includes('data structure')) return 'Programming fundamentals, basic math'
  if (title.includes('database')) return 'Basic programming, data concepts'
  if (title.includes('web')) return 'HTML, CSS, basic programming'
  
  return 'None specified'
}

/**
 * Get expected outcomes for course
 */
function getExpectedOutcomes(courseTitle: string): string {
  const title = courseTitle.toLowerCase()
  
  if (title.includes('programming')) return 'Ability to write and debug code'
  if (title.includes('algorithm')) return 'Problem-solving skills, algorithm design'
  if (title.includes('database')) return 'Database design and management skills'
  if (title.includes('web')) return 'Web development and deployment skills'
  
  return 'Subject matter proficiency'
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