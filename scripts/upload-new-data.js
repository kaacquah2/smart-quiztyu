const { PrismaClient } = require('../lib/generated/prisma')
const fs = require('fs')
const path = require('path')

const prisma = new PrismaClient()

// Read JSON data files
const quizzesData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/quizzes.json'), 'utf8'))
const recommendationsData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/recommendations.json'), 'utf8'))
const resourcesData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/resources.json'), 'utf8'))

async function uploadQuizzes() {
  console.log('📝 Uploading quizzes...')
  
  for (const quiz of quizzesData) {
    try {
      // Check if quiz already exists
      const existingQuiz = await prisma.quiz.findFirst({
        where: { title: quiz.title }
      })

      if (existingQuiz) {
        console.log(`⚠️  Quiz "${quiz.title}" already exists, skipping...`)
        continue
      }

      // Create quiz
      const createdQuiz = await prisma.quiz.create({
        data: {
          title: quiz.title,
          description: quiz.description,
          difficulty: quiz.difficulty,
          timeLimit: quiz.timeLimit,
          tags: quiz.tags,
          questions: {
            create: quiz.questions.map((question, index) => ({
              text: question.text,
              options: question.options,
              correctAnswer: question.correctAnswer
            }))
          }
        }
      })

      console.log(`✅ Created quiz: "${quiz.title}" with ${quiz.questions.length} questions`)
    } catch (error) {
      console.error(`❌ Error creating quiz "${quiz.title}":`, error.message)
    }
  }
}

async function uploadRecommendations() {
  console.log('📚 Uploading recommendations...')
  
  for (const recommendation of recommendationsData) {
    try {
      // Check if recommendation already exists
      const existingRecommendation = await prisma.recommendation.findFirst({
        where: { title: recommendation.title }
      })

      if (existingRecommendation) {
        console.log(`⚠️  Recommendation "${recommendation.title}" already exists, skipping...`)
        continue
      }

      // Create recommendation
      const createdRecommendation = await prisma.recommendation.create({
        data: {
          title: recommendation.title,
          description: recommendation.description,
          url: recommendation.url,
          type: recommendation.type,
          tags: recommendation.tags,
          difficulty: recommendation.difficulty
        }
      })

      console.log(`✅ Created recommendation: "${recommendation.title}"`)
    } catch (error) {
      console.error(`❌ Error creating recommendation "${recommendation.title}":`, error.message)
    }
  }
}

async function uploadResources() {
  console.log('🔗 Uploading resources...')
  
  for (const resource of resourcesData) {
    try {
      // Check if resource already exists
      const existingResource = await prisma.resource.findFirst({
        where: { title: resource.title }
      })

      if (existingResource) {
        console.log(`⚠️  Resource "${resource.title}" already exists, skipping...`)
        continue
      }

      // Create resource
      const createdResource = await prisma.resource.create({
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
          views: resource.views || 0,
          lessons: resource.lessons || 0,
          videos: resource.videos || 0,
          courseIds: resource.courseIds || []
        }
      })

      console.log(`✅ Created resource: "${resource.title}"`)
    } catch (error) {
      console.error(`❌ Error creating resource "${resource.title}":`, error.message)
    }
  }
}

async function getDatabaseStats() {
  console.log('\n📊 Database Statistics:')
  
  const quizCount = await prisma.quiz.count()
  const questionCount = await prisma.question.count()
  const recommendationCount = await prisma.recommendation.count()
  const resourceCount = await prisma.resource.count()
  
  console.log(`📝 Total Quizzes: ${quizCount}`)
  console.log(`❓ Total Questions: ${questionCount}`)
  console.log(`📚 Total Recommendations: ${recommendationCount}`)
  console.log(`🔗 Total Resources: ${resourceCount}`)
}

async function main() {
  try {
    console.log('🚀 Starting data upload process...\n')
    
    // Upload all data
    await uploadQuizzes()
    console.log('')
    
    await uploadRecommendations()
    console.log('')
    
    await uploadResources()
    console.log('')
    
    // Show final statistics
    await getDatabaseStats()
    
    console.log('\n🎉 Data upload completed successfully!')
  } catch (error) {
    console.error('❌ Error during data upload:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Run the script
if (require.main === module) {
  main()
}

module.exports = { uploadQuizzes, uploadRecommendations, uploadResources, getDatabaseStats } 