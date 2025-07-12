const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

// Enhanced explanation generator based on course content
function generateExplanation(courseTitle, questionText, correctAnswer, options) {
  const lowerTitle = courseTitle.toLowerCase()
  const lowerQuestion = questionText.toLowerCase()
  
  // Subject-specific explanations
  if (lowerTitle.includes('computer science') || lowerTitle.includes('programming')) {
    if (lowerQuestion.includes('algorithm')) {
      return 'An algorithm is a step-by-step procedure for solving a problem. It provides a clear sequence of instructions that can be followed to achieve a desired result.'
    }
    if (lowerQuestion.includes('programming')) {
      return 'Programming involves writing instructions for computers to execute. Different paradigms offer different approaches to organizing and structuring code.'
    }
    if (lowerQuestion.includes('data structure')) {
      return 'Data structures are ways of organizing and storing data to enable efficient access and modification. Different structures are optimized for different operations.'
    }
  }
  
  if (lowerTitle.includes('mathematics')) {
    if (lowerQuestion.includes('logic')) {
      return 'Mathematical logic provides formal methods for reasoning about statements and their truth values. It forms the foundation for mathematical proofs.'
    }
    if (lowerQuestion.includes('probability')) {
      return 'Probability theory deals with the likelihood of events occurring. It provides mathematical tools for analyzing uncertainty and making predictions.'
    }
  }
  
  if (lowerTitle.includes('business')) {
    if (lowerQuestion.includes('management')) {
      return 'Management involves coordinating resources and people to achieve organizational goals. It requires both technical skills and interpersonal abilities.'
    }
    if (lowerQuestion.includes('economics')) {
      return 'Economics studies how individuals and societies allocate scarce resources. It provides frameworks for understanding decision-making and market behavior.'
    }
  }
  
  if (lowerTitle.includes('engineering')) {
    if (lowerQuestion.includes('circuit')) {
      return 'Electrical circuits are systems that allow current to flow through components. Understanding circuit analysis is fundamental to electrical engineering.'
    }
    if (lowerQuestion.includes('system')) {
      return 'Engineering systems integrate multiple components to achieve specific functions. Systems thinking is essential for complex engineering problems.'
    }
  }
  
  if (lowerTitle.includes('nursing')) {
    if (lowerQuestion.includes('patient')) {
      return 'Patient care involves providing safe, effective, and compassionate healthcare. It requires both technical skills and strong interpersonal communication.'
    }
    if (lowerQuestion.includes('health')) {
      return 'Health assessment involves systematically collecting and analyzing patient data to identify health problems and plan appropriate interventions.'
    }
  }
  
  // Generic explanations based on question type
  if (lowerQuestion.includes('main focus') || lowerQuestion.includes('primary goal')) {
    return `${courseTitle} aims to provide comprehensive understanding of the subject matter, including theoretical foundations, practical applications, and historical context.`
  }
  
  if (lowerQuestion.includes('most important') || lowerQuestion.includes('essential')) {
    return 'Understanding fundamental concepts is crucial for building a strong foundation in any field. This enables deeper learning and practical application.'
  }
  
  if (lowerQuestion.includes('best approach') || lowerQuestion.includes('learning')) {
    return 'Active engagement and consistent practice are key to mastering any subject. This includes hands-on experience, critical thinking, and regular review.'
  }
  
  if (lowerQuestion.includes('skill') || lowerQuestion.includes('ability')) {
    return 'Developing a combination of technical, analytical, and communication skills is essential for success in this field.'
  }
  
  // Default explanation
  return `The correct answer is "${correctAnswer}". This represents the most accurate response based on the principles and concepts covered in ${courseTitle}.`
}

