import { getAllPrograms, getCourseById, type Program, type Course } from "./program-service"
import { getResourcesForCourse } from "./resource-service"
import { prisma } from "./prisma"
import { getPersonalizedPlan } from './personalization-engine';

export interface RuleBasedRecommendation {
  title: string
  description: string
  resourceType: string
  difficulty: string
  url: string
  reasoning: string
  priority: number
  estimatedTime: string
  tags: string[]
  confidence: number // New field for recommendation confidence
  learningPath?: string // New field for learning progression
  prerequisites?: string[] // New field for required knowledge
  personalizedSession?: any; // New field for personalized session details
  personalizedAdvice?: string; // New field for personalized advice
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
  questionDetails?: QuestionDetail[] // New field for detailed question analysis
}

export interface QuestionDetail {
  questionId: string
  questionText: string
  userAnswer: string
  correctAnswer: string
  isCorrect: boolean
  timeSpent: number
  difficulty: string
  category: string
  tags: string[]
}

export interface UserProfile {
  program: string
  interests: string[]
  recentTopics: string[]
  learningStyle?: 'visual' | 'auditory' | 'kinesthetic' | 'reading'
  preferredDifficulty?: 'beginner' | 'intermediate' | 'advanced'
  availableTime?: number
  studyPatterns?: StudyPatterns // New field for learning behavior analysis
  progressHistory?: ProgressHistory[] // New field for tracking improvement
  userId?: string; // New field for user ID
}

export interface StudyPatterns {
  preferredTimeOfDay?: 'morning' | 'afternoon' | 'evening' | 'night'
  studySessionDuration?: number // in minutes
  breakFrequency?: number // minutes between breaks
  preferredResourceTypes?: string[]
  retentionRate?: number // percentage of information retained
}

export interface ProgressHistory {
  date: Date
  courseId: string
  score: number
  total: number
  improvement: number
  timeSpent: number
}

export interface DetailedPerformanceAnalysis {
  overallScore: number
  topicPerformance: { [topic: string]: number }
  difficultyBreakdown: { [difficulty: string]: number }
  timeAnalysis: {
    averageTimePerQuestion: number
    timeEfficiency: number // score per minute
    rushedQuestions: number
    overthoughtQuestions: number
  }
  learningGaps: string[]
  strengths: string[]
  improvementAreas: string[]
  recommendedFocus: string[]
  confidenceLevel: number
}

/**
 * Generate rule-based recommendations as fallback for DeepSeek API
 */
export async function generateRuleBasedRecommendations(
  quizResults: QuizResult[],
  userProfile: UserProfile,
  courseId?: string
): Promise<RuleBasedRecommendation[]> {
  try {
    // --- NEW: Personalization integration ---
    const userId = (userProfile as any).userId;
    if (userId) {
      const personalized = await getPersonalizedPlan({ userId });
      const prioritizedTopics = personalized.prioritizedTopics;
      const schedule = personalized.schedule;
      const advice = personalized.advice;
      // Use prioritizedTopics to drive weak area recommendations
      let recommendations: RuleBasedRecommendation[] = [];
      prioritizedTopics.forEach(area => {
        recommendations.push(...generateWeakAreaRecommendations(area, userProfile));
      });
      // Generate recommendations based on strong areas (for advancement)
      const strongAreas = identifyStrongAreas(quizResults)
      strongAreas.forEach(area => {
        recommendations.push(...generateStrongAreaRecommendations(area, userProfile))
      })
      // Generate general program recommendations
      recommendations.push(...generateProgramRecommendations(userProfile))
      // Optionally, attach schedule/advice to the output (if your API supports it)
      recommendations = recommendations.map((rec, idx) => ({
        ...rec,
        personalizedSession: schedule[idx] || null,
        personalizedAdvice: advice
      }));
      return recommendations.sort((a, b) => a.priority - b.priority).slice(0, 5);
    }
    // --- fallback to existing logic if no userId ---
    if (courseId) {
      return await generateCourseSpecificRuleBasedRecommendations(courseId, quizResults, userProfile)
    }
    return await generateGeneralRuleBasedRecommendations(quizResults, userProfile)
  } catch (error) {
    console.error("Error generating rule-based recommendations:", error)
    return generateDefaultRecommendations()
  }
}

/**
 * Generate general rule-based recommendations
 */
