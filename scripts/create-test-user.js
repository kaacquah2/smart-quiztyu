const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function createTestUser() {
  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: 'test@example.com' }
    })

    if (existingUser) {
      console.log('Test user already exists:', existingUser.email)
      return existingUser
    }

    // Hash password
    const hashedPassword = await bcrypt.hash('password123', 12)

    // Create test user
    const user = await prisma.user.create({
      data: {
        name: 'Test User',
        email: 'test@example.com',
        password: hashedPassword
      }
    })

    console.log('Test user created successfully:', {
      id: user.id,
      name: user.name,
      email: user.email
    })

    return user
  } catch (error) {
    console.error('Error creating test user:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Run the script
createTestUser()
  .then(() => {
    console.log('Script completed successfully')
    process.exit(0)
  })
  .catch((error) => {
    console.error('Script failed:', error)
    process.exit(1)
  }) 