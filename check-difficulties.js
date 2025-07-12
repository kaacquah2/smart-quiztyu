const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkDifficulties() {
  try {
    const quizzes = await prisma.quiz.findMany({
      select: { difficulty: true }
    });
    
    const difficulties = [...new Set(quizzes.map(q => q.difficulty))];
    console.log('Unique difficulties:', difficulties);
    
    const counts = {};
    difficulties.forEach(d => {
      counts[d] = quizzes.filter(q => q.difficulty === d).length;
    });
    
    console.log('Counts by difficulty:', counts);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDifficulties(); 