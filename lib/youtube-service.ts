interface YouTubeVideo {
  id: string
  title: string
  description: string
  thumbnail: string
  channelTitle: string
  publishedAt: string
  duration: string
  viewCount: string
  likeCount: string
  url: string
}

interface YouTubeSearchResult {
  items: Array<{
    id: {
      videoId: string
    }
    snippet: {
      title: string
      description: string
      thumbnails: {
        medium: {
          url: string
        }
      }
      channelTitle: string
      publishedAt: string
    }
  }>
}

interface YouTubeVideoDetails {
  items: Array<{
    id: string
    contentDetails: {
      duration: string
    }
    statistics: {
      viewCount: string
      likeCount: string
    }
  }>
}

export class YouTubeService {
  private apiKey: string
  private baseUrl = 'https://www.googleapis.com/youtube/v3'

  constructor() {
    this.apiKey = process.env.YOUTUBE_API_KEY || ''
    if (!this.apiKey) {
      console.warn('YouTube API key not configured. YouTube recommendations will be limited.')
    }
  }

  /**
   * Search for YouTube videos based on query and filters
   */
  async searchVideos(
    query: string,
    maxResults: number = 10,
    type: 'video' | 'playlist' | 'channel' = 'video',
    relevanceLanguage: string = 'en',
    videoDuration: 'short' | 'medium' | 'long' | 'any' = 'any',
    videoDefinition: 'high' | 'standard' | 'any' = 'any',
    order: 'relevance' | 'rating' | 'uploadDate' | 'viewCount' = 'relevance'
  ): Promise<YouTubeVideo[]> {
    if (!this.apiKey) {
      throw new Error('YouTube API key not configured')
    }

    try {
      const params = new URLSearchParams({
        part: 'snippet',
        q: query,
        type: type,
        maxResults: maxResults.toString(),
        key: this.apiKey,
        relevanceLanguage,
        order,
      })

      if (videoDuration !== 'any') {
        params.append('videoDuration', videoDuration)
      }

      if (videoDefinition !== 'any') {
        params.append('videoDefinition', videoDefinition)
      }

      const response = await fetch(`${this.baseUrl}/search?${params}`)
      
      if (!response.ok) {
        throw new Error(`YouTube API error: ${response.status} ${response.statusText}`)
      }

      const data: YouTubeSearchResult = await response.json()
      
      if (!data.items || data.items.length === 0) {
        return []
      }

      // Get additional details for videos (duration, view count, like count)
      const videoIds = data.items.map(item => item.id.videoId)
      const videoDetails = await this.getVideoDetails(videoIds)

      return data.items.map((item, index) => {
        const details = videoDetails[index]
        return {
          id: item.id.videoId,
          title: item.snippet.title,
          description: item.snippet.description,
          thumbnail: item.snippet.thumbnails.medium.url,
          channelTitle: item.snippet.channelTitle,
          publishedAt: item.snippet.publishedAt,
          duration: details?.contentDetails?.duration || '',
          viewCount: details?.statistics?.viewCount || '0',
          likeCount: details?.statistics?.likeCount || '0',
          url: `https://www.youtube.com/watch?v=${item.id.videoId}`
        }
      })
    } catch (error) {
      console.error('Error searching YouTube videos:', error)
      throw error
    }
  }

  /**
   * Get detailed information about specific videos
   */
  async getVideoDetails(videoIds: string[]): Promise<YouTubeVideoDetails['items']> {
    if (!this.apiKey) {
      throw new Error('YouTube API key not configured')
    }

    try {
      const params = new URLSearchParams({
        part: 'contentDetails,statistics',
        id: videoIds.join(','),
        key: this.apiKey,
      })

      const response = await fetch(`${this.baseUrl}/videos?${params}`)
      
      if (!response.ok) {
        throw new Error(`YouTube API error: ${response.status} ${response.statusText}`)
      }

      const data: YouTubeVideoDetails = await response.json()
      return data.items || []
    } catch (error) {
      console.error('Error getting video details:', error)
      return []
    }
  }

  /**
   * Get educational videos for a specific topic
   */
  async getEducationalVideos(
    topic: string,
    difficulty: 'beginner' | 'intermediate' | 'advanced' = 'beginner',
    maxResults: number = 5
  ): Promise<YouTubeVideo[]> {
    const difficultyKeywords = {
      beginner: 'tutorial introduction basics',
      intermediate: 'advanced concepts techniques',
      advanced: 'masterclass deep dive expert'
    }

    const query = `${topic} ${difficultyKeywords[difficulty]} educational`
    
    return this.searchVideos(
      query,
      maxResults,
      'video',
      'en',
      'medium',
      'high',
      'relevance'
    )
  }

  /**
   * Get popular videos for a specific topic
   */
  async getPopularVideos(
    topic: string,
    maxResults: number = 5
  ): Promise<YouTubeVideo[]> {
    const query = `${topic} tutorial`
    
    return this.searchVideos(
      query,
      maxResults,
      'video',
      'en',
      'any',
      'any',
      'viewCount'
    )
  }

  /**
   * Get recent videos for a specific topic
   */
  async getRecentVideos(
    topic: string,
    maxResults: number = 5
  ): Promise<YouTubeVideo[]> {
    const query = `${topic} tutorial`
    
    return this.searchVideos(
      query,
      maxResults,
      'video',
      'en',
      'any',
      'any',
      'uploadDate'
    )
  }

  /**
   * Format duration from ISO 8601 format to readable format
   */
  formatDuration(duration: string): string {
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
    if (!match) return 'Unknown'

    const hours = parseInt(match[1] || '0')
    const minutes = parseInt(match[2] || '0')
    const seconds = parseInt(match[3] || '0')

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    } else {
      return `${minutes}:${seconds.toString().padStart(2, '0')}`
    }
  }

  /**
   * Format view count to readable format
   */
  formatViewCount(viewCount: string): string {
    const count = parseInt(viewCount)
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M views`
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K views`
    } else {
      return `${count} views`
    }
  }
}

// Export a singleton instance
export const youtubeService = new YouTubeService() 