import { getAllPrograms, getCourseById, type Program, type Course } from "./program-service"
import { getResourcesForCourse } from "./resource-service"
import { cacheService } from "./cache-service"

export interface DeepSeekRecommendation {
  title: string
  description: string
  resourceType: string
  difficulty: string
  url: string
  reasoning: string
  priority: number
  estimatedTime: string
  tags: string[]
}

export interface QuizResult {
  quizId: string
  courseId: string
  quizTitle?: string
  score: number
  total: number
  strengths?: string[]
  weaknesses?: string[]
  timeSpent?: number
}

export interface UserProfile {
  program: string
  interests: string[]
  recentTopics: string[]
  learningStyle?: 'visual' | 'auditory' | 'kinesthetic' | 'reading'
  preferredDifficulty?: 'beginner' | 'intermediate' | 'advanced'
  availableTime?: number // hours per week
}

export interface CourseSpecificContext {
  courseId: string
  courseTitle: string
  programTitle: string
  year: number
  semester: number
  quizResults: QuizResult[]
  existingResources: any[]
}

// Enhanced course interface with program context
export interface EnhancedCourse extends Course {
  programId: string
  programTitle: string
  year: number
  semester: number
}

// DeepSeek API configuration
const DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions"
const DEEPSEEK_MODEL = process.env.DEEPSEEK_MODEL || "deepseek-chat"

/**
 * Generate AI recommendations using DeepSeek API with caching
 */
export async function generateDeepSeekRecommendations(
  quizResults: QuizResult[],
  userProfile: UserProfile,
  courseId?: string,
  userId?: string
): Promise<DeepSeekRecommendation[]> {
  const startTime = Date.now()
  
  try {
    // Check if API key is configured
    if (!process.env.DEEPSEEK_API_KEY || process.env.DEEPSEEK_API_KEY === "your-deepseek-api-key-here") {
      throw new Error("DeepSeek API key not configured. Please set DEEPSEEK_API_KEY in your .env file.")
    }

    // Try to get from cache first
    const cached = await cacheService.getCachedRecommendations(
      quizResults,
      'deepseek',
      userId,
      courseId
    )

    if (cached) {
      // Log cache hit
      await cacheService.logAPICall({
        userId,
        apiProvider: 'deepseek',
        endpoint: 'recommendations',
        success: true,
        cacheHit: true,
        responseTime: Date.now() - startTime
      })

      return cached.recommendations as DeepSeekRecommendation[]
    }

    let recommendations: DeepSeekRecommendation[]
    let performance: any
    let generatedBy = "DeepSeek AI"

    if (courseId) {
      const result = await generateCourseSpecificRecommendations(courseId, quizResults)
      recommendations = result.recommendations
      performance = result.performance
    } else {
      recommendations = await generateGeneralRecommendations(quizResults, userProfile)
    }

    // Cache the successful response
    await cacheService.cacheRecommendations(
      quizResults,
      'deepseek',
      {
        recommendations,
        performance,
        userProfile,
        confidence: calculateRecommendationConfidence(recommendations, performance),
        generatedBy
      },
      userId,
      courseId
    )

    // Log successful API call
    await cacheService.logAPICall({
      userId,
      apiProvider: 'deepseek',
      endpoint: 'recommendations',
      success: true,
      cacheHit: false,
      responseTime: Date.now() - startTime,
      cost: estimateAPICost(recommendations),
      tokens: estimateTokenCount(quizResults, userProfile)
    })

    return recommendations
  } catch (error) {
    console.error("Error generating DeepSeek recommendations:", error)
    
    // Log failed API call
    await cacheService.logAPICall({
      userId,
      apiProvider: 'deepseek',
      endpoint: 'recommendations',
      success: false,
      cacheHit: false,
      responseTime: Date.now() - startTime,
      errorMessage: error instanceof Error ? error.message : 'Unknown error'
    })

    throw error
  }
}

/**
 * Calculate recommendation confidence based on various factors
 */
