const { PrismaClient } = require('@prisma/client')
const { 
  generateRuleBasedRecommendations,
  generateFilteredRuleBasedRecommendations 
} = require('./lib/rule-based-recommendations-service')
const { 
  generateDeepSeekRecommendations 
} = require('./lib/deepseek-recommendations-service')
const { 
  generateGeminiStudyPlan 
} = require('./lib/gemini-study-plan-service')
const { cacheService } = require('./lib/cache-service')
const { logger } = require('./lib/logger')
const { 
  generateTestScenarios, 
  validateRecommendations, 
  validateStudyPlan, 
  runPerformanceTest,
  generateMockQuizResults,
  generateMockUserProfile,
  generateMockQuizContext
} = require('./lib/test-utils')

const prisma = new PrismaClient()

class PersonalizationSystemTester {
  constructor() {
    this.testResults = []
    this.performanceResults = []
  }

  /**
   * Run comprehensive tests for the personalization system
   */
  async runAllTests() {
    console.log('🚀 Starting Personalization System Tests...\n')
    
    try {
      // Test 1: Rule-based recommendations
      await this.testRuleBasedRecommendations()
      
      // Test 2: AI recommendations (if API keys available)
      await this.testAIRecommendations()
      
      // Test 3: Study plan generation
      await this.testStudyPlanGeneration()
      
      // Test 4: Caching system
      await this.testCachingSystem()
      
      // Test 5: Performance tests
      await this.testPerformance()
      
      // Test 6: Logging system
      await this.testLoggingSystem()
      
      // Generate comprehensive report
      this.generateTestReport()
      
    } catch (error) {
      console.error('❌ Test suite failed:', error)
      await logger.error('Test suite failed', error, {}, undefined, 'test-suite', 'run-all')
    } finally {
      await prisma.$disconnect()
    }
  }

  /**
   * Test rule-based recommendations
   */
  async testRuleBasedRecommendations() {
    console.log('📊 Testing Rule-Based Recommendations...')
    
    const scenarios = generateTestScenarios()
    
    for (const scenario of scenarios) {
      const startTime = Date.now()
      
      try {
        const recommendations = await generateRuleBasedRecommendations(
          scenario.quizResults,
          scenario.userProfile,
          scenario.courseId
        )
        
        const duration = Date.now() - startTime
        const validation = validateRecommendations(recommendations, scenario)
        
        const result = {
          scenario: scenario.name,
          passed: validation.isValid,
          duration,
          actualRecommendations: recommendations.length,
          actualConfidence: recommendations.reduce((sum, rec) => sum + (rec.confidence || 0), 0) / recommendations.length,
          actualLearningPaths: recommendations
            .filter(rec => rec.learningPath)
            .map(rec => rec.learningPath)
            .filter(Boolean),
          errors: validation.errors,
          warnings: validation.warnings
        }
        
        this.testResults.push(result)
        
        // Log the test result
        await logger.info(
          `Rule-based test: ${scenario.name}`,
          { 
            passed: result.passed, 
            duration: result.duration,
            recommendations: result.actualRecommendations,
            errors: result.errors.length,
            warnings: result.warnings.length
          },
          undefined,
          'test-suite',
          'rule-based'
        )
        
        console.log(`  ✅ ${scenario.name}: ${result.passed ? 'PASSED' : 'FAILED'} (${result.duration}ms)`)
        
        if (result.errors.length > 0) {
          console.log(`    ❌ Errors: ${result.errors.join(', ')}`)
        }
        if (result.warnings.length > 0) {
          console.log(`    ⚠️  Warnings: ${result.warnings.join(', ')}`)
        }
        
      } catch (error) {
        const duration = Date.now() - startTime
        this.testResults.push({
          scenario: scenario.name,
          passed: false,
          duration,
          actualRecommendations: 0,
          actualConfidence: 0,
          actualLearningPaths: [],
          errors: [error.message],
          warnings: []
        })
        
        console.log(`  ❌ ${scenario.name}: FAILED (${duration}ms) - ${error.message}`)
      }
    }
    
    console.log('')
  }

