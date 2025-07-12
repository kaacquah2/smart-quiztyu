// Test database connection and basic functionality
// Run with: node test-db-connection.js

require('dotenv').config()

async function testDatabaseConnection() {
  console.log("🧪 Testing Database Connection")
  console.log("=" .repeat(40))

  try {
    // Import Prisma client
    const { PrismaClient } = require('@prisma/client')
    const prisma = new PrismaClient()

    // Test 1: Check database connection
    console.log("1. Testing database connection...")
    await prisma.$connect()
    console.log("✅ Database connection successful")

    // Test 2: Check if quiz questions exist
    console.log("2. Checking existing quiz questions...")
    const quizQuestions = await prisma.question.findMany({
      take: 5
    })
    console.log(`✅ Found ${quizQuestions.length} quiz questions in database`)

    // Test 3: Check if resources exist
    console.log("3. Checking existing resources...")
    const resources = await prisma.resource.findMany({
      take: 5
    })
    console.log(`✅ Found ${resources.length} resources in database`)

    // Test 4: Check course mapping
    console.log("4. Testing course mapping...")
    const { quizToCourseMapping } = require('./lib/resource-service')
    const courseId = quizToCourseMapping['intro-to-cs']
    console.log(`✅ Course mapping for 'intro-to-cs': ${courseId}`)

    // Test 5: Check if course exists in program data
    console.log("5. Testing program data...")
    const { programs } = require('./lib/program-data')
    let courseFound = false
    for (const program of programs) {
      for (const year of program.years) {
        for (const semester of year.semesters) {
          const course = semester.courses.find(c => c.id === 'intro-to-cs')
          if (course) {
            courseFound = true
            console.log(`✅ Course found: ${course.title}`)
            break
          }
        }
        if (courseFound) break
      }
      if (courseFound) break
    }

    if (!courseFound) {
      console.log("❌ Course 'intro-to-cs' not found in program data")
    }

    await prisma.$disconnect()
    console.log("✅ Database connection closed")

  } catch (error) {
    console.error("❌ Database test failed:", error.message)
  }
}

testDatabaseConnection().catch(console.error) 