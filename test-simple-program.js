require('dotenv').config()

console.log("🧪 Simple Program Data Test")
console.log("=" .repeat(40))

try {
  // Import the programs data
  const { programs } = require('./lib/program-data')
  
  console.log(`Programs array length: ${programs.length}`)
  console.log(`First program: ${programs[0]?.title || 'undefined'}`)
  
  if (programs.length > 0) {
    const firstProgram = programs[0]
    console.log(`First program years: ${firstProgram.years.length}`)
    
    if (firstProgram.years.length > 0) {
      console.log(`First program first year: ${firstProgram.years[0].year}`)
      console.log(`First program semesters in first year: ${firstProgram.years[0].semesters.length}`)
    }
  }
  
  // Check if artificial-intelligence exists
  let foundAI = false
  for (const program of programs) {
    for (const year of program.years) {
      for (const semester of year.semesters) {
        const aiCourse = semester.courses.find(c => c.id === 'artificial-intelligence')
        if (aiCourse) {
          console.log(`✅ Found AI course in ${program.title}, Year ${year.year}, Semester ${semester.semester}`)
          foundAI = true
          break
        }
      }
      if (foundAI) break
    }
    if (foundAI) break
  }
  
  if (!foundAI) {
    console.log("❌ AI course not found")
  }

} catch (error) {
  console.error("❌ Error:", error.message)
  console.error("Stack:", error.stack)
} 