const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function countPrograms() {
  try {
    console.log('🔍 Counting programs in the database...\n');
    
    // Count total programs
    const programCount = await prisma.program.count();
    
    // Get all programs with basic info
    const programs = await prisma.program.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        createdAt: true,
        _count: {
          select: {
            years: true,
            users: true
          }
        }
      },
      orderBy: {
        title: 'asc'
      }
    });
    
    console.log(`📊 Total Programs: ${programCount}\n`);
    
    if (programs.length > 0) {
      console.log('📋 Program Details:');
      programs.forEach((program, index) => {
        console.log(`${index + 1}. ${program.title}`);
        console.log(`   ID: ${program.id}`);
        console.log(`   Years: ${program._count.years}`);
        console.log(`   Enrolled Students: ${program._count.users}`);
        console.log(`   Created: ${program.createdAt.toLocaleDateString()}`);
        console.log('');
      });
    }
    
    // Additional statistics
    const totalYears = await prisma.year.count();
    const totalSemesters = await prisma.semester.count();
    const totalCourses = await prisma.course.count();
    const totalUsers = await prisma.user.count();
    
    console.log('📈 Additional Statistics:');
    console.log(`   Total Years: ${totalYears}`);
    console.log(`   Total Semesters: ${totalSemesters}`);
    console.log(`   Total Courses: ${totalCourses}`);
    console.log(`   Total Users: ${totalUsers}`);
    
  } catch (error) {
    console.error('❌ Error counting programs:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the count
countPrograms()
  .then(() => {
    console.log('\n✅ Program count completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Failed to count programs:', error);
    process.exit(1);
  }); 