// Update existing questions with better explanations
async function updateQuizExplanations() {
  try {
    console.log('🔄 Updating quiz explanations...\n')
    
    // Get all questions
    const questions = await prisma.question.findMany({
      include: {
        quiz: true
      }
    })
    
    let updatedCount = 0
    let skippedCount = 0
    
    for (const question of questions) {
      // Skip if explanation is already detailed (more than 50 characters)
      if (question.explanation && question.explanation.length > 50) {
        skippedCount++
        continue
      }
      
      // Generate better explanation
      const newExplanation = generateExplanation(
        question.quiz.title,
        question.text,
        question.correctAnswer,
        question.options
      )
      
      // Update the question
      await prisma.question.update({
        where: { id: question.id },
        data: {
          explanation: newExplanation,
          updatedAt: new Date()
        }
      })
      
      updatedCount++
      console.log(`✅ Updated explanation for: ${question.quiz.title} - "${question.text.substring(0, 50)}..."`)
    }
    
    console.log(`\n📊 Summary:`)
    console.log(`- Updated: ${updatedCount} questions`)
    console.log(`- Skipped: ${skippedCount} questions (already had detailed explanations)`)
    console.log(`- Total processed: ${questions.length} questions`)
    
  } catch (error) {
    console.error('❌ Error updating quiz explanations:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Add difficulty levels and categories to questions
async function enhanceQuestionMetadata() {
  try {
    console.log('\n🔄 Enhancing question metadata...\n')
    
    const questions = await prisma.question.findMany({
      include: {
        quiz: true
      }
    })
    
    let updatedCount = 0
    
    for (const question of questions) {
      const quizTitle = question.quiz.title.toLowerCase()
      
      // Determine difficulty based on course content
      let difficulty = 'Medium'
      if (quizTitle.includes('introduction') || quizTitle.includes('basic') || quizTitle.includes('fundamental')) {
        difficulty = 'Beginner'
      } else if (quizTitle.includes('advanced') || quizTitle.includes('specialized')) {
        difficulty = 'Advanced'
      }
      
      // Determine category based on subject
      let category = 'General'
      if (quizTitle.includes('computer science') || quizTitle.includes('programming')) {
        category = 'Computer Science'
      } else if (quizTitle.includes('mathematics') || quizTitle.includes('math')) {
        category = 'Mathematics'
      } else if (quizTitle.includes('business') || quizTitle.includes('management')) {
        category = 'Business'
      } else if (quizTitle.includes('engineering')) {
        category = 'Engineering'
      } else if (quizTitle.includes('nursing') || quizTitle.includes('health')) {
        category = 'Healthcare'
      }
      
      // Generate tags based on content
      const tags = []
      if (quizTitle.includes('programming')) tags.push('programming')
      if (quizTitle.includes('algorithm')) tags.push('algorithms')
      if (quizTitle.includes('data structure')) tags.push('data-structures')
      if (quizTitle.includes('database')) tags.push('databases')
      if (quizTitle.includes('network')) tags.push('networking')
      if (quizTitle.includes('security')) tags.push('security')
      if (quizTitle.includes('web')) tags.push('web-development')
      if (quizTitle.includes('mobile')) tags.push('mobile-development')
      if (quizTitle.includes('ai') || quizTitle.includes('artificial intelligence')) tags.push('artificial-intelligence')
      if (quizTitle.includes('machine learning')) tags.push('machine-learning')
      
      // Update the question
      await prisma.question.update({
        where: { id: question.id },
        data: {
          difficulty,
          category,
          tags,
          updatedAt: new Date()
        }
      })
      
      updatedCount++
    }
    
    console.log(`✅ Enhanced metadata for ${updatedCount} questions`)
    
  } catch (error) {
    console.error('❌ Error enhancing question metadata:', error)
    throw error
  }
}

// Main execution
async function main() {
  try {
    console.log('🚀 Starting quiz enhancement process...\n')
    
    await updateQuizExplanations()
    await enhanceQuestionMetadata()
    
    console.log('\n🎉 Quiz enhancement completed successfully!')
    
  } catch (error) {
    console.error('💥 Error in quiz enhancement process:', error)
    process.exit(1)
  }
}

// Run if called directly
if (require.main === module) {
  main()
}

module.exports = {
  updateQuizExplanations,
  enhanceQuestionMetadata,
  generateExplanation
} 