const fs = require('fs');
const path = require('path');

// Test script to verify the new programs integration
async function testNewPrograms() {
  console.log('🧪 Testing New Programs Integration...\n');

  const newPrograms = [
    'mechanical-engineering',
    'civil-engineering', 
    'chemical-engineering',
    'architecture',
    'medicine',
    'law'
  ];

  let allTestsPassed = true;

  // Test 1: Check if programs exist in seed-database.js
  console.log('📋 Test 1: Checking programs in seed-database.js');
  try {
    const seedData = fs.readFileSync(path.join(__dirname, 'scripts/seed-database.js'), 'utf8');
    
    for (const programId of newPrograms) {
      if (seedData.includes(`id: "${programId}"`)) {
        console.log(`  ✅ ${programId} found in seed-database.js`);
      } else {
        console.log(`  ❌ ${programId} NOT found in seed-database.js`);
        allTestsPassed = false;
      }
    }
  } catch (error) {
    console.log(`  ❌ Error reading seed-database.js: ${error.message}`);
    allTestsPassed = false;
  }

  // Test 2: Check if programs exist in program-data.js
  console.log('\n📋 Test 2: Checking programs in program-data.js');
  try {
    const programData = fs.readFileSync(path.join(__dirname, 'lib/program-data.js'), 'utf8');
    
    for (const programId of newPrograms) {
      if (programData.includes(`"id": "${programId}"`)) {
        console.log(`  ✅ ${programId} found in program-data.js`);
      } else {
        console.log(`  ❌ ${programId} NOT found in program-data.js`);
        allTestsPassed = false;
      }
    }
  } catch (error) {
    console.log(`  ❌ Error reading program-data.js: ${error.message}`);
    allTestsPassed = false;
  }

  // Test 3: Check if quizzes exist
  console.log('\n📋 Test 3: Checking quizzes for new programs');
  try {
    const quizzesData = fs.readFileSync(path.join(__dirname, 'data/quizzes.json'), 'utf8');
    const quizzes = JSON.parse(quizzesData);
    
    const newProgramQuizzes = quizzes.filter(quiz => 
      newPrograms.some(program => quiz.tags.includes(program))
    );
    
    console.log(`  ✅ Found ${newProgramQuizzes.length} quizzes for new programs`);
    
    if (newProgramQuizzes.length === 0) {
      console.log(`  ⚠️  No quizzes found for new programs`);
      allTestsPassed = false;
    }
  } catch (error) {
    console.log(`  ❌ Error reading quizzes.json: ${error.message}`);
    allTestsPassed = false;
  }

  // Test 4: Check if resources exist
  console.log('\n📋 Test 4: Checking resources for new programs');
  try {
    const resourcesData = fs.readFileSync(path.join(__dirname, 'data/resources.json'), 'utf8');
    const resources = JSON.parse(resourcesData);
    
    const newProgramResources = resources.filter(resource => 
      newPrograms.some(program => resource.category === program || resource.tags.includes(program))
    );
    
    console.log(`  ✅ Found ${newProgramResources.length} resources for new programs`);
    
    if (newProgramResources.length === 0) {
      console.log(`  ⚠️  No resources found for new programs`);
      allTestsPassed = false;
    }
  } catch (error) {
    console.log(`  ❌ Error reading resources.json: ${error.message}`);
    allTestsPassed = false;
  }

  // Test 5: Check if recommendations exist
  console.log('\n📋 Test 5: Checking recommendations for new programs');
  try {
    const recommendationsData = fs.readFileSync(path.join(__dirname, 'data/recommendations.json'), 'utf8');
    const recommendations = JSON.parse(recommendationsData);
    
    const newProgramRecommendations = recommendations.filter(rec => 
      newPrograms.some(program => rec.category === program || rec.tags.includes(program))
    );
    
    console.log(`  ✅ Found ${newProgramRecommendations.length} recommendations for new programs`);
    
    if (newProgramRecommendations.length === 0) {
      console.log(`  ⚠️  No recommendations found for new programs`);
      allTestsPassed = false;
    }
  } catch (error) {
    console.log(`  ❌ Error reading recommendations.json: ${error.message}`);
    allTestsPassed = false;
  }

  // Test 6: Check integration summary
  console.log('\n📋 Test 6: Checking integration summary');
  try {
    const summaryData = fs.readFileSync(path.join(__dirname, 'integration-summary.json'), 'utf8');
    const summary = JSON.parse(summaryData);
    
    console.log(`  ✅ Integration completed at: ${summary.timestamp}`);
    console.log(`  ✅ Programs added: ${summary.programsAdded}`);
    console.log(`  ✅ Quizzes added: ${summary.quizzesAdded}`);
    console.log(`  ✅ Resources added: ${summary.resourcesAdded}`);
    console.log(`  ✅ Recommendations added: ${summary.recommendationsAdded}`);
    console.log(`  ✅ Total courses: ${summary.totalCourses}`);
    
    if (summary.programsAdded !== 6) {
      console.log(`  ❌ Expected 6 programs, got ${summary.programsAdded}`);
      allTestsPassed = false;
    }
  } catch (error) {
    console.log(`  ❌ Error reading integration-summary.json: ${error.message}`);
    allTestsPassed = false;
  }

  // Test 7: Check individual program files
  console.log('\n📋 Test 7: Checking individual program files');
  for (const programId of newPrograms) {
    const programFile = path.join(__dirname, `lib/programs/${programId}.ts`);
    try {
      if (fs.existsSync(programFile)) {
        console.log(`  ✅ ${programId}.ts exists`);
      } else {
        console.log(`  ❌ ${programId}.ts does not exist`);
        allTestsPassed = false;
      }
    } catch (error) {
      console.log(`  ❌ Error checking ${programId}.ts: ${error.message}`);
      allTestsPassed = false;
    }
  }

  // Final Results
  console.log('\n' + '='.repeat(50));
  if (allTestsPassed) {
    console.log('🎉 ALL TESTS PASSED!');
    console.log('✅ All 6 new programs have been successfully integrated');
    console.log('✅ Quizzes, resources, and recommendations are available');
    console.log('✅ Database files have been updated');
    console.log('✅ Individual program files have been created');
  } else {
    console.log('❌ SOME TESTS FAILED');
    console.log('⚠️  Please check the integration process');
  }
  console.log('='.repeat(50));

  return allTestsPassed;
}

// Run the test
testNewPrograms()
  .then((success) => {
    if (success) {
      console.log('\n🚀 Ready to use the new programs!');
    } else {
      console.log('\n🔧 Integration needs attention');
    }
    process.exit(success ? 0 : 1);
  })
  .catch((error) => {
    console.error('❌ Test failed with error:', error);
    process.exit(1);
  }); 