require('dotenv').config()

console.log("🧪 Simple Import Test")
console.log("=" .repeat(40))

try {
  // Import the simplified programs data
  const { programs } = require('./lib/program-data-simple')
  
  console.log(`Programs array length: ${programs.length}`)
  
  for (const program of programs) {
    console.log(`\n📚 Program: ${program.title} (${program.id})`)
    console.log(`   Years: ${program.years.length}`)
    
    for (const year of program.years) {
      console.log(`   Year ${year.year}:`)
      for (const semester of year.semesters) {
        console.log(`     Semester ${semester.semester}: ${semester.courses.length} courses`)
        semester.courses.forEach(course => {
          console.log(`       - ${course.id}: ${course.title}`)
        })
      }
    }
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
  console.error("❌ Error:", error.message)
  console.error("Stack:", error.stack)
} 