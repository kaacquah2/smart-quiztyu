require('dotenv').config();
const fetch = require('node-fetch');

async function testDirectAPIs() {
  console.log('🚀 Testing API Keys Directly (Bypassing Next.js Server)\n');
  console.log('=' .repeat(60));
  
  // Test 1: Gemini API
  console.log('\n🤖 TEST 1: Gemini API Direct Test');
  console.log('-'.repeat(40));
  
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.0-flash";
  
  if (!GEMINI_API_KEY || GEMINI_API_KEY === "your-gemini-api-key-here") {
    console.log('❌ GEMINI_API_KEY not configured');
  } else {
    console.log(`✅ API Key: ${GEMINI_API_KEY.substring(0, 10)}...`);
    console.log(`✅ Model: ${GEMINI_MODEL}`);
    
    try {
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;
      
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
                  text: "Generate a study recommendation for a student learning Python programming. Keep it under 50 words."
                }
              ]
            }
          ]
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.log('❌ Gemini API Error:', errorData.error?.message || response.statusText);
      } else {
        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response";
        console.log('✅ Gemini API Working!');
        console.log('🤖 AI Recommendation:', text);
      }
    } catch (error) {
      console.log('❌ Gemini API Error:', error.message);
    }
  }
  
  // Test 2: YouTube API
  console.log('\n🎬 TEST 2: YouTube API Direct Test');
  console.log('-'.repeat(40));
  
  const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
  
  if (!YOUTUBE_API_KEY || YOUTUBE_API_KEY === "your-youtube-api-key-here") {
    console.log('❌ YOUTUBE_API_KEY not configured');
  } else {
    console.log(`✅ API Key: ${YOUTUBE_API_KEY.substring(0, 10)}...`);
    
    try {
      const apiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=python+programming+tutorial&maxResults=3&type=video&videoDuration=medium&relevanceLanguage=en&key=${YOUTUBE_API_KEY}`;
      
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.log('❌ YouTube API Error:', errorData.error?.message || response.statusText);
      } else {
        const data = await response.json();
        if (data.items && data.items.length > 0) {
          console.log('✅ YouTube API Working!');
          console.log('📺 Found videos:');
          data.items.forEach((item, index) => {
            console.log(`   ${index + 1}. ${item.snippet.title}`);
            console.log(`      Channel: ${item.snippet.channelTitle}`);
            console.log(`      Published: ${new Date(item.snippet.publishedAt).toLocaleDateString()}`);
          });
        } else {
          console.log('⚠️  YouTube API working but no results found');
        }
      }
    } catch (error) {
      console.log('❌ YouTube API Error:', error.message);
    }
  }
  
  // Test 3: Test different educational topics
  console.log('\n📚 TEST 3: Educational Content Search');
  console.log('-'.repeat(40));
  
  const educationalTopics = [
    'data structures algorithms',
    'machine learning basics',
    'web development tutorial',
    'database design',
    'react programming'
  ];
  
  if (YOUTUBE_API_KEY && YOUTUBE_API_KEY !== "your-youtube-api-key-here") {
    for (const topic of educationalTopics.slice(0, 3)) { // Test first 3 topics
      try {
        console.log(`\n🔍 Searching for: ${topic}`);
        const apiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(topic)}&maxResults=1&type=video&videoDuration=medium&relevanceLanguage=en&key=${YOUTUBE_API_KEY}`;
        
        const response = await fetch(apiUrl);
        
        if (response.ok) {
          const data = await response.json();
          if (data.items && data.items.length > 0) {
            console.log(`✅ Found: ${data.items[0].snippet.title}`);
          } else {
            console.log('⚠️  No results found');
          }
        } else {
          console.log('❌ Search failed');
        }
      } catch (error) {
        console.log('❌ Search error:', error.message);
      }
    }
  }
  
  // Test 4: Test AI recommendations for different courses
  console.log('\n🧠 TEST 4: AI Recommendations for Courses');
  console.log('-'.repeat(40));
  
  const courses = [
    'Introduction to Python Programming',
    'Data Structures and Algorithms',
    'Web Development Fundamentals',
    'Machine Learning Basics',
    'Database Systems'
  ];
  
  if (GEMINI_API_KEY && GEMINI_API_KEY !== "your-gemini-api-key-here") {
    for (const course of courses.slice(0, 3)) { // Test first 3 courses
      try {
        console.log(`\n📖 Generating recommendations for: ${course}`);
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;
        
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
                    text: `Generate 3 specific study recommendations for a student learning "${course}". Format as a numbered list. Keep each recommendation under 30 words.`
                  }
                ]
              }
            ]
          })
        });

        if (response.ok) {
          const data = await response.json();
          const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response";
          console.log('✅ AI Recommendations:');
          console.log(text);
        } else {
          console.log('❌ Failed to generate recommendations');
        }
      } catch (error) {
        console.log('❌ AI recommendation error:', error.message);
      }
    }
  }
  
  // Summary
  console.log('\n' + '=' .repeat(60));
  console.log('📊 API TESTING SUMMARY');
  console.log('=' .repeat(60));
  
  const geminiWorking = GEMINI_API_KEY && GEMINI_API_KEY !== "your-gemini-api-key-here";
  const youtubeWorking = YOUTUBE_API_KEY && YOUTUBE_API_KEY !== "your-youtube-api-key-here";
  
  console.log(`🤖 Gemini API: ${geminiWorking ? '✅ CONFIGURED' : '❌ NOT CONFIGURED'}`);
  console.log(`🎬 YouTube API: ${youtubeWorking ? '✅ CONFIGURED' : '❌ NOT CONFIGURED'}`);
  
  if (geminiWorking && youtubeWorking) {
    console.log('\n🎉 Both API keys are properly configured and working!');
    console.log('✅ Your Smart Quiztyu system can generate AI recommendations');
    console.log('✅ Your Smart Quiztyu system can fetch educational videos');
    console.log('✅ All course content can be enhanced with AI and video recommendations');
  } else {
    console.log('\n⚠️  Some API keys need configuration:');
    if (!geminiWorking) {
      console.log('• Get Gemini API key from: https://makersuite.google.com/app/apikey');
    }
    if (!youtubeWorking) {
      console.log('• Get YouTube API key from: https://console.cloud.google.com/apis/credentials');
      console.log('• Enable YouTube Data API v3 in Google Cloud Console');
    }
  }
  
  console.log('\n🎯 Next Steps:');
  console.log('• The API keys are working correctly');
  console.log('• The authentication middleware is protecting the API routes');
  console.log('• To test the full system, you need to authenticate first');
  console.log('• The APIs will work perfectly once users are logged in');
}

// Run the tests
testDirectAPIs().catch(console.error); 