function calculateRecommendationConfidence(recommendations: DeepSeekRecommendation[], performance?: any): number {
  let confidence = 70 // Base confidence

  // Factor in number of recommendations
  if (recommendations.length >= 5) confidence += 10
  if (recommendations.length >= 3) confidence += 5

  // Factor in recommendation quality
  const avgPriority = recommendations.reduce((sum, rec) => sum + rec.priority, 0) / recommendations.length
  if (avgPriority <= 2) confidence += 10 // High priority recommendations

  // Factor in performance data availability
  if (performance) confidence += 10

  // Factor in recommendation diversity
  const resourceTypes = new Set(recommendations.map(rec => rec.resourceType))
  if (resourceTypes.size >= 3) confidence += 5

  return Math.min(100, confidence)
}

/**
 * Estimate API cost based on response
 */
function estimateAPICost(recommendations: DeepSeekRecommendation[]): number {
  // Rough estimation: $0.002 per 1K tokens
  const estimatedTokens = recommendations.length * 100 // Rough estimate
  return (estimatedTokens / 1000) * 0.002
}

/**
 * Estimate token count for request
 */
function estimateTokenCount(quizResults: QuizResult[], userProfile: UserProfile): number {
  // Rough estimation based on input data
  const quizDataTokens = quizResults.reduce((sum, quiz) => {
    return sum + (quiz.quizTitle?.length || 0) + 
           (quiz.strengths?.join(' ').length || 0) + 
           (quiz.weaknesses?.join(' ').length || 0)
  }, 0)

  const userProfileTokens = userProfile.program.length + 
                           userProfile.interests.join(' ').length + 
                           userProfile.recentTopics.join(' ').length

  return Math.round((quizDataTokens + userProfileTokens) / 4) // Rough token estimation
}

/**
 * Generate course-specific recommendations with caching
 */
async function generateCourseSpecificRecommendations(
  courseId: string,
  quizResults: QuizResult[]
): Promise<{ recommendations: DeepSeekRecommendation[], performance: any }> {
  const course = await findCourseById(courseId)
  if (!course) {
    throw new Error("Course not found")
  }

  const courseQuizResults = quizResults.filter(quiz => quiz.courseId === courseId)
  const existingResources = getResourcesForCourse(courseId)
  
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

  const prompt = buildCourseSpecificPrompt(course, performance, courseQuizResults, await existingResources)
  const response = await callDeepSeekAPI(prompt)
  const recommendations = parseDeepSeekResponse(response)
  
  return { recommendations, performance }
}

/**
 * Generate general recommendations based on user profile
 */
async function generateGeneralRecommendations(
  quizResults: QuizResult[],
  userProfile: UserProfile
): Promise<DeepSeekRecommendation[]> {
  const prompt = buildGeneralRecommendationsPrompt(quizResults, userProfile)
  const response = await callDeepSeekAPI(prompt)
  
  return parseDeepSeekResponse(response)
}

/**
 * Build prompt for course-specific recommendations with enhanced context
 */
