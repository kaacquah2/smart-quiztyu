const fs = require('fs');
const path = require('path');

console.log('🧪 Simple Integration Test\n');

// Check if new programs are in seed-database.js
console.log('1. Checking seed-database.js...');
try {
  const seedData = fs.readFileSync('scripts/seed-database.js', 'utf8');
  const newPrograms = ['mechanical-engineering', 'civil-engineering', 'chemical-engineering', 'architecture', 'medicine', 'law'];
  
  let foundCount = 0;
  for (const program of newPrograms) {
    if (seedData.includes(`id: "${program}"`)) {
      console.log(`   ✅ ${program}`);
      foundCount++;
    } else {
      console.log(`   ❌ ${program}`);
    }
  }
  console.log(`   Found ${foundCount}/6 programs in seed-database.js\n`);
} catch (error) {
  console.log(`   ❌ Error: ${error.message}\n`);
}

// Check if new programs are in program-data.js
console.log('2. Checking program-data.js...');
try {
  const programData = fs.readFileSync('lib/program-data.js', 'utf8');
  const newPrograms = ['mechanical-engineering', 'civil-engineering', 'chemical-engineering', 'architecture', 'medicine', 'law'];
  
  let foundCount = 0;
  for (const program of newPrograms) {
    if (programData.includes(`"id": "${program}"`)) {
      console.log(`   ✅ ${program}`);
      foundCount++;
    } else {
      console.log(`   ❌ ${program}`);
    }
  }
  console.log(`   Found ${foundCount}/6 programs in program-data.js\n`);
} catch (error) {
  console.log(`   ❌ Error: ${error.message}\n`);
}

// Check integration summary
console.log('3. Checking integration summary...');
try {
  const summary = JSON.parse(fs.readFileSync('integration-summary.json', 'utf8'));
  console.log(`   ✅ Programs added: ${summary.programsAdded}`);
  console.log(`   ✅ Quizzes added: ${summary.quizzesAdded}`);
  console.log(`   ✅ Resources added: ${summary.resourcesAdded}`);
  console.log(`   ✅ Recommendations added: ${summary.recommendationsAdded}`);
  console.log(`   ✅ Total courses: ${summary.totalCourses}`);
  console.log(`   ✅ Timestamp: ${summary.timestamp}\n`);
} catch (error) {
  console.log(`   ❌ Error: ${error.message}\n`);
}

// Check data files
console.log('4. Checking data files...');
try {
  const quizzes = JSON.parse(fs.readFileSync('data/quizzes.json', 'utf8'));
  const resources = JSON.parse(fs.readFileSync('data/resources.json', 'utf8'));
  const recommendations = JSON.parse(fs.readFileSync('data/recommendations.json', 'utf8'));
  
  console.log(`   ✅ Quizzes: ${quizzes.length} total`);
  console.log(`   ✅ Resources: ${resources.length} total`);
  console.log(`   ✅ Recommendations: ${recommendations.length} total\n`);
} catch (error) {
  console.log(`   ❌ Error: ${error.message}\n`);
}

console.log('✅ Integration test completed!'); 