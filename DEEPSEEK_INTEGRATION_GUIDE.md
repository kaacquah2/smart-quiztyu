# DeepSeek Integration Guide

## Overview

This guide explains the integration of DeepSeek API for AI recommendations in the Smart Quiztyu platform. The system now uses:
- **DeepSeek API** for AI-powered learning recommendations
- **Gemini API** for study plan generation

This separation allows each AI service to specialize in its strengths while providing comprehensive educational support.

## Architecture

### AI Service Distribution

```
┌─────────────────┐    ┌─────────────────┐
│   DeepSeek API  │    │   Gemini API    │
│                 │    │                 │
│ • AI Learning   │    │ • Study Plans   │
│   Recommendations│    │ • Course        │
│ • Personalized  │    │   Strategies    │
│   Suggestions   │    │ • Time          │
│ • Resource      │    │   Allocation    │
│   Matching      │    │ • Progress      │
│                 │    │   Tracking      │
└─────────────────┘    └─────────────────┘
```

## DeepSeek AI Recommendations

### Features

- **Personalized Learning Paths**: AI-generated recommendations based on quiz performance
- **Course-Specific Suggestions**: Tailored resources for specific courses and topics
- **Performance-Based Filtering**: Recommendations adapt to student performance levels
- **Multi-Format Resources**: Videos, articles, practice exercises, courses, and books
- **Priority-Based Ranking**: Intelligent prioritization of learning resources
- **Time Estimation**: Estimated time commitment for each resource
- **Reasoning**: Clear explanations for why each resource is recommended

### API Endpoints

#### 1. Dedicated DeepSeek Recommendations API
```http
POST /api/deepseek-recommendations
```

**Request Body:**
```json
{
  "courseId": "data-structures",
  "quizResults": [
    {
      "quizId": "data-structures-basics",
      "courseId": "data-structures",
      "quizTitle": "Data Structures Basics",
      "score": 85,
      "total": 10,
      "strengths": ["Arrays", "Linked Lists"],
      "weaknesses": ["Dynamic Programming", "Graph Algorithms"]
    }
  ]
}
```

**Response:**
```json
{
  "recommendations": [
    {
      "title": "Advanced Data Structures Course",
      "description": "Comprehensive course covering dynamic programming and graph algorithms",
      "resourceType": "Course",
      "difficulty": "Advanced",
      "url": "https://example.com/course",
      "reasoning": "Based on your 85% score, you're ready for advanced concepts. This course will help you master the areas where you struggled.",
      "priority": 1,
      "estimatedTime": "8 hours",
      "tags": ["data-structures", "algorithms", "advanced"]
    }
  ],
  "generatedBy": "DeepSeek AI",
  "enhanced": true
}
```

#### 2. Updated AI Recommendations API (with DeepSeek)
```http
POST /api/ai-recommendations
```

**Request Body:**
```json
{
  "courseId": "algorithms",
  "useDeepSeek": true,
  "quizResults": [
    {
      "quizId": "algorithms-basics",
      "courseId": "algorithms",
      "score": 70,
      "total": 10,
      "strengths": ["Sorting", "Searching"],
      "weaknesses": ["Complexity Analysis", "Recursion"]
    }
  ]
}
```

### Recommendation Types

#### 1. Course-Specific Recommendations
- **Purpose**: Generate recommendations for a specific course
- **Input**: Course ID and quiz results
- **Output**: 5 prioritized learning resources
- **Features**: Performance-based filtering, strength/weakness analysis

#### 2. Filtered Recommendations
- **Purpose**: Generate recommendations across multiple courses based on filters
- **Input**: Program, year, semester filters + quiz results
- **Output**: Course-wise recommendations with performance analysis
- **Features**: Multi-course support, priority ranking

#### 3. General Recommendations
- **Purpose**: Generate broad learning recommendations based on user profile
- **Input**: User profile, interests, recent topics, quiz history
- **Output**: Personalized learning path recommendations
- **Features**: Interest-based matching, learning style consideration

## Configuration

### Environment Variables

Add to your `.env` file:

```env
# DeepSeek Configuration (for AI Recommendations)
DEEPSEEK_API_KEY="your-deepseek-api-key-here"
DEEPSEEK_MODEL="deepseek-chat"  # or "deepseek-coder" for coding-specific recommendations

# Google Gemini Configuration (for Study Plans)
GEMINI_API_KEY="your-gemini-api-key-here"
GEMINI_MODEL="gemini-2.0-flash"
```

### API Key Setup

