const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function createDemoUser() {
  try {
    // Check if demo user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: 'demo@example.com' }
    })

    if (existingUser) {
      console.log('✅ Demo user already exists')
      return
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash('demo', 12)

    // Create demo user
    const user = await prisma.user.create({
      data: {
        name: 'Demo User',
        email: 'demo@example.com',
        password: hashedPassword,
        program: 'Computer Science'
      }
    })

    console.log('✅ Demo user created successfully:')
    console.log(`   ID: ${user.id}`)
    console.log(`   Email: ${user.email}`)
    console.log(`   Name: ${user.name}`)

  } catch (error) {
    console.error('❌ Error creating demo user:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createDemoUser() 