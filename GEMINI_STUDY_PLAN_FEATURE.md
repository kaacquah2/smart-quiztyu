# Gemini Study Plan Feature

## Overview

The Gemini Study Plan feature enhances the Smart Quiztyu platform by using Google's Gemini AI to generate personalized, intelligent study plans for students after completing quizzes. This feature provides comprehensive, AI-powered recommendations that adapt to each student's performance level and learning needs across all courses and programs.

## Features

### 🎯 Enhanced Study Plans
- **Personalized Advice**: AI-generated advice based on quiz performance
- **Focus Areas**: Specific topics and concepts to concentrate on
- **Time Allocation**: Recommended time distribution across different study activities
- **Weekly Goals**: Actionable weekly objectives to achieve improvement
- **Resource Recommendations**: Curated learning resources categorized by type
- **Progress Tracking**: Estimated improvement timelines and next milestones

### 📚 Multi-Course Support
- **All Programs**: Computer Science, Electrical Engineering, Business Administration, Nursing
- **All Courses**: Every course in the curriculum has enhanced study plans
- **Performance-Based**: Adapts recommendations based on quiz scores (0-100%)
- **Program-Specific**: Tailored advice for each academic program

### 🤖 AI-Powered Intelligence
- **Gemini Integration**: Uses Google's Gemini 2.0 Flash model
- **Context-Aware**: Considers course content, available resources, and student performance
- **Fallback System**: Gracefully falls back to basic plans if AI is unavailable
- **Real-time Generation**: Creates fresh, personalized plans for each quiz attempt

## Technical Implementation

### API Endpoints

#### 1. Enhanced Study Plan API
```http
POST /api/study-plan
GET /api/study-plan?quizId={id}&score={score}&total={total}&useGemini=true
```

**Request Body:**
```json
{
  "quizId": "intro-to-cs",
  "score": 3,
  "totalQuestions": 5,
  "programId": "computer-science",
  "useGemini": true
}
```

**Response:**
```json
{
  "success": true,
  "studyPlan": {
    "courseTitle": "Introduction to Computer Science",
    "currentLevel": "Intermediate",
    "targetScore": 80,
    "programId": "computer-science",
    "studySteps": ["Review foundational concepts", "Practice with examples"],
    "personalizedAdvice": "You're on the right track with 60%! Focus on understanding core concepts...",
    "focusAreas": ["Algorithm complexity", "Data structures", "Problem-solving techniques"],
    "timeAllocation": {
      "conceptReview": 25,
      "practiceProblems": 35,
      "advancedTopics": 25,
      "realWorldApplications": 15
    },
    "weeklyGoals": ["Complete 3 practice sessions", "Review 2 key concepts"],
    "resources": {
      "primary": ["Course materials", "Practice exercises"],
      "supplementary": ["Online tutorials"],
      "practice": ["Mock quizzes"]
    },
    "estimatedImprovement": "15-20% improvement in 2 weeks",
    "nextMilestone": "Master intermediate concepts",
    "generatedBy": "Gemini AI",
    "enhanced": true
  }
}
```

#### 2. Dedicated Gemini Study Plan API
```http
POST /api/gemini-study-plan
GET /api/gemini-study-plan?quizId={id}&score={score}&total={total}
```

**Multi-Course Request:**
```json
{
  "multipleQuizzes": [
    {
      "quizId": "intro-to-cs",
      "score": 3,
      "totalQuestions": 5,
      "courseId": "intro-to-cs",
      "programId": "computer-science",
      "courseTitle": "Introduction to Computer Science"
    }
  ]
}
```

**Program-Wide Request:**
```json
{
  "programWide": {
    "programId": "computer-science",
    "quizResults": [
      {
        "quizId": "intro-to-cs",
        "score": 3,
        "totalQuestions": 5,
        "courseId": "intro-to-cs",
        "courseTitle": "Introduction to Computer Science"
      }
    ]
  }
}
```

### Core Services

#### 1. Gemini Study Plan Service (`lib/gemini-study-plan-service.ts`)
- **`generateGeminiStudyPlan()`**: Creates personalized study plans using Gemini AI
- **`generateMultiCourseStudyPlan()`**: Generates plans for multiple courses
- **`generateProgramStudyPlan()`**: Creates comprehensive program-wide plans
- **`createStudyPlanPrompt()`**: Builds intelligent prompts for Gemini
- **`parseGeminiResponse()`**: Parses and validates AI responses

#### 2. Enhanced Resource Service (`lib/resource-service.ts`)
- **`quizToCourseMapping`**: Maps quiz IDs to course IDs
- **`getResourcesForCourse()`**: Retrieves available learning resources
- **`generateAIRecommendations()`**: Creates resource recommendations

### Frontend Integration

#### Results Page (`app/results/[id]/page.tsx`)
- **Enhanced Study Plan Display**: Shows all Gemini features when available
- **Fallback Support**: Gracefully handles basic plans when AI is unavailable
- **Visual Indicators**: Shows "AI Enhanced" badge for Gemini-generated plans
- **Comprehensive UI**: Displays time allocation, focus areas, weekly goals, etc.

