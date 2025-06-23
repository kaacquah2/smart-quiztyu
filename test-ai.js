const fetch = require('node-fetch');

async function testAIRecommendations() {
  try {
    const response = await fetch('http://localhost:3000/api/ai-recommendations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        program: 'Computer Science',
        interests: ['Web Development', 'Machine Learning'],
        recentTopics: ['React', 'Node.js', 'Python'],
        quizResults: {
          score: 85,
          totalQuestions: 10,
          topics: ['JavaScript', 'React', 'Node.js'],
          strengths: ['React Hooks', 'State Management'],
          weaknesses: ['Advanced JavaScript', 'Testing']
        }
      })
    });

    const data = await response.json();
    console.log('Response:', data);
  } catch (error) {
    console.error('Error:', error);
  }
}

testAIRecommendations(); 