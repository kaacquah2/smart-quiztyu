require('dotenv').config();
const fetch = require('node-fetch');

// Sample course data for testing
const sampleCourses = [
  {
    id: 'intro-to-python',
    title: 'Introduction to Python Programming',
    description: 'Learn the basics of Python programming language',
    tags: ['python', 'programming', 'beginner']
  },
  {
    id: 'data-structures',
    title: 'Data Structures and Algorithms',
    description: 'Fundamental data structures and algorithmic concepts',
    tags: ['algorithms', 'data-structures', 'computer-science']
  },
  {
    id: 'web-development',
    title: 'Web Development Fundamentals',
    description: 'HTML, CSS, and JavaScript basics for web development',
    tags: ['html', 'css', 'javascript', 'web-development']
  },
  {
    id: 'machine-learning',
    title: 'Machine Learning Basics',
    description: 'Introduction to machine learning concepts and algorithms',
    tags: ['machine-learning', 'ai', 'python', 'statistics']
  },
  {
    id: 'database-systems',
    title: 'Database Systems',
    description: 'Relational databases, SQL, and database design',
    tags: ['sql', 'database', 'mysql', 'postgresql']
  }
];

async function testGeminiAPI() {
  console.log('\n🤖 Testing Gemini API...\n');
  
  const API_KEY = process.env.GEMINI_API_KEY;
  const MODEL = process.env.GEMINI_MODEL || "gemini-2.0-flash";
  
  if (!API_KEY || API_KEY === "your-gemini-api-key-here") {
    console.log('❌ GEMINI_API_KEY not configured in .env file');
    return false;
  }
  
  console.log(`✅ API Key configured: ${API_KEY.substring(0, 10)}...`);
  console.log(`✅ Model: ${MODEL}`);
  
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;
  
  try {
    console.log('🧪 Testing basic Gemini API call...');
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: "Explain how AI works in exactly 3 words"
              }
            ]
          }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.log('❌ Gemini API test failed:', errorData.error?.message || response.statusText);
      return false;
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response";
    
    console.log('✅ Gemini API test successful!');
    console.log('🤖 Response:', text);
    return true;
    
  } catch (error) {
    console.log('❌ Gemini API test failed:', error.message);
    return false;
  }
}

