import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { startOfDay, endOfDay, subDays, isSameDay } from 'date-fns';

export async function GET(req: NextRequest) {
  try {
    // Get all completed sessions
    const completedSessions = await prisma.studySession.findMany({
      where: { completed: true },
      select: { date: true },
      orderBy: { date: 'desc' }
    });

    if (completedSessions.length === 0) {
      return NextResponse.json({
        currentStreak: 0,
        longestStreak: 0,
        totalStudyDays: 0
      });
    }

    // Calculate current streak
    let currentStreak = 0;
    let checkDate = startOfDay(new Date());
    
    for (let i = 0; i < 365; i++) { // Check up to a year back
      const daySessions = completedSessions.filter(session => 
        isSameDay(new Date(session.date), checkDate)
      );
      
      if (daySessions.length > 0) {
        currentStreak++;
        checkDate = subDays(checkDate, 1);
      } else {
        break;
      }
    }

    // Calculate longest streak
    let longestStreak = 0;
    let tempStreak = 0;
    let lastDate: Date | null = null;

    for (const session of completedSessions) {
      const sessionDate = startOfDay(new Date(session.date));
      
      if (lastDate === null) {
        tempStreak = 1;
      } else {
        const daysDiff = Math.floor((lastDate.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24));
        if (daysDiff === 1) {
          tempStreak++;
        } else {
          longestStreak = Math.max(longestStreak, tempStreak);
          tempStreak = 1;
        }
      }
      lastDate = sessionDate;
    }
    
    longestStreak = Math.max(longestStreak, tempStreak);

    // Calculate total study days
    const uniqueStudyDays = new Set(
      completedSessions.map(session => 
        startOfDay(new Date(session.date)).toISOString().split('T')[0]
      )
    ).size;

    return NextResponse.json({
      currentStreak,
      longestStreak,
      totalStudyDays: uniqueStudyDays
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to calculate streak' },
      { status: 500 }
    );
  }
} 