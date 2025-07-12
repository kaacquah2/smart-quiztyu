const fetch = require('node-fetch');

async function testFrontendIntegration() {
  console.log('🧪 Testing Frontend Integration with New Programs...\n');

  try {
    // Test the programs API endpoint
    console.log('1. Testing /api/programs endpoint...');
    const response = await fetch('http://localhost:3000/api/programs');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const programs = await response.json();
    console.log(`   ✅ API returned ${programs.length} programs`);
    
    // Check for new programs
    const newPrograms = [
      'mechanical-engineering',
      'civil-engineering', 
      'chemical-engineering',
      'architecture',
      'medicine',
      'law'
    ];
    
    console.log('\n2. Checking for new programs...');
    let foundCount = 0;
    for (const programId of newPrograms) {
      const program = programs.find(p => p.id === programId);
      if (program) {
        console.log(`   ✅ ${programId}: ${program.title}`);
        console.log(`      - ${program.statistics.totalCourses} courses`);
        console.log(`      - ${program.statistics.totalQuizzes} quizzes`);
        console.log(`      - ${program.statistics.totalResources} resources`);
        foundCount++;
      } else {
        console.log(`   ❌ ${programId}: NOT FOUND`);
      }
    }
    
    console.log(`\n   Found ${foundCount}/6 new programs in API response`);
    
    if (foundCount === 6) {
      console.log('\n🎉 Frontend Integration Test PASSED!');
      console.log('✅ All new programs are accessible via API');
      console.log('✅ Frontend components should display new programs');
    } else {
      console.log('\n⚠️  Frontend Integration Test PARTIAL');
      console.log('❌ Some new programs are missing from API');
    }
    
  } catch (error) {
    console.log('\n❌ Frontend Integration Test FAILED');
    console.log(`Error: ${error.message}`);
    console.log('\nMake sure the development server is running: npm run dev');
  }
}

testFrontendIntegration(); 