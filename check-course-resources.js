const fs = require('fs');
const path = require('path');

// Read the resources data
const resourcesData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'resources.json'), 'utf8'));

// Read the program data to get all courses
const programDataPath = path.join(__dirname, 'lib', 'program-data.ts');
let programDataContent = fs.readFileSync(programDataPath, 'utf8');

// Extract course IDs using a more robust regex
const courseIds = new Set();
const courseIdRegex = /id:\s*"([^"]+)"/g;
let match;

// Find all course IDs in the file
while ((match = courseIdRegex.exec(programDataContent)) !== null) {
  const courseId = match[1];
  // Filter out program IDs and other non-course IDs
  if (!courseId.includes('program') && 
      !courseId.includes('year') && 
      !courseId.includes('semester') &&
      courseId !== 'computer-science' &&
      courseId !== 'electrical-engineering' &&
      courseId !== 'business-admin' &&
      courseId !== 'nursing' &&
      courseId !== 'mechanical-engineering' &&
      courseId !== 'mathematics' &&
      courseId !== 'physics' &&
      courseId !== 'civil-engineering' &&
      courseId !== 'economics' &&
      courseId !== 'sociology' &&
      courseId !== 'psychology' &&
      courseId !== 'chemistry' &&
      courseId !== 'biology' &&
      courseId !== 'geography' &&
      courseId !== 'law' &&
      courseId !== 'political-science' &&
      courseId !== 'biomedical-science') {
    courseIds.add(courseId);
  }
}

console.log('=== COURSE RESOURCE ANALYSIS ===\n');

// Get all unique course IDs from resources
const resourceCourseIds = new Set();
resourcesData.forEach(resource => {
  if (resource.courseIds && Array.isArray(resource.courseIds)) {
    resource.courseIds.forEach(courseId => resourceCourseIds.add(courseId));
  }
});

// Find courses that have resources
const coursesWithResources = new Set();
resourcesData.forEach(resource => {
  if (resource.courseIds && Array.isArray(resource.courseIds)) {
    resource.courseIds.forEach(courseId => coursesWithResources.add(courseId));
  }
});

// Find courses that don't have resources
const coursesWithoutResources = new Set();
courseIds.forEach(courseId => {
  if (!coursesWithResources.has(courseId)) {
    coursesWithoutResources.add(courseId);
  }
});

// Generate statistics
const totalCourses = courseIds.size;
const coursesWithResourcesCount = coursesWithResources.size;
const coursesWithoutResourcesCount = coursesWithoutResources.size;
const coveragePercentage = ((coursesWithResourcesCount / totalCourses) * 100).toFixed(2);

console.log(`📊 STATISTICS:`);
console.log(`Total courses: ${totalCourses}`);
console.log(`Courses with resources: ${coursesWithResourcesCount}`);
console.log(`Courses without resources: ${coursesWithoutResourcesCount}`);
console.log(`Coverage: ${coveragePercentage}%\n`);

// Show courses with resources
console.log(`✅ COURSES WITH RESOURCES (${coursesWithResourcesCount}):`);
Array.from(coursesWithResources).sort().forEach(courseId => {
  const resourcesForCourse = resourcesData.filter(resource => 
    resource.courseIds && resource.courseIds.includes(courseId)
  );
  console.log(`  • ${courseId} (${resourcesForCourse.length} resources)`);
});

console.log(`\n❌ COURSES WITHOUT RESOURCES (${coursesWithoutResourcesCount}):`);
Array.from(coursesWithoutResources).sort().forEach(courseId => {
  console.log(`  • ${courseId}`);
});

// Analyze by program
console.log(`\n📚 ANALYSIS BY PROGRAM:`);

