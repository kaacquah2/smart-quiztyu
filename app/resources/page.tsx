"use client"

import type React from "react"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Bookmark, ExternalLink, Search, ThumbsUp, Youtube } from "lucide-react"

// Resource data with YouTube, Khan Academy, and other platforms
const resourcesData = [
  {
    id: "1",
    title: "Introduction to Computer Science - Harvard's CS50",
    description: "Comprehensive introduction to computer science and programming",
    url: "https://www.youtube.com/watch?v=8mAITcNt710",
    platform: "youtube",
    type: "video",
    category: "computer-science",
    tags: ["programming", "computer science", "introduction"],
    duration: "2h 15m",
    rating: 4.9,
    views: 12500000,
  },
  {
    id: "2",
    title: "Learn Python - Full Course for Beginners",
    description: "Complete Python tutorial covering all the basics",
    url: "https://www.youtube.com/watch?v=rfscVS0vtbw",
    platform: "youtube",
    type: "video",
    category: "programming",
    tags: ["python", "programming", "beginners"],
    duration: "4h 27m",
    rating: 4.8,
    views: 28300000,
  },
  {
    id: "3",
    title: "Linear Algebra - Khan Academy",
    description: "Full course on linear algebra concepts",
    url: "https://www.khanacademy.org/math/linear-algebra",
    platform: "khan-academy",
    type: "course",
    category: "mathematics",
    tags: ["linear algebra", "mathematics", "vectors"],
    duration: "15h",
    rating: 4.7,
    lessons: 45,
  },
  {
    id: "4",
    title: "Calculus 1 - Khan Academy",
    description: "Comprehensive calculus course covering limits, derivatives, and integrals",
    url: "https://www.khanacademy.org/math/calculus-1",
    platform: "khan-academy",
    type: "course",
    category: "mathematics",
    tags: ["calculus", "mathematics", "derivatives"],
    duration: "20h",
    rating: 4.8,
    lessons: 60,
  },
  {
    id: "5",
    title: "Data Structures Easy to Advanced Course",
    description: "Complete course on data structures with implementations",
    url: "https://www.youtube.com/watch?v=RBSGKlAvoiM",
    platform: "youtube",
    type: "video",
    category: "computer-science",
    tags: ["data structures", "algorithms", "programming"],
    duration: "8h 3m",
    rating: 4.9,
    views: 3700000,
  },
  {
    id: "6",
    title: "MIT 6.006 Introduction to Algorithms",
    description: "Full MIT course on algorithms and their analysis",
    url: "https://www.youtube.com/playlist?list=PLUl4u3cNGP61Oq3tWYp6V_F-5jb5L2iHb",
    platform: "youtube",
    type: "playlist",
    category: "computer-science",
    tags: ["algorithms", "computer science", "advanced"],
    duration: "24h",
    rating: 4.9,
    videos: 24,
  },
  {
    id: "7",
    title: "Statistics and Probability - Khan Academy",
    description: "Full course on statistics and probability concepts",
    url: "https://www.khanacademy.org/math/statistics-probability",
    platform: "khan-academy",
    type: "course",
    category: "mathematics",
    tags: ["statistics", "probability", "data analysis"],
    duration: "18h",
    rating: 4.6,
    lessons: 55,
  },
  {
    id: "8",
    title: "Web Development Bootcamp",
    description: "Complete web development course covering HTML, CSS, JavaScript, and more",
    url: "https://www.udemy.com/course/the-web-developer-bootcamp/",
    platform: "udemy",
    type: "course",
    category: "web-development",
    tags: ["web development", "html", "css", "javascript"],
    duration: "63h",
    rating: 4.7,
    lessons: 615,
  },
  {
    id: "9",
    title: "Machine Learning Crash Course - Google",
    description: "Google's fast-paced practical introduction to machine learning",
    url: "https://developers.google.com/machine-learning/crash-course",
    platform: "google",
    type: "course",
    category: "machine-learning",
    tags: ["machine learning", "AI", "TensorFlow"],
    duration: "15h",
    rating: 4.8,
    lessons: 30,
  },
  {
    id: "10",
    title: "Database Systems - Stanford Course",
    description: "Stanford's comprehensive course on database systems",
    url: "https://www.youtube.com/playlist?list=PLSE8ODhjZXjbohkNBWQs_otTrBTrjyohi",
    platform: "youtube",
    type: "playlist",
    category: "databases",
    tags: ["databases", "SQL", "data management"],
    duration: "20h",
    rating: 4.7,
    videos: 20,
  },
  {
    id: "11",
    title: "Operating Systems - MIT Course",
    description: "MIT's course on operating system principles",
    url: "https://ocw.mit.edu/courses/6-828-operating-system-engineering-fall-2012/",
    platform: "mit-ocw",
    type: "course",
    category: "computer-science",
    tags: ["operating systems", "systems programming", "advanced"],
    duration: "24h",
    rating: 4.8,
    lessons: 24,
  },
  {
    id: "12",
    title: "Networking Fundamentals",
    description: "Complete course on computer networking concepts",
    url: "https://www.youtube.com/watch?v=qiQR5rTSshw",
    platform: "youtube",
    type: "video",
    category: "networking",
    tags: ["networking", "protocols", "internet"],
    duration: "5h 19m",
    rating: 4.6,
    views: 1800000,
  },
  {
    id: "13",
    title: "Discrete Mathematics - Khan Academy",
    description: "Introduction to discrete mathematics for computer science",
    url: "https://www.khanacademy.org/computing/computer-science/algorithms",
    platform: "khan-academy",
    type: "course",
    category: "mathematics",
    tags: ["discrete math", "logic", "computer science"],
    duration: "12h",
    rating: 4.5,
    lessons: 35,
  },
  {
    id: "14",
    title: "React - The Complete Guide",
    description: "Comprehensive course on React.js development",
    url: "https://www.udemy.com/course/react-the-complete-guide-incl-redux/",
    platform: "udemy",
    type: "course",
    category: "web-development",
    tags: ["react", "javascript", "frontend"],
    duration: "48h",
    rating: 4.8,
    lessons: 490,
  },
  {
    id: "15",
    title: "Cybersecurity Fundamentals",
    description: "Introduction to cybersecurity principles and practices",
    url: "https://www.coursera.org/learn/cybersecurity-fundamentals",
    platform: "coursera",
    type: "course",
    category: "cybersecurity",
    tags: ["security", "cryptography", "network security"],
    duration: "15h",
    rating: 4.6,
    lessons: 28,
  },
  {
    id: "16",
    title: "Physics - Khan Academy",
    description: "Comprehensive physics course covering mechanics, electricity, and more",
    url: "https://www.khanacademy.org/science/physics",
    platform: "khan-academy",
    type: "course",
    category: "physics",
    tags: ["physics", "mechanics", "electricity"],
    duration: "25h",
    rating: 4.7,
    lessons: 75,
  },
  {
    id: "17",
    title: "Data Science with Python",
    description: "Complete data science course using Python and popular libraries",
    url: "https://www.edx.org/professional-certificate/ibm-python-data-science",
    platform: "edx",
    type: "course",
    category: "data-science",
    tags: ["data science", "python", "machine learning"],
    duration: "40h",
    rating: 4.7,
    lessons: 120,
  },
  {
    id: "18",
    title: "Artificial Intelligence - MIT Course",
    description: "MIT's introduction to artificial intelligence",
    url: "https://ocw.mit.edu/courses/6-034-artificial-intelligence-fall-2010/",
    platform: "mit-ocw",
    type: "course",
    category: "artificial-intelligence",
    tags: ["AI", "machine learning", "advanced"],
    duration: "24h",
    rating: 4.9,
    lessons: 24,
  },
  {
    id: "19",
    title: "Software Engineering Principles",
    description: "Course on software engineering best practices and methodologies",
    url: "https://www.coursera.org/learn/software-engineering",
    platform: "coursera",
    type: "course",
    category: "software-engineering",
    tags: ["software engineering", "agile", "development"],
    duration: "20h",
    rating: 4.5,
    lessons: 40,
  },
  {
    id: "20",
    title: "Mobile App Development with Flutter",
    description: "Complete course on building cross-platform mobile apps with Flutter",
    url: "https://www.udemy.com/course/flutter-bootcamp-with-dart/",
    platform: "udemy",
    type: "course",
    category: "mobile-development",
    tags: ["flutter", "dart", "mobile development"],
    duration: "28h",
    rating: 4.6,
    lessons: 285,
  },
]

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
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedPlatform, setSelectedPlatform] = useState("all")
  const [selectedType, setSelectedType] = useState("all")

  // Filter resources based on search query and filters
  const filteredResources = resourcesData.filter((resource) => {
    const matchesSearch =
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCategory = selectedCategory === "all" || resource.category === selectedCategory
    const matchesPlatform = selectedPlatform === "all" || resource.platform === selectedPlatform
    const matchesType = selectedType === "all" || resource.type === selectedType

    return matchesSearch && matchesCategory && matchesPlatform && matchesType
  })

  // Get unique categories, platforms, and types for filters
  const categories = Array.from(new Set(resourcesData.map((r) => r.category)))
  const platforms = Array.from(new Set(resourcesData.map((r) => r.platform)))
  const types = Array.from(new Set(resourcesData.map((r) => r.type)))

  return (
    <>
      <DashboardHeader />
      <DashboardShell>
        <div className="flex flex-col gap-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Learning Resources</h1>
            <p className="text-muted-foreground">
              Discover high-quality resources from YouTube, Khan Academy, and other platforms
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

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
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
                          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
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

          <Tabs defaultValue="all" className="space-y-4">
            <TabsList>
              <TabsTrigger value="all">All Resources</TabsTrigger>
              <TabsTrigger value="recommended">Recommended</TabsTrigger>
              <TabsTrigger value="popular">Most Popular</TabsTrigger>
              <TabsTrigger value="saved">Saved</TabsTrigger>
            </TabsList>

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

            <TabsContent value="saved" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredResources
                  .slice(0, 3) // Simulating saved resources
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
                              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
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
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
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