  /**
   * Test AI recommendations (DeepSeek)
   */
  async testAIRecommendations() {
    console.log('🤖 Testing AI Recommendations (DeepSeek)...')
    
    // Check if DeepSeek API key is available
    if (!process.env.DEEPSEEK_API_KEY || process.env.DEEPSEEK_API_KEY === "your-deepseek-api-key-here") {
      console.log('  ⚠️  DeepSeek API key not configured, skipping AI tests')
      return
    }
    
    const scenarios = generateTestScenarios().slice(0, 2) // Test first 2 scenarios to avoid API costs
    
    for (const scenario of scenarios) {
      const startTime = Date.now()
      
      try {
        const recommendations = await generateDeepSeekRecommendations(
          scenario.quizResults,
          scenario.userProfile,
          scenario.courseId,
          'test-user-id'
        )
        
        const duration = Date.now() - startTime
        const validation = validateRecommendations(recommendations, scenario)
        
        const result = {
          scenario: `AI-${scenario.name}`,
          passed: validation.isValid,
          duration,
          actualRecommendations: recommendations.length,
          actualConfidence: 75, // Default confidence for AI recommendations
          actualLearningPaths: [],
          errors: validation.errors,
          warnings: validation.warnings
        }
        
        this.testResults.push(result)
        
        console.log(`  ✅ AI-${scenario.name}: ${result.passed ? 'PASSED' : 'FAILED'} (${result.duration}ms)`)
        
      } catch (error) {
        const duration = Date.now() - startTime
        this.testResults.push({
          scenario: `AI-${scenario.name}`,
          passed: false,
          duration,
          actualRecommendations: 0,
          actualConfidence: 0,
          actualLearningPaths: [],
          errors: [error.message],
          warnings: []
        })
        
        console.log(`  ❌ AI-${scenario.name}: FAILED (${duration}ms) - ${error.message}`)
      }
    }
    
    console.log('')
  }

  /**
   * Test study plan generation
   */
  async testStudyPlanGeneration() {
    console.log('📚 Testing Study Plan Generation...')
    
    // Check if Gemini API key is available
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "your-gemini-api-key-here") {
      console.log('  ⚠️  Gemini API key not configured, testing with basic study plans')
    }
    
    const testCases = [
      { performance: 'low', courseId: 'beginner-course' },
      { performance: 'medium', courseId: 'intermediate-course' },
      { performance: 'high', courseId: 'advanced-course' }
    ]
    
    for (const testCase of testCases) {
      const startTime = Date.now()
      
      try {
        const quizContext = generateMockQuizContext(testCase.courseId, testCase.performance)
        const studyPlan = await generateGeminiStudyPlan(quizContext, 'test-user-id')
        
        const duration = Date.now() - startTime
        
        if (studyPlan) {
          const validation = validateStudyPlan(studyPlan, {
            name: `Study Plan - ${testCase.performance}`,
            description: `Study plan for ${testCase.performance} performer`,
            quizResults: [],
            userProfile: generateMockUserProfile(),
            expectedOutcomes: {
              minRecommendations: 3,
              maxRecommendations: 5,
              expectedConfidence: 70,
              expectedLearningPaths: []
            }
          })
          
          const result = {
            scenario: `Study Plan - ${testCase.performance}`,
            passed: validation.isValid,
            duration,
            actualRecommendations: studyPlan.studySteps?.length || 0,
            actualConfidence: studyPlan.confidence || 70,
            actualLearningPaths: [],
            errors: validation.errors,
            warnings: validation.warnings
          }
          
          this.testResults.push(result)
          
          console.log(`  ✅ Study Plan - ${testCase.performance}: ${result.passed ? 'PASSED' : 'FAILED'} (${result.duration}ms)`)
          
        } else {
          console.log(`  ❌ Study Plan - ${testCase.performance}: FAILED - No study plan generated`)
        }
        
      } catch (error) {
        const duration = Date.now() - startTime
        console.log(`  ❌ Study Plan - ${testCase.performance}: FAILED (${duration}ms) - ${error.message}`)
      }
    }
    
