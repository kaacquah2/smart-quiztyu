import { prisma } from "./prisma";

export interface PersonalizationInput {
  userId: string;
  recentQuizCount?: number;
}

export interface PersonalizedPlan {
  prioritizedTopics: string[];
  schedule: Array<{ session: number; topic: string }>;
  advice: string;
}

export async function getPersonalizedPlan({ userId, recentQuizCount = 10 }: PersonalizationInput): Promise<PersonalizedPlan> {
  // Fetch user profile and analytics
  const profile = await prisma.personalizationProfile.findUnique({ where: { userId } });
  const analytics = await prisma.userAnalytics.findUnique({ where: { userId } });
  const recentQuizzes = await prisma.quizSubmission.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: recentQuizCount,
    include: { result: true },
  });

  // Aggregate weaknesses from analytics or derive from quiz results
  const topicStats: Record<string, number> = {};
  
  // Use analytics weak areas if available
  if (analytics?.weakAreas && analytics.weakAreas.length > 0) {
    for (const topic of analytics.weakAreas) {
      topicStats[topic] = (topicStats[topic] || 0) + 1;
    }
  } else {
    // Fallback: derive weaknesses from quiz performance
    for (const quiz of recentQuizzes) {
      if (quiz.result && quiz.result.percentage < 70) {
        // Add generic weak areas based on low performance
        const weakAreas = ['core concepts', 'problem solving', 'application'];
        for (const topic of weakAreas) {
          topicStats[topic] = (topicStats[topic] || 0) + 1;
        }
      }
    }
  }
  
  // Sort topics by frequency
  const prioritizedTopics = Object.entries(topicStats)
    .sort((a, b) => b[1] - a[1])
    .map(([topic]) => topic);

  // Scheduling logic
  const availableTime = profile?.availableTime || 7; // hours/week
  const studyPatterns = profile?.studyPatterns as any;
  const sessionLength = studyPatterns?.studySessionDuration || 60; // minutes
  const sessionsPerWeek = Math.max(1, Math.floor((availableTime * 60) / sessionLength));

  // Assign sessions to topics, more to weakest
  const plan: Array<{ session: number; topic: string }> = [];
  let sessionIdx = 0;
  
  for (const topic of prioritizedTopics) {
    // Proportional allocation
    const sessionsForTopic = Math.max(1, Math.round(sessionsPerWeek * (topicStats[topic] / recentQuizzes.length)));
    for (let i = 0; i < sessionsForTopic; i++) {
      plan.push({ session: ++sessionIdx, topic });
      if (sessionIdx >= sessionsPerWeek) break;
    }
    if (sessionIdx >= sessionsPerWeek) break;
  }
  
  // Fill remaining sessions with review/strong topics if needed
  if (sessionIdx < sessionsPerWeek && analytics?.strongAreas?.length) {
    for (const topic of analytics.strongAreas) {
      plan.push({ session: ++sessionIdx, topic: `Review: ${topic}` });
      if (sessionIdx >= sessionsPerWeek) break;
    }
  }

  // Advice
  const advice = prioritizedTopics.length
    ? `Focus on your weakest topic: ${prioritizedTopics[0]}. Allocate more time to it this week.`
    : "Keep up the good work! Maintain your strengths and review as needed.";

  return {
    prioritizedTopics,
    schedule: plan,
    advice,
  };
} 