import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bookmark, ExternalLink, Clock, ThumbsUp, Users } from "lucide-react"
import { YouTubeVideoCard } from "@/components/youtube-video-card"

interface ResourceRecommendationProps {
  resource: {
    id: string
    title: string
    description: string
    url: string
    platform: string
    type: string
    category: string
    tags: string[]
    duration: string
    rating: number
    views?: number
    lessons?: number
    videos?: number
    courseIds: string[]
    reason: string
    priority: number
    thumbnail?: string
    channelTitle?: string
    viewCount?: string
    publishedAt?: string
  }
  showReason?: boolean
  compact?: boolean
}

export function ResourceRecommendationCard({ 
  resource, 
  showReason = true, 
  compact = false 
}: ResourceRecommendationProps) {
  const isYouTube = resource.platform === 'youtube' && resource.thumbnail

  if (isYouTube) {
    return (
      <div className="space-y-2">
        {showReason && (
          <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border-l-4 border-green-500">
            <p className="text-sm text-green-700 dark:text-green-300 font-medium">
              🤖 AI Recommendation #{resource.priority}
            </p>
            <p className="text-xs text-green-600 dark:text-green-400 mt-1">
              {resource.reason}
            </p>
          </div>
        )}
        <YouTubeVideoCard
          video={{
            id: resource.id,
            title: resource.title,
            description: resource.description,
            url: resource.url,
            thumbnail: resource.thumbnail || '',
            channelTitle: resource.channelTitle || 'YouTube',
            duration: resource.duration || 'Unknown',
            viewCount: resource.viewCount || '0',
            publishedAt: resource.publishedAt || '',
            difficulty: resource.rating >= 4.7 ? "advanced" : resource.rating >= 4.5 ? "intermediate" : "beginner",
            tags: resource.tags
          }}
          compact={compact}
        />
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {showReason && (
        <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border-l-4 border-green-500">
          <p className="text-sm text-green-700 dark:text-green-300 font-medium">
            🤖 AI Recommendation #{resource.priority}
          </p>
          <p className="text-xs text-green-600 dark:text-green-400 mt-1">
            {resource.reason}
          </p>
        </div>
      )}
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg">{resource.title}</CardTitle>
              <CardDescription className="mt-1">{resource.description}</CardDescription>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Bookmark className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex flex-wrap gap-2 mb-3">
            <Badge variant="outline" className="text-xs">
              {resource.platform ? resource.platform.charAt(0).toUpperCase() + resource.platform.slice(1) : 'Unknown'}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
            </Badge>
            {resource.duration && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {resource.duration}
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
            <div className="flex items-center gap-1">
              <ThumbsUp className="h-3 w-3" />
              <span>{resource.rating}/5</span>
            </div>
            {resource.views && (
              <div className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                <span>{resource.views.toLocaleString()} views</span>
              </div>
            )}
            {resource.lessons && (
              <span>{resource.lessons} lessons</span>
            )}
            {resource.videos && (
              <span>{resource.videos} videos</span>
            )}
          </div>

          <div className="flex flex-wrap gap-1 mb-3">
            {resource.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center rounded-full border px-2 py-1 text-xs font-semibold text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>

          <Button size="sm" className="gap-1 w-full" asChild>
            <a href={resource.url} target="_blank" rel="noopener noreferrer">
              View Resource <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
} 