const { PrismaClient } = require('@prisma/client')
const fs = require('fs')
const path = require('path')

const prisma = new PrismaClient()

// Load resources data from JSON
const resourcesData = require('../data/resources.json')

// Mock analytics data generator
function generateMockAnalytics(userId) {
  return {
    userId,
    averageScore: Math.floor(Math.random() * 30) + 70, // 70-100
    totalQuizzes: Math.floor(Math.random() * 50) + 10, // 10-60
    totalQuestions: Math.floor(Math.random() * 200) + 50, // 50-250
    totalStudyHours: Math.floor(Math.random() * 200) + 50, // 50-250
    improvementRate: Math.floor(Math.random() * 20) + 5, // 5-25
    weakAreas: ["Database Design", "Machine Learning", "Networking"],
    strongAreas: ["Programming", "Web Development", "Algorithms"],
    lastUpdated: new Date(),
  }
}

// Mock social activities generator
function generateMockSocialActivities(userId, userName) {
  const activities = []
  const activityTypes = ['quiz_completed', 'achievement', 'study_milestone', 'streak']
  const quizTitles = [
    "Data Structures and Algorithms",
    "Python Fundamentals", 
    "Database Systems",
    "Web Development",
    "Machine Learning Basics",
    "Computer Networks",
    "Operating Systems",
    "Artificial Intelligence"
  ]
  
  const achievements = [
    "Perfect Score",
    "Study Streak",
    "Quiz Master",
    "Learning Champion",
    "Consistent Learner"
  ]

  // Generate 5-15 activities per user
  const numActivities = Math.floor(Math.random() * 10) + 5
  
  for (let i = 0; i < numActivities; i++) {
    const type = activityTypes[Math.floor(Math.random() * activityTypes.length)]
    const createdAt = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) // Random date in last 30 days
    
    let content = {}
    
    switch (type) {
      case 'quiz_completed':
        content = {
          quizTitle: quizTitles[Math.floor(Math.random() * quizTitles.length)],
          score: Math.floor(Math.random() * 40) + 60, // 60-100
          totalQuestions: Math.floor(Math.random() * 10) + 10, // 10-20
        }
        break
      case 'achievement':
        content = {
          achievement: achievements[Math.floor(Math.random() * achievements.length)],
          description: "Earned a new achievement for consistent learning",
        }
        break
      case 'study_milestone':
        content = {
          milestone: "Completed 10 study sessions",
          description: "Reached a study milestone",
        }
        break
      case 'streak':
        content = {
          streakDays: Math.floor(Math.random() * 20) + 5, // 5-25 days
          description: "Maintained a study streak",
        }
        break
    }
    
    activities.push({
      userId,
      type,
      content,
      likes: Math.floor(Math.random() * 20), // 0-20 likes
      comments: Math.floor(Math.random() * 10), // 0-10 comments
      isPublic: true,
      createdAt,
    })
  }
  
  return activities
}

// Mock user achievements generator
function generateMockUserAchievements(userId) {
  const achievements = [
    {
      title: "First Quiz",
      description: "Completed your first quiz",
      type: "quiz_count",
      metadata: { count: 1 }
    },
    {
      title: "Perfect Score",
      description: "Achieved 100% on a quiz",
      type: "quiz_perfect",
      metadata: { quizTitle: "Data Structures" }
    },
    {
      title: "Study Streak",
      description: "Maintained a 7-day study streak",
      type: "streak",
      metadata: { days: 7 }
    },
    {
      title: "Learning Champion",
      description: "Completed 50 quizzes",
      type: "quiz_count",
      metadata: { count: 50 }
    },
    {
      title: "Study Hours",
      description: "Studied for 100 hours",
      type: "study_hours",
      metadata: { hours: 100 }
    }
  ]
  
  // Randomly select 2-4 achievements per user
  const numAchievements = Math.floor(Math.random() * 3) + 2
  const selectedAchievements = []
  
  for (let i = 0; i < numAchievements; i++) {
    const achievement = achievements[Math.floor(Math.random() * achievements.length)]
    selectedAchievements.push({
      userId,
      title: achievement.title,
      description: achievement.description,
      type: achievement.type,
      metadata: achievement.metadata,
      earnedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
    })
  }
  
  return selectedAchievements
}

// Mock user streaks generator
function generateMockUserStreaks(userId) {
  const streakTypes = ['study', 'quiz', 'login']
  const streaks = []
  
  for (const type of streakTypes) {
    const currentStreak = Math.floor(Math.random() * 15) + 1 // 1-15 days
    const longestStreak = Math.max(currentStreak, Math.floor(Math.random() * 30) + 5) // 5-35 days
    
    streaks.push({
      userId,
      type,
      currentStreak,
      longestStreak,
      lastActivity: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000), // Random time in last 24 hours
    })
  }
  
  return streaks
}

