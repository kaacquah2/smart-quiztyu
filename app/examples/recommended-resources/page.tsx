"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RecommendedResources } from "@/components/recommended-resources"
import { 
  BookOpen, 
  Video, 
  Brain, 
  TrendingUp,
  Lightbulb,
  GraduationCap
} from "lucide-react"

export default function RecommendedResourcesExamples() {
  const [selectedExample, setSelectedExample] = useState("quiz-performance")

  const examples = [
    {
      id: "quiz-performance",
      title: "Quiz Performance Based",
      description: "AI-powered recommendations based on quiz results",
      icon: <Brain className="h-5 w-5" />,
      props: {
        quizId: "data-structures",
        score: 6,
        totalQuestions: 10,
        title: "Personalized Recommendations",
        description: "Based on your quiz performance, here are resources to help you improve"
      }
    },
    {
      id: "course-specific",
      title: "Course Specific",
      description: "Resources curated for a specific course",
      icon: <BookOpen className="h-5 w-5" />,
      props: {
        courseId: "intro-to-python",
        title: "Python Programming Resources",
        description: "Curated resources for learning Python programming"
      }
    },
    {
      id: "program-wide",
      title: "Program Wide",
      description: "Resources for an entire program",
      icon: <GraduationCap className="h-5 w-5" />,
      props: {
        programId: "computer-science",
        title: "Computer Science Resources",
        description: "Top resources for computer science students"
      }
    },
    {
      id: "compact-view",
      title: "Compact View",
      description: "Space-efficient resource display",
      icon: <TrendingUp className="h-5 w-5" />,
      props: {
        courseId: "web-development",
        compact: true,
        limit: 5,
        title: "Web Development Resources",
        description: "Essential resources for web development"
      }
    },
    {
      id: "general",
      title: "General Recommendations",
      description: "High-quality resources across all topics",
      icon: <Lightbulb className="h-5 w-5" />,
      props: {
        title: "Featured Resources",
        description: "Hand-picked high-quality learning resources"
      }
    }
  ]

  const currentExample = examples.find(ex => ex.id === selectedExample)

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Recommended Resources Component Examples</h1>
        <p className="text-muted-foreground">
          Demonstrating the dynamic RecommendedResources component in different contexts
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Sidebar with examples */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Examples</CardTitle>
              <CardDescription>Click to see different use cases</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {examples.map((example) => (
                  <Button
                    key={example.id}
                    variant={selectedExample === example.id ? "default" : "outline"}
                    className="w-full justify-start"
                    onClick={() => setSelectedExample(example.id)}
                  >
                    <div className="flex items-center gap-2">
                      {example.icon}
                      <div className="text-left">
                        <div className="font-medium text-sm">{example.title}</div>
                        <div className="text-xs text-muted-foreground">{example.description}</div>
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main content area */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {currentExample?.icon}
                {currentExample?.title}
              </CardTitle>
              <CardDescription>{currentExample?.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="component" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="component">Component</TabsTrigger>
                  <TabsTrigger value="code">Code</TabsTrigger>
                  <TabsTrigger value="props">Props</TabsTrigger>
                </TabsList>

                <TabsContent value="component" className="space-y-4">
                  <div className="border rounded-lg p-4 bg-muted/20">
                    <RecommendedResources {...currentExample?.props} />
                  </div>
                </TabsContent>

                <TabsContent value="code" className="space-y-4">
                  <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
                    <pre className="text-sm">
{`<RecommendedResources 
  ${Object.entries(currentExample?.props || {})
    .map(([key, value]) => {
      if (typeof value === 'string') {
        return `${key}="${value}"`
      } else if (typeof value === 'boolean') {
        return value ? `${key}={true}` : `${key}={false}`
      } else if (typeof value === 'number') {
        return `${key}={${value}}`
      }
      return null
    })
    .filter(Boolean)
    .join('\n  ')}
/>`}
                    </pre>
                  </div>
                </TabsContent>

                <TabsContent value="props" className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <h4 className="font-medium mb-2">Available Props</h4>
                      <div className="space-y-2 text-sm">
                        <div><Badge variant="outline">quizId</Badge> - Quiz ID for performance-based recommendations</div>
                        <div><Badge variant="outline">courseId</Badge> - Course ID for course-specific resources</div>
                        <div><Badge variant="outline">programId</Badge> - Program ID for program-wide resources</div>
                        <div><Badge variant="outline">score</Badge> - Quiz score for AI recommendations</div>
                        <div><Badge variant="outline">totalQuestions</Badge> - Total quiz questions</div>
                        <div><Badge variant="outline">limit</Badge> - Number of resources to show (default: 3)</div>
                        <div><Badge variant="outline">showReason</Badge> - Show AI recommendation reasons</div>
                        <div><Badge variant="outline">compact</Badge> - Use compact layout</div>
                        <div><Badge variant="outline">title</Badge> - Custom title</div>
                        <div><Badge variant="outline">description</Badge> - Custom description</div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Features</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• AI-powered personalized recommendations</li>
                        <li>• Performance-based resource filtering</li>
                        <li>• Multiple layout options (card grid, compact list)</li>
                        <li>• Loading states and error handling</li>
                        <li>• Resource type icons and difficulty badges</li>
                        <li>• Rating display and platform badges</li>
                        <li>• External link handling</li>
                        <li>• Responsive design</li>
                      </ul>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 