async function generateGeneralRuleBasedRecommendations(
  quizResults: QuizResult[],
  userProfile: UserProfile
): Promise<RuleBasedRecommendation[]> {
  const recommendations: RuleBasedRecommendation[] = []
  
  // Analyze overall performance
  const overallPerformance = calculateOverallPerformance(quizResults)
  const weakAreas = identifyWeakAreas(quizResults)
  const strongAreas = identifyStrongAreas(quizResults)
  
  // Generate recommendations based on weak areas
  weakAreas.forEach(area => {
    recommendations.push(...generateWeakAreaRecommendations(area, userProfile))
  })
  
  // Generate recommendations based on strong areas (for advancement)
  strongAreas.forEach(area => {
    recommendations.push(...generateStrongAreaRecommendations(area, userProfile))
  })
  
  // Generate general program recommendations
  recommendations.push(...generateProgramRecommendations(userProfile))
  
  // Sort by priority and limit to 5 recommendations
  return recommendations
    .sort((a, b) => a.priority - b.priority)
    .slice(0, 5)
}

/**
 * Calculate performance metrics from quiz results
 */
function calculatePerformance(quizResults: QuizResult[]) {
  if (quizResults.length === 0) {
    return { score: 0, total: 0, percentage: 0 }
  }
  
  const totalScore = quizResults.reduce((sum, quiz) => sum + quiz.score, 0)
  const totalQuestions = quizResults.reduce((sum, quiz) => sum + quiz.total, 0)
  const percentage = (totalScore / totalQuestions) * 100
  
  return {
    score: totalScore,
    total: totalQuestions,
    percentage: Math.round(percentage)
  }
}

/**
 * Calculate overall performance across all quizzes
 */
function calculateOverallPerformance(quizResults: QuizResult[]) {
  return calculatePerformance(quizResults)
}

/**
 * Determine difficulty level based on performance
 */
function determineDifficulty(percentage: number): string {
  if (percentage < 40) return 'beginner'
  if (percentage < 70) return 'intermediate'
  return 'advanced'
}

/**
 * Identify weak areas from quiz results
 */
