const { PrismaClient } = require('@prisma/client')
const programs = require('../lib/program-data.json')

const prisma = new PrismaClient()

async function migrateProgramData() {
  try {
    console.log('🚀 Starting program data migration...')

    // First, create all programs
    console.log('📚 Creating programs...')
    const createdPrograms = {}
    
    for (const programData of programs) {
      const program = await prisma.program.create({
        data: {
          id: programData.id,
          title: programData.title,
          description: programData.description
        }
      })
      createdPrograms[program.id] = program
      console.log(`✅ Created program: ${program.title}`)
    }

    // Create years, semesters, and courses for each program
    console.log('📅 Creating years, semesters, and courses...')
    
    for (const programData of programs) {
      for (const yearData of programData.years) {
        const year = await prisma.year.create({
          data: {
            year: yearData.year,
            programId: programData.id
          }
        })
        console.log(`✅ Created year ${yearData.year} for ${programData.title}`)

        for (const semesterData of yearData.semesters) {
          const semester = await prisma.semester.create({
            data: {
              semester: semesterData.semester,
              yearId: year.id
            }
          })
          console.log(`✅ Created semester ${semesterData.semester} for year ${yearData.year}`)

          for (const courseData of semesterData.courses) {
            const course = await prisma.course.create({
              data: {
                id: courseData.id,
                title: courseData.title,
                description: courseData.description,
                semesterId: semester.id
              }
            })
            console.log(`✅ Created course: ${course.title}`)
          }
        }
      }
    }

    // Update existing quizzes to reference courses
    console.log('📝 Updating existing quizzes...')
    const quizzes = await prisma.quiz.findMany()
    
    for (const quiz of quizzes) {
      // Try to find a matching course by title
      const course = await prisma.course.findFirst({
        where: {
          title: {
            contains: quiz.title,
            mode: 'insensitive'
          }
        }
      })

      if (course) {
        await prisma.quiz.update({
          where: { id: quiz.id },
          data: { courseId: course.id }
        })
        console.log(`✅ Linked quiz "${quiz.title}" to course "${course.title}"`)
      }
    }

    console.log('\n🎉 Program data migration completed successfully!')
    
    // Show final statistics
    const programCount = await prisma.program.count()
    const yearCount = await prisma.year.count()
    const semesterCount = await prisma.semester.count()
    const courseCount = await prisma.course.count()
    
    console.log('\n📊 Final Statistics:')
    console.log(`📚 Programs: ${programCount}`)
    console.log(`📅 Years: ${yearCount}`)
    console.log(`📆 Semesters: ${semesterCount}`)
    console.log(`📖 Courses: ${courseCount}`)

  } catch (error) {
    console.error('❌ Error during migration:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Run the migration
migrateProgramData()
  .then(() => {
    console.log('Migration script completed successfully')
    process.exit(0)
  })
  .catch((error) => {
    console.error('Migration script failed:', error)
    process.exit(1)
  }) 