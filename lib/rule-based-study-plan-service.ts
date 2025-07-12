import { getAllPrograms, getCourseById, type Program, type Course } from "./program-service"
import { getResourcesForCourse } from "./resource-service"
import { prisma } from "./prisma"
import { getPersonalizedPlan } from './personalization-engine';

export interface RuleBasedStudyPlan {
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
  personalizedSchedule?: string[] // Added for personalization
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

/**
 * Generate rule-based study plan as fallback for Gemini API
 */
export async function generateRuleBasedStudyPlan(quizContext: QuizContext): Promise<RuleBasedStudyPlan | null> {
  try {
    // --- NEW: Personalization integration ---
    const userId = (quizContext as any).userId;
    let personalizedSchedule = undefined;
    let personalizedAdvice = undefined;
    if (userId) {
      const personalized = await getPersonalizedPlan({ userId });
      personalizedSchedule = personalized.schedule;
      personalizedAdvice = personalized.advice;
    }
    const percentage = (quizContext.score / quizContext.totalQuestions) * 100
    const courseResources = getResourcesForCourse(quizContext.courseId)
    const course = await getCourseById(quizContext.programId, quizContext.courseId)
    
    if (!course) {
      const plan = generateDefaultStudyPlan(quizContext)
      return {
        ...plan,
        personalizedSchedule,
        personalizedAdvice
      }
    }
    
    // Get user analytics for additional context
    const userAnalytics = await getUserAnalytics(quizContext.quizId)
    let plan: RuleBasedStudyPlan;
    if (percentage < 40) {
      plan = generateBeginnerStudyPlan(quizContext, course, await courseResources, userAnalytics)
    } else if (percentage < 70) {
      plan = generateIntermediateStudyPlan(quizContext, course, await courseResources, userAnalytics)
    } else {
      plan = generateAdvancedStudyPlan(quizContext, course, await courseResources, userAnalytics)
    }
    return {
      ...plan,
      personalizedSchedule,
      personalizedAdvice
    }
  } catch (error) {
    console.error("Error generating rule-based study plan:", error)
    const plan = generateDefaultStudyPlan(quizContext)
    return {
      ...plan,
      personalizedSchedule: undefined,
      personalizedAdvice: undefined
    }
  }
}

/**
 * Generate study plan for beginners (score < 40%)
 */
function generateBeginnerStudyPlan(
  quizContext: QuizContext,
  course: any,
  courseResources: any[],
  userAnalytics: any
): RuleBasedStudyPlan {
  const percentage = (quizContext.score / quizContext.totalQuestions) * 100
  const targetScore = Math.min(100, percentage + 25)
  
  // Find foundational resources
  const foundationalResources = courseResources.filter(resource => 
    resource.tags.some((tag: string) => 
      ['basics', 'fundamentals', 'introduction', 'beginner'].includes(tag.toLowerCase())
    )
  )
  
  // Find practice resources
  const practiceResources = courseResources.filter(resource => 
    resource.tags.some((tag: string) => 
      ['practice', 'exercise', 'quiz', 'problem'].includes(tag.toLowerCase())
    )
  )
  
  return {
    courseTitle: quizContext.courseTitle,
    currentLevel: "Beginner",
    targetScore: targetScore,
    programId: quizContext.programId,
    studySteps: [
      "Review basic concepts and terminology for 30 minutes daily",
      "Complete 2-3 practice problems each day to build confidence",
      "Watch introductory videos to understand core concepts",
      "Create flashcards for key terms and definitions",
      "Join study groups to discuss concepts with peers"
    ],
    personalizedAdvice: `Your current score of ${percentage.toFixed(1)}% indicates you need to build a strong foundation. Focus on understanding basic concepts before moving to more complex topics. Don't rush - take time to fully grasp each concept.`,
    focusAreas: [
      "Basic terminology and definitions",
      "Fundamental concepts and principles",
      "Simple problem-solving techniques",
      "Building confidence through practice"
    ],
    timeAllocation: {
      conceptReview: 40,
      practiceProblems: 35,
      advancedTopics: 15,
      realWorldApplications: 10
    },
    weeklyGoals: [
      "Complete 10 practice problems by end of week",
      "Review all basic concepts covered in the course",
      "Create a glossary of key terms",
      "Achieve 60% on next practice quiz"
    ],
    resources: {
      primary: foundationalResources.slice(0, 3).map(r => r.title),
      supplementary: courseResources.slice(0, 2).map(r => r.title),
      practice: practiceResources.slice(0, 2).map(r => r.title)
    },
    estimatedImprovement: "15-25% improvement in 2-3 weeks with consistent study",
    nextMilestone: "Achieve 60% on next assessment"
  }
}

/**
 * Generate study plan for intermediate students (score 40-70%)
 */
function generateIntermediateStudyPlan(
  quizContext: QuizContext,
  course: any,
  courseResources: any[],
  userAnalytics: any
): RuleBasedStudyPlan {
  const percentage = (quizContext.score / quizContext.totalQuestions) * 100
  const targetScore = Math.min(100, percentage + 20)
  
  // Find intermediate resources
  const intermediateResources = courseResources.filter(resource => 
    resource.tags.some((tag: string) => 
      ['intermediate', 'practice', 'application'].includes(tag.toLowerCase())
    )
  )
  
  // Find advanced resources for growth
  const advancedResources = courseResources.filter(resource => 
    resource.tags.some((tag: string) => 
      ['advanced', 'expert', 'mastery'].includes(tag.toLowerCase())
    )
  )
  
  return {
    courseTitle: quizContext.courseTitle,
    currentLevel: "Intermediate",
    targetScore: targetScore,
    programId: quizContext.programId,
    studySteps: [
      "Focus on connecting concepts and understanding relationships",
      "Practice complex problem-solving scenarios",
      "Review areas where you made mistakes in the quiz",
      "Apply concepts to real-world scenarios",
      "Teach concepts to others to reinforce understanding"
    ],
    personalizedAdvice: `Your score of ${percentage.toFixed(1)}% shows you have a good foundation but need to strengthen your understanding of complex concepts. Focus on connecting ideas and applying knowledge to new situations.`,
    focusAreas: [
      "Concept integration and connections",
      "Complex problem-solving strategies",
      "Application of knowledge to new scenarios",
      "Identifying and filling knowledge gaps"
    ],
    timeAllocation: {
      conceptReview: 25,
      practiceProblems: 40,
      advancedTopics: 25,
      realWorldApplications: 10
    },
    weeklyGoals: [
      "Complete 15 challenging practice problems",
      "Review and understand all incorrect answers from the quiz",
      "Apply concepts to 3 real-world scenarios",
      "Achieve 80% on next practice quiz"
    ],
    resources: {
      primary: intermediateResources.slice(0, 3).map(r => r.title),
      supplementary: courseResources.slice(0, 2).map(r => r.title),
      practice: advancedResources.slice(0, 2).map(r => r.title)
    },
    estimatedImprovement: "10-20% improvement in 2 weeks with focused practice",
    nextMilestone: "Achieve 80% on next assessment"
  }
}

/**
 * Generate study plan for advanced students (score > 70%)
 */
function generateAdvancedStudyPlan(
  quizContext: QuizContext,
  course: any,
  courseResources: any[],
  userAnalytics: any
): RuleBasedStudyPlan {
  const percentage = (quizContext.score / quizContext.totalQuestions) * 100
  const targetScore = Math.min(100, percentage + 15)
  
  // Find advanced resources
  const advancedResources = courseResources.filter(resource => 
    resource.tags.some((tag: string) => 
      ['advanced', 'expert', 'mastery', 'deep-dive'].includes(tag.toLowerCase())
    )
  )
  
  // Find real-world application resources
  const applicationResources = courseResources.filter(resource => 
    resource.tags.some((tag: string) => 
      ['real-world', 'application', 'project', 'case-study'].includes(tag.toLowerCase())
    )
  )
  
  return {
    courseTitle: quizContext.courseTitle,
    currentLevel: "Advanced",
    targetScore: targetScore,
    programId: quizContext.programId,
    studySteps: [
      "Explore advanced topics and cutting-edge applications",
      "Work on complex projects and case studies",
      "Mentor other students to reinforce your expertise",
      "Research current trends and developments in the field",
      "Apply knowledge to solve real-world problems"
    ],
    personalizedAdvice: `Your excellent score of ${percentage.toFixed(1)}% demonstrates strong mastery of the material. Focus on advanced applications and real-world problem-solving to achieve expert-level proficiency.`,
    focusAreas: [
      "Advanced concepts and cutting-edge applications",
      "Complex problem-solving and optimization",
      "Real-world project implementation",
      "Knowledge synthesis and innovation"
    ],
    timeAllocation: {
      conceptReview: 15,
      practiceProblems: 25,
      advancedTopics: 35,
      realWorldApplications: 25
    },
    weeklyGoals: [
      "Complete 2 advanced projects or case studies",
      "Research and present on a current topic in the field",
      "Mentor at least 2 other students",
      "Achieve 95% on next assessment"
    ],
    resources: {
      primary: advancedResources.slice(0, 3).map(r => r.title),
      supplementary: applicationResources.slice(0, 2).map(r => r.title),
      practice: courseResources.slice(0, 2).map(r => r.title)
    },
    estimatedImprovement: "5-15% improvement in 2 weeks with advanced focus",
    nextMilestone: "Achieve expert-level proficiency"
  }
}

/**
 * Generate default study plan when no specific data is available
 */
function generateDefaultStudyPlan(quizContext: QuizContext): RuleBasedStudyPlan {
  const percentage = (quizContext.score / quizContext.totalQuestions) * 100
  
  return {
    courseTitle: quizContext.courseTitle,
    currentLevel: "Intermediate",
    targetScore: Math.min(100, percentage + 20),
    programId: quizContext.programId,
    studySteps: [
      "Review course materials and notes regularly",
      "Complete practice problems and exercises",
      "Join study groups for collaborative learning",
      "Seek help from instructors when needed",
      "Maintain consistent study schedule"
    ],
    personalizedAdvice: "Focus on understanding core concepts and practicing regularly. Consistency is key to improvement.",
    focusAreas: [
      "Core course concepts",
      "Problem-solving skills",
      "Time management",
      "Regular practice"
    ],
    timeAllocation: {
      conceptReview: 30,
      practiceProblems: 35,
      advancedTopics: 20,
      realWorldApplications: 15
    },
    weeklyGoals: [
      "Complete assigned readings and materials",
      "Practice with 10-15 problems",
      "Review and understand mistakes",
      "Prepare for next assessment"
    ],
    resources: {
      primary: ["Course Textbook", "Lecture Notes", "Practice Problems"],
      supplementary: ["Online Resources", "Study Groups"],
      practice: ["Quiz Practice", "Homework Exercises"]
    },
    estimatedImprovement: "10-20% improvement with consistent study",
    nextMilestone: "Improve understanding of core concepts"
  }
}

/**
 * Generate multi-course study plan
 */
export async function generateMultiCourseRuleBasedStudyPlan(
  quizResults: Array<{ quizId: string; score: number; totalQuestions: number; courseId: string; programId: string; courseTitle: string }>
): Promise<{ [courseId: string]: RuleBasedStudyPlan }> {
  const studyPlans: { [courseId: string]: RuleBasedStudyPlan } = {}
  
  for (const quizResult of quizResults) {
    const quizContext: QuizContext = {
      quizId: quizResult.quizId,
      score: quizResult.score,
      totalQuestions: quizResult.totalQuestions,
      courseId: quizResult.courseId,
      programId: quizResult.programId,
      courseTitle: quizResult.courseTitle
    }
    
    const studyPlan = await generateRuleBasedStudyPlan(quizContext)
    if (studyPlan) {
      studyPlans[quizResult.courseId] = studyPlan
    }
  }
  
  return studyPlans
}

/**
 * Generate program-wide study plan
 */
export async function generateProgramRuleBasedStudyPlan(
  programId: string,
  quizResults: Array<{ quizId: string; score: number; totalQuestions: number; courseId: string; courseTitle: string }>
): Promise<{
  programOverview: string
  coursePlans: { [courseId: string]: RuleBasedStudyPlan }
  overallStrategy: string
  programGoals: string[]
}> {
  const coursePlans: { [courseId: string]: RuleBasedStudyPlan } = {}
  
  // Generate individual course plans
  for (const quizResult of quizResults) {
    const quizContext: QuizContext = {
      quizId: quizResult.quizId,
      score: quizResult.score,
      totalQuestions: quizResult.totalQuestions,
      courseId: quizResult.courseId,
      programId: programId,
      courseTitle: quizResult.courseTitle
    }
    
    const studyPlan = await generateRuleBasedStudyPlan(quizContext)
    if (studyPlan) {
      coursePlans[quizResult.courseId] = studyPlan
    }
  }
  
  // Calculate overall performance
  const overallPercentage = calculateOverallPerformance(quizResults)
  
  // Generate program overview and strategy
  const programOverview = generateProgramOverview(programId, quizResults, overallPercentage)
  const overallStrategy = generateOverallStrategy(overallPercentage, Object.keys(coursePlans).length)
  const programGoals = generateProgramGoals(overallPercentage, Object.keys(coursePlans).length)
  
  return {
    programOverview,
    coursePlans,
    overallStrategy,
    programGoals
  }
}

/**
 * Calculate overall performance across all quizzes
 */
function calculateOverallPerformance(quizResults: Array<{ score: number; totalQuestions: number }>) {
  if (quizResults.length === 0) return 0
  
  const totalScore = quizResults.reduce((sum, quiz) => sum + quiz.score, 0)
  const totalQuestions = quizResults.reduce((sum, quiz) => sum + quiz.totalQuestions, 0)
  
  return (totalScore / totalQuestions) * 100
}

/**
 * Generate program overview
 */
function generateProgramOverview(
  programId: string,
  quizResults: Array<{ courseTitle: string; score: number; totalQuestions: number }>,
  overallPercentage: number
): string {
  return `Based on your performance across ${quizResults.length} courses with an overall score of ${overallPercentage.toFixed(1)}%, here's your personalized study plan. Focus on the areas where you need the most improvement while maintaining your strengths.`
}

/**
 * Generate overall strategy
 */
function generateOverallStrategy(overallPercentage: number, courseCount: number): string {
  if (overallPercentage < 50) {
    return `Focus on building strong foundations across all courses. Prioritize understanding basic concepts before moving to advanced topics. Allocate more time to courses where you're struggling.`
  } else if (overallPercentage < 70) {
    return `Maintain your good performance while identifying and addressing specific weak areas. Focus on connecting concepts across courses and applying knowledge in new contexts.`
  } else {
    return `Build on your excellent performance by exploring advanced topics and real-world applications. Consider taking on leadership roles in study groups and mentoring other students.`
  }
}

/**
 * Generate program goals
 */
function generateProgramGoals(overallPercentage: number, courseCount: number): string[] {
  if (overallPercentage < 50) {
    return [
      `Improve overall performance to at least 60% within 4 weeks`,
      `Complete all foundational materials for each course`,
      `Establish consistent study habits and schedule`,
      `Seek help from instructors and tutors when needed`
    ]
  } else if (overallPercentage < 70) {
    return [
      `Achieve 80% average across all courses within 6 weeks`,
      `Master complex problem-solving techniques`,
      `Apply knowledge to real-world scenarios`,
      `Develop advanced study and time management skills`
    ]
  } else {
    return [
      `Maintain 90%+ average across all courses`,
      `Complete advanced projects and research`,
      `Mentor other students and lead study groups`,
      `Prepare for advanced coursework and career opportunities`
    ]
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