1. **DeepSeek API Key**:
   - Visit [DeepSeek Platform](https://platform.deepseek.com/)
   - Create an account and generate an API key
   - Add the key to your `.env` file

2. **Gemini API Key** (existing):
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Generate or use existing API key
   - Already configured in your project

## Usage Examples

### Frontend Integration

```typescript
// Fetch DeepSeek recommendations
const fetchDeepSeekRecommendations = async (courseId: string, quizResults: any[]) => {
  const response = await fetch('/api/deepseek-recommendations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      courseId,
      quizResults
    })
  });
  
  return response.json();
};

// Fetch study plan with Gemini
const fetchStudyPlan = async (quizId: string, score: number, total: number) => {
  const response = await fetch(`/api/study-plan?quizId=${quizId}&score=${score}&total=${total}&useGemini=true`);
  return response.json();
};
```

### Component Usage

```tsx
// AI Recommendations Component
function AIRecommendations({ courseId, quizResults }) {
  const [recommendations, setRecommendations] = useState([]);
  
  useEffect(() => {
    fetchDeepSeekRecommendations(courseId, quizResults)
      .then(data => setRecommendations(data.recommendations));
  }, [courseId, quizResults]);
  
  return (
    <div>
      <h3>AI-Powered Learning Recommendations</h3>
      {recommendations.map(rec => (
        <div key={rec.title}>
          <h4>{rec.title}</h4>
          <p>{rec.description}</p>
          <p><strong>Reasoning:</strong> {rec.reasoning}</p>
          <p><strong>Time:</strong> {rec.estimatedTime}</p>
          <p><strong>Priority:</strong> {rec.priority}/5</p>
        </div>
      ))}
    </div>
  );
}
```

## Error Handling

### Fallback System

The system includes robust fallback mechanisms:

1. **DeepSeek API Failure**: Falls back to basic recommendation algorithm
2. **Gemini API Failure**: Falls back to basic study plan generation
3. **API Key Issues**: Clear error messages with setup instructions

### Error Responses

```json
{
  "error": "DeepSeek API key not configured. Please set DEEPSEEK_API_KEY in your .env file."
}
```

```json
{
  "error": "DeepSeek API rate limit exceeded. Please try again later."
}
```

## Testing

### Test Scripts

Run the test script to verify integration:

```bash
node test-deepseek-integration.js
```

### Test Coverage

The test script covers:
1. Course-specific recommendations
2. Filtered recommendations
3. General recommendations
4. Updated AI recommendations route
5. Error handling and fallbacks

## Performance Considerations

### API Limits

- **DeepSeek**: Check your plan limits at [DeepSeek Platform](https://platform.deepseek.com/)
- **Gemini**: Check your quota at [Google AI Studio](https://makersuite.google.com/)

### Caching Strategy

Consider implementing caching for:
- Course-specific recommendations (cache for 24 hours)
- User profile recommendations (cache for 1 hour)
- Study plans (cache for 12 hours)

### Rate Limiting

Implement rate limiting to prevent API quota exhaustion:
- Maximum 10 requests per minute per user
- Maximum 100 requests per hour per user

## Best Practices

### 1. API Key Security
- Never commit API keys to version control
- Use environment variables for all API keys
- Rotate keys regularly

### 2. Error Handling
- Always implement fallback mechanisms
- Provide clear error messages to users
- Log errors for debugging

### 3. User Experience
- Show loading states during API calls
- Provide fallback content when AI is unavailable
- Explain the reasoning behind recommendations

### 4. Performance
- Cache recommendations when possible
- Implement request debouncing
- Monitor API usage and costs

## Troubleshooting

### Common Issues

1. **API Key Not Working**:
   - Verify the key is correct
   - Check if the key has the right permissions
   - Ensure the key is properly set in environment variables

2. **Rate Limiting**:
   - Implement request throttling
   - Add retry logic with exponential backoff
   - Monitor API usage

3. **Poor Recommendations**:
   - Check the quality of input data
   - Verify quiz results are accurate
   - Review the prompt engineering

### Debug Mode

Enable debug logging by setting:
```env
DEBUG=true
```

This will log detailed information about API calls and responses.

## Future Enhancements

### Planned Features

1. **Multi-Model Support**: Support for different DeepSeek models
2. **A/B Testing**: Compare recommendation quality between models
3. **User Feedback**: Collect feedback on recommendation quality
4. **Personalization**: Learn from user interactions
5. **Offline Mode**: Cache recommendations for offline use

### Integration Opportunities

1. **Learning Analytics**: Track recommendation effectiveness
2. **Adaptive Learning**: Adjust recommendations based on progress
3. **Social Learning**: Share recommendations between students
4. **Content Curation**: Automatically curate new learning resources

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review API documentation
3. Test with the provided test scripts
4. Check server logs for detailed error information

---

This integration provides a powerful combination of AI services, with DeepSeek specializing in intelligent learning recommendations and Gemini handling comprehensive study planning. 