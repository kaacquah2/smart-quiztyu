const { getAllPrograms } = require('./lib/program-service')

async function listCourses() {
  console.log('📚 Listing All Available Courses...\n')
  
  try {
    const programs = await getAllPrograms()
    
    console.log(`Found ${programs.length} programs:\n`)
    
    programs.forEach(program => {
      console.log(`🏫 ${program.title} (${program.id})`)
      
      program.years.forEach(year => {
        year.semesters.forEach(semester => {
          console.log(`  📅 Year ${year.year}, Semester ${semester.semester}:`)
          
          semester.courses.forEach(course => {
            console.log(`    📖 ${course.title} (${course.id})`)
          })
          
          if (semester.courses.length === 0) {
            console.log(`    ⚠️  No courses in this semester`)
          }
        })
      })
      
      console.log('')
    })
    
    // Count total courses
    const totalCourses = programs.reduce((total, program) => 
      total + program.years.reduce((yearTotal, year) => 
        yearTotal + year.semesters.reduce((semesterTotal, semester) => 
          semesterTotal + semester.courses.length, 0), 0), 0)
    
    console.log(`📊 Total courses available: ${totalCourses}`)
    
    // List all course IDs for easy copying
    console.log('\n📋 All Course IDs:')
    const courseIds = []
    programs.forEach(program => {
      program.years.forEach(year => {
        year.semesters.forEach(semester => {
          semester.courses.forEach(course => {
            courseIds.push(course.id)
            console.log(`  "${course.id}", // ${course.title}`)
          })
        })
      })
    })
    
    console.log(`\n✅ Found ${courseIds.length} courses total`)
    
  } catch (error) {
    console.error('❌ Error listing courses:', error)
  }
}

listCourses().catch(console.error) 