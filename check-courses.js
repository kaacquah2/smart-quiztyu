const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkCourses() {
  try {
    const courses = await prisma.course.findMany({
      include: {
        quizzes: true,
        semester: {
          include: {
            year: {
              include: {
                program: true
              }
            }
          }
        }
      }
    });
    
    console.log('Total courses:', courses.length);
    console.log('Courses with quizzes:', courses.filter(c => c.quizzes.length > 0).length);
    console.log('Courses without quizzes:', courses.filter(c => c.quizzes.length === 0).length);
    
    if (courses.length > 0) {
      console.log('\nSample courses:');
      courses.slice(0, 5).forEach(course => {
        console.log({
          id: course.id,
          title: course.title,
          program: course.semester.year.program.title,
          year: course.semester.year.year,
          semester: course.semester.semester,
          quizCount: course.quizzes.length
        });
      });
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkCourses(); 