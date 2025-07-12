"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Bookmark, ExternalLink, Search, ThumbsUp, Youtube, ChevronDown, ChevronRight, Star, Clock, Users, Filter, BookOpen, Video, FileText, Globe, Eye } from "lucide-react"
import useSWR from "swr"
import type { Program } from "@/lib/program-service"
import { Suspense } from "react"
import { Metadata } from "next"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"

// Platform icons and colors
const platformIcons: Record<string, { icon: React.ReactNode; color: string }> = {
  youtube: {
    icon: <Youtube className="h-4 w-4" />,
    color: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300",
  },
  "khan-academy": {
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 4L2 20h20L12 4z" />
      </svg>
    ),
    color: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300",
  },
  udemy: {
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0L5.81 3.573v3.574l6.189-3.574 6.191 3.574V3.573zM5.81 10.148v8.144c0 1.85.589 3.243 1.741 4.234S10.177 24 11.973 24s3.269-.482 4.448-1.474c1.179-.991 1.768-2.439 1.768-4.234v-8.144l-6.189 3.574z" />
      </svg>
    ),
    color: "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300",
  },
  coursera: {
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zm0 4.8c3.976 0 7.2 3.224 7.2 7.2s-3.224 7.2-7.2 7.2-7.2-3.224-7.2-7.2 3.224-7.2 7.2-7.2zm0 3.6c-1.984 0-3.6 1.616-3.6 3.6s1.616 3.6 3.6 3.6 3.6-1.616 3.6-3.6-1.616-3.6-3.6-3.6z" />
      </svg>
    ),
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300",
  },
  "mit-ocw": {
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M0 0v24h4.8V0H0zm9.6 0v24h4.8V0H9.6zm9.6 0v24H24V0h-4.8z" />
      </svg>
    ),
    color: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300",
  },
  google: {
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zm6.804 16.863a8.46 8.46 0 01-3.246 2.116 8.57 8.57 0 01-3.558.756 8.57 8.57 0 01-3.558-.756 8.47 8.47 0 01-3.246-2.116A9.85 9.85 0 013 12c0-1.714.504-3.291 1.368-4.596a8.46 8.46 0 013.246-2.116 8.57 8.57 0 013.558-.756c1.288 0 2.492.252 3.558.756a8.46 8.46 0 013.246 2.116A9.85 9.85 0 0121 12a9.85 9.85 0 01-2.196 4.863z" />
      </svg>
    ),
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300",
  },
  edx: {
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0L0 12l12 12 12-12L12 0zM5.6 10.8L12 4.4l6.4 6.4-6.4 6.4-6.4-6.4z" />
      </svg>
    ),
    color: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-300",
  },
}

const fetcher = (url: string) => fetch(url).then(res => res.json())

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
}

