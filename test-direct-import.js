require('dotenv').config()

console.log("🧪 Direct Import Test")
console.log("=" .repeat(40))

try {
  // Import the programs data directly
  const { programs } = require('./lib/program-data')
  
  console.log(`Raw programs array length: ${programs.length}`)
  console.log(`Type of programs: ${typeof programs}`)
  console.log(`Is array: ${Array.isArray(programs)}`)
  
  if (programs.length > 0) {
    console.log(`First program: ${JSON.stringify(programs[0], null, 2)}`)
  }
  
  // Try to access the second program
  if (programs.length > 1) {
    console.log(`Second program: ${programs[1].title}`)
  } else {
    console.log("❌ No second program found")
  }
  
  // Check if we can access the artificial-intelligence course
  let foundAI = false
  for (let i = 0; i < programs.length; i++) {
    const program = programs[i]
    console.log(`Checking program ${i + 1}: ${program.title}`)
    
    for (const year of program.years) {
      console.log(`  Year ${year.year}: ${year.semesters.length} semesters`)
      for (const semester of year.semesters) {
        console.log(`    Semester ${semester.semester}: ${semester.courses.length} courses`)
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
    console.log("❌ AI course not found in any program")
  }

} catch (error) {
  console.error("❌ Error:", error.message)
  console.error("Stack:", error.stack)
} 