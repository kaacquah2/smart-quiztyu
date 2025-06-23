const { PrismaClient } = require('../lib/generated/prisma')

const prisma = new PrismaClient()

// Sample location data for demonstration
const sampleLocations = [
  { city: 'New York', country: 'United States', region: 'New York', timezone: 'America/New_York', latitude: 40.7128, longitude: -74.0060 },
  { city: 'London', country: 'United Kingdom', region: 'England', timezone: 'Europe/London', latitude: 51.5074, longitude: -0.1278 },
  { city: 'Toronto', country: 'Canada', region: 'Ontario', timezone: 'America/Toronto', latitude: 43.6532, longitude: -79.3832 },
  { city: 'Sydney', country: 'Australia', region: 'New South Wales', timezone: 'Australia/Sydney', latitude: -33.8688, longitude: 151.2093 },
  { city: 'Berlin', country: 'Germany', region: 'Berlin', timezone: 'Europe/Berlin', latitude: 52.5200, longitude: 13.4050 },
  { city: 'Tokyo', country: 'Japan', region: 'Tokyo', timezone: 'Asia/Tokyo', latitude: 35.6762, longitude: 139.6503 },
  { city: 'Mumbai', country: 'India', region: 'Maharashtra', timezone: 'Asia/Kolkata', latitude: 19.0760, longitude: 72.8777 },
  { city: 'São Paulo', country: 'Brazil', region: 'São Paulo', timezone: 'America/Sao_Paulo', latitude: -23.5505, longitude: -46.6333 },
  { city: 'Cape Town', country: 'South Africa', region: 'Western Cape', timezone: 'Africa/Johannesburg', latitude: -33.9249, longitude: 18.4241 },
  { city: 'Singapore', country: 'Singapore', region: 'Singapore', timezone: 'Asia/Singapore', latitude: 1.3521, longitude: 103.8198 },
]

async function seedLocations() {
  try {
    console.log('🌍 Seeding location data for users...')
    
    // Get all users without location data
    const users = await prisma.user.findMany({
      where: {
        OR: [
          { city: null },
          { country: null },
          { region: null }
        ]
      }
    })
    
    console.log(`Found ${users.length} users to update with location data`)
    
    // Update each user with random location data
    for (let i = 0; i < users.length; i++) {
      const user = users[i]
      const location = sampleLocations[i % sampleLocations.length]
      
      await prisma.user.update({
        where: { id: user.id },
        data: {
          city: location.city,
          country: location.country,
          region: location.region,
          timezone: location.timezone,
          latitude: location.latitude,
          longitude: location.longitude,
        }
      })
      
      console.log(`✅ Updated ${user.name} with location: ${location.city}, ${location.country}`)
    }
    
    console.log('🎉 Location seeding completed successfully!')
  } catch (error) {
    console.error('❌ Error seeding locations:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Run the seeding function
seedLocations() 