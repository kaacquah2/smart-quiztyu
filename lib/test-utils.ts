import { QuizResult, UserProfile, RuleBasedRecommendation } from "./rule-based-recommendations-service"
import { DeepSeekRecommendation } from "./deepseek-recommendations-service"
import { GeminiStudyPlan, QuizContext } from "./gemini-study-plan-service"

export interface TestScenario {
  name: string
  description: string
  quizResults: QuizResult[]
  userProfile: UserProfile
  courseId?: string
  expectedOutcomes: {
    minRecommendations: number
    maxRecommendations: number
    expectedConfidence: number
    expectedLearningPaths: string[]
  }
}

export interface TestResult {
  scenario: string
  passed: boolean
  duration: number
  actualRecommendations: number
  actualConfidence: number
  actualLearningPaths: string[]
  errors: string[]
  warnings: string[]
}

export interface PerformanceTestResult {
  operation: string
  iterations: number
  totalDuration: number
  averageDuration: number
  minDuration: number
  maxDuration: number
  successRate: number
  cacheHitRate: number
  errors: string[]
}

/**
 * Generate mock quiz results for testing
 */
export function generateMockQuizResults(
  count: number = 3,
  courseId?: string,
  performanceLevel: 'low' | 'medium' | 'high' = 'medium'
): QuizResult[] {
  const results: QuizResult[] = []
  
  // Valid course IDs from the database
  const validCourseIds = [
    'intro-to-cs', 'math-for-cs', 'intro-to-python', 'fundamentals-computing',
    'data-structures', 'discrete-math', 'database-systems', 'computer-organization',
    'operating-systems', 'oop-java', 'web-development', 'artificial-intelligence',
    'machine-learning', 'cloud-computing', 'cybersecurity'
  ]
  
  for (let i = 0; i < count; i++) {
    const score = performanceLevel === 'low' ? Math.floor(Math.random() * 40) + 10 :
                 performanceLevel === 'high' ? Math.floor(Math.random() * 30) + 70 :
                 Math.floor(Math.random() * 40) + 30
    
    const total = 10
    const timeSpent = Math.floor(Math.random() * 300) + 60 // 1-6 minutes
    
    results.push({
      quizId: `quiz-${i + 1}`,
      courseId: courseId || validCourseIds[Math.floor(Math.random() * validCourseIds.length)],
      quizTitle: `Test Quiz ${i + 1}`,
      score,
      total,
      timeSpent,
      strengths: generateMockStrengths(),
      weaknesses: generateMockWeaknesses(),
      questionDetails: generateMockQuestionDetails(score, total)
    })
  }
  
  return results
}

/**
 * Generate mock user profile for testing
 */
export function generateMockUserProfile(
  program: string = 'Computer Science',
  learningStyle?: 'visual' | 'auditory' | 'kinesthetic' | 'reading'
): UserProfile {
  return {
    program,
    interests: generateMockInterests(),
    recentTopics: generateMockRecentTopics(),
    learningStyle: learningStyle || ['visual', 'auditory', 'kinesthetic', 'reading'][Math.floor(Math.random() * 4)],
    preferredDifficulty: ['beginner', 'intermediate', 'advanced'][Math.floor(Math.random() * 3)],
    availableTime: Math.floor(Math.random() * 20) + 5, // 5-25 hours per week
    studyPatterns: generateMockStudyPatterns(),
    progressHistory: generateMockProgressHistory()
  }
}

/**
 * Generate mock quiz context for study plan testing
 */
