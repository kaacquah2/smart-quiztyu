# AI Services Setup Guide

This guide covers the setup and configuration of AI services for the Smart Quiz System.

## Current AI Services

### 1. Google Gemini AI (Study Plans) ✅ **ACTIVE**
- **Purpose**: Enhanced study plan generation
- **API Key**: `GEMINI_API_KEY` in `.env`
- **Model**: `gemini-2.0-flash` (default) or `gemini-2.0-pro`
- **Endpoint**: `/api/gemini-study-plan`

### 2. DeepSeek AI (Recommendations) ✅ **ACTIVE**
- **Purpose**: AI-powered resource recommendations
- **API Key**: `DEEPSEEK_API_KEY` in `.env`
- **Model**: `deepseek-chat` (default) or `deepseek-coder`
- **Endpoint**: `/api/ai-recommendations`

### 3. YouTube API (Video Resources) ✅ **ACTIVE**
- **Purpose**: Educational video recommendations
- **API Key**: `YOUTUBE_API_KEY` in `.env`
- **Endpoint**: `/api/youtube-recommendations`

## Setup Instructions

### 1. Environment Variables ✅ **COMPLETE**
All required environment variables are configured in `.env`:

```env
# Google Gemini Configuration (for Study Plans ONLY)
GEMINI_API_KEY="your-gemini-api-key-here"
GEMINI_MODEL="gemini-2.0-flash"

# DeepSeek Configuration (for AI Recommendations)
DEEPSEEK_API_KEY="your-deepseek-api-key-here"
DEEPSEEK_MODEL="deepseek-chat"

# YouTube API Configuration
YOUTUBE_API_KEY="your-youtube-api-key-here"
```

### 2. Implementation ✅ **COMPLETE**
- **Study Plans**: Enhanced with Gemini AI + Basic algorithm fallback
- **Recommendations**: AI-powered with DeepSeek + YouTube integration
- **Quiz Generation**: Basic algorithm only (no AI generation)

### 3. Features
- **AI-Enhanced Study Plans**: Personalized learning paths with Gemini AI
- **Smart Recommendations**: Context-aware resource suggestions
- **Video Integration**: Educational YouTube content recommendations
- **Fallback Systems**: Robust fallbacks when AI services are unavailable

## Testing

### Test Study Plans (Gemini)
```bash
curl -X POST http://localhost:3000/api/gemini-study-plan \
  -H "Content-Type: application/json" \
  -d '{
    "quizId": "intro-programming",
    "score": 7,
    "totalQuestions": 10,
    "courseId": "intro-programming",
    "courseTitle": "Introduction to Programming"
  }'
```

### Test AI Recommendations (DeepSeek)
```bash
curl -X GET "http://localhost:3000/api/ai-recommendations?quizId=intro-programming&score=7&total=10"
```

## Current Status Summary

- ✅ **Gemini Study**: Active for study plans
- ✅ **DeepSeek**: Active for recommendations
- ✅ **YouTube**: Active for video resources
- ✅ **Basic Algorithm**: Fallback for study plans and quiz generation

The system is configured with AI services for enhanced study plans and recommendations, while maintaining reliable basic algorithms for core functionality. 