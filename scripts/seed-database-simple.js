const { PrismaClient } = require('@prisma/client')
const fs = require('fs')
const path = require('path')

const prisma = new PrismaClient()

// Generate quiz questions for a course
function generateQuizQuestions(courseTitle) {
  return [
    {
      text: `What is the main focus of ${courseTitle}?`,
      options: ["Theory and concepts", "Practical applications", "Historical development", "All of the above"],
      correctAnswer: "All of the above"
    },
    {
      text: `Which of the following is most important in ${courseTitle}?`,
      options: ["Memorization", "Understanding concepts", "Speed", "Creativity"],
      correctAnswer: "Understanding concepts"
    },
    {
      text: `What skill is most valuable for ${courseTitle}?`,
      options: ["Critical thinking", "Memorization", "Speed reading", "Artistic ability"],
      correctAnswer: "Critical thinking"
    },
    {
      text: `Which approach is best for learning ${courseTitle}?`,
      options: ["Passive reading", "Active practice", "Memorization only", "Avoiding difficult topics"],
      correctAnswer: "Active practice"
    },
    {
      text: `What is the primary goal of ${courseTitle}?`,
      options: ["To pass exams", "To develop practical skills", "To understand fundamental principles", "All of the above"],
      correctAnswer: "All of the above"
    }
  ]
}

async function seedDatabase() {
  try {
    console.log('Starting database seeding...')

    // Clear existing data
    console.log('Clearing existing data...')
    await prisma.quizResult.deleteMany()
    await prisma.quizSubmission.deleteMany()
    await prisma.question.deleteMany()
    await prisma.quiz.deleteMany()
    await prisma.recommendation.deleteMany()

    // Seed recommendations
    console.log('Seeding recommendations...')
    const recommendationsData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/recommendations.json'), 'utf8'))
    
    for (const rec of recommendationsData) {
      await prisma.recommendation.create({
        data: {
          id: rec.id,
          title: rec.title,
          description: rec.description,
          url: rec.url,
          type: rec.type,
          tags: rec.tags,
          difficulty: rec.difficulty
        }
      })
    }

    // Seed quizzes from the existing quizzes.json file
    console.log('Seeding quizzes from existing data...')
    const quizzesData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/quizzes.json'), 'utf8'))
    
    for (const quizData of quizzesData) {
      // Create quiz
      const quiz = await prisma.quiz.create({
        data: {
          id: quizData.id,
          title: quizData.title,
          description: quizData.description,
          difficulty: quizData.difficulty,
          timeLimit: quizData.timeLimit,
          tags: quizData.tags
        }
      })

      // Create questions for this quiz
      for (const questionData of quizData.questions) {
        await prisma.question.create({
          data: {
            text: questionData.text,
            options: questionData.options,
            correctAnswer: questionData.correctAnswer,
            quizId: quiz.id
          }
        })
      }

      console.log(`Created quiz: ${quiz.title} (${quizData.questions.length} questions)`)
    }

    // Create additional quizzes for all courses (simplified approach)
    console.log('Creating additional course quizzes...')
    const courseQuizzes = [
      { id: "data-structures", title: "Data Structures and Algorithms", difficulty: "Intermediate" },
      { id: "database-systems", title: "Database Systems I", difficulty: "Intermediate" },
      { id: "operating-systems", title: "Operating Systems", difficulty: "Intermediate" },
      { id: "computer-networks", title: "Computer Networks", difficulty: "Intermediate" },
      { id: "artificial-intelligence", title: "Artificial Intelligence", difficulty: "Advanced" },
      { id: "machine-learning", title: "Machine Learning", difficulty: "Advanced" },
      { id: "intro-business", title: "Introduction to Business", difficulty: "Beginner" },
      { id: "principles-management", title: "Principles of Management", difficulty: "Beginner" },
      { id: "financial-accounting", title: "Financial Accounting", difficulty: "Intermediate" },
      { id: "marketing-principles", title: "Principles of Marketing", difficulty: "Intermediate" },
      { id: "intro-nursing", title: "Introduction to Nursing", difficulty: "Beginner" },
      { id: "anatomy-physiology-1", title: "Anatomy and Physiology I", difficulty: "Beginner" },
      { id: "intro-to-ee", title: "Introduction to Electrical Engineering", difficulty: "Beginner" },
      { id: "circuit-analysis", title: "Circuit Analysis", difficulty: "Intermediate" }
    ]

    for (const courseQuiz of courseQuizzes) {
      const questions = generateQuizQuestions(courseQuiz.title)
      
      // Create quiz
      const quiz = await prisma.quiz.create({
        data: {
          id: courseQuiz.id,
          title: courseQuiz.title,
          description: `Quiz for ${courseQuiz.title}`,
          difficulty: courseQuiz.difficulty,
          timeLimit: 15,
          tags: ["course", courseQuiz.difficulty.toLowerCase()]
        }
      })

      // Create questions for this quiz
      for (const questionData of questions) {
        await prisma.question.create({
          data: {
            text: questionData.text,
            options: questionData.options,
            correctAnswer: questionData.correctAnswer,
            quizId: quiz.id
          }
        })
      }

      console.log(`Created course quiz: ${courseQuiz.title} (${questions.length} questions)`)
    }

    console.log(`\nDatabase seeding completed successfully!`)
    console.log(`Created ${quizzesData.length} quizzes from existing data`)
    console.log(`Created ${courseQuizzes.length} additional course quizzes`)
    console.log(`Created ${recommendationsData.length} recommendations`)

  } catch (error) {
    console.error('Error seeding database:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Run the seeding
seedDatabase()
  .then(() => {
    console.log('Script completed successfully')
    process.exit(0)
  })
  .catch((error) => {
    console.error('Script failed:', error)
    process.exit(1)
  }) 