export function generateMockQuizContext(
  courseId: string = 'intro-to-cs',
  performanceLevel: 'low' | 'medium' | 'high' = 'medium'
): QuizContext {
  const score = performanceLevel === 'low' ? Math.floor(Math.random() * 40) + 10 :
               performanceLevel === 'high' ? Math.floor(Math.random() * 30) + 70 :
               Math.floor(Math.random() * 40) + 30
  
  const totalQuestions = 10
  const timeSpent = Math.floor(Math.random() * 300) + 60
  
  // Map course IDs to proper titles
  const courseTitles: { [key: string]: string } = {
    'intro-to-cs': 'Introduction to Computer Science',
    'math-for-cs': 'Mathematics for Computer Science',
    'intro-to-python': 'Introduction to Programming (Python)',
    'fundamentals-computing': 'Fundamentals of Computing',
    'data-structures': 'Data Structures and Algorithms',
    'discrete-math': 'Discrete Mathematics',
    'database-systems': 'Database Systems I',
    'computer-organization': 'Computer Organization',
    'operating-systems': 'Operating Systems',
    'oop-java': 'Object-Oriented Programming (Java)',
    'web-development': 'Web Development',
    'artificial-intelligence': 'Artificial Intelligence',
    'machine-learning': 'Machine Learning',
    'cloud-computing': 'Cloud Computing',
    'cybersecurity': 'Cybersecurity and Risk Management'
  }
  
  return {
    quizId: `quiz-${Date.now()}`,
    score,
    totalQuestions,
    courseId,
    programId: 'computer-science',
    courseTitle: courseTitles[courseId] || `Course ${courseId}`,
    timeSpent,
    difficulty: ['beginner', 'intermediate', 'advanced'][Math.floor(Math.random() * 3)],
    incorrectAnswers: generateMockIncorrectAnswers(score, totalQuestions)
  }
}

/**
 * Generate comprehensive test scenarios
 */
export function generateTestScenarios(): TestScenario[] {
  return [
    {
      name: "High Performer - Advanced Course",
      description: "Student with high performance in advanced course",
      quizResults: generateMockQuizResults(3, 'artificial-intelligence', 'high'),
      userProfile: generateMockUserProfile('Computer Science', 'visual'),
      courseId: 'artificial-intelligence',
      expectedOutcomes: {
        minRecommendations: 3,
        maxRecommendations: 5,
        expectedConfidence: 80,
        expectedLearningPaths: ['advanced', 'mastery', 'expert']
      }
    },
    {
      name: "Low Performer - Beginner Course",
      description: "Student with low performance in beginner course",
      quizResults: generateMockQuizResults(2, 'intro-to-cs', 'low'),
      userProfile: generateMockUserProfile('Computer Science', 'kinesthetic'),
      courseId: 'intro-to-cs',
      expectedOutcomes: {
        minRecommendations: 3,
        maxRecommendations: 5,
        expectedConfidence: 85,
        expectedLearningPaths: ['foundational', 'remediation', 'basics']
      }
    },
    {
      name: "Mixed Performance - Multiple Courses",
      description: "Student with mixed performance across multiple courses",
      quizResults: [
        ...generateMockQuizResults(2, 'data-structures', 'high'),
        ...generateMockQuizResults(2, 'math-for-cs', 'low'),
        ...generateMockQuizResults(1, 'intro-to-python', 'medium')
      ],
      userProfile: generateMockUserProfile('Software Engineering', 'reading'),
      expectedOutcomes: {
        minRecommendations: 3,
        maxRecommendations: 5,
        expectedConfidence: 75,
        expectedLearningPaths: ['practice', 'gap-filling', 'program-core']
      }
    },
    {
      name: "New Student - No History",
      description: "New student with no quiz history",
      quizResults: [],
      userProfile: generateMockUserProfile('Information Technology'),
      expectedOutcomes: {
        minRecommendations: 2,
        maxRecommendations: 5,
        expectedConfidence: 60,
        expectedLearningPaths: ['foundational', 'program-core']
      }
    }
  ]
}

/**
 * Validate recommendation quality
 */
