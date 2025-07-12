"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  ExternalLink, 
  BookOpen, 
  Video, 
  FileText, 
  Lightbulb, 
  Clock, 
  Star,
  TrendingUp,
  Brain,
  GraduationCap
} from "lucide-react"

interface Resource {
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
  reason?: string
  priority?: number
}

interface RecommendedResourcesProps {
  quizId?: string
  courseId?: string
  programId?: string
  score?: number
  totalQuestions?: number
  limit?: number
  showReason?: boolean
  compact?: boolean
  title?: string
  description?: string
}

export function RecommendedResources({
  quizId,
  courseId,
  programId,
  score,
  totalQuestions,
  limit = 3,
  showReason = true,
  compact = false,
  title = "Recommended Resources",
  description = "Personalized learning resources to help you improve"
}: RecommendedResourcesProps) {
  const [resources, setResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchResources = async () => {
      try {
        setLoading(true)
        setError(null)

        let url = '/api/recommendations?'
        
        if (quizId && score !== undefined && totalQuestions !== undefined) {
          // Get AI-powered recommendations based on quiz performance
          url += `quizId=${quizId}&score=${score}&total=${totalQuestions}&includeYouTube=true&includeCurated=true`
        } else if (courseId) {
          // Get resources for a specific course
          url += `courseId=${courseId}&includeYouTube=true&includeCurated=true`
        } else if (programId) {
          // Get resources for a program
          url += `programId=${programId}&includeYouTube=true&includeCurated=true`
        } else {
          // Get general high-rated resources
          url += 'includeYouTube=true&includeCurated=true&limit=6'
        }

        const response = await fetch(url)
        if (response.ok) {
          const data = await response.json()
          setResources(data.slice(0, limit))
        } else {
          throw new Error('Failed to fetch resources')
        }
      } catch (error) {
        console.error('Error fetching resources:', error)
        setError('Failed to load resources')
      } finally {
        setLoading(false)
      }
    }

    fetchResources()
  }, [quizId, courseId, programId, score, totalQuestions, limit])

  const getResourceIcon = (type: string) => {
    const lowerType = type.toLowerCase()
    if (lowerType.includes("video")) return <Video className="h-4 w-4" />
    if (lowerType.includes("article")) return <FileText className="h-4 w-4" />
    if (lowerType.includes("course")) return <BookOpen className="h-4 w-4" />
    if (lowerType.includes("practice")) return <Brain className="h-4 w-4" />
    return <Lightbulb className="h-4 w-4" />
  }

  const getDifficultyColor = (rating: number) => {
    if (rating >= 4.7) return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300"
    if (rating >= 4.5) return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300"
    return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300"
  }

  const getDifficultyLabel = (rating: number) => {
    if (rating >= 4.7) return "Advanced"
    if (rating >= 4.5) return "Intermediate"
    return "Beginner"
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: limit }).map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Lightbulb className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">{error}</p>
            <Button 
              variant="outline" 
              className="mt-2"
              onClick={() => window.location.reload()}
            >
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (resources.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <GraduationCap className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">No resources available for this selection.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (compact) {
    return (
      <div className="space-y-4">
        {resources.map((resource, index) => (
          <div key={resource.id} className="border-b pb-4 last:border-b-0">
            {showReason && resource.reason && (
              <div className="p-2 bg-green-50 dark:bg-green-950/20 rounded-lg mb-2 border-l-4 border-green-500">
                <p className="text-xs text-green-700 dark:text-green-300 font-medium">
                  🤖 AI Recommendation #{resource.priority || index + 1}
                </p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                  {resource.reason}
                </p>
              </div>
            )}
            
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  {getResourceIcon(resource.type)}
                  <p className="font-medium text-sm">{resource.title}</p>
                </div>
                <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                  {resource.description}
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 text-yellow-500 fill-current" />
                    <span>{resource.rating}/5</span>
                  </div>
                  {resource.duration && (
                    <>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{resource.duration}</span>
                      </div>
                    </>
                  )}
                  {resource.platform && (
                    <>
                      <span>•</span>
                      <span className="capitalize">{resource.platform}</span>
                    </>
                  )}
                </div>
              </div>
              <Button size="sm" variant="outline" asChild className="ml-4">
                <a href={resource.url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-3 w-3 mr-1" />
                  View
                </a>
              </Button>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-primary" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {resources.map((resource) => (
            <Card key={resource.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                {showReason && resource.reason && (
                  <div className="p-2 bg-green-50 dark:bg-green-950/20 rounded-lg mb-3 border-l-4 border-green-500">
                    <p className="text-xs text-green-700 dark:text-green-300 font-medium">
                      🤖 AI Recommendation #{resource.priority || 1}
                    </p>
                    <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                      {resource.reason}
                    </p>
                  </div>
                )}
                
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getResourceIcon(resource.type)}
                    <Badge variant="outline" className={getDifficultyColor(resource.rating)}>
                      {getDifficultyLabel(resource.rating)}
                    </Badge>
                  </div>
                  {resource.platform && (
                    <Badge variant="secondary" className="text-xs">
                      {resource.platform}
                    </Badge>
                  )}
                </div>
                
                <h4 className="font-medium text-sm mb-1 line-clamp-2">{resource.title}</h4>
                <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{resource.description}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 text-yellow-500 fill-current" />
                    <span className="text-xs text-muted-foreground">{resource.rating}/5</span>
                  </div>
                  <Button size="sm" variant="outline" asChild>
                    <a href={resource.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Study
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
