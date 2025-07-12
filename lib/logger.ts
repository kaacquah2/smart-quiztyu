import { prisma } from "./prisma"

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error'
}

export interface LogEntry {
  level: LogLevel
  message: string
  context?: Record<string, any>
  userId?: string
  timestamp: Date
  service: string
  operation: string
  duration?: number
  error?: Error
}

export interface PerformanceMetrics {
  operation: string
  duration: number
  success: boolean
  cacheHit?: boolean
  apiProvider?: string
  userId?: string
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development'
  private shouldLogToConsole = process.env.LOG_TO_CONSOLE !== 'false'
  private shouldLogToDatabase = process.env.LOG_TO_DATABASE !== 'false'

  /**
   * Log a message with context
   */
  async log(
    level: LogLevel,
    message: string,
    context?: Record<string, any>,
    userId?: string,
    service = 'unknown',
    operation = 'unknown'
  ): Promise<void> {
    const entry: LogEntry = {
      level,
      message,
      context,
      userId,
      timestamp: new Date(),
      service,
      operation
    }

    // Console logging for development
    if (this.shouldLogToConsole && (this.isDevelopment || level === LogLevel.ERROR || level === LogLevel.WARN)) {
      this.logToConsole(entry)
    }

    // Database logging for production monitoring
    if (this.shouldLogToDatabase) {
      await this.logToDatabase(entry)
    }
  }

  /**
   * Log debug information
   */
  async debug(message: string, context?: Record<string, any>, userId?: string, service?: string, operation?: string): Promise<void> {
    await this.log(LogLevel.DEBUG, message, context, userId, service, operation)
  }

  /**
   * Log informational messages
   */
  async info(message: string, context?: Record<string, any>, userId?: string, service?: string, operation?: string): Promise<void> {
    await this.log(LogLevel.INFO, message, context, userId, service, operation)
  }

  /**
   * Log warnings
   */
  async warn(message: string, context?: Record<string, any>, userId?: string, service?: string, operation?: string): Promise<void> {
    await this.log(LogLevel.WARN, message, context, userId, service, operation)
  }

  /**
   * Log errors
   */
  async error(message: string, error?: Error, context?: Record<string, any>, userId?: string, service?: string, operation?: string): Promise<void> {
    const entry: LogEntry = {
      level: LogLevel.ERROR,
      message,
      context,
      userId,
      timestamp: new Date(),
      service: service || 'unknown',
      operation: operation || 'unknown',
      error
    }

    // Console logging for errors
    if (this.shouldLogToConsole) {
      this.logToConsole(entry)
    }

    // Database logging for errors
    if (this.shouldLogToDatabase) {
      await this.logToDatabase(entry)
    }
  }

  /**
   * Log performance metrics
   */
  async logPerformance(metrics: PerformanceMetrics): Promise<void> {
    const context = {
      duration: metrics.duration,
      success: metrics.success,
      cacheHit: metrics.cacheHit,
      apiProvider: metrics.apiProvider
    }

    await this.info(
      `Performance: ${metrics.operation} completed in ${metrics.duration}ms`,
      context,
      metrics.userId,
      'performance',
      metrics.operation
    )
  }

  /**
   * Log recommendation generation
   */
  async logRecommendationGeneration(
    userId: string,
    apiProvider: string,
    quizResults: any[],
    recommendations: any[],
    performance: any,
    duration: number,
    cacheHit: boolean
  ): Promise<void> {
    const context = {
      apiProvider,
      quizCount: quizResults.length,
      recommendationCount: recommendations.length,
      performance: performance?.percentage || 0,
      cacheHit,
      duration
    }

    await this.info(
      `Generated ${recommendations.length} recommendations using ${apiProvider}`,
      context,
      userId,
      'recommendations',
      'generate'
    )
  }

  /**
   * Log study plan generation
   */
  async logStudyPlanGeneration(
    userId: string,
    apiProvider: string,
    quizContext: any,
    studyPlan: any,
    duration: number,
    cacheHit: boolean
  ): Promise<void> {
    const context = {
      apiProvider,
      courseId: quizContext.courseId,
      score: quizContext.score,
      totalQuestions: quizContext.totalQuestions,
      cacheHit,
      duration,
      studyStepsCount: studyPlan?.studySteps?.length || 0,
      focusAreasCount: studyPlan?.focusAreas?.length || 0
    }

    await this.info(
      `Generated study plan for course ${quizContext.courseId}`,
      context,
      userId,
      'study-plan',
      'generate'
    )
  }

