import { prisma } from "./prisma"
import crypto from "crypto"

export interface CacheConfig {
  recommendationTTL: number // Time to live in hours
  studyPlanTTL: number // Time to live in hours
  maxCacheSize: number // Maximum number of cached items per user
  enableCompression: boolean
}

export interface CachedRecommendationData {
  recommendations: any[]
  performance?: any
  userProfile?: any
  confidence: number
  generatedBy: string
}

export interface CachedStudyPlanData {
  studyPlan: any
  quizContext: any
  confidence: number
  generatedBy: string
}

export interface APILogData {
  userId?: string
  apiProvider: string
  endpoint: string
  requestData?: any
  responseData?: any
  statusCode?: number
  responseTime?: number
  success: boolean
  errorMessage?: string
  cacheHit: boolean
  cost?: number
  tokens?: number
}

class CacheService {
  private config: CacheConfig = {
    recommendationTTL: 24, // 24 hours
    studyPlanTTL: 48, // 48 hours
    maxCacheSize: 100,
    enableCompression: true
  }

  /**
   * Generate a hash for quiz results to use as cache key
   */
  private generateQuizResultsHash(quizResults: any[]): string {
    const sortedResults = quizResults
      .map(q => ({
        quizId: q.quizId,
        courseId: q.courseId,
        score: q.score,
        total: q.total,
        timeSpent: q.timeSpent
      }))
      .sort((a, b) => a.quizId.localeCompare(b.quizId))
    
    return crypto.createHash('sha256')
      .update(JSON.stringify(sortedResults))
      .digest('hex')
  }

  /**
   * Generate a hash for quiz context to use as cache key
   */
  private generateQuizContextHash(quizContext: any): string {
    const contextData = {
      quizId: quizContext.quizId,
      courseId: quizContext.courseId,
      score: quizContext.score,
      totalQuestions: quizContext.totalQuestions,
      timeSpent: quizContext.timeSpent,
      difficulty: quizContext.difficulty
    }
    
    return crypto.createHash('sha256')
      .update(JSON.stringify(contextData))
      .digest('hex')
  }

