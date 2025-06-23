# Gemini AI Quiz Question Generation Feature

## Overview

This feature enables automatic generation of random quiz questions for all courses using Google's Gemini AI. Students will now receive different questions each time they take a quiz, making the learning experience more dynamic and preventing memorization of answers.

## Key Features

### 🎯 AI-Powered Question Generation
- **Gemini AI Integration**: Uses Google's Gemini 2.0 Flash model to generate contextually relevant questions
- **Course-Specific Content**: Questions are tailored to each course's content, difficulty level, and learning objectives
- **Multiple Difficulty Levels**: Supports Beginner, Intermediate, and Advanced question generation
- **Fallback System**: Falls back to basic questions if AI generation fails

### 🔄 Randomization System
- **Question Shuffling**: Questions are randomly shuffled for each quiz attempt
- **Variable Question Count**: Supports different numbers of questions per quiz
- **Fresh Content**: Each quiz attempt provides a unique experience

### 📚 Comprehensive Coverage
- **All Programs**: Covers Computer Science, Electrical Engineering, Business Administration, and Nursing
- **All Courses**: Every course in the curriculum gets AI-generated questions
- **Scalable**: Easy to add new courses and programs

## Technical Implementation

### Core Components

#### 1. Gemini Quiz Service (`lib/gemini-quiz-service.ts`)
```typescript
// Generate questions for a specific course
await generateAndSaveQuizQuestions(courseId, questionCount, difficulty)

// Generate questions for all courses
await generateQuestionsForAllCourses(questionCount)

// Get random questions for a quiz
await getRandomQuizQuestions(courseId, questionCount)
```

#### 2. API Endpoints
- `POST /api/generate-quiz-questions` - Generate new questions
- `GET /api/generate-quiz-questions` - Get course information
- `GET /api/quizzes/[id]?randomize=true` - Get random questions for a quiz

#### 3. Enhanced Quiz Service (`lib/quiz-service.ts`)
```typescript
// Get quiz with random questions
await getQuizWithRandomQuestions(quizId, questionCount)
```

### Database Schema
The existing schema supports the new functionality:
- `Quiz` table stores quiz metadata
- `Question` table stores individual questions
- Questions are linked to quizzes via `quizId`

## Usage

### 1. Generate Questions for All Courses

#### Using the Script
```bash
node scripts/generate-all-quiz-questions.js
```

#### Using the API
```bash
curl -X POST http://localhost:3000/api/generate-quiz-questions \
  -H "Content-Type: application/json" \
  -d '{"generateForAll": true, "questionCount": 10}'
```

### 2. Generate Questions for a Specific Course

```bash
curl -X POST http://localhost:3000/api/generate-quiz-questions \
  -H "Content-Type: application/json" \
  -d '{
    "courseId": "intro-to-cs",
    "questionCount": 10,
    "difficulty": "Intermediate"
  }'
```

### 3. Get Random Questions for a Quiz

```bash
curl "http://localhost:3000/api/quizzes/intro-to-cs?randomize=true&questionCount=5"
```

## Configuration

### Environment Variables
```env
# Required for AI question generation
GEMINI_API_KEY=your-gemini-api-key-here
GEMINI_MODEL=gemini-2.0-flash
```

### Getting a Gemini API Key
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add it to your `.env` file

## Question Generation Process

### 1. AI Prompt Creation
The system creates detailed prompts for Gemini AI including:
- Course title and description
- Program context
- Year and semester information
- Difficulty level
- Specific requirements for question format

### 2. Response Parsing
- Extracts JSON from Gemini response
- Validates question format
- Ensures correct answers match options
- Sanitizes text content

### 3. Database Storage
- Clears existing questions for the course
- Stores new AI-generated questions
- Maintains quiz metadata

### 4. Fallback System
If AI generation fails:
- Uses predefined question templates
- Ensures course-specific content
- Maintains consistent quality

## Question Quality Features

### Content Validation
- **Answer Verification**: Ensures correct answers are among the options
- **Format Consistency**: Maintains 4-option multiple choice format
- **Content Relevance**: Questions are specific to course content
- **Difficulty Appropriateness**: Matches course level and student year

### Educational Best Practices
- **Understanding Focus**: Questions test comprehension rather than memorization
- **Practical Application**: Mix of theoretical and practical questions
- **Balanced Distribution**: Correct answers are well-distributed across options
- **Clear Language**: Questions are written in clear, understandable language

## Testing

### Run the Test Suite
```bash
node test-gemini-quiz-generation.js
```

### Test Coverage
- ✅ Individual course question generation
- ✅ All courses generation
- ✅ Random question retrieval
- ✅ Course listing functionality
- ✅ API error handling
- ✅ Fallback system validation

## Performance Considerations

### API Rate Limits
- Gemini API has rate limits
- Script includes error handling for rate limit exceeded
- Batch processing for multiple courses

### Database Performance
- Efficient question storage and retrieval
- Indexed queries for random selection
- Minimal database overhead

### Caching Strategy
- Questions are generated once and stored
- Random selection happens at retrieval time
- No repeated API calls for the same content

## Monitoring and Maintenance

### Success Metrics
- Question generation success rate
- API response times
- Student quiz completion rates
- Question quality feedback

### Maintenance Tasks
- Regular question regeneration (monthly recommended)
- API key rotation
- Database cleanup of old questions
- Performance monitoring

## Troubleshooting

### Common Issues

#### 1. API Key Not Configured
```
Error: Gemini API key not configured
Solution: Set GEMINI_API_KEY in .env file
```

#### 2. Rate Limit Exceeded
```
Error: API rate limit exceeded
Solution: Wait and retry, or reduce batch size
```

#### 3. Invalid Course ID
```
Error: Course not found
Solution: Verify course ID exists in program data
```

#### 4. Database Connection Issues
```
Error: Database connection failed
Solution: Check DATABASE_URL and database status
```

### Debug Mode
Enable detailed logging by setting:
```env
DEBUG=true
```

## Future Enhancements

### Planned Features
- **Question Difficulty Adaptation**: Adjust difficulty based on student performance
- **Topic-Specific Questions**: Generate questions for specific course topics
- **Multilingual Support**: Generate questions in different languages
- **Question Analytics**: Track question effectiveness and student performance
- **Custom Question Types**: Support for different question formats

### Integration Opportunities
- **Learning Management Systems**: Export questions to LMS platforms
- **Assessment Tools**: Integration with external assessment platforms
- **Analytics Dashboard**: Question performance analytics
- **Student Feedback**: Collect feedback on question quality

## Security Considerations

### API Key Security
- Store API keys in environment variables
- Never commit API keys to version control
- Rotate API keys regularly
- Use least privilege principle

### Data Privacy
- No personal student data sent to AI APIs
- Only course content and metadata used
- Generated questions stored securely
- Compliance with educational data privacy regulations

## Support and Documentation

### Getting Help
- Check the troubleshooting section above
- Review API documentation
- Test with the provided test scripts
- Monitor application logs for errors

### Contributing
- Follow the existing code style
- Add tests for new features
- Update documentation for changes
- Test thoroughly before deployment

---

**Note**: This feature requires a valid Gemini API key to function. Without the API key, the system will fall back to basic question templates. 