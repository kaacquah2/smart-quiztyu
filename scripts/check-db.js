const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkDatabase() {
  try {
    console.log('Checking database...')
    
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true
      }
    })
    
    console.log('Users found:', users.length)
    users.forEach(user => {
      console.log(`- ${user.email} (${user.id})`)
    })
    
    const userAnalytics = await prisma.userAnalytics.findMany({
      select: {
        id: true,
        userId: true,
        createdAt: true
      }
    })
    
    console.log('User Analytics found:', userAnalytics.length)
    userAnalytics.forEach(analytics => {
      console.log(`- Analytics for user: ${analytics.userId}`)
    })
    
  } catch (error) {
    console.error('Error checking database:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkDatabase() 