  /**
   * Get cached recommendations
   */
  async getCachedRecommendations(
    quizResults: any[],
    apiProvider: string,
    userId?: string,
    courseId?: string
  ): Promise<CachedRecommendationData | null> {
    try {
      const quizResultsHash = this.generateQuizResultsHash(quizResults)
      
      const cached = await prisma.cachedRecommendation.findFirst({
        where: {
          quizResultsHash,
          apiProvider,
          expiresAt: {
            gt: new Date()
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      })

      if (cached) {
        // Update hit count and last accessed
        await prisma.cachedRecommendation.update({
          where: { id: cached.id },
          data: {
            hitCount: { increment: 1 },
            lastAccessed: new Date()
          }
        })

        return {
          recommendations: cached.recommendations as any[],
          performance: cached.performance as any,
          userProfile: cached.userProfile as any,
          confidence: cached.confidence,
          generatedBy: `Cached ${apiProvider}`
        }
      }

      return null
    } catch (error) {
      console.error("Error getting cached recommendations:", error)
      return null
    }
  }

  /**
   * Cache recommendations
   */
  async cacheRecommendations(
    quizResults: any[],
    apiProvider: string,
    data: CachedRecommendationData,
    userId?: string,
    courseId?: string,
    programId?: string
  ): Promise<void> {
    try {
      const quizResultsHash = this.generateQuizResultsHash(quizResults)
      const expiresAt = new Date(Date.now() + this.config.recommendationTTL * 60 * 60 * 1000)

      await prisma.cachedRecommendation.create({
        data: {
          userId,
          courseId,
          programId,
          quizResultsHash,
          apiProvider,
          recommendations: data.recommendations,
          performance: data.performance,
          userProfile: data.userProfile,
          confidence: data.confidence,
          expiresAt
        }
      })

      // Clean up old cache entries if needed
      await this.cleanupOldCache(userId, 'recommendation')
    } catch (error) {
      console.error("Error caching recommendations:", error)
    }
  }

  /**
   * Get cached study plan
   */
  async getCachedStudyPlan(
    quizContext: any,
    apiProvider: string,
    userId?: string,
    courseId?: string
  ): Promise<CachedStudyPlanData | null> {
    try {
      const quizContextHash = this.generateQuizContextHash(quizContext)
      
      const cached = await prisma.cachedStudyPlan.findFirst({
        where: {
          quizContextHash,
          apiProvider,
          expiresAt: {
            gt: new Date()
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      })

      if (cached) {
        // Update hit count and last accessed
        await prisma.cachedStudyPlan.update({
          where: { id: cached.id },
          data: {
            hitCount: { increment: 1 },
            lastAccessed: new Date()
          }
        })

        return {
          studyPlan: cached.studyPlan as any,
          quizContext: cached.quizContext as any,
          confidence: cached.confidence,
          generatedBy: `Cached ${apiProvider}`
        }
      }

      return null
    } catch (error) {
      console.error("Error getting cached study plan:", error)
      return null
    }
  }

  /**
   * Cache study plan
   */
  async cacheStudyPlan(
    quizContext: any,
    apiProvider: string,
    data: CachedStudyPlanData,
    userId?: string,
    courseId?: string
  ): Promise<void> {
    try {
      const quizContextHash = this.generateQuizContextHash(quizContext)
      const expiresAt = new Date(Date.now() + this.config.studyPlanTTL * 60 * 60 * 1000)

      await prisma.cachedStudyPlan.create({
        data: {
          userId,
          courseId,
          quizContextHash,
          apiProvider,
          studyPlan: data.studyPlan,
          quizContext: data.quizContext,
          confidence: data.confidence,
          expiresAt
        }
      })

      // Clean up old cache entries if needed
      await this.cleanupOldCache(userId, 'studyPlan')
    } catch (error) {
      console.error("Error caching study plan:", error)
    }
  }

  /**
   * Log API call for monitoring and analytics
   */
  async logAPICall(data: APILogData): Promise<void> {
    try {
      await prisma.aPILog.create({
        data: {
          userId: data.userId,
          apiProvider: data.apiProvider,
          endpoint: data.endpoint,
          requestData: data.requestData,
          responseData: data.responseData,
          statusCode: data.statusCode,
          responseTime: data.responseTime,
          success: data.success,
          errorMessage: data.errorMessage,
          cacheHit: data.cacheHit,
          cost: data.cost,
          tokens: data.tokens
        }
      })
    } catch (error) {
      console.error("Error logging API call:", error)
    }
  }

  /**
   * Clean up old cache entries
   */
  private async cleanupOldCache(userId?: string, type: 'recommendation' | 'studyPlan' = 'recommendation'): Promise<void> {
    try {
      const whereClause: any = {
        expiresAt: {
          lt: new Date()
        }
      }

      if (userId) {
        whereClause.userId = userId
      }

      if (type === 'recommendation') {
        await prisma.cachedRecommendation.deleteMany({
          where: whereClause
        })
      } else {
        await prisma.cachedStudyPlan.deleteMany({
          where: whereClause
        })
      }
    } catch (error) {
      console.error("Error cleaning up old cache:", error)
    }
  }

  /**
   * Get cache statistics
   */
  async getCacheStats(userId?: string): Promise<{
    totalRecommendations: number
    totalStudyPlans: number
    cacheHitRate: number
    totalAPICalls: number
    successfulAPICalls: number
    averageResponseTime: number
    totalCost: number
  }> {
    try {
      const whereClause = userId ? { userId } : {}

      const [
        totalRecommendations,
        totalStudyPlans,
        totalAPICalls,
        successfulAPICalls,
        cachedAPICalls,
        apiStats
      ] = await Promise.all([
        prisma.cachedRecommendation.count({ where: whereClause }),
        prisma.cachedStudyPlan.count({ where: whereClause }),
        prisma.aPILog.count({ where: whereClause }),
        prisma.aPILog.count({ where: { ...whereClause, success: true } }),
        prisma.aPILog.count({ where: { ...whereClause, cacheHit: true } }),
        prisma.aPILog.aggregate({
          where: whereClause,
          _avg: {
            responseTime: true,
            cost: true
          },
          _sum: {
            cost: true
          }
        })
      ])

      const cacheHitRate = totalAPICalls > 0 ? (cachedAPICalls / totalAPICalls) * 100 : 0

      return {
        totalRecommendations,
        totalStudyPlans,
        cacheHitRate: Math.round(cacheHitRate * 100) / 100,
        totalAPICalls,
        successfulAPICalls,
        averageResponseTime: Math.round(apiStats._avg.responseTime || 0),
        totalCost: Math.round((apiStats._sum.cost || 0) * 100) / 100
      }
    } catch (error) {
      console.error("Error getting cache stats:", error)
      return {
        totalRecommendations: 0,
        totalStudyPlans: 0,
        cacheHitRate: 0,
        totalAPICalls: 0,
        successfulAPICalls: 0,
        averageResponseTime: 0,
        totalCost: 0
      }
    }
  }

  /**
   * Clear cache for a specific user or all cache
   */
  async clearCache(userId?: string): Promise<void> {
    try {
      const whereClause = userId ? { userId } : {}

      await Promise.all([
        prisma.cachedRecommendation.deleteMany({ where: whereClause }),
        prisma.cachedStudyPlan.deleteMany({ where: whereClause })
      ])
    } catch (error) {
      console.error("Error clearing cache:", error)
    }
  }

  /**
   * Update cache configuration
   */
  updateConfig(newConfig: Partial<CacheConfig>): void {
    this.config = { ...this.config, ...newConfig }
  }

  /**
   * Get current cache configuration
   */
  getConfig(): CacheConfig {
    return { ...this.config }
  }
}

// Export singleton instance
export const cacheService = new CacheService() 