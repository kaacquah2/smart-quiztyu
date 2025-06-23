import { PrismaClient } from './generated/prisma'
import { getCourseById, programs } from "./program-data"

const prisma = new PrismaClient()

export interface ResourceRecommendation {
  id: string
  title: string
  description: string
  url: string
  platform: string
  type: string
  category: string
  tags: string[]
  duration: string
  rating: number
  views?: number | null
  lessons?: number | null
  videos?: number | null
  courseIds: string[]
  reason: string // AI-generated reason for recommendation
  priority: number // 1-5, higher is more important
}

// Quiz ID to Course ID mapping
const quizToCourseMapping: Record<string, string> = {
  // Computer Science courses
  "intro-to-cs": "intro-to-cs",
  "math-for-cs": "math-for-cs", 
  "intro-to-python": "intro-to-python",
  "fundamentals-computing": "fundamentals-computing",
  "data-structures": "data-structures",
  "discrete-math": "discrete-math",
  "database-systems": "database-systems",
  "computer-organization": "computer-organization",
  "intro-software-eng": "intro-software-eng",
  "operating-systems": "operating-systems",
  "data-structures-2": "data-structures-2",
  "oop-java": "oop-java",
  "digital-logic": "digital-logic",
  "linear-algebra": "linear-algebra",
  "theory-computation": "theory-computation",
  "computer-networks": "computer-networks",
  "database-systems-2": "database-systems-2",
  "web-development": "web-development",
  "mathematical-logic": "mathematical-logic",
  "software-eng-advanced": "software-eng-advanced",
  "artificial-intelligence": "artificial-intelligence",
  "computer-graphics": "computer-graphics",
  "advanced-database": "advanced-database",
  "os-advanced": "os-advanced",
  "mobile-app-dev": "mobile-app-dev",
  "machine-learning": "machine-learning",
  "information-security": "information-security",
  "cloud-computing": "cloud-computing",
  "computer-vision": "computer-vision",
  "advanced-algorithms": "advanced-algorithms",
  "distributed-systems": "distributed-systems",
  "big-data-analytics": "big-data-analytics",
  "cybersecurity": "cybersecurity",
  "advanced-web": "advanced-web",
  
  // Electrical Engineering courses
  "physics": "physics",
  "math-for-engineers-1": "math-for-engineers-1",
  "circuit-analysis": "circuit-analysis",
  "math-for-engineers-2": "math-for-engineers-2",
  "digital-systems": "digital-systems",
  "electronics-1": "electronics-1",
  "electromagnetism": "electromagnetism",
  "signals-systems": "signals-systems",
  "electronics-2": "electronics-2",
  "electric-machines-1": "electric-machines-1",
  "engineering-math": "engineering-math",
  "measurements-instrumentation": "measurements-instrumentation",
  "control-systems": "control-systems",
  "power-systems": "power-systems",
  "digital-electronics": "digital-electronics",
  "electric-machines-2": "electric-machines-2",
  "microprocessors": "microprocessors",
  "communication-systems": "communication-systems",
  "power-electronics": "power-electronics",
  "electromagnetic-fields": "electromagnetic-fields",
  "digital-signal-processing": "digital-signal-processing",
  "power-systems-2": "power-systems-2",
  "renewable-energy": "renewable-energy",
  "embedded-systems": "embedded-systems",
  "industrial-electronics": "industrial-electronics",
  
  // Business Administration courses
  "intro-business": "intro-business",
  "principles-management": "principles-management",
  "microeconomics": "microeconomics",
  "business-math": "business-math",
  "business-communication": "business-communication",
  "principles-accounting": "principles-accounting",
  "financial-accounting": "financial-accounting",
  "macroeconomics": "macroeconomics",
  "business-statistics": "business-statistics",
  "organizational-behavior": "organizational-behavior",
  "business-law": "business-law",
  "it-business": "it-business",
  "marketing-principles": "marketing-principles",
  "marketing-management": "marketing-management",
  "business-finance": "business-finance",
  "human-resource-management": "human-resource-management",
  "management-accounting": "management-accounting",
  "operations-management": "operations-management",
  "corporate-finance": "corporate-finance",
  "business-ethics": "business-ethics",
  "entrepreneurship": "entrepreneurship",
  "business-analysis": "business-analysis",
  "strategic-management": "strategic-management",
  "investment-analysis": "investment-analysis",
  "international-business": "international-business",
  "management-info-systems": "management-info-systems",
  "innovation-management": "innovation-management",
  "financial-markets": "financial-markets",
  "quality-management": "quality-management",
  "digital-marketing": "digital-marketing",
  "business-analytics": "business-analytics",
  
  // Nursing courses
  "anatomy-physiology": "anatomy-physiology",
  "anatomy-physiology-1": "anatomy-physiology-1",
  "anatomy-physiology-2": "anatomy-physiology-2",
  "nursing-fundamentals": "nursing-fundamentals",
  "fundamentals-nursing": "fundamentals-nursing",
  "health-assessment": "health-assessment",
  "nursing-ethics": "nursing-ethics",
  "medical-surgical-nursing": "medical-surgical-nursing",
  "maternal-child-nursing": "maternal-child-nursing",
  "mental-health-nursing": "mental-health-nursing",
  "community-health-nursing": "community-health-nursing",
  "pharmacology": "pharmacology",
  "pharmacology-1": "pharmacology-1",
  "nursing-research": "nursing-research",
  "geriatric-nursing": "geriatric-nursing",
  "critical-care-nursing": "critical-care-nursing",
}

