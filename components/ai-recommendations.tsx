"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Video, FileText, Lightbulb, ExternalLink, Code } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface AIRecommendationsProps {
  userId?: string
}

export function AIRecommendations({ userId = "user123" }: AIRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("courses")

  // Sample user data - in a real app, this would come from your user database
  const userData = {
    program: "Computer Science",
    interests: ["Artificial Intelligence", "Web Development", "Data Structures"],
    recentTopics: ["Python Programming", "Algorithms", "Database Systems"],
    quizResults: [
      {
        quizTitle: "Data Structures and Algorithms",
        score: 85,
        strengths: ["Arrays", "Linked Lists"],
        weaknesses: ["Dynamic Programming", "Graph Algorithms"],
      },
      {
        quizTitle: "Database Systems",
        score: 72,
        strengths: ["SQL Basics", "Normalization"],
        weaknesses: ["Transactions", "Indexing"],
      },
      {
        quizTitle: "Web Development",
        score: 90,
        strengths: ["HTML/CSS", "JavaScript", "React"],
        weaknesses: ["Backend Integration", "Security"],
      },
    ],
  }

  const fetchRecommendations = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/ai-recommendations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          ...userData,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to fetch recommendations")
      }

      const data = await response.json()
      setRecommendations(data.recommendations || [])
    } catch (err) {
      console.error("Error fetching AI recommendations:", err)
      setError("Failed to generate recommendations. Please try again later.")

      // Fallback to sample recommendations if API fails
      setRecommendations(sampleRecommendations)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Load recommendations on component mount
    fetchRecommendations()
  }, [userId])

  const getResourceIcon = (type: string) => {
    const lowerType = type.toLowerCase()
    if (lowerType.includes("video")) return <Video className="h-4 w-4" />
    if (lowerType.includes("article")) return <FileText className="h-4 w-4" />
    if (lowerType.includes("course")) return <BookOpen className="h-4 w-4" />
    return <Lightbulb className="h-4 w-4" />
  }

  const getDifficultyColor = (difficulty: string) => {
    const lower = difficulty.toLowerCase()
    if (lower.includes("beginner")) return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300"
    if (lower.includes("advanced")) return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300"
    return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300" // intermediate
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>AI-Powered Learning Recommendations</CardTitle>
        <CardDescription>
          Personalized recommendations based on your quiz performance and learning patterns
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="courses" className="space-y-4" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="videos">Videos</TabsTrigger>
            <TabsTrigger value="articles">Articles</TabsTrigger>
            <TabsTrigger value="practice">Practice</TabsTrigger>
          </TabsList>

          <TabsContent value="courses" className="space-y-4">
            <div className="rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Advanced Data Structures</h3>
                <Badge variant="outline">98% Match</Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                A comprehensive course covering advanced data structures including AVL trees, red-black trees, and
                B-trees.
              </p>
              <div className="flex items-center gap-2 mt-3">
                <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
                  Advanced
                </Badge>
                <Badge variant="secondary">8 weeks</Badge>
                <Badge variant="secondary">Certificate</Badge>
              </div>
              <div className="flex justify-between items-center mt-4">
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <BookOpen className="h-4 w-4" />
                  <span>MIT OpenCourseWare</span>
                </div>
                <Button size="sm">Enroll</Button>
              </div>
            </div>

            <div className="rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Database Optimization Techniques</h3>
                <Badge variant="outline">92% Match</Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Learn how to optimize database queries, design efficient schemas, and implement indexing strategies.
              </p>
              <div className="flex items-center gap-2 mt-3">
                <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
                  Intermediate
                </Badge>
                <Badge variant="secondary">6 weeks</Badge>
                <Badge variant="secondary">Certificate</Badge>
              </div>
              <div className="flex justify-between items-center mt-4">
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <BookOpen className="h-4 w-4" />
                  <span>Stanford Online</span>
                </div>
                <Button size="sm">Enroll</Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="videos" className="space-y-4">
            <div className="rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Dynamic Programming Explained</h3>
                <Badge variant="outline">95% Match</Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                A clear explanation of dynamic programming with practical examples and problem-solving techniques.
              </p>
              <div className="flex items-center gap-2 mt-3">
                <Badge variant="secondary">45 minutes</Badge>
                <Badge variant="secondary">Tutorial</Badge>
              </div>
              <div className="flex justify-between items-center mt-4">
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Video className="h-4 w-4" />
                  <span>CS Dojo</span>
                </div>
                <Button size="sm">Watch</Button>
              </div>
            </div>

            <div className="rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Graph Algorithms Masterclass</h3>
                <Badge variant="outline">90% Match</Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Comprehensive tutorial on graph algorithms including DFS, BFS, Dijkstra's, and A*.
              </p>
              <div className="flex items-center gap-2 mt-3">
                <Badge variant="secondary">Series (5 videos)</Badge>
                <Badge variant="secondary">Advanced</Badge>
              </div>
              <div className="flex justify-between items-center mt-4">
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Video className="h-4 w-4" />
                  <span>MIT OpenCourseWare</span>
                </div>
                <Button size="sm">Watch</Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="articles" className="space-y-4">
            <div className="rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Understanding Time Complexity</h3>
                <Badge variant="outline">97% Match</Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                A deep dive into algorithmic time complexity analysis with practical examples.
              </p>
              <div className="flex items-center gap-2 mt-3">
                <Badge variant="secondary">15 min read</Badge>
                <Badge variant="secondary">Tutorial</Badge>
              </div>
              <div className="flex justify-between items-center mt-4">
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <FileText className="h-4 w-4" />
                  <span>Medium</span>
                </div>
                <Button size="sm">Read</Button>
              </div>
            </div>

            <div className="rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Modern Database Design Patterns</h3>
                <Badge variant="outline">89% Match</Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Learn about the latest database design patterns for scalable and maintainable applications.
              </p>
              <div className="flex items-center gap-2 mt-3">
                <Badge variant="secondary">20 min read</Badge>
                <Badge variant="secondary">Advanced</Badge>
              </div>
              <div className="flex justify-between items-center mt-4">
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <FileText className="h-4 w-4" />
                  <span>Dev.to</span>
                </div>
                <Button size="sm">Read</Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="practice" className="space-y-4">
            <div className="rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">LeetCode Problem Set: Trees</h3>
                <Badge variant="outline">96% Match</Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                A curated set of tree-related problems to strengthen your understanding and implementation skills.
              </p>
              <div className="flex items-center gap-2 mt-3">
                <Badge variant="secondary">10 problems</Badge>
                <Badge variant="secondary">Medium-Hard</Badge>
              </div>
              <div className="flex justify-between items-center mt-4">
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Code className="h-4 w-4" />
                  <span>LeetCode</span>
                </div>
                <Button size="sm">Practice</Button>
              </div>
            </div>

            <div className="rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">SQL Query Optimization Challenges</h3>
                <Badge variant="outline">91% Match</Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Practice optimizing complex SQL queries with real-world database scenarios.
              </p>
              <div className="flex items-center gap-2 mt-3">
                <Badge variant="secondary">8 challenges</Badge>
                <Badge variant="secondary">Intermediate</Badge>
              </div>
              <div className="flex justify-between items-center mt-4">
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Code className="h-4 w-4" />
                  <span>HackerRank</span>
                </div>
                <Button size="sm">Practice</Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">
          <ExternalLink className="mr-2 h-4 w-4" />
          View All {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
        </Button>
      </CardFooter>
    </Card>
  )
}

