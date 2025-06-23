const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function verifyUpload() {
  console.log('🔍 Verifying uploaded data...\n')

  try {
    // Get all quizzes
    const quizzes = await prisma.quiz.findMany({
      include: {
        questions: true
      },
      orderBy: {
        title: 'asc'
      }
    })

    // Get all recommendations
    const recommendations = await prisma.recommendation.findMany({
      orderBy: {
        title: 'asc'
      }
    })

    // Get all resources
    const resources = await prisma.resource.findMany({
      orderBy: {
        title: 'asc'
      }
    })

    console.log('📝 QUIZZES UPLOADED:')
    console.log('='.repeat(50))
    quizzes.forEach((quiz, index) => {
      console.log(`${index + 1}. ${quiz.title}`)
      console.log(`   Difficulty: ${quiz.difficulty}`)
      console.log(`   Questions: ${quiz.questions.length}`)
      console.log(`   Tags: ${quiz.tags.join(', ')}`)
      console.log('')
    })

    console.log('\n📚 RECOMMENDATIONS UPLOADED:')
    console.log('='.repeat(50))
    recommendations.forEach((rec, index) => {
      console.log(`${index + 1}. ${rec.title}`)
      console.log(`   Type: ${rec.type}`)
      console.log(`   Difficulty: ${rec.difficulty}`)
      console.log(`   Tags: ${rec.tags.join(', ')}`)
      console.log('')
    })

    console.log('\n🔗 RESOURCES UPLOADED:')
    console.log('='.repeat(50))
    resources.forEach((resource, index) => {
      console.log(`${index + 1}. ${resource.title}`)
      console.log(`   Platform: ${resource.platform}`)
      console.log(`   Type: ${resource.type}`)
      console.log(`   Category: ${resource.category}`)
      console.log(`   Rating: ${resource.rating}/5`)
      console.log(`   Duration: ${resource.duration}`)
      console.log('')
    })

    // Summary statistics
    console.log('\n📊 SUMMARY STATISTICS:')
    console.log('='.repeat(50))
    console.log(`📝 Total Quizzes: ${quizzes.length}`)
    console.log(`❓ Total Questions: ${quizzes.reduce((sum, quiz) => sum + quiz.questions.length, 0)}`)
    console.log(`📚 Total Recommendations: ${recommendations.length}`)
    console.log(`🔗 Total Resources: ${resources.length}`)

    // Count by category
    const resourceCategories = resources.reduce((acc, resource) => {
      acc[resource.category] = (acc[resource.category] || 0) + 1
      return acc
    }, {})

    console.log('\n📂 RESOURCES BY CATEGORY:')
    console.log('='.repeat(50))
    Object.entries(resourceCategories).forEach(([category, count]) => {
      console.log(`${category}: ${count} resources`)
    })

    // Count by difficulty
    const quizDifficulties = quizzes.reduce((acc, quiz) => {
      acc[quiz.difficulty] = (acc[quiz.difficulty] || 0) + 1
      return acc
    }, {})

    console.log('\n📊 QUIZZES BY DIFFICULTY:')
    console.log('='.repeat(50))
    Object.entries(quizDifficulties).forEach(([difficulty, count]) => {
      console.log(`${difficulty}: ${count} quizzes`)
    })

    console.log('\n✅ Data verification completed successfully!')

  } catch (error) {
    console.error('❌ Error during verification:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Run the script
if (require.main === module) {
  verifyUpload()
}

module.exports = { verifyUpload } 