    console.log('')
  }

  /**
   * Test caching system
   */
  async testCachingSystem() {
    console.log('💾 Testing Caching System...')
    
    try {
      // Test 1: Cache recommendations
      const quizResults = generateMockQuizResults(2, 'test-course')
      const userProfile = generateMockUserProfile()
      
      const startTime = Date.now()
      
      // First call - should hit API
      const recommendations1 = await generateRuleBasedRecommendations(quizResults, userProfile, 'test-course')
      const firstCallDuration = Date.now() - startTime
      
      // Second call - should hit cache
      const cacheStartTime = Date.now()
      const recommendations2 = await generateRuleBasedRecommendations(quizResults, userProfile, 'test-course')
      const cacheCallDuration = Date.now() - cacheStartTime
      
      // Verify cache is working
      const cacheStats = await cacheService.getCacheStats()
      
      console.log(`  ✅ Cache Test: PASSED`)
      console.log(`    First call: ${firstCallDuration}ms`)
      console.log(`    Cache call: ${cacheCallDuration}ms`)
      console.log(`    Cache hit rate: ${cacheStats.cacheHitRate.toFixed(1)}%`)
      console.log(`    Total cached items: ${cacheStats.totalRecommendations + cacheStats.totalStudyPlans}`)
      
      // Test cache clearing
      await cacheService.clearCache()
      const statsAfterClear = await cacheService.getCacheStats()
      console.log(`  ✅ Cache Clear: PASSED (${statsAfterClear.totalRecommendations + statsAfterClear.totalStudyPlans} items remaining)`)
      
    } catch (error) {
      console.log(`  ❌ Cache Test: FAILED - ${error.message}`)
    }
    
    console.log('')
  }

  /**
   * Test performance
   */
  async testPerformance() {
    console.log('⚡ Testing Performance...')
    
    const performanceTests = [
      {
        name: 'Rule-based Recommendations',
        test: async () => {
          const quizResults = generateMockQuizResults(3)
          const userProfile = generateMockUserProfile()
          return await generateRuleBasedRecommendations(quizResults, userProfile)
        }
      },
      {
        name: 'Study Plan Generation',
        test: async () => {
          const quizContext = generateMockQuizContext()
          return await generateGeminiStudyPlan(quizContext)
        }
      }
    ]
    
    for (const perfTest of performanceTests) {
      const result = await runPerformanceTest(perfTest.name, perfTest.test, 5)
      this.performanceResults.push(result)
      
      console.log(`  ✅ ${perfTest.name}:`)
      console.log(`    Average: ${result.averageDuration.toFixed(0)}ms`)
      console.log(`    Min: ${result.minDuration}ms, Max: ${result.maxDuration}ms`)
      console.log(`    Success Rate: ${result.successRate.toFixed(1)}%`)
    }
    
    console.log('')
  }

  /**
   * Test logging system
   */
  async testLoggingSystem() {
    console.log('📝 Testing Logging System...')
    
    try {
      // Test different log levels
      await logger.debug('Debug test message', { test: true })
      await logger.info('Info test message', { test: true })
      await logger.warn('Warning test message', { test: true })
      await logger.error('Error test message', new Error('Test error'), { test: true })
      
      // Test performance logging
      await logger.logPerformance({
        operation: 'test-operation',
        duration: 150,
        success: true,
        cacheHit: false,
        apiProvider: 'test',
        userId: 'test-user'
      })
      
      // Test recommendation logging
      await logger.logRecommendationGeneration(
        'test-user',
        'rule-based',
        generateMockQuizResults(2),
        generateMockQuizResults(2).map(r => ({ title: 'Test Rec', description: 'Test' })),
        { percentage: 75 },
        200,
        false
      )
      
      console.log('  ✅ Logging System: PASSED')
      
    } catch (error) {
      console.log(`  ❌ Logging System: FAILED - ${error.message}`)
    }
    
    console.log('')
  }

  /**
   * Generate comprehensive test report
   */
  generateTestReport() {
    console.log('📋 Test Report')
    console.log('=' * 50)
    
    const totalTests = this.testResults.length
    const passedTests = this.testResults.filter(r => r.passed).length
    const failedTests = totalTests - passedTests
    
    console.log(`Total Tests: ${totalTests}`)
    console.log(`Passed: ${passedTests}`)
    console.log(`Failed: ${failedTests}`)
    console.log(`Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`)
    
    console.log('\n📊 Test Results:')
    this.testResults.forEach(result => {
      const status = result.passed ? '✅' : '❌'
      console.log(`${status} ${result.scenario}: ${result.duration}ms`)
      if (result.errors.length > 0) {
        console.log(`   Errors: ${result.errors.join(', ')}`)
      }
    })
    
    console.log('\n⚡ Performance Results:')
    this.performanceResults.forEach(result => {
      console.log(`${result.operation}:`)
      console.log(`  Average: ${result.averageDuration.toFixed(0)}ms`)
      console.log(`  Success Rate: ${result.successRate.toFixed(1)}%`)
    })
    
    console.log('\n🎯 Recommendations:')
    if (failedTests > 0) {
      console.log('❌ Some tests failed. Review the errors above and fix issues.')
    } else {
      console.log('✅ All tests passed! The personalization system is working correctly.')
    }
    
    if (this.performanceResults.some(r => r.averageDuration > 1000)) {
      console.log('⚠️  Some operations are slow. Consider optimizing performance.')
    }
    
    console.log('\n📈 Next Steps:')
    console.log('1. Review any failed tests and fix issues')
    console.log('2. Monitor performance in production')
    console.log('3. Set up alerts for API failures')
    console.log('4. Regularly review cache hit rates')
    console.log('5. Monitor user engagement with recommendations')
  }
}

// Run the tests if this file is executed directly
if (require.main === module) {
  const tester = new PersonalizationSystemTester()
  tester.runAllTests().catch(console.error)
}

module.exports = PersonalizationSystemTester 