// Get resources for a specific course from database
export async function getResourcesForCourse(courseId: string) {
  try {
    const resources = await prisma.resource.findMany({
      where: {
        courseIds: {
          has: courseId
        }
      }
    })
    return resources
  } catch (error) {
    console.error('Error fetching resources for course:', error)
    return []
  }
}

// Get resources for a quiz by mapping quiz ID to course ID
export async function getResourcesForQuiz(quizId: string) {
  const courseId = quizToCourseMapping[quizId]
  if (!courseId) {
    return []
  }
  return await getResourcesForCourse(courseId)
}

// Generate AI recommendations based on quiz performance
export async function generateAIRecommendations(
  quizId: string, 
  score: number, 
  totalQuestions: number,
  _incorrectAnswers: number[] = []
): Promise<ResourceRecommendation[]> {
  const percentage = (score / totalQuestions) * 100
  const courseId = quizToCourseMapping[quizId]
  
  if (!courseId) {
    return []
  }

  const courseResources = await getResourcesForCourse(courseId)
  const recommendations: ResourceRecommendation[] = []

  // Determine performance level and generate appropriate recommendations
  if (percentage < 40) {
    // Poor performance - recommend foundational resources
    const foundationalResources = courseResources.filter(r => 
      r.tags.some(tag => 
        ['introduction', 'beginners', 'basics', 'fundamentals', 'easy'].includes(tag.toLowerCase())
      )
    )
    
    // If no foundational resources found, use high-rated resources
    const resourcesToUse = foundationalResources.length > 0 ? foundationalResources : 
      courseResources.sort((a, b) => b.rating - a.rating).slice(0, 3)
    
    resourcesToUse.forEach((resource, index) => {
      recommendations.push({
        ...resource,
        reason: `Based on your score of ${percentage}%, I recommend starting with foundational concepts. This ${resource.type} will help you build a strong base.`,
        priority: 5 - index
      })
    })
  } else if (percentage < 70) {
    // Moderate performance - recommend intermediate resources
    const intermediateResources = courseResources.filter(r => 
      r.rating >= 4.5 && r.tags.some(tag => 
        ['intermediate', 'practice', 'examples', 'comprehensive'].includes(tag.toLowerCase())
      )
    )
    
    // If no intermediate resources found, use high-rated resources
    const resourcesToUse = intermediateResources.length > 0 ? intermediateResources : 
      courseResources.sort((a, b) => b.rating - a.rating).slice(0, 3)
    
    resourcesToUse.forEach((resource, index) => {
      recommendations.push({
        ...resource,
        reason: `You're on the right track with ${percentage}%! This ${resource.type} will help you strengthen your understanding and improve your performance.`,
        priority: 5 - index
      })
    })
  } else {
    // Good performance - recommend advanced resources
    const advancedResources = courseResources.filter(r => 
      r.rating >= 4.7 && r.tags.some(tag => 
        ['advanced', 'deep-dive', 'comprehensive', 'expert'].includes(tag.toLowerCase())
      )
    )
    
    // If no advanced resources found, use high-rated resources
    const resourcesToUse = advancedResources.length > 0 ? advancedResources : 
      courseResources.sort((a, b) => b.rating - a.rating).slice(0, 3)
    
    resourcesToUse.forEach((resource, index) => {
      recommendations.push({
        ...resource,
        reason: `Excellent work with ${percentage}%! You're ready for more advanced content. This ${resource.type} will help you master the subject.`,
        priority: 5 - index
      })
    })
  }

  // Add general high-quality resources if we don't have enough specific ones
  if (recommendations.length < 3) {
    const remainingResources = courseResources
      .filter(r => !recommendations.find(rec => rec.id === r.id))
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 3 - recommendations.length)

    remainingResources.forEach((resource, index) => {
      recommendations.push({
        ...resource,
        reason: `This highly-rated ${resource.type} (${resource.rating}/5) is perfect for your current level.`,
        priority: 3 - index
      })
    })
  }

  // Sort by priority and return top 5 recommendations
  return recommendations
    .sort((a, b) => b.priority - a.priority)
    .slice(0, 5)
}

