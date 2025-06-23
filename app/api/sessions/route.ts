import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/lib/generated/prisma';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  // Optionally filter by userId
  const userId = req.nextUrl.searchParams.get('userId');
  const sessions = await prisma.studySession.findMany({
    where: userId ? { userId } : undefined,
    orderBy: { date: 'asc' },
  });
  return NextResponse.json(sessions);
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  const session = await prisma.studySession.create({ data });
  return NextResponse.json(session, { status: 201 });
} 