# YouTube API Setup Guide

This guide will help you set up the YouTube Data API v3 to enable dynamic video recommendations in your Smart Quiz application.

## Prerequisites

- A Google account
- Access to Google Cloud Console

## Step 1: Create a Google Cloud Project

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Click on "Select a project" at the top of the page
3. Click "New Project"
4. Enter a project name (e.g., "Smart Quiz YouTube API")
5. Click "Create"

## Step 2: Enable YouTube Data API v3

1. In your Google Cloud project, go to the [APIs & Services > Library](https://console.cloud.google.com/apis/library)
2. Search for "YouTube Data API v3"
3. Click on "YouTube Data API v3"
4. Click "Enable"

## Step 3: Create API Credentials

1. Go to [APIs & Services > Credentials](https://console.cloud.google.com/apis/credentials)
2. Click "Create Credentials" > "API Key"
3. Copy the generated API key
4. (Optional) Click on the API key to configure it:
   - Add a name (e.g., "Smart Quiz YouTube API Key")
   - Restrict the key to "YouTube Data API v3" for security

## Step 4: Configure Environment Variables

1. Open your `.env` file in the project root
2. Replace the placeholder with your actual API key:

```env
# YouTube API Configuration
# Get your API key from https://console.cloud.google.com/apis/credentials
# Enable YouTube Data API v3 in Google Cloud Console
YOUTUBE_API_KEY="your-actual-youtube-api-key-here"
```

## Step 5: Test the Integration

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Run the test script to verify the API is working:
   ```bash
   node test-youtube-api.js
   ```

3. Take a quiz and check the results page to see YouTube recommendations

## Features

Once configured, the YouTube API integration provides:

### 🎯 Personalized Recommendations
- Videos are filtered based on quiz performance (beginner/intermediate/advanced)
- Content is matched to quiz topics and tags
- Educational content is prioritized

### 📊 Rich Video Metadata
- Video thumbnails and descriptions
- Channel information and view counts
- Duration and publication dates
- Difficulty badges

### 🔄 Multiple Recommendation Types
- **Educational**: Tutorial-style content for learning
- **Popular**: High-view-count videos for trending topics
- **Recent**: Latest uploads for current information

### 🎨 Beautiful UI Components
- Compact video cards for results pages
- Full-featured cards for resource pages
- Hover effects and play buttons
- Responsive design

## API Endpoints

### GET `/api/youtube-recommendations`
Get YouTube recommendations based on quiz performance:
```
/api/youtube-recommendations?quizId=python-basics&score=7&total=10&maxResults=5
```

### POST `/api/youtube-recommendations`
Get custom YouTube recommendations:
```json
{
  "topic": "Python programming",
  "difficulty": "beginner",
  "maxResults": 5,
  "type": "educational"
}
```

### GET `/api/recommendations`
Combined recommendations (static + YouTube):
```
/api/recommendations?quizId=python-basics&score=7&total=10&includeYouTube=true
```

## Usage Examples

### In Components
```tsx
import { YouTubeVideoCard } from "@/components/youtube-video-card"

// Display a YouTube video recommendation
<YouTubeVideoCard
  video={{
    id: "video-id",
    title: "Python Tutorial for Beginners",
    description: "Learn Python programming from scratch",
    url: "https://www.youtube.com/watch?v=...",
    thumbnail: "https://...",
    channelTitle: "Programming Channel",
    duration: "15:30",
    viewCount: "1.2M views",
    publishedAt: "2024-01-15"
  }}
  compact={true}
/>
```

### Fetching Recommendations
```javascript
// Get recommendations for a quiz
const response = await fetch(
  `/api/recommendations?quizId=${quizId}&score=${score}&total=${total}&includeYouTube=true`
)
const recommendations = await response.json()

// Get specific YouTube recommendations
const response = await fetch('/api/youtube-recommendations', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    topic: 'JavaScript',
    difficulty: 'intermediate',
    type: 'educational'
  })
})
const data = await response.json()
```

## Troubleshooting

### API Key Not Working
- Verify the API key is correct in your `.env` file
- Check that YouTube Data API v3 is enabled in Google Cloud Console
- Ensure the API key has the necessary permissions

### No Recommendations Appearing
- Check the browser console for error messages
- Verify the API key is not the placeholder value
- Test the API endpoints directly using the test script

### Rate Limiting
- YouTube API has daily quotas (typically 10,000 units per day)
- Each search request costs 100 units
- Monitor usage in Google Cloud Console

### CORS Issues
- The API calls are made server-side, so CORS shouldn't be an issue
- If you see CORS errors, check that your development server is running

## Security Considerations

1. **API Key Protection**: Never commit your API key to version control
2. **Key Restrictions**: Restrict your API key to only YouTube Data API v3
3. **Quota Monitoring**: Set up alerts for API usage to avoid unexpected charges
4. **Environment Variables**: Use environment variables for all API keys

## Cost Information

- YouTube Data API v3 is free for the first 10,000 units per day
- Each search request costs 100 units
- Each video details request costs 1 unit
- Monitor usage in Google Cloud Console to avoid charges

## Support

If you encounter issues:
1. Check the browser console for error messages
2. Run the test script to verify API connectivity
3. Check Google Cloud Console for API usage and errors
4. Review the YouTube Data API v3 documentation

For more information, visit:
- [YouTube Data API v3 Documentation](https://developers.google.com/youtube/v3)
- [Google Cloud Console](https://console.cloud.google.com/)
- [API Quotas and Pricing](https://developers.google.com/youtube/v3/getting-started#quota) 