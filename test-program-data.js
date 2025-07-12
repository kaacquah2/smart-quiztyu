require('dotenv').config()

async function testProgramData() {
  console.log("🧪 Testing Program Data Loading")
  console.log("=" .repeat(40))

  try {
    // Import the programs data
    const { programs } = require('./lib/program-data')
    
    console.log(`✅ Loaded ${programs.length} programs:`)
    
    for (const program of programs) {
      console.log(`\n📚 Program: ${program.title} (${program.id})`)
      console.log(`   Description: ${program.description}`)
      console.log(`   Years: ${program.years.length}`)
      
      let totalCourses = 0
      for (const year of program.years) {
        console.log(`   Year ${year.year}:`)
        for (const semester of year.semesters) {
          console.log(`     Semester ${semester.semester}: ${semester.courses.length} courses`)
          totalCourses += semester.courses.length
          
          // List first few courses
          semester.courses.slice(0, 3).forEach(course => {
            console.log(`       - ${course.id}: ${course.title}`)
          })
          if (semester.courses.length > 3) {
            console.log(`       ... and ${semester.courses.length - 3} more`)
          }
        }
      }
      console.log(`   Total courses: ${totalCourses}`)
    }
    
    // Check specific courses
    console.log("\n🔍 Checking specific courses:")
    const courseIds = ['artificial-intelligence', 'circuit-analysis', 'intro-business']
    
    for (const courseId of courseIds) {
      let found = false
      for (const program of programs) {
        for (const year of program.years) {
          for (const semester of year.semesters) {
            const course = semester.courses.find(c => c.id === courseId)
            if (course) {
              console.log(`✅ Found ${courseId}: ${course.title} in ${program.title}`)
              found = true
              break
            }
          }
          if (found) break
        }
        if (found) break
      }
      if (!found) {
        console.log(`❌ Course ${courseId} not found in any program`)
      }
    }

  } catch (error) {
    console.error("❌ Error loading program data:", error.message)
    console.error("Stack trace:", error.stack)
  }
}

testProgramData().catch(console.error) 