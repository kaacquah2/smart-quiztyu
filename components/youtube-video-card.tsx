"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Play, Eye, Calendar, Clock } from "lucide-react"
import Image from "next/image"

interface YouTubeVideoCardProps {
  video: {
    id: string
    title: string
    description: string
    url: string
    thumbnail: string
    channelTitle: string
    duration: string
    viewCount: string
    publishedAt: string
    difficulty?: string
    tags?: string[]
  }
  showMetadata?: boolean
  compact?: boolean
}

export function YouTubeVideoCard({ video, showMetadata = true, compact = false }: YouTubeVideoCardProps) {
  const handleWatchClick = () => {
    window.open(video.url, '_blank')
  }

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }

  if (compact) {
    return (
      <Card className="overflow-hidden hover:shadow-md transition-shadow">
        <div className="flex">
          <div className="relative w-32 h-20 flex-shrink-0">
            <Image
              src={video.thumbnail}
              alt={video.title}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
              <Play className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="flex-1 p-3">
            <CardTitle className="text-sm font-medium line-clamp-2 mb-1">
              {truncateText(video.title, 60)}
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground mb-2">
              {video.channelTitle}
            </CardDescription>
            {showMetadata && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{video.duration}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  <span>{video.viewCount}</span>
                </div>
              </div>
            )}
          </div>
        </div>
        <CardFooter className="p-3 pt-0">
          <Button size="sm" onClick={handleWatchClick} className="w-full">
            <Play className="h-4 w-4 mr-1" />
            Watch
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <Image
          src={video.thumbnail}
          alt={video.title}
          width={400}
          height={225}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-2 right-2">
          <Badge variant="secondary" className="bg-black bg-opacity-75 text-white">
            {video.duration}
          </Badge>
        </div>
        <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
          <Play className="h-12 w-12 text-white opacity-0 hover:opacity-100 transition-opacity" />
        </div>
      </div>
      
      <CardHeader className="pb-3">
        <CardTitle className="text-lg line-clamp-2 leading-tight">
          {video.title}
        </CardTitle>
        <CardDescription className="text-sm line-clamp-2">
          {truncateText(video.description, 120)}
        </CardDescription>
      </CardHeader>

      <CardContent className="pb-3">
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
          <span className="font-medium text-foreground">{video.channelTitle}</span>
          {video.difficulty && (
            <Badge variant="outline" className="text-xs">
              {video.difficulty}
            </Badge>
          )}
        </div>

        {showMetadata && (
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              <span>{video.viewCount}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{video.publishedAt}</span>
            </div>
          </div>
        )}

        {video.tags && video.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {video.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>

      <CardFooter>
        <Button onClick={handleWatchClick} className="w-full">
          <Play className="h-4 w-4 mr-2" />
          Watch on YouTube
          <ExternalLink className="h-4 w-4 ml-2" />
        </Button>
      </CardFooter>
    </Card>
  )
} 