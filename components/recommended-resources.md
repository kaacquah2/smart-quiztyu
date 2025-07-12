# RecommendedResources Component

A dynamic, AI-powered resource recommendation component that connects to your webapp's sophisticated resource system.

## Overview

The `RecommendedResources` component replaces the old static component with a fully dynamic system that:

- **Fetches real resources** from your database and API endpoints
- **Provides AI-powered recommendations** based on quiz performance
- **Supports multiple contexts** (quiz results, course pages, program overviews)
- **Offers flexible layouts** (card grid, compact list)
- **Includes loading states and error handling**

## Features

### 🧠 AI-Powered Recommendations
- Analyzes quiz performance to suggest appropriate resources
- Provides personalized reasoning for each recommendation
- Adapts difficulty level based on user performance

### 📚 Multiple Data Sources
- **Quiz Performance**: Uses quiz results to generate personalized recommendations
- **Course-Specific**: Shows resources curated for specific courses
- **Program-Wide**: Displays resources for entire academic programs
- **General**: Shows high-quality resources across all topics

### 🎨 Flexible Layouts
- **Card Grid**: Beautiful card-based layout for detailed resource display
- **Compact List**: Space-efficient list layout for sidebar or summary views
- **Responsive Design**: Adapts to different screen sizes

### ⚡ Smart Features
- **Loading States**: Skeleton loaders while fetching data
- **Error Handling**: Graceful error states with retry options
- **Resource Icons**: Visual indicators for different resource types
- **Difficulty Badges**: Color-coded difficulty levels
- **Rating Display**: Shows resource ratings and platform information

## Usage Examples

### Quiz Performance Based Recommendations
```tsx
<RecommendedResources 
  quizId="data-structures"
  score={6}
  totalQuestions={10}
  title="Personalized Recommendations"
  description="Based on your quiz performance, here are resources to help you improve"
/>
```

### Course-Specific Resources
```tsx
<RecommendedResources 
  courseId="intro-to-python"
  title="Python Programming Resources"
  description="Curated resources for learning Python programming"
/>
```

### Program-Wide Resources
```tsx
<RecommendedResources 
  programId="computer-science"
  title="Computer Science Resources"
  description="Top resources for computer science students"
/>
```

### Compact Layout
```tsx
<RecommendedResources 
  courseId="web-development"
  compact={true}
  limit={5}
  title="Web Development Resources"
  description="Essential resources for web development"
/>
```

### General Recommendations
```tsx
<RecommendedResources 
  title="Featured Resources"
  description="Hand-picked high-quality learning resources"
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `quizId` | `string` | - | Quiz ID for performance-based recommendations |
| `courseId` | `string` | - | Course ID for course-specific resources |
| `programId` | `string` | - | Program ID for program-wide resources |
| `score` | `number` | - | Quiz score for AI recommendations |
| `totalQuestions` | `number` | - | Total quiz questions |
| `limit` | `number` | `3` | Number of resources to show |
| `showReason` | `boolean` | `true` | Show AI recommendation reasons |
| `compact` | `boolean` | `false` | Use compact layout |
| `title` | `string` | `"Recommended Resources"` | Custom title |
| `description` | `string` | `"Personalized learning resources..."` | Custom description |

## How It Works

### 1. Data Fetching
The component automatically fetches resources based on the provided props:

- **Quiz Performance**: Calls `/api/recommendations` with quiz data for AI-powered recommendations
- **Course/Program**: Fetches resources filtered by course or program ID
- **General**: Retrieves high-rated resources across all topics

### 2. AI Recommendation Logic
When quiz performance data is provided, the component uses sophisticated logic:

- **Poor Performance (< 40%)**: Recommends foundational, beginner-friendly resources
- **Moderate Performance (40-70%)**: Suggests intermediate resources with practice focus
- **Good Performance (> 70%)**: Recommends advanced, comprehensive resources

### 3. Resource Display
Resources are displayed with rich metadata:

- **Type Icons**: Visual indicators (video, course, article, practice)
- **Difficulty Badges**: Color-coded by rating (Beginner/Intermediate/Advanced)
- **Platform Badges**: Shows source platform (YouTube, Coursera, etc.)
- **Rating Display**: Star ratings and view counts
- **AI Reasoning**: Personalized explanations for recommendations

## Integration with Existing Systems

The component seamlessly integrates with your existing resource infrastructure:

- **Database Resources**: Uses the `Resource` model with course mappings
- **Quiz System**: Connects to quiz results and performance analytics
- **API Endpoints**: Leverages existing `/api/recommendations` endpoint
- **Resource Service**: Utilizes `getResourcesForCourse()` and `generateAIRecommendations()`

## Example Page

Visit `/examples/recommended-resources` to see the component in action with different configurations and use cases.

## Migration from Static Component

The old static component had hardcoded resources. The new dynamic component:

1. **Replaces static data** with real database queries
2. **Adds personalization** through AI recommendations
3. **Provides flexibility** through configurable props
4. **Improves UX** with loading states and error handling
5. **Maintains compatibility** with existing usage patterns

## Future Enhancements

Potential improvements for the component:

- **User Preferences**: Remember user's preferred resource types
- **Learning History**: Consider past resource consumption
- **Collaborative Filtering**: Show resources popular with similar students
- **Offline Support**: Cache resources for offline viewing
- **Resource Bookmarking**: Allow users to save favorite resources 