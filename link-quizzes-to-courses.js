const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function linkQuizzesToCourses() {
  try {
    // Get all quizzes without courseId
    const unlinkedQuizzes = await prisma.quiz.findMany({
      where: {
        courseId: null
      }
    });
    
    console.log(`Found ${unlinkedQuizzes.length} unlinked quizzes`);
    
    // Get all courses
    const courses = await prisma.course.findMany({
      include: {
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
    
    console.log(`Found ${courses.length} courses`);
    
    // Create a mapping of course keywords to course IDs
    const courseMapping = {};
    
    courses.forEach(course => {
      const courseTitle = course.title.toLowerCase();
      const courseId = course.id;
      
      // Extract keywords from course title
      const keywords = courseTitle.split(/[\s\-\(\)]+/).filter(word => word.length > 2);
      
      keywords.forEach(keyword => {
        if (!courseMapping[keyword]) {
          courseMapping[keyword] = [];
        }
        courseMapping[keyword].push(courseId);
      });
      
      // Also map the full course title
      courseMapping[courseTitle] = [courseId];
    });
    
    let linkedCount = 0;
    
    // Try to link quizzes to courses based on title and tags
    for (const quiz of unlinkedQuizzes) {
      const quizTitle = quiz.title.toLowerCase();
      const quizTags = quiz.tags.map(tag => tag.toLowerCase());
      
      let bestMatch = null;
      let bestScore = 0;
      
      // Check for exact matches first
      for (const [keyword, courseIds] of Object.entries(courseMapping)) {
        if (quizTitle.includes(keyword) || quizTags.some(tag => tag.includes(keyword))) {
          const score = keyword.length; // Longer keywords get higher scores
          if (score > bestScore) {
            bestScore = score;
            bestMatch = courseIds[0]; // Take the first matching course
          }
        }
      }
      
      // If we found a match, link the quiz to the course
      if (bestMatch) {
        try {
          await prisma.quiz.update({
            where: { id: quiz.id },
            data: { courseId: bestMatch }
          });
          linkedCount++;
          
          if (linkedCount <= 10) { // Log first 10 matches
            const course = courses.find(c => c.id === bestMatch);
            console.log(`Linked "${quiz.title}" to "${course.title}"`);
          }
        } catch (error) {
          console.error(`Error linking quiz ${quiz.id}:`, error);
        }
      }
    }
    
    console.log(`\nSuccessfully linked ${linkedCount} quizzes to courses`);
    
    // Verify the results
    const linkedQuizzes = await prisma.quiz.findMany({
      where: {
        courseId: { not: null }
      },
      include: {
        course: {
          include: {
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
        }
      }
    });
    
    console.log(`\nVerification: ${linkedQuizzes.length} quizzes now have courseId`);
    
    // Show distribution by program
    const programStats = {};
    linkedQuizzes.forEach(quiz => {
      const programTitle = quiz.course.semester.year.program.title;
      if (!programStats[programTitle]) {
        programStats[programTitle] = 0;
      }
      programStats[programTitle]++;
    });
    
    console.log('\nQuizzes per program:');
    Object.entries(programStats).forEach(([program, count]) => {
      console.log(`${program}: ${count} quizzes`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

linkQuizzesToCourses(); 