async function testYouTubeAPI() {
  console.log('\n🎬 Testing YouTube API...\n');
  
  const API_KEY = process.env.YOUTUBE_API_KEY;
  
  if (!API_KEY || API_KEY === "your-youtube-api-key-here") {
    console.log('❌ YOUTUBE_API_KEY not configured in .env file');
    return false;
  }
  
  console.log(`✅ API Key configured: ${API_KEY.substring(0, 10)}...`);
  
  try {
    console.log('🧪 Testing direct YouTube API call...');
    const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=python+tutorial&maxResults=1&key=${API_KEY}`);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.log('❌ YouTube API test failed:', errorData.error?.message || response.statusText);
      return false;
    }

    const data = await response.json();
    if (data.items && data.items.length > 0) {
      console.log('✅ YouTube API test successful!');
      console.log(`📺 Found video: ${data.items[0].snippet.title}`);
      return true;
    } else {
      console.log('⚠️  YouTube API call successful but no results returned');
      return false;
    }
    
  } catch (error) {
    console.log('❌ YouTube API test failed:', error.message);
    return false;
  }
}

async function testAIRecommendationsAPI() {
  console.log('\n🧠 Testing AI Recommendations API...\n');
  
  try {
    console.log('🧪 Testing course-specific AI recommendations...');
    
    for (const course of sampleCourses.slice(0, 3)) { // Test first 3 courses
      console.log(`\n📚 Testing course: ${course.title}`);
      
      const response = await fetch('http://localhost:3000/api/ai-recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courseId: course.id,
          quizResults: [
            {
              quizId: `${course.id}-quiz`,
              courseId: course.id,
              quizTitle: `${course.title} Quiz`,
              score: Math.floor(Math.random() * 20) + 70, // Random score 70-90
              total: 20
            }
          ]
        })
      });

      if (!response.ok) {
        console.log(`❌ Error for ${course.title}: ${response.status} ${response.statusText}`);
        continue;
      }

      const data = await response.json();
      
      if (data.error) {
        console.log(`❌ Error for ${course.title}: ${data.error}`);
      } else {
        console.log(`✅ Success for ${course.title}!`);
        console.log(`   Course: ${data.course?.title || 'N/A'}`);
        console.log(`   Performance: ${data.performance?.percentage || 'N/A'}%`);
        console.log(`   Recommendations: ${data.recommendations?.length || 0}`);
      }
    }
    
    return true;
  } catch (error) {
    console.log('❌ AI Recommendations API test failed:', error.message);
    return false;
  }
}

async function testYouTubeRecommendationsAPI() {
  console.log('\n📺 Testing YouTube Recommendations API...\n');
  
  try {
    console.log('🧪 Testing YouTube recommendations for different topics...');
    
    const testTopics = [
      { topic: 'Python programming', difficulty: 'beginner' },
      { topic: 'Data structures', difficulty: 'intermediate' },
      { topic: 'Machine learning', difficulty: 'advanced' }
    ];
    
    for (const test of testTopics) {
      console.log(`\n🎯 Testing topic: ${test.topic} (${test.difficulty})`);
      
      const response = await fetch('http://localhost:3000/api/youtube-recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic: test.topic,
          difficulty: test.difficulty,
          maxResults: 2,
          type: 'educational'
        })
      });

      if (!response.ok) {
        console.log(`❌ Error for ${test.topic}: ${response.status} ${response.statusText}`);
        continue;
      }

      const data = await response.json();
      
      if (data.error) {
        console.log(`❌ Error for ${test.topic}: ${data.error}`);
      } else {
        console.log(`✅ Success for ${test.topic}!`);
        console.log(`   Found ${data.recommendations?.length || 0} videos`);
        if (data.recommendations?.length > 0) {
          console.log(`   Sample: ${data.recommendations[0].title}`);
          console.log(`   Channel: ${data.recommendations[0].channelTitle}`);
          console.log(`   Duration: ${data.recommendations[0].duration}`);
        }
      }
    }
    
    return true;
  } catch (error) {
    console.log('❌ YouTube Recommendations API test failed:', error.message);
    return false;
  }
}

async function testAllAPIs() {
  console.log('🚀 Starting Comprehensive API Testing for Smart Quiztyu\n');
  console.log('=' .repeat(60));
  
  // Test 1: Direct API calls
  console.log('\n📋 TEST 1: Direct API Key Validation');
  const geminiDirect = await testGeminiAPI();
  const youtubeDirect = await testYouTubeAPI();
  
  // Wait for server to be ready
  console.log('\n⏳ Waiting for development server to be ready...');
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  // Test 2: API endpoints
  console.log('\n📋 TEST 2: API Endpoints');
  const aiRecommendations = await testAIRecommendationsAPI();
  const youtubeRecommendations = await testYouTubeRecommendationsAPI();
  
  // Summary
  console.log('\n' + '=' .repeat(60));
  console.log('📊 TEST RESULTS SUMMARY');
  console.log('=' .repeat(60));
  console.log(`🤖 Gemini API: ${geminiDirect ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`🎬 YouTube API: ${youtubeDirect ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`🧠 AI Recommendations: ${aiRecommendations ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`📺 YouTube Recommendations: ${youtubeRecommendations ? '✅ PASS' : '❌ FAIL'}`);
  
  const allPassed = geminiDirect && youtubeDirect && aiRecommendations && youtubeRecommendations;
  console.log(`\n🎯 Overall Status: ${allPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}`);
  
  if (!allPassed) {
    console.log('\n🔧 Troubleshooting Tips:');
    if (!geminiDirect) {
      console.log('• Check GEMINI_API_KEY in .env file');
      console.log('• Verify API key at https://makersuite.google.com/app/apikey');
    }
    if (!youtubeDirect) {
      console.log('• Check YOUTUBE_API_KEY in .env file');
      console.log('• Verify API key at https://console.cloud.google.com/apis/credentials');
      console.log('• Ensure YouTube Data API v3 is enabled');
    }
    if (!aiRecommendations || !youtubeRecommendations) {
      console.log('• Ensure development server is running (npm run dev)');
      console.log('• Check server logs for errors');
    }
  }
  
  console.log('\n🎉 Testing completed!');
}

// Run the tests
testAllAPIs().catch(console.error); 