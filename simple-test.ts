import { PrismaClient } from '@prisma/client'

// Simple test to verify the system is working
async function simpleTest() {
  console.log('🚀 Starting Simple Personalization System Test...\n')
  
  try {
    // Test 1: Database connection
    console.log('📊 Testing Database Connection...')
    const prisma = new PrismaClient()
    await prisma.$connect()
    console.log('  ✅ Database connection successful')
    
    // Test 2: Check if required services exist
    console.log('\n🔧 Testing Service Availability...')
    
    try {
      const ruleBasedService = await import('./lib/rule-based-recommendations-service')
      console.log('  ✅ Rule-based recommendations service loaded')
    } catch (error) {
      console.log('  ❌ Rule-based recommendations service failed to load:', (error as Error).message)
    }
    
    try {
      const deepseekService = await import('./lib/deepseek-recommendations-service')
      console.log('  ✅ DeepSeek recommendations service loaded')
    } catch (error) {
      console.log('  ❌ DeepSeek recommendations service failed to load:', (error as Error).message)
    }
    
    try {
      const geminiService = await import('./lib/gemini-study-plan-service')
      console.log('  ✅ Gemini study plan service loaded')
    } catch (error) {
      console.log('  ❌ Gemini study plan service failed to load:', (error as Error).message)
    }
    
    try {
      const cacheService = await import('./lib/cache-service')
      console.log('  ✅ Cache service loaded')
    } catch (error) {
      console.log('  ❌ Cache service failed to load:', (error as Error).message)
    }
    
    try {
      const logger = await import('./lib/logger')
      console.log('  ✅ Logger service loaded')
    } catch (error) {
      console.log('  ❌ Logger service failed to load:', (error as Error).message)
    }
    
    // Test 3: Environment variables
    console.log('\n🔑 Testing Environment Variables...')
    const requiredVars = ['DATABASE_URL', 'GEMINI_API_KEY', 'DEEPSEEK_API_KEY']
    
    requiredVars.forEach(varName => {
      if (process.env[varName] && process.env[varName] !== 'your-api-key-here') {
        console.log(`  ✅ ${varName}: Configured`)
      } else {
        console.log(`  ⚠️  ${varName}: Not configured or using placeholder`)
      }
    })
    
    // Test 4: Basic rule-based recommendation generation
    console.log('\n🧠 Testing Rule-Based Recommendations...')
    try {
      const { generateRuleBasedRecommendations } = await import('./lib/rule-based-recommendations-service')
      
      const mockQuizResults = [
        {
          quizId: 'test-quiz-1',
          courseId: 'test-course-1',
          score: 7,
          total: 10,
          strengths: ['problem-solving'],
          weaknesses: ['time-complexity']
        }
      ]
      
      const mockUserProfile = {
        program: 'Computer Science',
        interests: ['algorithms'],
        recentTopics: ['data-structures']
      }
      
      const recommendations = await generateRuleBasedRecommendations(mockQuizResults, mockUserProfile)
      
      if (recommendations && recommendations.length > 0) {
        console.log(`  ✅ Generated ${recommendations.length} recommendations`)
        console.log(`  📋 Sample recommendation: ${recommendations[0].title}`)
      } else {
        console.log('  ⚠️  No recommendations generated')
      }
      
    } catch (error) {
      console.log('  ❌ Rule-based recommendations failed:', (error as Error).message)
    }
    
    // Test 5: Basic study plan generation
    console.log('\n📚 Testing Study Plan Generation...')
    try {
      const { generateGeminiStudyPlan } = await import('./lib/gemini-study-plan-service')
      
      const mockQuizContext = {
        quizId: 'test-quiz-1',
        score: 7,
        totalQuestions: 10,
        courseId: 'test-course-1',
        programId: 'computer-science',
        courseTitle: 'Test Course'
      }
      
      const studyPlan = await generateGeminiStudyPlan(mockQuizContext)
      
      if (studyPlan) {
        console.log('  ✅ Study plan generated successfully')
        console.log(`  📋 Course: ${studyPlan.courseTitle}`)
        console.log(`  📋 Study steps: ${studyPlan.studySteps?.length || 0}`)
      } else {
        console.log('  ⚠️  No study plan generated')
      }
      
    } catch (error) {
      console.log('  ❌ Study plan generation failed:', (error as Error).message)
    }
    
    await prisma.$disconnect()
    
    console.log('\n✅ Simple test completed successfully!')
    console.log('\n📈 Next Steps:')
    console.log('1. Run the full test suite: npx tsx test-personalization-system.js')
    console.log('2. Check any warnings above and configure missing services')
    console.log('3. Test with real API keys for AI features')
    
  } catch (error) {
    console.error('❌ Simple test failed:', error)
  }
}

// Run the test
simpleTest().catch(console.error) 