export default function ResourcesPage() {
  const searchParams = useSearchParams()
  const initialProgramId = searchParams.get('programId') || "all"
  
  const { data: programs, error: programError } = useSWR<Program[]>("/api/programs", fetcher)
  
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedProgram, setSelectedProgram] = useState(initialProgramId)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedPlatform, setSelectedPlatform] = useState("all")
  const [selectedType, setSelectedType] = useState("all")
  const [expandedCourses, setExpandedCourses] = useState<Set<string>>(new Set())
  const [resources, setResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState<string[]>([])
  const [platforms, setPlatforms] = useState<string[]>([])
  const [types, setTypes] = useState<string[]>([])

  // Fetch resources from the new API
  useEffect(() => {
    const fetchResources = async () => {
      try {
        setLoading(true)
        const params = new URLSearchParams()
        if (selectedProgram !== "all") {
          params.append('programId', selectedProgram)
        }
        if (selectedCategory !== "all") {
          params.append('category', selectedCategory)
        }
        if (selectedPlatform !== "all") {
          params.append('platform', selectedPlatform)
        }
        if (selectedType !== "all") {
          params.append('type', selectedType)
        }
        
        const response = await fetch(`/api/resources?${params.toString()}`)
        if (response.ok) {
          const data = await response.json()
          setResources(data.resources || [])
          
          // Extract unique values for filters
          const uniqueCategories = Array.from(new Set(data.resources.map((r: Resource) => r.category))) as string[]
          const uniquePlatforms = Array.from(new Set(data.resources.map((r: Resource) => r.platform))) as string[]
          const uniqueTypes = Array.from(new Set(data.resources.map((r: Resource) => r.type))) as string[]
          
          setCategories(uniqueCategories)
          setPlatforms(uniquePlatforms)
          setTypes(uniqueTypes)
        } else {
          console.error('Failed to fetch resources')
          setResources([])
        }
      } catch (error) {
        console.error("Error fetching resources:", error)
        setResources([])
      } finally {
        setLoading(false)
      }
    }

    fetchResources()
  }, [selectedProgram, selectedCategory, selectedPlatform, selectedType])

  // Filter resources based on search query
  const filteredResources = resources.filter((resource) => {
    const matchesSearch =
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    return matchesSearch
  })

  // Function to get resources for a specific course
  const getResourcesForCourse = (courseId: string) => {
    return filteredResources.filter((resource) => 
      resource.courseIds && resource.courseIds.includes(courseId)
    )
  }

  // Function to toggle course expansion
  const toggleCourseExpansion = (courseId: string) => {
    const newExpanded = new Set(expandedCourses)
    if (newExpanded.has(courseId)) {
      newExpanded.delete(courseId)
    } else {
      newExpanded.add(courseId)
    }
    setExpandedCourses(newExpanded)
  }

  // Get all courses from all programs
  const allCourses = programs?.flatMap(program => 
    program.years.flatMap(year => 
      year.semesters.flatMap(semester => 
        semester.courses.map(course => ({
          ...course,
          programId: program.id,
          programTitle: program.title,
          year: year.year,
          semester: semester.semester
        }))
      )
    )
  ) || []

  // Filter courses by selected program
  const filteredCourses = selectedProgram === "all" 
    ? allCourses 
    : allCourses.filter(course => course.programId === selectedProgram)

  if (programError) {
    return (
      <>
        <DashboardHeader />
        <DashboardShell>
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Failed to load programs.</p>
          </div>
        </DashboardShell>
      </>
    )
  }

  if (!programs) {
    return (
      <>
        <DashboardHeader />
        <DashboardShell>
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Loading programs...</p>
          </div>
        </DashboardShell>
      </>
    )
  }

  if (loading) {
    return (
      <>
        <DashboardHeader />
        <DashboardShell>
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Loading resources...</p>
          </div>
        </DashboardShell>
      </>
    )
  }

  return (
    <>
      <DashboardHeader />
      <DashboardShell>
        <div className="flex flex-col gap-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Learning Resources</h1>
            <p className="text-muted-foreground">
              Discover high-quality resources organized by course for each program
            </p>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col gap-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search resources..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Select value={selectedProgram} onValueChange={setSelectedProgram}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Program" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Programs</SelectItem>
                  {programs.map((program) => (
                    <SelectItem key={program.id} value={program.id}>
                      {program.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                <SelectTrigger>
                  <SelectValue placeholder="Platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Platforms</SelectItem>
                  {platforms.map((platform) => (
                    <SelectItem key={platform} value={platform}>
                      {platform}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {types.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Resources by Course */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Resources by Course</h2>
            
            {filteredCourses.map((course) => {
              const courseResources = getResourcesForCourse(course.id)
              const isExpanded = expandedCourses.has(course.id)
              
              if (courseResources.length === 0) return null

              return (
                <div key={course.id} className="border rounded-lg p-4">
                  <div 
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => toggleCourseExpansion(course.id)}
                  >
                    <div>
                      <h3 className="font-semibold">{course.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {course.programTitle} • Year {course.year}, Semester {course.semester}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{courseResources.length} resources</Badge>
                      {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </div>
                  </div>
                  
                  {isExpanded && (
                    <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {courseResources.map((resource) => (
                        <ResourceCard key={resource.id} resource={resource} />
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </DashboardShell>
    </>
  )
}

function ResourceCard({ resource }: { resource: Resource }) {
  const platformIcon = platformIcons[resource.platform.toLowerCase()] || {
    icon: <ExternalLink className="h-4 w-4" />,
    color: "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300",
  }

  return (
    <Card className="h-full hover:bg-muted/50 transition-colors">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className={`p-1 rounded ${platformIcon.color}`}>
              {platformIcon.icon}
            </div>
            <Badge variant="outline" className="text-xs">
              {resource.platform}
            </Badge>
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Star className="h-3 w-3 fill-current" />
            <span>{resource.rating.toFixed(1)}</span>
          </div>
        </div>
        <CardTitle className="text-base">{resource.title}</CardTitle>
        <CardDescription className="text-sm line-clamp-2">
          {resource.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="flex flex-wrap gap-1 mb-3">
          {resource.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
          {resource.tags.length > 3 && (
            <Badge variant="secondary" className="text-xs">
              +{resource.tags.length - 3} more
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          {resource.duration && (
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{resource.duration}</span>
            </div>
          )}
          {resource.views && (
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              <span>{resource.views.toLocaleString()} views</span>
            </div>
          )}
          {resource.lessons && (
            <div className="flex items-center gap-1">
              <Bookmark className="h-3 w-3" />
              <span>{resource.lessons} lessons</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <Button asChild className="w-full">
          <a href={resource.url} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-4 w-4 mr-2" />
            Open Resource
          </a>
        </Button>
      </CardFooter>
    </Card>
  )
}