export function validateRecommendations(
  recommendations: (RuleBasedRecommendation | DeepSeekRecommendation)[],
  scenario: TestScenario
): { isValid: boolean; errors: string[]; warnings: string[] } {
  const errors: string[] = []
  const warnings: string[] = []
  
  // Check recommendation count
  if (recommendations.length < scenario.expectedOutcomes.minRecommendations) {
    errors.push(`Too few recommendations: ${recommendations.length} < ${scenario.expectedOutcomes.minRecommendations}`)
  }
  
  if (recommendations.length > scenario.expectedOutcomes.maxRecommendations) {
    warnings.push(`More recommendations than expected: ${recommendations.length} > ${scenario.expectedOutcomes.maxRecommendations}`)
  }
  
  // Check recommendation quality
  recommendations.forEach((rec, index) => {
    if (!rec.title || rec.title.length < 5) {
      errors.push(`Recommendation ${index + 1}: Invalid title`)
    }
    
    if (!rec.description || rec.description.length < 10) {
      errors.push(`Recommendation ${index + 1}: Invalid description`)
    }
    
    if (!rec.url || rec.url.length < 5) {
      warnings.push(`Recommendation ${index + 1}: Missing or invalid URL`)
    }
    
    if (rec.priority < 1 || rec.priority > 5) {
      errors.push(`Recommendation ${index + 1}: Invalid priority (${rec.priority})`)
    }
    
    // Check for confidence field in rule-based recommendations
    if ('confidence' in rec && (rec.confidence < 0 || rec.confidence > 100)) {
      errors.push(`Recommendation ${index + 1}: Invalid confidence (${rec.confidence})`)
    }
  })
  
  // Check learning paths if available
  const learningPaths = recommendations
    .filter(rec => 'learningPath' in rec)
    .map(rec => (rec as any).learningPath)
    .filter(Boolean)
  
  if (learningPaths.length > 0) {
    const expectedPaths = scenario.expectedOutcomes.expectedLearningPaths
    const hasExpectedPath = learningPaths.some(path => expectedPaths.includes(path))
    
    if (!hasExpectedPath) {
      warnings.push(`No expected learning paths found. Expected: ${expectedPaths.join(', ')}, Found: ${learningPaths.join(', ')}`)
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  }
}

/**
 * Validate study plan quality
 */
export function validateStudyPlan(
  studyPlan: GeminiStudyPlan,
  scenario: TestScenario
): { isValid: boolean; errors: string[]; warnings: string[] } {
  const errors: string[] = []
  const warnings: string[] = []
  
  // Check required fields
  if (!studyPlan.courseTitle) {
    errors.push('Missing course title')
  }
  
  if (!studyPlan.studySteps || studyPlan.studySteps.length < 3) {
    errors.push(`Too few study steps: ${studyPlan.studySteps?.length || 0}`)
  }
  
  if (!studyPlan.focusAreas || studyPlan.focusAreas.length < 2) {
    errors.push(`Too few focus areas: ${studyPlan.focusAreas?.length || 0}`)
  }
  
  if (!studyPlan.weeklyGoals || studyPlan.weeklyGoals.length < 2) {
    errors.push(`Too few weekly goals: ${studyPlan.weeklyGoals?.length || 0}`)
  }
  
  if (!studyPlan.resources || !studyPlan.resources.primary || studyPlan.resources.primary.length < 2) {
    errors.push(`Too few primary resources: ${studyPlan.resources?.primary?.length || 0}`)
  }
  
  // Check target score logic
  if (studyPlan.targetScore < 0 || studyPlan.targetScore > 100) {
    errors.push(`Invalid target score: ${studyPlan.targetScore}`)
  }
  
  // Check time allocation
  const timeAllocation = studyPlan.timeAllocation
  if (timeAllocation) {
    const total = timeAllocation.conceptReview + timeAllocation.practiceProblems + 
                  timeAllocation.advancedTopics + timeAllocation.realWorldApplications
    
    if (Math.abs(total - 100) > 5) {
      warnings.push(`Time allocation doesn't add up to 100%: ${total}%`)
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  }
}

/**
 * Run performance test
 */
export async function runPerformanceTest<T>(
  operation: string,
  testFunction: () => Promise<T>,
  iterations: number = 10
): Promise<PerformanceTestResult> {
  const results: { success: boolean; duration: number; error?: string }[] = []
  
  for (let i = 0; i < iterations; i++) {
    const startTime = Date.now()
    
    try {
      await testFunction()
      results.push({ success: true, duration: Date.now() - startTime })
    } catch (error) {
      results.push({ 
        success: false, 
        duration: Date.now() - startTime, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      })
    }
  }
  
  const successfulResults = results.filter(r => r.success)
  const durations = successfulResults.map(r => r.duration)
  const errors = results.filter(r => !r.success).map(r => r.error!).filter(Boolean)
  
  return {
    operation,
    iterations,
    totalDuration: durations.reduce((sum, d) => sum + d, 0),
    averageDuration: durations.length > 0 ? durations.reduce((sum, d) => sum + d, 0) / durations.length : 0,
    minDuration: durations.length > 0 ? Math.min(...durations) : 0,
    maxDuration: durations.length > 0 ? Math.max(...durations) : 0,
    successRate: (successfulResults.length / results.length) * 100,
    cacheHitRate: 0, // Would need to be calculated based on cache service
    errors
  }
}

// Helper functions for generating mock data
function generateMockStrengths(): string[] {
  const strengths = ['problem-solving', 'algorithm-design', 'data-structures', 'debugging', 'code-optimization']
  return strengths.slice(0, Math.floor(Math.random() * 3) + 1)
}

function generateMockWeaknesses(): string[] {
  const weaknesses = ['time-complexity', 'memory-management', 'design-patterns', 'testing', 'documentation']
  return weaknesses.slice(0, Math.floor(Math.random() * 3) + 1)
}

function generateMockInterests(): string[] {
  const interests = ['web-development', 'machine-learning', 'cybersecurity', 'mobile-development', 'data-science']
  return interests.slice(0, Math.floor(Math.random() * 3) + 1)
}

function generateMockRecentTopics(): string[] {
  const topics = ['algorithms', 'databases', 'networking', 'operating-systems', 'software-engineering']
  return topics.slice(0, Math.floor(Math.random() * 2) + 1)
}

function generateMockStudyPatterns(): any {
  return {
    preferredTimeOfDay: ['morning', 'afternoon', 'evening', 'night'][Math.floor(Math.random() * 4)],
    studySessionDuration: Math.floor(Math.random() * 60) + 30, // 30-90 minutes
    breakFrequency: Math.floor(Math.random() * 30) + 15, // 15-45 minutes
    preferredResourceTypes: ['video', 'article', 'practice', 'book'].slice(0, Math.floor(Math.random() * 3) + 1),
    retentionRate: Math.floor(Math.random() * 40) + 60 // 60-100%
  }
}

function generateMockProgressHistory(): any[] {
  const history = []
  for (let i = 0; i < 5; i++) {
    history.push({
      date: new Date(Date.now() - i * 7 * 24 * 60 * 60 * 1000),
      courseId: `course-${Math.floor(Math.random() * 5) + 1}`,
      score: Math.floor(Math.random() * 40) + 30,
      total: 10,
      improvement: Math.floor(Math.random() * 20) - 10,
      timeSpent: Math.floor(Math.random() * 300) + 60
    })
  }
  return history
}

function generateMockQuestionDetails(score: number, total: number): any[] {
  const details = []
  for (let i = 0; i < total; i++) {
    const isCorrect = i < score
    details.push({
      questionId: `q-${i + 1}`,
      questionText: `Question ${i + 1}`,
      userAnswer: isCorrect ? 'correct' : 'incorrect',
      correctAnswer: 'correct',
      isCorrect,
      timeSpent: Math.floor(Math.random() * 120) + 30,
      difficulty: ['easy', 'medium', 'hard'][Math.floor(Math.random() * 3)],
      category: ['theory', 'practice', 'application'][Math.floor(Math.random() * 3)],
      tags: ['programming', 'algorithms', 'data-structures'].slice(0, Math.floor(Math.random() * 2) + 1)
    })
  }
  return details
}

function generateMockIncorrectAnswers(score: number, total: number): string[] {
  const incorrectCount = total - score
  const incorrectAnswers = []
  for (let i = score; i < total; i++) {
    incorrectAnswers.push(`q-${i + 1}`)
  }
  return incorrectAnswers
} 