function identifyWeakAreas(quizResults: QuizResult[]): string[] {
  const weakAreas: string[] = []
  
  quizResults.forEach(quiz => {
    if (quiz.weaknesses && quiz.weaknesses.length > 0) {
      weakAreas.push(...quiz.weaknesses)
    }
  })
  
  // Count frequency and return most common weak areas
  const areaCounts = weakAreas.reduce((acc, area) => {
    acc[area] = (acc[area] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  
  return Object.entries(areaCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3)
    .map(([area]) => area)
}

/**
 * Identify strong areas from quiz results
 */
function identifyStrongAreas(quizResults: QuizResult[]): string[] {
  const strongAreas: string[] = []
  
  quizResults.forEach(quiz => {
    if (quiz.strengths && quiz.strengths.length > 0) {
      strongAreas.push(...quiz.strengths)
    }
  })
  
  // Count frequency and return most common strong areas
  const areaCounts = strongAreas.reduce((acc, area) => {
    acc[area] = (acc[area] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  
  return Object.entries(areaCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 2)
    .map(([area]) => area)
}

/**
 * Generate foundational recommendations for low performers
 */
async function generateFoundationalRecommendations(
  course: any,
  existingResources: any[],
  difficulty: string,
  performance: DetailedPerformanceAnalysis,
  userProfile: UserProfile
): Promise<RuleBasedRecommendation[]> {
  const recommendations: RuleBasedRecommendation[] = []
  
  // Find foundational resources
  const foundationalResources = existingResources.filter(resource => 
    resource.tags.some((tag: string) => 
      ['basics', 'fundamentals', 'introduction', 'beginner'].includes(tag.toLowerCase())
    )
  )
  
  // Prioritize resources that address learning gaps
  const gapResources = foundationalResources.filter(resource =>
    resource.tags.some((tag: string) => 
      performance.learningGaps.some(gap => 
        tag.toLowerCase().includes(gap.toLowerCase())
      )
    )
  )
  
  const resourcesToUse = gapResources.length > 0 ? gapResources : foundationalResources
  
  resourcesToUse.slice(0, 2).forEach((resource, index) => {
    const confidence = calculateRecommendationConfidence(resource, performance, userProfile)
    
    recommendations.push({
      title: resource.title,
      description: `Essential foundational content for ${course.title} - focuses on core concepts`,
      resourceType: resource.type,
      difficulty: 'beginner',
      url: resource.url,
      reasoning: `Build strong fundamentals in ${course.title} to address identified learning gaps: ${performance.learningGaps.slice(0, 2).join(', ')}`,
      priority: 1 + index,
      estimatedTime: resource.duration || '30-45 minutes',
      tags: resource.tags,
      confidence,
      learningPath: 'foundational',
      prerequisites: []
    })
  })
  
  return recommendations
}

/**
 * Generate practice recommendations
 */
async function generatePracticeRecommendations(
  course: any,
  existingResources: any[],
  difficulty: string
): Promise<RuleBasedRecommendation[]> {
  const recommendations: RuleBasedRecommendation[] = []
  
  // Find practice resources
  const practiceResources = existingResources.filter(resource => 
    resource.tags.some((tag: string) => 
      ['practice', 'exercise', 'quiz', 'problem'].includes(tag.toLowerCase())
    )
  )
  
  practiceResources.slice(0, 2).forEach((resource, index) => {
    recommendations.push({
      title: resource.title,
      description: `Practice exercises to reinforce ${course.title} concepts`,
      resourceType: resource.type,
      difficulty: difficulty,
      url: resource.url,
      reasoning: `Practice is essential for mastering ${course.title} concepts`,
      priority: 2 + index,
      estimatedTime: resource.duration || '45-60 minutes',
      tags: resource.tags,
      confidence: 75, // Default confidence for practice resources
      learningPath: 'practice',
      prerequisites: []
    })
  })
  
  return recommendations
}

/**
 * Generate advanced recommendations for high performers
 */
async function generateAdvancedRecommendations(
  course: any,
  existingResources: any[],
  difficulty: string
): Promise<RuleBasedRecommendation[]> {
  const recommendations: RuleBasedRecommendation[] = []
  
  // Find advanced resources
  const advancedResources = existingResources.filter(resource => 
    resource.tags.some((tag: string) => 
      ['advanced', 'expert', 'mastery', 'deep-dive'].includes(tag.toLowerCase())
    )
  )
  
  advancedResources.slice(0, 1).forEach((resource, index) => {
    recommendations.push({
      title: resource.title,
      description: `Advanced content to deepen your understanding of ${course.title}`,
      resourceType: resource.type,
      difficulty: 'advanced',
      url: resource.url,
      reasoning: `Take your ${course.title} knowledge to the next level`,
      priority: 3 + index,
      estimatedTime: resource.duration || '60-90 minutes',
      tags: resource.tags,
      confidence: 80, // Higher confidence for advanced resources
      learningPath: 'advanced',
      prerequisites: ['intermediate-knowledge']
    })
  })
  
  return recommendations
}

/**
 * Generate supplementary recommendations
 */
async function generateSupplementaryRecommendations(
  course: any,
  existingResources: any[],
  difficulty: string
): Promise<RuleBasedRecommendation[]> {
  const recommendations: RuleBasedRecommendation[] = []
  
  // Find supplementary resources
  const supplementaryResources = existingResources.filter(resource => 
    resource.tags.some((tag: string) => 
      ['supplementary', 'additional', 'extra', 'bonus'].includes(tag.toLowerCase())
    )
  )
  
  supplementaryResources.slice(0, 1).forEach((resource, index) => {
    recommendations.push({
      title: resource.title,
      description: `Additional learning material for ${course.title}`,
      resourceType: resource.type,
      difficulty: difficulty,
      url: resource.url,
      reasoning: `Supplementary content to enhance your ${course.title} learning`,
      priority: 4 + index,
      estimatedTime: resource.duration || '30-45 minutes',
      tags: resource.tags,
      confidence: 70, // Moderate confidence for supplementary resources
      learningPath: 'supplementary',
      prerequisites: []
    })
  })
  
  return recommendations
}

/**
 * Generate recommendations for weak areas
 */
function generateWeakAreaRecommendations(area: string, userProfile: UserProfile): RuleBasedRecommendation[] {
  const recommendations: RuleBasedRecommendation[] = []
  
  // Find resources related to the weak area
  const relatedResources = findResourcesByTopic(area)
  
  relatedResources.slice(0, 2).forEach((resource, index) => {
    recommendations.push({
      title: resource.title,
      description: `Focus on improving your ${area} skills`,
      resourceType: resource.type,
      difficulty: 'beginner',
      url: resource.url,
      reasoning: `Targeted practice to strengthen your ${area} understanding`,
      priority: 1 + index,
      estimatedTime: resource.duration || '45-60 minutes',
      tags: resource.tags,
      confidence: 85, // High confidence for targeted weak area resources
      learningPath: 'remediation',
      prerequisites: []
    })
  })
  
  return recommendations
}

/**
 * Generate recommendations for strong areas
 */
function generateStrongAreaRecommendations(area: string, userProfile: UserProfile): RuleBasedRecommendation[] {
  const recommendations: RuleBasedRecommendation[] = []
  
  // Find advanced resources related to the strong area
  const advancedResources = findAdvancedResourcesByTopic(area)
  
  advancedResources.slice(0, 1).forEach((resource, index) => {
    recommendations.push({
      title: resource.title,
      description: `Advance your ${area} expertise`,
      resourceType: resource.type,
      difficulty: 'advanced',
      url: resource.url,
      reasoning: `Build on your strong ${area} foundation to achieve mastery`,
      priority: 3 + index,
      estimatedTime: resource.duration || '60-90 minutes',
      tags: resource.tags,
      confidence: 90, // Very high confidence for building on strengths
      learningPath: 'advancement',
      prerequisites: [area]
    })
  })
  
  return recommendations
}

/**
 * Generate program-specific recommendations
 */
function generateProgramRecommendations(userProfile: UserProfile): RuleBasedRecommendation[] {
  const recommendations: RuleBasedRecommendation[] = []
  
  // Find program-specific resources
  const programResources = findResourcesByProgram(userProfile.program)
  
  programResources.slice(0, 2).forEach((resource, index) => {
    recommendations.push({
      title: resource.title,
      description: `Essential ${userProfile.program} program content`,
      resourceType: resource.type,
      difficulty: 'intermediate',
      url: resource.url,
      reasoning: `Core content for your ${userProfile.program} program`,
      priority: 2 + index,
      estimatedTime: resource.duration || '45-60 minutes',
      tags: resource.tags,
      confidence: 80, // High confidence for program-specific resources
      learningPath: 'program-core',
      prerequisites: []
    })
  })
  
  return recommendations
}

/**
 * Generate default recommendations when no specific data is available
 */
function generateDefaultRecommendations(): RuleBasedRecommendation[] {
  return [
    {
      title: "Programming Fundamentals",
      description: "Essential programming concepts and best practices",
      resourceType: "Course",
      difficulty: "beginner",
      url: "https://example.com/programming-fundamentals",
      reasoning: "Build a strong foundation in programming concepts",
      priority: 1,
      estimatedTime: "60-90 minutes",
      tags: ["programming", "fundamentals", "beginner"],
      confidence: 60, // Lower confidence for default recommendations
      learningPath: "foundational",
      prerequisites: []
    },
    {
      title: "Data Structures and Algorithms",
      description: "Core computer science concepts for problem solving",
      resourceType: "Course",
      difficulty: "intermediate",
      url: "https://example.com/data-structures",
      reasoning: "Essential knowledge for technical interviews and problem solving",
      priority: 2,
      estimatedTime: "90-120 minutes",
      tags: ["algorithms", "data-structures", "computer-science"],
      confidence: 65,
      learningPath: "core-cs",
      prerequisites: ["programming-basics"]
    },
    {
      title: "Web Development Basics",
      description: "Introduction to HTML, CSS, and JavaScript",
      resourceType: "Course",
      difficulty: "beginner",
      url: "https://example.com/web-development",
      reasoning: "Practical skills for modern software development",
      priority: 3,
      estimatedTime: "75-90 minutes",
      tags: ["web-development", "html", "css", "javascript"],
      confidence: 70,
      learningPath: "web-dev",
      prerequisites: []
    }
  ]
}

/**
 * Find course by ID
 */
async function findCourseById(courseId: string) {
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
    console.error('Error finding course by ID:', error)
    return null
  }
}

/**
 * Get user analytics from database
 */
async function getUserAnalytics(quizId?: string) {
  if (!quizId) return null
  
  try {
    const submission = await prisma.quizSubmission.findFirst({
      where: { quizId },
      include: {
        user: {
          include: {
            userAnalytics: true
          }
        }
      }
    })
    
    return submission?.user?.userAnalytics || null
  } catch (error) {
    console.error("Error fetching user analytics:", error)
    return null
  }
}

/**
 * Find resources by topic
 */
function findResourcesByTopic(topic: string): any[] {
  // This would typically query the database
  // For now, return mock data
  return [
    {
      title: `${topic} Fundamentals`,
      type: "Course",
      url: `https://example.com/${topic.toLowerCase()}-fundamentals`,
      duration: "45-60 minutes",
      tags: [topic.toLowerCase(), "fundamentals", "beginner"]
    }
  ]
}

/**
 * Find advanced resources by topic
 */
function findAdvancedResourcesByTopic(topic: string): any[] {
  return [
    {
      title: `Advanced ${topic}`,
      type: "Course",
      url: `https://example.com/advanced-${topic.toLowerCase()}`,
      duration: "60-90 minutes",
      tags: [topic.toLowerCase(), "advanced", "expert"]
    }
  ]
}

/**
 * Find resources by program
 */
function findResourcesByProgram(program: string): any[] {
  return [
    {
      title: `${program} Core Concepts`,
      type: "Course",
      url: `https://example.com/${program.toLowerCase()}-core`,
      duration: "45-60 minutes",
      tags: [program.toLowerCase(), "core", "fundamentals"]
    }
  ]
}

/**
 * Generate course-specific rule-based recommendations with enhanced personalization
 */
async function generateCourseSpecificRuleBasedRecommendations(
  courseId: string,
  quizResults: QuizResult[],
  userProfile: UserProfile
): Promise<RuleBasedRecommendation[]> {
  const course = await findCourseById(courseId)
  if (!course) {
    return generateDefaultRecommendations()
  }

  const courseQuizResults = quizResults.filter(quiz => quiz.courseId === courseId)
  const existingResources = await getResourcesForCourse(courseId)
  
  // Enhanced performance analysis
  const performance = calculateDetailedPerformance(courseQuizResults)
  const difficulty = determineAdaptiveDifficulty(performance, userProfile)
  
  // Get user analytics for additional context
  const userAnalytics = await getUserAnalytics(courseQuizResults[0]?.quizId)
  
  // Generate personalized recommendations
  const recommendations: RuleBasedRecommendation[] = []
  
  // Add foundational resources for low performers with confidence scoring
  if (performance.overallScore < 50) {
    const foundationalRecs = await generateFoundationalRecommendations(course, existingResources, difficulty, performance, userProfile)
    recommendations.push(...foundationalRecs)
  }
  
  // Add practice resources with adaptive difficulty
  const practiceRecs = await generateAdaptivePracticeRecommendations(course, existingResources, difficulty, performance, userProfile)
  recommendations.push(...practiceRecs)
  
  // Add advanced resources for high performers
  if (performance.overallScore > 70) {
    const advancedRecs = await generateAdvancedRecommendations(course, existingResources, difficulty, performance, userProfile)
    recommendations.push(...advancedRecs)
  }
  
  // Add supplementary resources based on learning gaps
  const supplementaryRecs = await generateGapFillingRecommendations(course, existingResources, performance, userProfile)
  recommendations.push(...supplementaryRecs)
  
  // Add learning path recommendations
  const pathRecs = await generateLearningPathRecommendations(course, existingResources, performance, userProfile)
  recommendations.push(...pathRecs)
  
  // Sort by priority and confidence, limit to 5 recommendations
  return recommendations
    .sort((a, b) => {
      // Primary sort by priority, secondary by confidence
      if (a.priority !== b.priority) {
        return a.priority - b.priority
      }
      return b.confidence - a.confidence
    })
    .slice(0, 5)
}

/**
 * Calculate detailed performance metrics from quiz results
 */
function calculateDetailedPerformance(quizResults: QuizResult[]): DetailedPerformanceAnalysis {
  if (quizResults.length === 0) {
    return {
      overallScore: 0,
      topicPerformance: {},
      difficultyBreakdown: {},
      timeAnalysis: {
        averageTimePerQuestion: 0,
        timeEfficiency: 0,
        rushedQuestions: 0,
        overthoughtQuestions: 0
      },
      learningGaps: [],
      strengths: [],
      improvementAreas: [],
      recommendedFocus: [],
      confidenceLevel: 0
    }
  }
  
  const totalScore = quizResults.reduce((sum, quiz) => sum + quiz.score, 0)
  const totalQuestions = quizResults.reduce((sum, quiz) => sum + quiz.total, 0)
  const overallScore = (totalScore / totalQuestions) * 100
  
  // Analyze topic performance
  const topicPerformance: { [topic: string]: number } = {}
  const difficultyBreakdown: { [difficulty: string]: number } = {}
  const allStrengths: string[] = []
  const allWeaknesses: string[] = []
  let totalTimeSpent = 0
  let rushedQuestions = 0
  let overthoughtQuestions = 0
  
  quizResults.forEach(quiz => {
    // Aggregate strengths and weaknesses
    if (quiz.strengths) allStrengths.push(...quiz.strengths)
    if (quiz.weaknesses) allWeaknesses.push(...quiz.weaknesses)
    
    // Analyze question details if available
    if (quiz.questionDetails) {
      quiz.questionDetails.forEach(q => {
        // Topic performance
        q.tags.forEach(tag => {
          if (!topicPerformance[tag]) {
            topicPerformance[tag] = { correct: 0, total: 0 }
          }
          topicPerformance[tag].total++
          if (q.isCorrect) topicPerformance[tag].correct++
        })
        
        // Difficulty breakdown
        if (!difficultyBreakdown[q.difficulty]) {
          difficultyBreakdown[q.difficulty] = { correct: 0, total: 0 }
        }
        difficultyBreakdown[q.difficulty].total++
        if (q.isCorrect) difficultyBreakdown[q.difficulty].correct++
        
        // Time analysis
        totalTimeSpent += q.timeSpent
        if (q.timeSpent < 30 && !q.isCorrect) rushedQuestions++
        if (q.timeSpent > 120 && q.isCorrect) overthoughtQuestions++
      })
    }
  })
  
  // Calculate topic performance percentages
  Object.keys(topicPerformance).forEach(topic => {
    const { correct, total } = topicPerformance[topic]
    topicPerformance[topic] = (correct / total) * 100
  })
  
  // Calculate difficulty breakdown percentages
  Object.keys(difficultyBreakdown).forEach(difficulty => {
    const { correct, total } = difficultyBreakdown[difficulty]
    difficultyBreakdown[difficulty] = (correct / total) * 100
  })
  
  // Identify learning gaps and strengths
  const learningGaps = Object.entries(topicPerformance)
    .filter(([, score]) => score < 60)
    .map(([topic]) => topic)
    .slice(0, 3)
  
  const strengths = Object.entries(topicPerformance)
    .filter(([, score]) => score > 80)
    .map(([topic]) => topic)
    .slice(0, 2)
  
  // Calculate time efficiency
  const averageTimePerQuestion = totalTimeSpent / totalQuestions
  const timeEfficiency = overallScore / (averageTimePerQuestion / 60) // score per minute
  
  // Determine confidence level based on data quality
  const confidenceLevel = Math.min(100, 
    (quizResults.length * 20) + // More quizzes = higher confidence
    (quizResults.some(q => q.questionDetails) ? 30 : 0) + // Detailed data
    (overallScore > 0 ? 20 : 0) + // Valid scores
    (totalQuestions > 10 ? 30 : 0) // Sufficient questions
  )
  
  return {
    overallScore: Math.round(overallScore),
    topicPerformance,
    difficultyBreakdown,
    timeAnalysis: {
      averageTimePerQuestion: Math.round(averageTimePerQuestion),
      timeEfficiency: Math.round(timeEfficiency * 100) / 100,
      rushedQuestions,
      overthoughtQuestions
    },
    learningGaps,
    strengths,
    improvementAreas: learningGaps,
    recommendedFocus: learningGaps.slice(0, 2),
    confidenceLevel
  }
}

/**
 * Determine adaptive difficulty based on performance and user profile
 */
function determineAdaptiveDifficulty(performance: DetailedPerformanceAnalysis, userProfile: UserProfile): string {
  const baseDifficulty = performance.overallScore < 40 ? 'beginner' : 
                        performance.overallScore < 70 ? 'intermediate' : 'advanced'
  
  // Adjust based on user preferences and learning patterns
  if (userProfile.preferredDifficulty) {
    // If user prefers a different difficulty, consider their preference
    if (userProfile.preferredDifficulty === 'advanced' && baseDifficulty === 'intermediate') {
      return 'intermediate-advanced'
    }
    if (userProfile.preferredDifficulty === 'beginner' && baseDifficulty === 'intermediate') {
      return 'beginner-intermediate'
    }
  }
  
  // Adjust based on time efficiency
  if (performance.timeAnalysis.timeEfficiency > 2.0) {
    // High efficiency - can handle more challenging content
    if (baseDifficulty === 'intermediate') return 'intermediate-advanced'
    if (baseDifficulty === 'beginner') return 'beginner-intermediate'
  }
  
  return baseDifficulty
}

/**
 * Generate adaptive practice recommendations
 */
async function generateAdaptivePracticeRecommendations(
  course: any,
  existingResources: any[],
  difficulty: string,
  performance: DetailedPerformanceAnalysis,
  userProfile: UserProfile
): Promise<RuleBasedRecommendation[]> {
  const recommendations: RuleBasedRecommendation[] = []
  
  // Find practice resources matching the adaptive difficulty
  const practiceResources = existingResources.filter(resource => 
    resource.tags.some((tag: string) => 
      ['practice', 'exercise', 'quiz', 'problem'].includes(tag.toLowerCase())
    ) &&
    resource.tags.some((tag: string) => 
      [difficulty, 'intermediate'].includes(tag.toLowerCase())
    )
  )
  
  // Focus on improvement areas
  const targetedResources = practiceResources.filter(resource =>
    resource.tags.some((tag: string) => 
      performance.improvementAreas.some(area => 
        tag.toLowerCase().includes(area.toLowerCase())
      )
    )
  )
  
  const resourcesToUse = targetedResources.length > 0 ? targetedResources : practiceResources
  
  resourcesToUse.slice(0, 2).forEach((resource, index) => {
    const confidence = calculateRecommendationConfidence(resource, performance, userProfile)
    
    recommendations.push({
      title: resource.title,
      description: `Practice exercises tailored to your current level in ${course.title}`,
      resourceType: resource.type,
      difficulty,
      url: resource.url,
      reasoning: `Targeted practice to improve in areas where you scored ${performance.overallScore}% - focus on ${performance.improvementAreas.slice(0, 2).join(', ')}`,
      priority: 2 + index,
      estimatedTime: resource.duration || '45-60 minutes',
      tags: resource.tags,
      confidence,
      learningPath: 'practice',
      prerequisites: performance.strengths.slice(0, 2)
    })
  })
  
  return recommendations
}

/**
 * Generate gap-filling recommendations
 */
async function generateGapFillingRecommendations(
  course: any,
  existingResources: any[],
  performance: DetailedPerformanceAnalysis,
  userProfile: UserProfile
): Promise<RuleBasedRecommendation[]> {
  const recommendations: RuleBasedRecommendation[] = []
  
  // Find resources that specifically address learning gaps
  performance.learningGaps.forEach((gap, index) => {
    const gapResources = existingResources.filter(resource =>
      resource.tags.some((tag: string) => 
        tag.toLowerCase().includes(gap.toLowerCase())
      ) &&
      !resource.tags.some((tag: string) => 
        ['advanced', 'expert'].includes(tag.toLowerCase())
      )
    )
    
    if (gapResources.length > 0) {
      const resource = gapResources[0]
      const confidence = calculateRecommendationConfidence(resource, performance, userProfile)
      
      recommendations.push({
        title: resource.title,
        description: `Specifically addresses your gap in ${gap}`,
        resourceType: resource.type,
        difficulty: 'intermediate',
        url: resource.url,
        reasoning: `Targeted resource to fill knowledge gap in ${gap} where you need improvement`,
        priority: 3 + index,
        estimatedTime: resource.duration || '30-45 minutes',
        tags: resource.tags,
        confidence,
        learningPath: 'gap-filling',
        prerequisites: performance.strengths.slice(0, 1)
      })
    }
  })
  
  return recommendations.slice(0, 2)
}

/**
 * Generate learning path recommendations
 */
async function generateLearningPathRecommendations(
  course: any,
  existingResources: any[],
  performance: DetailedPerformanceAnalysis,
  userProfile: UserProfile
): Promise<RuleBasedRecommendation[]> {
  const recommendations: RuleBasedRecommendation[] = []
  
  // Determine next learning milestone
  const nextMilestone = performance.overallScore < 50 ? 'master-basics' :
                       performance.overallScore < 70 ? 'build-confidence' : 'advance-skills'
  
  // Find resources that support the learning path
  const pathResources = existingResources.filter(resource => {
    const tags = resource.tags.map((tag: string) => tag.toLowerCase())
    
    if (nextMilestone === 'master-basics') {
      return tags.some(tag => ['comprehensive', 'complete', 'mastery'].includes(tag))
    } else if (nextMilestone === 'build-confidence') {
      return tags.some(tag => ['confidence', 'application', 'real-world'].includes(tag))
    } else {
      return tags.some(tag => ['advanced', 'expert', 'mastery'].includes(tag))
    }
  })
  
  if (pathResources.length > 0) {
    const resource = pathResources[0]
    const confidence = calculateRecommendationConfidence(resource, performance, userProfile)
    
    recommendations.push({
      title: resource.title,
      description: `Next step in your learning journey for ${course.title}`,
      resourceType: resource.type,
      difficulty: performance.overallScore > 70 ? 'advanced' : 'intermediate',
      url: resource.url,
      reasoning: `Progressive learning resource to advance from ${performance.overallScore}% to the next level`,
      priority: 4,
      estimatedTime: resource.duration || '60-90 minutes',
      tags: resource.tags,
      confidence,
      learningPath: nextMilestone,
      prerequisites: performance.strengths
    })
  }
  
  return recommendations
}

/**
 * Calculate recommendation confidence based on multiple factors
 */
function calculateRecommendationConfidence(resource: any, performance: DetailedPerformanceAnalysis, userProfile: UserProfile): number {
  let confidence = 50 // Base confidence
  
  // Resource quality factors
  if (resource.rating && resource.rating > 4.0) confidence += 20
  if (resource.views && resource.views > 1000) confidence += 10
  
  // Match with user preferences
  if (userProfile.learningStyle) {
    const resourceType = resource.type.toLowerCase()
    if (userProfile.learningStyle === 'visual' && ['video', 'infographic'].includes(resourceType)) confidence += 15
    if (userProfile.learningStyle === 'auditory' && ['podcast', 'audio'].includes(resourceType)) confidence += 15
    if (userProfile.learningStyle === 'reading' && ['article', 'book', 'documentation'].includes(resourceType)) confidence += 15
  }
  
  // Match with performance data
  if (performance.confidenceLevel > 70) confidence += 10
  if (performance.learningGaps.some(gap => 
    resource.tags.some((tag: string) => tag.toLowerCase().includes(gap.toLowerCase()))
  )) confidence += 15
  
  // Time availability match
  if (userProfile.availableTime && resource.duration) {
    const resourceTime = parseInt(resource.duration) || 45
    if (resourceTime <= userProfile.availableTime) confidence += 10
  }
  
  return Math.min(100, confidence)
}

/**
 * Generate filtered rule-based recommendations
 */
export async function generateFilteredRuleBasedRecommendations(
  selectedProgram: string,
  selectedYear: string,
  selectedSemester: string,
  quizResults: QuizResult[]
): Promise<Array<{
  courseId: string
  courseTitle: string
  programTitle: string
  year: number
  semester: number
  recommendations: RuleBasedRecommendation[]
  performance: any
  difficulty: string
  priority: number
}>> {
  const courseRecommendations = []
  
  // Find courses matching the filters
  const matchingCourses = findCoursesByFilters(selectedProgram, selectedYear, selectedSemester, await getAllPrograms())
  
  for (const course of matchingCourses) {
    const courseQuizResults = quizResults.filter(quiz => quiz.courseId === course.id)
    const performance = calculatePerformance(courseQuizResults)
    const difficulty = determineDifficulty(performance.percentage)
    const priority = calculateCoursePriority(performance.percentage, courseQuizResults.length)
    
    const recommendations = await generateCourseSpecificRuleBasedRecommendations(course.id, courseQuizResults, { program: course.programTitle, interests: [], recentTopics: [] }) // Pass a minimal user profile for filtering
    
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
  
  return courseRecommendations.sort((a, b) => b.priority - a.priority)
}

/**
 * Find courses by filters
 */
function findCoursesByFilters(program: string, year: string, semester: string, programs: any[]) {
  const courses = []
  
  for (const prog of programs) {
    if (program !== "all" && prog.id !== program) continue
    
    for (const y of prog.years) {
      if (year !== "all" && y.year !== parseInt(year)) continue
      
      for (const sem of y.semesters) {
        if (semester !== "all" && sem.semester !== parseInt(semester)) continue
        
        for (const course of sem.courses) {
          courses.push({
            ...course,
            programTitle: prog.title,
            year: y.year,
            semester: sem.semester
          })
        }
      }
    }
  }
  
  return courses
}

/**
 * Calculate course priority based on performance and quiz count
 */
function calculateCoursePriority(percentage: number, quizCount: number): number {
  // Higher priority for courses with low performance and more quiz attempts
  const performanceWeight = 100 - percentage // Lower percentage = higher priority
  const quizWeight = Math.min(quizCount * 10, 50) // More quizzes = higher priority, capped at 50
  
  return performanceWeight + quizWeight
} 