## Configuration

### Environment Variables
```env
# Required for Gemini functionality
GEMINI_API_KEY=your-gemini-api-key-here
GEMINI_MODEL=gemini-2.0-flash

# Optional: YouTube API for enhanced resource recommendations
YOUTUBE_API_KEY=your-youtube-api-key-here
```

### API Key Setup
1. Get Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Add to `.env` file
3. Restart the development server

## Usage Examples

### Basic Study Plan Generation
```javascript
// Fetch enhanced study plan for a quiz
const response = await fetch('/api/study-plan', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    quizId: 'intro-to-cs',
    score: 3,
    totalQuestions: 5,
    useGemini: true
  })
});

const data = await response.json();
const studyPlan = data.studyPlan;
```

### Multi-Course Study Plans
```javascript
// Generate plans for multiple courses
const response = await fetch('/api/gemini-study-plan', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    multipleQuizzes: [
      { quizId: 'intro-to-cs', score: 3, totalQuestions: 5, courseId: 'intro-to-cs', programId: 'computer-science' },
      { quizId: 'data-structures', score: 4, totalQuestions: 5, courseId: 'data-structures', programId: 'computer-science' }
    ]
  })
});
```

## Performance Levels

### Beginner (0-39%)
- **Focus**: Foundational concepts and basic principles
- **Advice**: Build strong base, understand core terminology
- **Resources**: Introduction materials, basic tutorials
- **Goals**: Establish consistent study routine

### Intermediate (40-69%)
- **Focus**: Practice problems and concept connections
- **Advice**: Strengthen understanding, fill knowledge gaps
- **Resources**: Practice exercises, comprehensive materials
- **Goals**: Master intermediate concepts

### Advanced (70-100%)
- **Focus**: Advanced applications and real-world projects
- **Advice**: Explore advanced topics, consider mentoring others
- **Resources**: Advanced materials, real-world applications
- **Goals**: Achieve mastery and prepare for advanced studies

## Testing

### Run Comprehensive Tests
```bash
# Test Gemini study plan functionality
node test-gemini-study-plan.js

# Test all APIs including Gemini
node test-all-apis-comprehensive.js

# Test basic study plan functionality
node test-final-study-plan.js
```

### Test Coverage
- ✅ Single course study plan generation
- ✅ Multi-course study plan generation
- ✅ Program-wide study plan generation
- ✅ Performance level detection
- ✅ Program-specific customization
- ✅ Enhanced feature validation
- ✅ Fallback mechanism testing
- ✅ API error handling

## Benefits

### For Students
- **Personalized Learning**: Tailored advice based on individual performance
- **Clear Roadmap**: Specific steps and goals for improvement
- **Resource Guidance**: Curated learning materials for their level
- **Progress Tracking**: Estimated timelines and milestones

### For Educators
- **Automated Support**: AI-powered study plan generation
- **Comprehensive Coverage**: All courses and programs supported
- **Performance Insights**: Detailed analysis of student needs
- **Resource Optimization**: Efficient use of available learning materials

### For the Platform
- **Enhanced User Experience**: More engaging and helpful results
- **Scalability**: AI handles complex personalization automatically
- **Reliability**: Fallback system ensures functionality even without AI
- **Future-Proof**: Easy to extend with additional AI features

## Troubleshooting

### Common Issues

#### 1. Gemini API Key Not Configured
```
Error: Gemini API key not configured
Solution: Set GEMINI_API_KEY in .env file
```

#### 2. API Rate Limits
```
Error: Gemini API rate limit exceeded
Solution: Wait and retry, or upgrade API quota
```

#### 3. Fallback to Basic Plans
```
Warning: Falling back to basic study plan
Solution: Check Gemini API key and network connectivity
```

### Debug Mode
Enable detailed logging by setting:
```env
DEBUG_GEMINI=true
```

## Future Enhancements

### Planned Features
- **Learning Path Integration**: Connect study plans across courses
- **Adaptive Difficulty**: Adjust quiz difficulty based on study plan progress
- **Social Learning**: Share study plans with peers
- **Progress Analytics**: Track improvement against study plan goals
- **Mobile Optimization**: Enhanced mobile study plan experience

### AI Improvements
- **Multi-Modal Support**: Include images and diagrams in recommendations
- **Conversational Interface**: Chat-based study plan refinement
- **Predictive Analytics**: Anticipate learning needs before quizzes
- **Personalized Content**: Generate custom practice questions

## Support

For technical support or feature requests:
1. Check the troubleshooting section above
2. Review the test scripts for validation
3. Verify API key configuration
4. Test with the provided examples

The Gemini Study Plan feature represents a significant enhancement to the Smart Quiztyu platform, providing students with intelligent, personalized learning guidance that adapts to their individual needs and performance levels. 