async function testAIRecommendations() {
  console.log('Testing updated AI recommendations...\n');

  // Test 1: Course-specific recommendations
  try {
    console.log('1. Testing course-specific recommendations...');
    const response = await fetch('http://localhost:3000/api/ai-recommendations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        courseId: 'data-structures',
        quizResults: [
          {
            quizId: 'data-structures-basics',
            courseId: 'data-structures',
            quizTitle: 'Data Structures Basics',
            score: 85,
            total: 10
          }
        ]
      })
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    const responseText = await response.text();
    console.log('Response text:', responseText.substring(0, 500));
    
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.log('❌ Failed to parse JSON response:', parseError.message);
      return;
    }
    
    if (data.error) {
      console.log('❌ Error:', data.error);
    } else {
      console.log('✅ Success! Course-specific recommendations generated');
      console.log(`   Course: ${data.course?.title}`);
      console.log(`   Performance: ${data.performance?.percentage}%`);
      console.log(`   Recommendations: ${data.recommendations?.length || 0}`);
    }
  } catch (error) {
    console.log('❌ Error testing course-specific recommendations:', error.message);
  }

  // Test 2: Filtered recommendations by program
  try {
    console.log('\n2. Testing filtered recommendations by program...');
    const response = await fetch('http://localhost:3000/api/ai-recommendations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        selectedProgram: 'computer-science',
        selectedYear: '1',
        selectedSemester: '1',
        quizResults: [
          {
            quizId: 'intro-to-python',
            courseId: 'intro-to-python',
            quizTitle: 'Python Fundamentals',
            score: 92,
            total: 15
          },
          {
            quizId: 'data-structures-basics',
            courseId: 'data-structures',
            quizTitle: 'Data Structures Basics',
            score: 78,
            total: 10
          }
        ]
      })
    });

    console.log('Response status:', response.status);
    const responseText = await response.text();
    console.log('Response text:', responseText.substring(0, 500));
    
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.log('❌ Failed to parse JSON response:', parseError.message);
      return;
    }
    
    if (data.error) {
      console.log('❌ Error:', data.error);
    } else {
      console.log('✅ Success! Filtered recommendations generated');
      console.log(`   Course recommendations: ${data.courseRecommendations?.length || 0}`);
      if (data.courseRecommendations?.length > 0) {
        console.log(`   First course: ${data.courseRecommendations[0].courseTitle}`);
        console.log(`   Difficulty: ${data.courseRecommendations[0].difficulty}`);
        console.log(`   Priority: ${data.courseRecommendations[0].priority}`);
      }
    }
  } catch (error) {
    console.log('❌ Error testing filtered recommendations:', error.message);
  }

  // Test 3: General recommendations
  try {
    console.log('\n3. Testing general recommendations...');
    const response = await fetch('http://localhost:3000/api/ai-recommendations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        program: 'Computer Science',
        interests: ['Web Development', 'Machine Learning'],
        recentTopics: ['React', 'Node.js', 'Python'],
        quizResults: [
          {
            quizTitle: 'Data Structures and Algorithms',
            score: 85,
            strengths: ['Arrays', 'Linked Lists'],
            weaknesses: ['Dynamic Programming', 'Graph Algorithms'],
          }
        ]
      })
    });

    const data = await response.json();
    
    if (data.error) {
      console.log('❌ Error:', data.error);
    } else {
      console.log('✅ Success! General recommendations generated');
      console.log(`   Recommendations: ${data.recommendations?.length || 0}`);
      if (data.recommendations?.length > 0) {
        console.log(`   First recommendation: ${data.recommendations[0].title}`);
        console.log(`   Type: ${data.recommendations[0].resourceType}`);
        console.log(`   Difficulty: ${data.recommendations[0].difficulty}`);
      }
    }
  } catch (error) {
    console.log('❌ Error testing general recommendations:', error.message);
  }

  console.log('\n🎉 AI recommendations testing completed!');
}

// Wait a bit for the server to start, then run tests
setTimeout(testAIRecommendations, 3000);