function buildCourseSpecificPrompt(
  course: EnhancedCourse,
  performance: any,
  quizResults: QuizResult[],
  existingResources: any[]
): string {
  const performanceText = performance ? 
    `Performance: ${performance.percentage}% (${performance.score}/${performance.total} correct)` :
    "No previous quiz attempts"

  const strengths = quizResults.flatMap(q => q.strengths || [])
  const weaknesses = quizResults.flatMap(q => q.weaknesses || [])
  
  const strengthsText = strengths.length > 0 ? `Strengths: ${strengths.join(", ")}` : "No specific strengths identified"
  const weaknessesText = weaknesses.length > 0 ? `Weaknesses: ${weaknesses.join(", ")}` : "No specific weaknesses identified"

  // Enhanced context with detailed analysis
  const detailedAnalysis = buildDetailedPerformanceAnalysis(quizResults)
  const learningPatterns = analyzeLearningPatterns(quizResults)
  const resourceContext = buildResourceContext(existingResources)

  return `You are an expert educational AI assistant specializing in personalized learning recommendations. 

Generate 5 highly specific and actionable learning recommendations for a student studying ${course.title} in the ${course.programTitle} program.

STUDENT CONTEXT:
- Course: ${course.title}
- Program: ${course.programTitle}
- Year: ${course.year}, Semester: ${course.semester}
- ${performanceText}
- ${strengthsText}
- ${weaknessesText}

DETAILED PERFORMANCE ANALYSIS:
${detailedAnalysis}

LEARNING PATTERNS:
${learningPatterns}

AVAILABLE RESOURCES: ${existingResources.length} curated resources available
${resourceContext}

COURSE CONTEXT:
- Course Level: ${course.year === 1 ? 'First Year' : course.year === 2 ? 'Second Year' : 'Advanced'}
- Semester Focus: ${course.semester === 1 ? 'Foundation building' : course.semester === 2 ? 'Intermediate concepts' : 'Advanced applications'}
- Program Context: ${course.programTitle} typically focuses on ${getProgramFocus(course.programTitle)}

Requirements:
1. Provide exactly 5 recommendations
2. Each recommendation must be specific and actionable
3. Consider the student's detailed performance patterns and learning behavior
4. Include a mix of resource types (videos, articles, practice exercises, etc.)
5. Provide clear reasoning for each recommendation based on the detailed analysis
6. Estimate time commitment for each resource
7. Assign priority levels (1-5, where 1 is highest priority)
8. Consider the student's learning patterns and time efficiency
9. Address specific knowledge gaps identified in the analysis
10. Build on identified strengths while targeting improvement areas

Format each recommendation as:
Title: [Resource Title]
Description: [1-2 sentence description]
Type: [Video/Article/Practice/Course/Book/etc.]
Difficulty: [Beginner/Intermediate/Advanced]
URL: [Resource URL or "example.com" if not available]
Reasoning: [Why this resource is recommended for this student based on their specific performance data]
Priority: [1-5]
Time: [Estimated time commitment]
Tags: [comma-separated tags]
Confidence: [1-100, based on how well the resource matches the student's needs]

Focus on helping the student improve in their weak areas while building on their strengths. Consider their learning efficiency and time management patterns.`
}

/**
 * Build detailed performance analysis for enhanced context
 */
