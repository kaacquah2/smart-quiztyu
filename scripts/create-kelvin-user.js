const { PrismaClient } = require('../lib/generated/prisma');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createKelvinUser() {
  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: 'kaacquah2004@gmail.com' }
    });

    if (existingUser) {
      console.log('User already exists:', existingUser.email);
      return existingUser;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash('password123', 12);

    // Create user with specific ID
    const user = await prisma.user.create({
      data: {
        id: '66e3afdd-c483-43ae-83e6-97411ce475c2',
        name: 'Kelvin Acquah',
        email: 'kaacquah2004@gmail.com',
        password: hashedPassword,
        program: 'Not specified',
      }
    });

    console.log('Kelvin user created successfully:', {
      id: user.id,
      name: user.name,
      email: user.email
    });
    return user;
  } catch (error) {
    console.error('Error creating Kelvin user:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

createKelvinUser(); 