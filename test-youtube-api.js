const fetch = require('node-fetch');

async function testYouTubeAPI() {
  console.log('Testing YouTube API integration...\n');

  // Test 1: YouTube recommendations endpoint
  try {
    console.log('1. Testing YouTube recommendations endpoint...');
    const response = await fetch('http://localhost:3000/api/youtube-recommendations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        topic: 'Python programming',
        difficulty: 'beginner',
        maxResults: 3,
        type: 'educational'
      })
    });

    const data = await response.json();
    
    if (data.error) {
      console.log('❌ Error:', data.error);
    } else {
      console.log('✅ Success! Found', data.recommendations.length, 'recommendations');
      data.recommendations.forEach((rec, index) => {
        console.log(`   ${index + 1}. ${rec.title}`);
        console.log(`      Channel: ${rec.channelTitle}`);
        console.log(`      Duration: ${rec.duration}`);
        console.log(`      Views: ${rec.viewCount}`);
        console.log('');
      });
    }
  } catch (error) {
    console.log('❌ Error testing YouTube recommendations:', error.message);
  }

  // Test 2: Combined recommendations endpoint
  try {
    console.log('2. Testing combined recommendations endpoint...');
    const response = await fetch('http://localhost:3000/api/recommendations?quizId=python-basics&score=7&total=10&includeYouTube=true');
    
    const data = await response.json();
    
    if (Array.isArray(data)) {
      console.log('✅ Success! Found', data.length, 'total recommendations');
      
      const youtubeVideos = data.filter(rec => rec.platform === 'youtube');
      const otherResources = data.filter(rec => rec.platform !== 'youtube');
      
      console.log(`   - YouTube videos: ${youtubeVideos.length}`);
      console.log(`   - Other resources: ${otherResources.length}`);
      
      if (youtubeVideos.length > 0) {
        console.log('\n   YouTube videos found:');
        youtubeVideos.forEach((video, index) => {
          console.log(`   ${index + 1}. ${video.title}`);
        });
      }
    } else {
      console.log('❌ Unexpected response format:', data);
    }
  } catch (error) {
    console.log('❌ Error testing combined recommendations:', error.message);
  }

  // Test 3: Popular videos
  try {
    console.log('\n3. Testing popular videos endpoint...');
    const response = await fetch('http://localhost:3000/api/youtube-recommendations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        topic: 'JavaScript',
        type: 'popular',
        maxResults: 2
      })
    });

    const data = await response.json();
    
    if (data.error) {
      console.log('❌ Error:', data.error);
    } else {
      console.log('✅ Success! Found', data.recommendations.length, 'popular videos');
      data.recommendations.forEach((rec, index) => {
        console.log(`   ${index + 1}. ${rec.title} (${rec.viewCount} views)`);
      });
    }
  } catch (error) {
    console.log('❌ Error testing popular videos:', error.message);
  }

  console.log('\n🎉 YouTube API testing completed!');
}

// Run the test
testYouTubeAPI().catch(console.error); 