// Mock user activities generator
function generateMockUserActivities(userId) {
  const activities = []
  const activityTypes = ['quiz_completed', 'resource_viewed', 'study_session', 'achievement_earned']
  const pages = ['/dashboard', '/quiz', '/analytics', '/social', '/scheduler']
  
  // Generate 20-50 activities per user
  const numActivities = Math.floor(Math.random() * 30) + 20
  
  for (let i = 0; i < numActivities; i++) {
    const type = activityTypes[Math.floor(Math.random() * activityTypes.length)]
    const timestamp = new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000) // Random time in last 7 days
    
    let metadata = {}
    
    switch (type) {
      case 'quiz_completed':
        metadata = {
          quizId: `quiz-${Math.floor(Math.random() * 10) + 1}`,
          score: Math.floor(Math.random() * 40) + 60,
          totalQuestions: Math.floor(Math.random() * 10) + 10
        }
        break
      case 'resource_viewed':
        metadata = {
          resourceId: `resource-${Math.floor(Math.random() * 10) + 1}`,
          duration: Math.floor(Math.random() * 300) + 60 // 1-6 minutes
        }
        break
      case 'study_session':
        metadata = {
          duration: Math.floor(Math.random() * 120) + 30, // 30-150 minutes
          course: "Computer Science"
        }
        break
      case 'achievement_earned':
        metadata = {
          achievementId: `achievement-${Math.floor(Math.random() * 5) + 1}`,
          title: "Study Champion"
        }
        break
    }
    
    activities.push({
      userId,
      activityType: type,
      metadata,
      timestamp,
      sessionId: `session-${Math.floor(Math.random() * 1000) + 1}`,
      page: pages[Math.floor(Math.random() * pages.length)],
      duration: Math.floor(Math.random() * 300) + 30 // 30-330 seconds
    })
  }
  
  return activities
}

// Mock study sessions generator
function generateMockStudySessions(userId) {
  const sessions = []
  const courses = [
    "Introduction to Computer Science",
    "Data Structures and Algorithms", 
    "Database Systems",
    "Web Development",
    "Machine Learning",
    "Operating Systems",
    "Computer Networks",
    "Artificial Intelligence"
  ]
  
  const priorities = ['high', 'medium', 'low']
  
  // Generate 10-30 study sessions per user
  const numSessions = Math.floor(Math.random() * 20) + 10
  
  for (let i = 0; i < numSessions; i++) {
    const date = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) // Random date in last 30 days
    const startHour = Math.floor(Math.random() * 12) + 8 // 8 AM - 8 PM
    const startMinute = Math.floor(Math.random() * 60)
    const duration = Math.floor(Math.random() * 120) + 30 // 30-150 minutes
    
    const startTime = `${startHour.toString().padStart(2, '0')}:${startMinute.toString().padStart(2, '0')}`
    const endHour = Math.floor((startHour * 60 + startMinute + duration) / 60) % 24
    const endMinute = (startHour * 60 + startMinute + duration) % 60
    const endTime = `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`
    
    sessions.push({
      title: `Study Session ${i + 1}`,
      description: `Review session for ${courses[Math.floor(Math.random() * courses.length)]}`,
      date,
      startTime,
      endTime,
      course: courses[Math.floor(Math.random() * courses.length)],
      priority: priorities[Math.floor(Math.random() * priorities.length)],
      completed: Math.random() > 0.3, // 70% completed
      reminders: true,
      userId,
      createdAt: date,
      updatedAt: date
    })
  }
  
  return sessions
}

async function seedAllMockData() {
  try {
    console.log('🚀 Starting comprehensive mock data seeding...')

    // Clear existing data (optional - comment out if you want to keep existing data)
    console.log('🧹 Clearing existing mock data...')
    await prisma.userActivity.deleteMany()
    await prisma.userAchievement.deleteMany()
    await prisma.userStreak.deleteMany()
    await prisma.socialActivity.deleteMany()
    await prisma.userAnalytics.deleteMany()
    await prisma.studySession.deleteMany()
    await prisma.resource.deleteMany()

    // 1. Seed Resources
    console.log('📚 Seeding educational resources...')
    for (const resource of resourcesData) {
      await prisma.resource.create({
        data: {
          title: resource.title,
          description: resource.description,
          url: resource.url,
          platform: resource.platform,
          type: resource.type,
          category: resource.category,
          tags: resource.tags,
          duration: resource.duration,
          rating: resource.rating,
          views: resource.views || null,
          lessons: resource.lessons || null,
          videos: resource.videos || null,
          courseIds: resource.courseIds
        }
      })
    }
    console.log(`✅ Created ${resourcesData.length} resources`)

    // 2. Get all users to seed data for
    const users = await prisma.user.findMany()
    console.log(`👥 Found ${users.length} users to seed data for`)

    // 3. Seed data for each user
    for (const user of users) {
      console.log(`📊 Seeding data for user: ${user.name}`)
      
      // User Analytics
      const analytics = generateMockAnalytics(user.id)
      await prisma.userAnalytics.create({ data: analytics })
      
      // User Activities
      const activities = generateMockUserActivities(user.id)
      for (const activity of activities) {
        await prisma.userActivity.create({ data: activity })
      }
      
      // User Achievements
      const achievements = generateMockUserAchievements(user.id)
      for (const achievement of achievements) {
        await prisma.userAchievement.create({ data: achievement })
      }
      
      // User Streaks
      const streaks = generateMockUserStreaks(user.id)
      for (const streak of streaks) {
        await prisma.userStreak.create({ data: streak })
      }
      
      // Social Activities
      const socialActivities = generateMockSocialActivities(user.id, user.name)
      for (const activity of socialActivities) {
        await prisma.socialActivity.create({ data: activity })
      }
      
      // Study Sessions
      const studySessions = generateMockStudySessions(user.id)
      for (const session of studySessions) {
        await prisma.studySession.create({ data: session })
      }
      
      console.log(`✅ Completed seeding for ${user.name}`)
    }

    console.log('\n🎉 Comprehensive mock data seeding completed successfully!')
    console.log(`📊 Created analytics for ${users.length} users`)
    console.log(`📚 Created ${resourcesData.length} resources`)
    console.log(`🎯 Created achievements, streaks, activities, and study sessions for all users`)

  } catch (error) {
    console.error('❌ Error seeding mock data:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Run the seeding
seedAllMockData()
  .then(() => {
    console.log('✅ Script completed successfully')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Script failed:', error)
    process.exit(1)
  }) 