// Get all resources for a program
export async function getResourcesForProgram(programId: string) {
  const program = getCourseById(programId, "")
  if (!program) {
    return []
  }

  try {
    // Get all resources that match the program's general categories
    const resources = await prisma.resource.findMany({
      where: {
        OR: [
          { category: programId },
          {
            tags: {
              hasSome: [programId.toLowerCase()]
            }
          }
        ]
      }
    })

    return resources
  } catch (error) {
    console.error('Error fetching resources for program:', error)
    return []
  }
}

// Find which program a course belongs to
function findProgramByCourseId(courseId: string): string | null {
  for (const program of programs) {
    for (const year of program.years) {
      for (const semester of year.semesters) {
        const course = semester.courses.find(c => c.id === courseId)
        if (course) {
          return program.id
        }
      }
    }
  }
  return null
}

// Get personalized study plan based on quiz performance
export async function generateStudyPlan(quizId: string, score: number, totalQuestions: number, programId?: string) {
  const percentage = (score / totalQuestions) * 100
  const courseId = quizToCourseMapping[quizId]
  
  if (!courseId) {
    return null
  }

  // Determine program ID dynamically if not provided
  let actualProgramId = programId
  if (!actualProgramId) {
    // Try to find the program based on the course ID
    actualProgramId = findProgramByCourseId(courseId) || "computer-science"
  }

  const course = getCourseById(actualProgramId, courseId)
  const _resources = await getResourcesForCourse(courseId)

  const plan = {
    courseTitle: course?.title || "Unknown Course",
    currentLevel: percentage < 40 ? "Beginner" : percentage < 70 ? "Intermediate" : "Advanced",
    targetScore: Math.min(100, percentage + 20),
    recommendations: await generateAIRecommendations(quizId, score, totalQuestions),
    studySteps: [] as string[],
    programId: actualProgramId
  }

  // Generate study steps based on performance
  if (percentage < 40) {
    plan.studySteps = [
      "Start with foundational concepts and basic principles",
      "Focus on understanding core terminology and definitions",
      "Practice with simple examples and exercises",
      "Review basic concepts before moving to more complex topics",
      "Consider seeking additional help or tutoring if needed"
    ]
  } else if (percentage < 70) {
    plan.studySteps = [
      "Review areas where you made mistakes",
      "Practice with intermediate-level problems",
      "Focus on understanding the reasoning behind concepts",
      "Work on connecting different topics together",
      "Take practice quizzes to reinforce learning"
    ]
  } else {
    plan.studySteps = [
      "Focus on advanced applications and problem-solving",
      "Explore related topics and real-world applications",
      "Help others learn to reinforce your own understanding",
      "Consider taking on challenging projects",
      "Stay updated with latest developments in the field"
    ]
  }

  return plan
} 