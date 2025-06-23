const { PrismaClient } = require('../lib/generated/prisma');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

// Read all course IDs and titles from program-data.ts
const programDataPath = path.join(__dirname, '..', 'lib', 'program-data.ts');
const programDataContent = fs.readFileSync(programDataPath, 'utf8');
const courseIdRegex = /id:\s*"([^"]+)"\s*,\s*title:\s*"([^"]+)"/g;

const allCourses = [];
let match;
while ((match = courseIdRegex.exec(programDataContent)) !== null) {
  const courseId = match[1];
  const title = match[2];
  allCourses.push({ courseId, title });
}

async function verifyCourseResources() {
  let missing = [];
  let withResources = 0;

  for (const course of allCourses) {
    const resources = await prisma.resource.findMany({
      where: { courseIds: { has: course.courseId } }
    });
    if (resources.length === 0) {
      missing.push(course);
    } else {
      withResources++;
    }
  }

  console.log('=== COURSE RESOURCE VERIFICATION ===\n');
  if (missing.length === 0) {
    console.log('✅ All courses have at least one resource!');
  } else {
    console.log(`❌ ${missing.length} courses are still missing resources:`);
    for (const course of missing) {
      console.log(`- ${course.courseId} - ${course.title}`);
    }
  }
  console.log(`\nSummary:`);
  console.log(`Courses with resources: ${withResources}`);
  console.log(`Courses missing resources: ${missing.length}`);
  console.log(`Total courses: ${allCourses.length}`);
}

verifyCourseResources()
  .then(() => process.exit(0))
  .catch((err) => { console.error(err); process.exit(1); }); 