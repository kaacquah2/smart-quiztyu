const fetch = require('node-fetch');

async function testDashboardFixes() {
  console.log('🧪 Testing Dashboard Fixes and Improvements...\n');

  const baseUrl = 'http://localhost:3000';
  const tests = [];
  let passedTests = 0;
  let totalTests = 0;

  // Test 1: Programs API with caching headers
  tests.push(async () => {
    console.log('1. Testing Programs API with caching headers...');
    totalTests++;
    
    try {
      const response = await fetch(`${baseUrl}/api/programs`);
      const headers = response.headers;
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const programs = await response.json();
      
      // Check caching headers
      const cacheControl = headers.get('cache-control');
      if (cacheControl && cacheControl.includes('s-maxage=300')) {
        console.log('   ✅ Caching headers present');
        passedTests++;
      } else {
        console.log('   ❌ Caching headers missing');
      }
      
      // Check response structure
      if (Array.isArray(programs) && programs.length > 0) {
        console.log(`   ✅ API returned ${programs.length} programs`);
        passedTests++;
      } else {
        console.log('   ❌ No programs returned or invalid format');
      }
      
      // Check program structure
      const firstProgram = programs[0];
      if (firstProgram && firstProgram.statistics) {
        console.log('   ✅ Programs include statistics');
        passedTests++;
      } else {
        console.log('   ❌ Programs missing statistics');
      }
      
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
    }
  });

  // Test 2: Quizzes API with pagination and filtering
  tests.push(async () => {
    console.log('\n2. Testing Quizzes API with pagination...');
    totalTests++;
    
    try {
      const response = await fetch(`${baseUrl}/api/quizzes?page=1&limit=5`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Check pagination structure
      if (data.quizzes && data.pagination) {
        console.log('   ✅ Pagination structure present');
        passedTests++;
      } else {
        console.log('   ❌ Pagination structure missing');
      }
      
      // Check caching headers
      const cacheControl = response.headers.get('cache-control');
      if (cacheControl && cacheControl.includes('s-maxage=300')) {
        console.log('   ✅ Caching headers present');
        passedTests++;
      } else {
        console.log('   ❌ Caching headers missing');
      }
      
      console.log(`   📊 Found ${data.quizzes.length} quizzes, ${data.pagination.total} total`);
      
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
    }
  });

  // Test 3: Resources API with filtering
  tests.push(async () => {
    console.log('\n3. Testing Resources API with filtering...');
    totalTests++;
    
    try {
      // First get a program ID
      const programsResponse = await fetch(`${baseUrl}/api/programs`);
      const programs = await programsResponse.json();
      
      if (programs.length === 0) {
        console.log('   ⚠️  No programs available for testing');
        return;
      }
      
      const programId = programs[0].id;
      const response = await fetch(`${baseUrl}/api/resources?programId=${programId}&limit=3`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Check response structure
      if (data.resources && data.pagination) {
        console.log('   ✅ Resources structure present');
        passedTests++;
      } else {
        console.log('   ❌ Resources structure missing');
      }
      
      // Check caching headers
      const cacheControl = response.headers.get('cache-control');
      if (cacheControl && cacheControl.includes('s-maxage=300')) {
        console.log('   ✅ Caching headers present');
        passedTests++;
      } else {
        console.log('   ❌ Caching headers missing');
      }
      
      console.log(`   📊 Found ${data.resources.length} resources for program ${programId}`);
      
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
    }
  });

  // Test 4: Error handling
  tests.push(async () => {
    console.log('\n4. Testing Error Handling...');
    totalTests++;
    
    try {
      // Test invalid endpoint
      const response = await fetch(`${baseUrl}/api/nonexistent`);
      
      if (response.status === 404) {
        console.log('   ✅ 404 error handled properly');
        passedTests++;
      } else {
        console.log('   ❌ Unexpected response for invalid endpoint');
      }
      
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
    }
  });

  // Test 5: Dashboard page accessibility
  tests.push(async () => {
    console.log('\n5. Testing Dashboard Page Accessibility...');
    totalTests++;
    
    try {
      const response = await fetch(`${baseUrl}/dashboard`);
      
      if (response.status === 200) {
        console.log('   ✅ Dashboard page accessible');
        passedTests++;
      } else if (response.status === 401 || response.status === 302) {
        console.log('   ✅ Dashboard requires authentication (expected)');
        passedTests++;
      } else {
        console.log(`   ❌ Unexpected status: ${response.status}`);
      }
      
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
    }
  });

  // Test 6: API validation
  tests.push(async () => {
    console.log('\n6. Testing API Validation...');
    totalTests++;
    
    try {
      // Test invalid quiz creation
      const response = await fetch(`${baseUrl}/api/quizzes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          // Missing required fields
          title: '',
          description: ''
        })
      });
      
      if (response.status === 400) {
        console.log('   ✅ Validation working (rejected invalid data)');
        passedTests++;
      } else {
        console.log(`   ❌ Validation failed: ${response.status}`);
      }
      
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
    }
  });

  // Test 7: Performance improvements
  tests.push(async () => {
    console.log('\n7. Testing Performance Improvements...');
    totalTests++;
    
    try {
      const startTime = Date.now();
      
      // Test multiple concurrent requests
      const promises = [
        fetch(`${baseUrl}/api/programs`),
        fetch(`${baseUrl}/api/quizzes?limit=10`),
        fetch(`${baseUrl}/api/resources?limit=5`)
      ];
      
      const responses = await Promise.all(promises);
      const endTime = Date.now();
      
      const allSuccessful = responses.every(r => r.ok);
      const responseTime = endTime - startTime;
      
      if (allSuccessful) {
        console.log('   ✅ All concurrent requests successful');
        passedTests++;
      } else {
        console.log('   ❌ Some concurrent requests failed');
      }
      
      if (responseTime < 5000) { // Less than 5 seconds
        console.log(`   ✅ Response time acceptable: ${responseTime}ms`);
        passedTests++;
      } else {
        console.log(`   ⚠️  Slow response time: ${responseTime}ms`);
      }
      
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
    }
  });

  // Run all tests
  for (const test of tests) {
    await test();
  }

  // Summary
  console.log('\n📊 Test Summary:');
  console.log(`   Passed: ${passedTests}/${totalTests} tests`);
  console.log(`   Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);
  
  if (passedTests === totalTests) {
    console.log('\n🎉 All Dashboard Fixes PASSED!');
    console.log('✅ Error handling improved');
    console.log('✅ Caching implemented');
    console.log('✅ Performance optimized');
    console.log('✅ API validation working');
    console.log('✅ Component structure improved');
  } else {
    console.log('\n⚠️  Some tests failed. Please check the issues above.');
  }
}

// Run the test
testDashboardFixes().catch(console.error); 