// Sample recommendations as fallback
const sampleRecommendations = [
  {
    title: "Dynamic Programming Fundamentals",
    description:
      "A comprehensive course covering dynamic programming from basics to advanced techniques with practical examples.",
    resourceType: "Video Course",
    difficulty: "Intermediate",
    url: "https://example.com/dynamic-programming",
  },
  {
    title: "Graph Algorithms Masterclass",
    description: "Learn all essential graph algorithms with visualizations and step-by-step explanations.",
    resourceType: "Course",
    difficulty: "Advanced",
    url: "https://example.com/graph-algorithms",
  },
  {
    title: "Database Indexing Strategies",
    description: "Understand how database indexing works and learn best practices for optimizing query performance.",
    resourceType: "Article",
    difficulty: "Intermediate",
    url: "https://example.com/database-indexing",
  },
  {
    title: "Advanced React Patterns",
    description:
      "Take your React skills to the next level with advanced patterns and performance optimization techniques.",
    resourceType: "Video Tutorial",
    difficulty: "Advanced",
    url: "https://example.com/advanced-react",
  },
  {
    title: "Introduction to Machine Learning",
    description: "A beginner-friendly introduction to machine learning concepts and applications in Python.",
    resourceType: "Course",
    difficulty: "Beginner",
    url: "https://example.com/intro-ml",
  },
]