function buildDetailedPerformanceAnalysis(quizResults: QuizResult[]): string {
  if (quizResults.length === 0) {
    return "No performance data available"
  }

  const totalScore = quizResults.reduce((sum, quiz) => sum + quiz.score, 0)
  const totalQuestions = quizResults.reduce((sum, quiz) => sum + quiz.total, 0)
  const overallPercentage = (totalScore / totalQuestions) * 100
  
  // Analyze time patterns
  const timeData = quizResults.filter(q => q.timeSpent).map(q => q.timeSpent!)
  const avgTimePerQuestion = timeData.length > 0 ? timeData.reduce((sum, time) => sum + time, 0) / timeData.length : 0
  const timeEfficiency = avgTimePerQuestion > 0 ? overallPercentage / (avgTimePerQuestion / 60) : 0
  
  // Analyze question details if available
  let detailedQuestionAnalysis = ""
  const questionDetails = quizResults.flatMap(q => q.questionDetails || [])
  if (questionDetails.length > 0) {
    const difficultyBreakdown = questionDetails.reduce((acc, q) => {
      acc[q.difficulty] = (acc[q.difficulty] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    const rushedQuestions = questionDetails.filter(q => q.timeSpent < 30 && !q.isCorrect).length
    const overthoughtQuestions = questionDetails.filter(q => q.timeSpent > 120 && q.isCorrect).length
    
    detailedQuestionAnalysis = `
- Question Difficulty Distribution: ${Object.entries(difficultyBreakdown).map(([diff, count]) => `${diff}: ${count}`).join(', ')}
- Rushed Questions (answered too quickly): ${rushedQuestions}
- Overthought Questions (spent too much time): ${overthoughtQuestions}
- Average Time per Question: ${Math.round(avgTimePerQuestion)} seconds
- Time Efficiency: ${Math.round(timeEfficiency * 100) / 100} points per minute`
  }

  return `- Overall Performance: ${Math.round(overallPercentage)}%
- Total Questions Attempted: ${totalQuestions}
- Performance Trend: ${quizResults.length > 1 ? analyzePerformanceTrend(quizResults) : 'Single attempt'}
- Time Management: ${avgTimePerQuestion > 0 ? `${Math.round(avgTimePerQuestion)}s average per question` : 'No time data'}
- Efficiency Rating: ${timeEfficiency > 2.0 ? 'High' : timeEfficiency > 1.0 ? 'Medium' : 'Low'}${detailedQuestionAnalysis}`
}

/**
 * Analyze learning patterns from quiz results
 */
function analyzeLearningPatterns(quizResults: QuizResult[]): string {
  if (quizResults.length === 0) {
    return "No learning pattern data available"
  }

  // Analyze time patterns
  const timeData = quizResults.filter(q => q.timeSpent).map(q => q.timeSpent!)
  const avgTime = timeData.length > 0 ? timeData.reduce((sum, time) => sum + time, 0) / timeData.length : 0
  
  // Analyze performance consistency
  const percentages = quizResults.map(q => (q.score / q.total) * 100)
  const consistency = Math.max(...percentages) - Math.min(...percentages)
  
  // Analyze improvement over time
  const improvement = quizResults.length > 1 ? 
    `${Math.round(((percentages[percentages.length - 1] - percentages[0]) / percentages[0]) * 100)}%` : 
    'N/A'

  return `- Time Management: ${avgTime > 0 ? `${Math.round(avgTime)}s average per question` : 'No time data'}
- Performance Consistency: ${consistency < 20 ? 'High' : consistency < 40 ? 'Medium' : 'Low'} (${Math.round(consistency)}% variation)
- Improvement Trend: ${improvement}
- Learning Style Indicators: ${analyzeLearningStyleIndicators(quizResults)}
- Study Efficiency: ${analyzeStudyEfficiency(quizResults)}`
}

/**
 * Analyze learning style indicators
 */
function analyzeLearningStyleIndicators(quizResults: QuizResult[]): string {
  const questionDetails = quizResults.flatMap(q => q.questionDetails || [])
  if (questionDetails.length === 0) return "Insufficient data"

  // Analyze patterns that might indicate learning preferences
  const visualQuestions = questionDetails.filter(q => 
    q.tags.some(tag => ['diagram', 'chart', 'visual', 'image'].includes(tag.toLowerCase()))
  ).length
  
  const theoreticalQuestions = questionDetails.filter(q => 
    q.tags.some(tag => ['theory', 'concept', 'definition'].includes(tag.toLowerCase()))
  ).length
  
  const practicalQuestions = questionDetails.filter(q => 
    q.tags.some(tag => ['application', 'practice', 'problem-solving'].includes(tag.toLowerCase()))
  ).length

  const indicators = []
  if (visualQuestions > theoreticalQuestions && visualQuestions > practicalQuestions) {
    indicators.push('Visual learner')
  }
  if (theoreticalQuestions > visualQuestions && theoreticalQuestions > practicalQuestions) {
    indicators.push('Theoretical learner')
  }
  if (practicalQuestions > visualQuestions && practicalQuestions > theoreticalQuestions) {
    indicators.push('Practical learner')
  }

  return indicators.length > 0 ? indicators.join(', ') : 'Balanced learner'
}

/**
 * Analyze study efficiency
 */
function analyzeStudyEfficiency(quizResults: QuizResult[]): string {
  const questionDetails = quizResults.flatMap(q => q.questionDetails || [])
  if (questionDetails.length === 0) return "Insufficient data"

  const rushedQuestions = questionDetails.filter(q => q.timeSpent < 30 && !q.isCorrect).length
  const overthoughtQuestions = questionDetails.filter(q => q.timeSpent > 120 && q.isCorrect).length
  const totalQuestions = questionDetails.length

  const rushedPercentage = (rushedQuestions / totalQuestions) * 100
  const overthoughtPercentage = (overthoughtQuestions / totalQuestions) * 100

  if (rushedPercentage > 30) return "Needs to slow down and read carefully"
  if (overthoughtPercentage > 30) return "May be overthinking simple questions"
  if (rushedPercentage < 10 && overthoughtPercentage < 10) return "Good time management"
  return "Moderate time management"
}

/**
 * Analyze performance trend
 */
function analyzePerformanceTrend(quizResults: QuizResult[]): string {
  const percentages = quizResults.map(q => (q.score / q.total) * 100)
  const firstHalf = percentages.slice(0, Math.ceil(percentages.length / 2))
  const secondHalf = percentages.slice(Math.ceil(percentages.length / 2))
  
  const firstAvg = firstHalf.reduce((sum, p) => sum + p, 0) / firstHalf.length
  const secondAvg = secondHalf.reduce((sum, p) => sum + p, 0) / secondHalf.length
  
  const improvement = secondAvg - firstAvg
  
  if (improvement > 10) return "Strong improvement trend"
  if (improvement > 5) return "Moderate improvement"
  if (improvement > -5) return "Stable performance"
  return "Declining performance"
}

/**
 * Build resource context for better recommendations
 */
function buildResourceContext(existingResources: any[]): string {
  if (existingResources.length === 0) return "No specific resources available"

  const resourceTypes = existingResources.reduce((acc, resource) => {
    acc[resource.type] = (acc[resource.type] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const difficultyLevels = existingResources.reduce((acc, resource) => {
    const difficulty = resource.tags.find((tag: string) => 
      ['beginner', 'intermediate', 'advanced'].includes(tag.toLowerCase())
    ) || 'intermediate'
    acc[difficulty] = (acc[difficulty] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const topRatedResources = existingResources
    .filter(r => r.rating && r.rating > 4.0)
    .length

  return `
Resource Distribution:
- Types: ${Object.entries(resourceTypes).map(([type, count]) => `${type}: ${count}`).join(', ')}
- Difficulty Levels: ${Object.entries(difficultyLevels).map(([diff, count]) => `${diff}: ${count}`).join(', ')}
- High-Quality Resources (4+ rating): ${topRatedResources}
- Average Duration: ${Math.round(existingResources.reduce((sum, r) => sum + (parseInt(r.duration) || 45), 0) / existingResources.length)} minutes`
}

/**
 * Get program focus for context
 */
function getProgramFocus(programTitle: string): string {
  const focusMap: Record<string, string> = {
    'Computer Science': 'software development, algorithms, and computer systems',
    'Software Engineering': 'practical software development and engineering principles',
    'Information Technology': 'technology infrastructure and systems management',
    'Data Science': 'data analysis, statistics, and machine learning',
    'Cybersecurity': 'security principles, network protection, and ethical hacking'
  }
  
  return focusMap[programTitle] || 'general computing and technology concepts'
}

/**
 * Build prompt for general recommendations with enhanced context
 */
function buildGeneralRecommendationsPrompt(
  quizResults: QuizResult[],
  userProfile: UserProfile
): string {
  const quizSummary = quizResults.map(result => 
    `- ${result.quizTitle || 'Quiz'}: ${result.score}/${result.total} (${Math.round((result.score/result.total)*100)}%)`
  ).join('\n')

  const strengths = quizResults.flatMap(q => q.strengths || [])
  const weaknesses = quizResults.flatMap(q => q.weaknesses || [])

  // Enhanced context
  const detailedAnalysis = buildDetailedPerformanceAnalysis(quizResults)
  const learningPatterns = analyzeLearningPatterns(quizResults)
  const userContext = buildUserContext(userProfile)

  return `You are an expert educational AI assistant specializing in personalized learning recommendations.

Generate 5 highly specific and actionable learning recommendations for a student based on their comprehensive performance data and learning profile.

STUDENT PROFILE:
- Program: ${userProfile.program}
- Interests: ${userProfile.interests.join(', ') || 'Not specified'}
- Recent Topics: ${userProfile.recentTopics.join(', ') || 'None'}
- Learning Style: ${userProfile.learningStyle || 'Not specified'}
- Preferred Difficulty: ${userProfile.preferredDifficulty || 'Not specified'}
- Available Time: ${userProfile.availableTime || 'Not specified'} hours per week

QUIZ PERFORMANCE SUMMARY:
${quizSummary}

DETAILED PERFORMANCE ANALYSIS:
${detailedAnalysis}

LEARNING PATTERNS:
${learningPatterns}

USER CONTEXT:
${userContext}

Requirements:
1. Provide exactly 5 recommendations
2. Each recommendation must be specific and actionable
3. Consider the student's learning style, preferences, and time availability
4. Include a mix of resource types and difficulty levels
5. Provide clear reasoning for each recommendation
6. Estimate time commitment for each resource
7. Assign priority levels (1-5, where 1 is highest priority)
8. Consider the student's interests and recent topics
9. Address identified weaknesses while building on strengths
10. Ensure recommendations fit within the student's available time

Format each recommendation as:
Title: [Resource Title]
Description: [1-2 sentence description]
Type: [Video/Article/Practice/Course/Book/etc.]
Difficulty: [Beginner/Intermediate/Advanced]
URL: [Resource URL or "example.com" if not available]
Reasoning: [Why this resource is recommended for this student]
Priority: [1-5]
Time: [Estimated time commitment]
Tags: [comma-separated tags]
Confidence: [1-100, based on how well the resource matches the student's profile]

Focus on creating a personalized learning path that aligns with the student's goals, preferences, and current performance level.`
}

/**
 * Build user context for enhanced personalization
 */
function buildUserContext(userProfile: UserProfile): string {
  const context = []
  
  if (userProfile.learningStyle) {
    context.push(`- Learning Style: ${userProfile.learningStyle} (prefers ${getLearningStyleResources(userProfile.learningStyle)})`)
  }
  
  if (userProfile.preferredDifficulty) {
    context.push(`- Difficulty Preference: ${userProfile.preferredDifficulty}`)
  }
  
  if (userProfile.availableTime) {
    context.push(`- Time Availability: ${userProfile.availableTime} hours per week`)
  }
  
  if (userProfile.interests.length > 0) {
    context.push(`- Learning Interests: ${userProfile.interests.join(', ')}`)
  }
  
  if (userProfile.recentTopics.length > 0) {
    context.push(`- Recent Learning Focus: ${userProfile.recentTopics.join(', ')}`)
  }
  
  return context.join('\n') || "Limited user context available"
}

/**
 * Get resource types for learning style
 */
function getLearningStyleResources(learningStyle: string): string {
  const styleMap: Record<string, string> = {
    'visual': 'videos, diagrams, and visual content',
    'auditory': 'podcasts, audio lectures, and discussions',
    'kinesthetic': 'hands-on exercises, projects, and interactive content',
    'reading': 'articles, books, and written materials'
  }
  
  return styleMap[learningStyle] || 'various content types'
}

/**
 * Call DeepSeek API
 */
async function callDeepSeekAPI(prompt: string): Promise<string> {
  const response = await fetch(DEEPSEEK_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
    },
    body: JSON.stringify({
      model: DEEPSEEK_MODEL,
      messages: [
        {
          role: "system",
          content: "You are an expert educational AI assistant that provides personalized learning recommendations. Always respond with structured, actionable recommendations."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    })
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(`DeepSeek API error: ${response.status} - ${errorData.error?.message || response.statusText}`)
  }

  const data = await response.json()
  return data.choices?.[0]?.message?.content || ""
}

/**
 * Parse DeepSeek API response into structured recommendations
 */
function parseDeepSeekResponse(response: string): DeepSeekRecommendation[] {
  const recommendations: DeepSeekRecommendation[] = []
  
  // Split by recommendation sections
  const sections = response.split(/(?=Title:)/).filter(Boolean)
  
  sections.forEach((section, index) => {
    try {
      const titleMatch = section.match(/Title:\s*(.+?)(?=\n|$)/)
      const descriptionMatch = section.match(/Description:\s*(.+?)(?=\n|$)/)
      const typeMatch = section.match(/Type:\s*(.+?)(?=\n|$)/)
      const difficultyMatch = section.match(/Difficulty:\s*(.+?)(?=\n|$)/)
      const urlMatch = section.match(/URL:\s*(.+?)(?=\n|$)/)
      const reasoningMatch = section.match(/Reasoning:\s*(.+?)(?=\n|$)/)
      const priorityMatch = section.match(/Priority:\s*(\d+)/)
      const timeMatch = section.match(/Time:\s*(.+?)(?=\n|$)/)
      const tagsMatch = section.match(/Tags:\s*(.+?)(?=\n|$)/)

      if (titleMatch) {
        recommendations.push({
          title: titleMatch[1].trim(),
          description: descriptionMatch?.[1]?.trim() || "No description available",
          resourceType: typeMatch?.[1]?.trim() || "Resource",
          difficulty: difficultyMatch?.[1]?.trim() || "Intermediate",
          url: urlMatch?.[1]?.trim() || "https://example.com",
          reasoning: reasoningMatch?.[1]?.trim() || "Recommended based on your learning profile",
          priority: parseInt(priorityMatch?.[1] || "3"),
          estimatedTime: timeMatch?.[1]?.trim() || "30 minutes",
          tags: tagsMatch?.[1]?.split(',').map(tag => tag.trim()) || []
        })
      }
    } catch (error) {
      console.warn(`Failed to parse recommendation section ${index}:`, error)
    }
  })

  // Sort by priority and return top 5
  return recommendations
    .sort((a, b) => a.priority - b.priority)
    .slice(0, 5)
}

/**
 * Find course by ID with program context
 */
async function findCourseById(courseId: string): Promise<EnhancedCourse | null> {
  try {
    const programs = await getAllPrograms()
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
  } catch (error) {
    console.error("Error finding course by ID:", error)
    return null
  }
}

/**
 * Generate filtered recommendations based on program/year/semester
 */
export async function generateFilteredDeepSeekRecommendations(
  selectedProgram: string,
  selectedYear: string,
  selectedSemester: string,
  quizResults: QuizResult[],
  programs: Program[]
): Promise<Array<{
  courseId: string
  courseTitle: string
  programTitle: string
  year: number
  semester: number
  recommendations: DeepSeekRecommendation[]
  performance: any
  difficulty: string
  priority: number
}>> {
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

  const filteredCourses = allCourses.filter(course => {
    const matchesProgram = selectedProgram === "all" || course.programId === selectedProgram
    const matchesYear = selectedYear === "all" || course.year === parseInt(selectedYear)
    const matchesSemester = selectedSemester === "all" || course.semester === parseInt(selectedSemester)
    
    return matchesProgram && matchesYear && matchesSemester
  })

  const courseRecommendations = []

  for (const course of filteredCourses) {
    const courseQuizResults = quizResults.filter(quiz => quiz.courseId === course.id)
    
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

    let recommendations: DeepSeekRecommendation[] = []
    if (performance) {
      recommendations = await generateCourseSpecificRecommendations(course.id, courseQuizResults)
    } else {
      // Generate general recommendations for courses without quiz history
      const userProfile: UserProfile = {
        program: course.programId,
        interests: [],
        recentTopics: [course.title]
      }
      recommendations = await generateGeneralRecommendations([], userProfile)
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

  return courseRecommendations.sort((a, b) => {
    if (a.priority !== b.priority) {
      return b.priority - a.priority
    }
    return a.year - b.year
  })
} 