  /**
   * Log personalization analysis
   */
  async logPersonalizationAnalysis(
    userId: string,
    analysis: any,
    duration: number
  ): Promise<void> {
    const context = {
      overallScore: analysis.overallScore,
      learningGaps: analysis.learningGaps?.length || 0,
      strengths: analysis.strengths?.length || 0,
      confidenceLevel: analysis.confidenceLevel,
      duration
    }

    await this.info(
      `Personalization analysis completed`,
      context,
      userId,
      'personalization',
      'analyze'
    )
  }

  /**
   * Console logging implementation
   */
  private logToConsole(entry: LogEntry): void {
    const timestamp = entry.timestamp.toISOString()
    const prefix = `[${timestamp}] [${entry.level.toUpperCase()}] [${entry.service}/${entry.operation}]`
    
    if (entry.level === LogLevel.ERROR) {
      console.error(`${prefix}: ${entry.message}`, entry.context || '', entry.error || '')
    } else if (entry.level === LogLevel.WARN) {
      console.warn(`${prefix}: ${entry.message}`, entry.context || '')
    } else if (entry.level === LogLevel.INFO) {
      console.info(`${prefix}: ${entry.message}`, entry.context || '')
    } else {
      console.debug(`${prefix}: ${entry.message}`, entry.context || '')
    }
  }

  /**
   * Database logging implementation
   */
  private async logToDatabase(entry: LogEntry): Promise<void> {
    try {
      // Store in a simple log table or use existing APILog table
      await prisma.aPILog.create({
        data: {
          userId: entry.userId,
          apiProvider: entry.service,
          endpoint: entry.operation,
          requestData: entry.context,
          responseData: entry.error ? { error: entry.error.message, stack: entry.error.stack } : null,
          statusCode: entry.level === LogLevel.ERROR ? 500 : 200,
          responseTime: entry.duration,
          success: entry.level !== LogLevel.ERROR,
          errorMessage: entry.error?.message,
          cacheHit: entry.context?.cacheHit || false
        }
      })
    } catch (error) {
      // Fallback to console if database logging fails
      console.error('Failed to log to database:', error)
      this.logToConsole(entry)
    }
  }

  /**
   * Get logs for a specific user
   */
  async getUserLogs(userId: string, limit = 100): Promise<LogEntry[]> {
    try {
      const logs = await prisma.aPILog.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: limit
      })

      return logs.map(log => ({
        level: log.success ? LogLevel.INFO : LogLevel.ERROR,
        message: `${log.apiProvider} ${log.endpoint}`,
        context: log.requestData as Record<string, any>,
        userId: log.userId || undefined,
        timestamp: log.createdAt,
        service: log.apiProvider,
        operation: log.endpoint,
        duration: log.responseTime || undefined,
        error: log.errorMessage ? new Error(log.errorMessage) : undefined
      }))
    } catch (error) {
      console.error('Failed to get user logs:', error)
      return []
    }
  }

  /**
   * Get performance statistics
   */
  async getPerformanceStats(userId?: string, days = 7): Promise<{
    totalOperations: number
    averageResponseTime: number
    successRate: number
    cacheHitRate: number
    topOperations: Array<{ operation: string; count: number; avgTime: number }>
  }> {
    try {
      const whereClause: any = {
        createdAt: {
          gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000)
        }
      }

      if (userId) {
        whereClause.userId = userId
      }

      const [totalOps, successfulOps, cachedOps, avgResponseTime, operationStats] = await Promise.all([
        prisma.aPILog.count({ where: whereClause }),
        prisma.aPILog.count({ where: { ...whereClause, success: true } }),
        prisma.aPILog.count({ where: { ...whereClause, cacheHit: true } }),
        prisma.aPILog.aggregate({
          where: whereClause,
          _avg: { responseTime: true }
        }),
        prisma.aPILog.groupBy({
          by: ['endpoint'],
          where: whereClause,
          _count: { endpoint: true },
          _avg: { responseTime: true }
        })
      ])

      const topOperations = operationStats
        .sort((a, b) => b._count.endpoint - a._count.endpoint)
        .slice(0, 5)
        .map(op => ({
          operation: op.endpoint,
          count: op._count.endpoint,
          avgTime: Math.round(op._avg.responseTime || 0)
        }))

      return {
        totalOperations: totalOps,
        averageResponseTime: Math.round(avgResponseTime._avg.responseTime || 0),
        successRate: totalOps > 0 ? (successfulOps / totalOps) * 100 : 0,
        cacheHitRate: totalOps > 0 ? (cachedOps / totalOps) * 100 : 0,
        topOperations
      }
    } catch (error) {
      console.error('Failed to get performance stats:', error)
      return {
        totalOperations: 0,
        averageResponseTime: 0,
        successRate: 0,
        cacheHitRate: 0,
        topOperations: []
      }
    }
  }
}

// Export singleton instance
export const logger = new Logger() 