// Define program mappings
const programMappings = {
  'computer-science': ['intro-to-cs', 'math-for-cs', 'intro-to-python', 'fundamentals-computing', 'data-structures', 'discrete-math', 'database-systems', 'computer-organization', 'intro-software-eng', 'operating-systems', 'data-structures-2', 'oop-java', 'digital-logic', 'linear-algebra', 'theory-computation', 'computer-networks', 'database-systems-2', 'web-development', 'mathematical-logic', 'software-eng-advanced', 'artificial-intelligence', 'computer-graphics', 'advanced-database', 'os-advanced', 'mobile-app-dev', 'machine-learning', 'information-security', 'cloud-computing', 'computer-vision', 'advanced-algorithms', 'distributed-systems', 'big-data-analytics', 'cybersecurity', 'advanced-web'],
  'electrical-engineering': ['physics', 'math-for-engineers-1', 'circuit-analysis', 'math-for-engineers-2', 'digital-systems', 'electronics-1', 'electromagnetism', 'signals-systems', 'electronics-2', 'electric-machines-1', 'engineering-math', 'measurements-instrumentation', 'control-systems', 'power-systems', 'digital-electronics', 'electric-machines-2', 'microprocessors', 'communication-systems', 'power-electronics', 'electromagnetic-fields', 'digital-signal-processing', 'power-systems-2', 'renewable-energy', 'embedded-systems', 'industrial-electronics'],
  'business-admin': ['intro-business', 'principles-management', 'microeconomics', 'business-math', 'business-communication', 'principles-accounting', 'financial-accounting', 'macroeconomics', 'business-statistics', 'organizational-behavior', 'business-law', 'it-business', 'marketing-principles', 'marketing-management', 'business-finance', 'human-resource-management', 'management-accounting', 'operations-management', 'corporate-finance', 'business-ethics', 'entrepreneurship', 'business-analysis', 'strategic-management', 'investment-analysis', 'international-business', 'management-info-systems', 'innovation-management', 'financial-markets', 'quality-management', 'digital-marketing', 'business-analytics'],
  'nursing': ['anatomy-physiology', 'anatomy-physiology-1', 'anatomy-physiology-2', 'nursing-fundamentals', 'fundamentals-nursing', 'health-assessment', 'nursing-ethics', 'medical-surgical-nursing', 'maternal-child-nursing', 'mental-health-nursing', 'community-health-nursing', 'pharmacology', 'pharmacology-1', 'nursing-research', 'geriatric-nursing', 'critical-care-nursing']
};

Object.entries(programMappings).forEach(([programId, programCourses]) => {
  const programCoursesWithResources = programCourses.filter(courseId => 
    coursesWithResources.has(courseId)
  );
  
  if (programCourses.length > 0) {
    const programCoverage = ((programCoursesWithResources.length / programCourses.length) * 100).toFixed(2);
    console.log(`  ${programId}: ${programCoursesWithResources.length}/${programCourses.length} courses (${programCoverage}%)`);
  }
});

console.log(`\n🔍 DETAILED RESOURCE ANALYSIS:`);
resourcesData.forEach(resource => {
  if (resource.courseIds && resource.courseIds.length > 0) {
    console.log(`  Resource "${resource.title}" (${resource.id}) covers: ${resource.courseIds.join(', ')}`);
  }
});

console.log(`\n📋 SUMMARY:`);
if (coursesWithoutResourcesCount === 0) {
  console.log(`✅ ALL COURSES HAVE AT LEAST ONE RESOURCE!`);
} else {
  console.log(`❌ ${coursesWithoutResourcesCount} courses are missing resources.`);
  console.log(`   Consider adding resources for: ${Array.from(coursesWithoutResources).slice(0, 5).join(', ')}${coursesWithoutResourcesCount > 5 ? '...' : ''}`);
}

// Print a clean list of all courses missing resources (with titles)
console.log(`\n=== FULL LIST: COURSES WITHOUT RESOURCES ===`);

// Extract course ID to title mapping
const courseIdToTitle = {};
const courseTitleRegex = /id:\s*"([^"]+)"\s*,\s*title:\s*"([^"]+)"/g;
let titleMatch;
while ((titleMatch = courseTitleRegex.exec(programDataContent)) !== null) {
  courseIdToTitle[titleMatch[1]] = titleMatch[2];
}

const missingCoursesList = Array.from(coursesWithoutResources).sort().map(courseId => {
  const title = courseIdToTitle[courseId] || '(No title found)';
  return `${courseId} - ${title}`;
});

missingCoursesList.forEach(line => console.log(line));

// Also save to a file
fs.writeFileSync('courses-missing-resources.txt', missingCoursesList.join('\n'), 'utf8');
console.log(`\nSaved to courses-missing-resources.txt`); 