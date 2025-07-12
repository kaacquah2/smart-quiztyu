const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkQuizzes() {
  try {
    const quizzes = await prisma.quiz.findMany({ 
      include: { 
        course: true 
      } 
    });
    
    console.log('Total quizzes:', quizzes.length);
    console.log('Quizzes with courseId:', quizzes.filter(q => q.courseId).length);
    console.log('Quizzes without courseId:', quizzes.filter(q => !q.courseId).length);
    
    if (quizzes.filter(q => q.courseId).length > 0) {
      console.log('\nSample quiz with course:');
      const sampleQuiz = quizzes.find(q => q.courseId);
      console.log({
        id: sampleQuiz.id,
        title: sampleQuiz.title,
        courseId: sampleQuiz.courseId,
        courseTitle: sampleQuiz.course?.title
      });
    }
    
    // Check programs and their courses
    const programs = await prisma.program.findMany({
      include: {
        years: {
          include: {
            semesters: {
              include: {
                courses: {
                  include: {
                    quizzes: true
                  }
                }
              }
            }
          }
        }
      }
    });
    
    console.log('\nPrograms and their quiz counts:');
    programs.forEach(program => {
      const totalQuizzes = program.years.reduce((yearSum, year) =>
        yearSum + year.semesters.reduce((semesterSum, semester) =>
          semesterSum + semester.courses.reduce((courseSum, course) =>
            courseSum + course.quizzes.length, 0), 0), 0
      );
      console.log(`${program.title}: ${totalQuizzes} quizzes`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkQuizzes(); 