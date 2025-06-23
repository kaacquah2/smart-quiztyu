"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Bookmark, ExternalLink, Search, ThumbsUp, Youtube, ChevronDown, ChevronRight } from "lucide-react"
import { programs, getProgramById, getCourseById } from "@/lib/program-data"
import { getResourcesForCourse, getResourcesForProgram } from "@/lib/resource-service"

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

export default function ResourcesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedProgram, setSelectedProgram] = useState("all")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedPlatform, setSelectedPlatform] = useState("all")
  const [selectedType, setSelectedType] = useState("all")
  const [expandedCourses, setExpandedCourses] = useState<Set<string>>(new Set())
  const [resources, setResources] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch resources on component mount
  useEffect(() => {
    const fetchResources = async () => {
      try {
        // Since getResourcesForProgram from resource-service is synchronous, we can call it directly
        const fetchedResources = getResourcesForProgram("computer-science")
        setResources(fetchedResources)
      } catch (error) {
        console.error("Error fetching resources:", error)
        setResources([])
      } finally {
        setLoading(false)
      }
    }

    fetchResources()
  }, [])

  // Extract unique categories, platforms, types from DB data
  const categories = Array.from(new Set(resources.map((r) => r.category)))
  const platforms = Array.from(new Set(resources.map((r) => r.platform)))
  const types = Array.from(new Set(resources.map((r) => r.type)))

  // Filter resources based on search query and filters
  const filteredResources = resources.filter((resource) => {
    const matchesSearch =
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCategory = selectedCategory === "all" || resource.category === selectedCategory
    const matchesPlatform = selectedPlatform === "all" || resource.platform === selectedPlatform
    const matchesType = selectedType === "all" || resource.type === selectedType

    return matchesSearch && matchesCategory && matchesPlatform && matchesType
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
  const allCourses = programs.flatMap(program => 
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
  )

  // Filter courses by selected program
  const filteredCourses = selectedProgram === "all" 
    ? allCourses 
    : allCourses.filter(course => course.programId === selectedProgram)

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

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
              <div>
                <Select value={selectedProgram} onValueChange={setSelectedProgram}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select program" />
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
              </div>
              <div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category
                          .split("-")
                          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                          .join(" ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Platforms</SelectItem>
                    {platforms.map((platform) => (
                      <SelectItem key={platform} value={platform}>
                        {platform
                          .split("-")
                          .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
                          .join(" ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {types.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Tabs defaultValue="by-course" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 gap-2 p-2">
              <TabsTrigger value="by-course" className="px-4 py-2">By Course</TabsTrigger>
              <TabsTrigger value="all" className="px-4 py-2">All Resources</TabsTrigger>
              <TabsTrigger value="recommended" className="px-4 py-2">Recommended</TabsTrigger>
              <TabsTrigger value="popular" className="px-4 py-2">Most Popular</TabsTrigger>
            </TabsList>

            <TabsContent value="by-course" className="space-y-6">
              {filteredCourses.length > 0 ? (
                filteredCourses.map((course) => {
                  const courseResources = getResourcesForCourse(course.id)
                  const hasResources = courseResources.length > 0
                  const isExpanded = expandedCourses.has(course.id)

                  return (
                    <Card key={course.id} className="overflow-hidden">
                      <CardHeader 
                        className="cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => toggleCourseExpansion(course.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg">{course.title}</CardTitle>
                            <CardDescription className="mt-1">
                              {course.description} • {course.programTitle} • Year {course.year}, Semester {course.semester}
                            </CardDescription>
                          </div>
                          <div className="flex items-center gap-2">
                            {hasResources && (
                              <Badge variant="secondary">
                                {courseResources.length} resource{courseResources.length !== 1 ? 's' : ''}
                              </Badge>
                            )}
                            {hasResources ? (
                              isExpanded ? (
                                <ChevronDown className="h-4 w-4" />
                              ) : (
                                <ChevronRight className="h-4 w-4" />
                              )
                            ) : (
                              <span className="text-sm text-muted-foreground">No resources</span>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      
                      {isExpanded && hasResources && (
                        <CardContent className="pt-0">
                          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {courseResources.map((resource) => (
                              <ResourceCard key={resource.id} resource={resource} />
                            ))}
                          </div>
                        </CardContent>
                      )}
                    </Card>
                  )
                })
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No courses found matching your criteria.</p>
                  <Button
                    variant="link"
                    onClick={() => {
                      setSearchQuery("")
                      setSelectedProgram("all")
                      setSelectedCategory("all")
                      setSelectedPlatform("all")
                      setSelectedType("all")
                    }}
                  >
                    Clear filters
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="all" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredResources.length > 0 ? (
                  filteredResources.map((resource) => <ResourceCard key={resource.id} resource={resource} />)
                ) : (
                  <div className="col-span-full text-center py-8">
                    <p className="text-muted-foreground">No resources found matching your criteria.</p>
                    <Button
                      variant="link"
                      onClick={() => {
                        setSearchQuery("")
                        setSelectedCategory("all")
                        setSelectedPlatform("all")
                        setSelectedType("all")
                      }}
                    >
                      Clear filters
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="recommended" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredResources
                  .filter((r) => r.rating >= 4.7)
                  .slice(0, 6)
                  .map((resource) => (
                    <ResourceCard key={resource.id} resource={resource} />
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="popular" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredResources
                  .sort((a, b) => (b.views || 0) - (a.views || 0))
                  .slice(0, 6)
                  .map((resource) => (
                    <ResourceCard key={resource.id} resource={resource} />
                  ))}
              </div>
            </TabsContent>
          </Tabs>

          {/* Featured Resources Section */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Featured YouTube Courses</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {filteredResources
                .filter((r) => r.platform === "youtube" && r.type === "video")
                .slice(0, 2)
                .map((resource) => (
                  <div key={resource.id} className="rounded-lg overflow-hidden border">
                    <div className="aspect-video w-full">
                      <iframe
                        width="100%"
                        height="100%"
                        src={resource.url.replace("watch?v=", "embed/")}
                        title={resource.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold">{resource.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{resource.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className={platformIcons[resource.platform].color}>
                          <span className="flex items-center gap-1">
                            {platformIcons[resource.platform].icon}
                            {resource.platform
                              .split("-")
                              .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
                              .join(" ")}
                          </span>
                        </Badge>
                        <Badge variant="outline">{resource.duration}</Badge>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </DashboardShell>
    </>
  )
}

// Resource Card Component
function ResourceCard({ resource }: { resource: any }) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{resource.title}</CardTitle>
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
            <Bookmark className="h-4 w-4" />
            <span className="sr-only">Save resource</span>
          </Button>
        </div>
        <CardDescription className="line-clamp-2">{resource.description}</CardDescription>
      </CardHeader>
      <CardContent className="pb-2 flex-grow">
        <div className="flex flex-wrap gap-2 mb-2">
          <Badge variant="outline" className={platformIcons[resource.platform].color}>
            <span className="flex items-center gap-1">
              {platformIcons[resource.platform].icon}
              {resource.platform
                .split("-")
                .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ")}
            </span>
          </Badge>
          <Badge variant="outline">{resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}</Badge>
          <Badge variant="outline">{resource.duration}</Badge>
        </div>
        <div className="flex flex-wrap gap-1 mt-2">
          {resource.tags.slice(0, 3).map((tag: string) => (
            <span
              key={tag}
              className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
      </CardContent>
      <CardFooter className="pt-2 flex justify-between items-center">
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <ThumbsUp className="h-3.5 w-3.5" />
          <span>{resource.rating}/5</span>
        </div>
        <Button size="sm" className="gap-1" asChild>
          <a href={resource.url} target="_blank" rel="noopener noreferrer">
            View <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  )
}
