"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, TrendingUp, TrendingDown, Target, Clock, _RefreshCw, AlertCircle } from "lucide-react"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { _ScrollArea } from "@/components/ui/scroll-area"
import { useAnalytics } from "@/hooks/use-analytics"
import { useOffline } from "@/hooks/use-offline"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from "recharts"

// Create a client-side only wrapper component for charts
function ClientOnlyChart({ children }: { children: React.ReactNode }) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return (
      <div className="h-[300px] w-full bg-muted/20 animate-pulse rounded-md flex items-center justify-center">
        <p className="text-muted-foreground">Loading chart...</p>
      </div>
    )
  }

  return <>{children}</>
}

// Custom tooltip component
function _ChartTooltip({ active, payload, label }: {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  label?: string;
}) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border rounded-lg p-3 shadow-lg">
        <p className="font-medium">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    )
  }
  return null
}

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("all")
  const [date, setDate] = useState<Date | undefined>(undefined)
  
  // Use real analytics data
  const { 
    analytics, 
    charts, 
    _userActivity, 
    loading, 
    error, 
    refreshData, 
    updateUserActivity 
  } = useAnalytics(timeRange, date)

  // Use offline functionality
  const { isOnline, pendingCount } = useOffline()

  // Set date only on client side to avoid hydration mismatch
  useEffect(() => {
    setDate(new Date())
  }, [])

  // Update user activity when page loads
  useEffect(() => {
    updateUserActivity({ 
      activityType: "page_view",
      page: "/analytics"
    })
  }, [updateUserActivity])

  if (loading) {
    return (
      <>
        <DashboardHeader />
        <main className="flex-grow">
          <DashboardShell>
            <div className="flex flex-col gap-8">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">Performance Analytics</h1>
                  <p className="text-muted-foreground">Track your learning progress and identify areas for improvement</p>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {Array(4).fill(0).map((_, i) => (
                  <Card key={i}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                      <div className="h-4 w-4 bg-muted animate-pulse rounded" />
                    </CardHeader>
                    <CardContent>
                      <div className="h-8 w-16 bg-muted animate-pulse rounded mb-2" />
                      <div className="h-4 w-full bg-muted animate-pulse rounded" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </DashboardShell>
        </main>
      </>
    )
  }

  if (error) {
    return (
      <>
        <DashboardHeader />
        <main className="flex-grow">
          <DashboardShell>
            <div className="flex flex-col items-center justify-center gap-4 py-12">
              <AlertCircle className="h-12 w-12 text-destructive" />
              <h2 className="text-2xl font-bold">Error Loading Analytics</h2>
              <p className="text-muted-foreground">{error}</p>
              <Button onClick={refreshData}>Try Again</Button>
            </div>
          </DashboardShell>
        </main>
      </>
    )
  }

  return (
    <>
      <DashboardHeader />
      <main className="flex-grow">
        <DashboardShell>
          <div className="flex flex-col gap-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Performance Analytics</h1>
                <p className="text-muted-foreground">Track your learning progress and identify areas for improvement</p>
              </div>
              <div className="flex items-center gap-2">
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select time range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7d">Last 7 days</SelectItem>
                    <SelectItem value="30d">Last 30 days</SelectItem>
                    <SelectItem value="90d">Last 90 days</SelectItem>
                    <SelectItem value="all">All time</SelectItem>
                  </SelectContent>
                </Select>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      selected={date}
                      onSelect={(selectedDate: Date | undefined) => setDate(selectedDate)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <Button onClick={refreshData} disabled={loading}>
                  {loading ? "Loading..." : "Refresh"}
                </Button>
              </div>
            </div>

            {/* Offline Status Indicator */}
            {!isOnline && (
              <Card className="border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950/20">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                      You&apos;re currently offline. Data will sync when connection is restored.
                      {pendingCount > 0 && ` (${pendingCount} items pending sync)`}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {analytics?.averageScore || 0}%
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {analytics?.improvementRate && analytics.improvementRate > 0 ? (
                      <span className="text-green-600 flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" />
                        +{analytics.improvementRate.toFixed(1)}% from last period
                      </span>
                    ) : analytics?.improvementRate && analytics.improvementRate < 0 ? (
                      <span className="text-red-600 flex items-center gap-1">
                        <TrendingDown className="h-3 w-3" />
                        {analytics.improvementRate.toFixed(1)}% from last period
                      </span>
                    ) : (
                      "No change from last period"
                    )}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Quizzes</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics?.totalQuizzes || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    {analytics?.totalQuestions || 0} questions answered
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Study Hours</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {analytics?.totalStudyHours ? Math.round(analytics.totalStudyHours) : 0}h
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Total time spent studying
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Weak Areas</CardTitle>
                  <AlertCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics?.weakAreas?.length || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    Topics needing improvement
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 gap-2 p-2">
                <TabsTrigger value="overview" className="px-4 py-2">Overview</TabsTrigger>
                <TabsTrigger value="courses" className="px-4 py-2">Courses</TabsTrigger>
                <TabsTrigger value="topics" className="px-4 py-2">Topics</TabsTrigger>
                <TabsTrigger value="activity" className="px-4 py-2">Activity</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Performance Trend</CardTitle>
                      <CardDescription>Your quiz performance over time</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[400px]">
                      <ClientOnlyChart>
                        {charts?.weeklyData && charts.weeklyData.length > 0 ? (
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={charts.weeklyData}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="name" />
                              <YAxis domain={[0, 100]} />
                              <Tooltip />
                              <Legend />
                              <Line
                                type="monotone"
                                dataKey="score"
                                name="Your Score"
                                stroke="#4f46e5"
                                strokeWidth={2}
                                dot={{ fill: "#4f46e5", strokeWidth: 2, r: 4 }}
                              />
                              <Line
                                type="monotone"
                                dataKey="avgScore"
                                name="Average Score"
                                stroke="#6b7280"
                                strokeWidth={2}
                                strokeDasharray="5 5"
                                dot={{ fill: "#6b7280", strokeWidth: 2, r: 4 }}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        ) : (
                          <div className="h-full flex items-center justify-center">
                            <p className="text-muted-foreground">No performance data available</p>
                          </div>
                        )}
                      </ClientOnlyChart>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Subject Distribution</CardTitle>
                      <CardDescription>Time spent on different subjects</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[400px]">
                      <ClientOnlyChart>
                        {charts?.subjectData && charts.subjectData.length > 0 ? (
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={charts.subjectData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }: { name: string; percent: number }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                              >
                                {charts.subjectData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Pie>
                              <Tooltip />
                            </PieChart>
                          </ResponsiveContainer>
                        ) : (
                          <div className="h-full flex items-center justify-center">
                            <p className="text-muted-foreground">No subject data available</p>
                          </div>
                        )}
                      </ClientOnlyChart>
                    </CardContent>
                  </Card>
                </div>

                {/* Knowledge Gap Analysis */}
                <Card>
                  <CardHeader>
                    <CardTitle>Knowledge Gap Analysis</CardTitle>
                    <CardDescription>Identify areas that need improvement</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analytics?.weakAreas?.map((area, index) => (
                        <div key={index} className="rounded-lg border p-4">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium">{area}</h3>
                            <Badge variant="destructive">Needs Work</Badge>
                          </div>
                          <div className="mt-2">
                            <div className="flex items-center justify-between text-sm">
                              <span>Current Level</span>
                              <span>Low</span>
                            </div>
                            <Progress value={30} className="mt-1" />
                          </div>
                          <p className="text-sm text-muted-foreground mt-2">
                            Focus on practice questions and review materials for this topic.
                          </p>
                        </div>
                      ))}
                      {(!analytics?.weakAreas || analytics.weakAreas.length === 0) && (
                        <p className="text-muted-foreground text-center py-8">
                          No weak areas identified. Keep up the great work!
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Courses Tab */}
              <TabsContent value="courses" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Course Performance</CardTitle>
                    <CardDescription>Your performance across different courses</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[400px]">
                    <ClientOnlyChart>
                      {charts?.courseData && charts.courseData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={charts.courseData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} tick={{ fontSize: 12 }} />
                            <YAxis domain={[0, 100]} />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="score" name="Your Score" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="avg" name="Class Average" fill="#6b7280" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="quizzes" name="Quizzes Taken" fill="#10b981" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="h-full flex items-center justify-center">
                          <p className="text-muted-foreground">No course data available</p>
                        </div>
                      )}
                    </ClientOnlyChart>
                  </CardContent>
                </Card>

                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Top Performing Courses</CardTitle>
                      <CardDescription>Your highest scoring subjects</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {analytics?.strongAreas?.slice(0, 3).map((area, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">{area}</p>
                              <p className="text-sm text-muted-foreground">Strong performance</p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium text-green-600">90%+</p>
                              <p className="text-xs text-muted-foreground">Excellent</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Areas for Improvement</CardTitle>
                      <CardDescription>Focus on these topics</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {analytics?.weakAreas?.slice(0, 3).map((area, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">{area}</p>
                              <p className="text-sm text-muted-foreground">Needs attention</p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium text-red-600">60%</p>
                              <p className="text-xs text-muted-foreground">Below average</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Topics Tab */}
              <TabsContent value="topics" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Topic Strength Analysis</CardTitle>
                    <CardDescription>Your proficiency in different topics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {charts?.topicStrengthData?.map((topic, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{topic.name}</span>
                            <span className="text-sm font-medium">{topic.score}%</span>
                          </div>
                          <Progress value={topic.score} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Activity Tab */}
              <TabsContent value="activity" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Monthly Activity</CardTitle>
                    <CardDescription>Your engagement over time</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[400px]">
                    <ClientOnlyChart>
                      {charts?.monthlyActivityData && charts.monthlyActivityData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={charts.monthlyActivityData}>
                            <defs>
                              <linearGradient id="colorQuizzes" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                              </linearGradient>
                              <linearGradient id="colorResources" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Area
                              type="monotone"
                              dataKey="quizzes"
                              name="Quizzes Taken"
                              stroke="#4f46e5"
                              fillOpacity={1}
                              fill="url(#colorQuizzes)"
                            />
                            <Area
                              type="monotone"
                              dataKey="resources"
                              name="Resources Viewed"
                              stroke="#10b981"
                              fillOpacity={1}
                              fill="url(#colorResources)"
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="h-full flex items-center justify-center">
                          <p className="text-muted-foreground">No activity data available</p>
                        </div>
                      )}
                    </ClientOnlyChart>
                  </CardContent>
                </Card>

                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Study Consistency</CardTitle>
                      <CardDescription>How regularly you engage with quizzes</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-medium">Current Streak</h3>
                            <p className="text-sm text-muted-foreground">Days in a row with activity</p>
                          </div>
                          <div className="text-2xl font-bold">5 days</div>
                        </div>
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-medium">Longest Streak</h3>
                            <p className="text-sm text-muted-foreground">Your best streak</p>
                          </div>
                          <div className="text-2xl font-bold">12 days</div>
                        </div>
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-medium">Weekly Average</h3>
                            <p className="text-sm text-muted-foreground">Days active per week</p>
                          </div>
                          <div className="text-2xl font-bold">4.5 days</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Activity</CardTitle>
                      <CardDescription>Your latest learning activities</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <span className="flex h-2 w-2 rounded-full bg-green-500"></span>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <p className="font-medium">Quiz Completed</p>
                              <p className="font-medium text-green-500">+10%</p>
                            </div>
                            <div className="flex items-center justify-between text-sm text-muted-foreground">
                              <p>Data Structures Quiz</p>
                              <p>2 hours ago</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="flex h-2 w-2 rounded-full bg-blue-500"></span>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <p className="font-medium">Resource Viewed</p>
                              <p className="font-medium text-blue-500">+5%</p>
                            </div>
                            <div className="flex items-center justify-between text-sm text-muted-foreground">
                              <p>Algorithms Tutorial</p>
                              <p>1 day ago</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="flex h-2 w-2 rounded-full bg-green-500"></span>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <p className="font-medium">UI/UX Design</p>
                              <p className="font-medium text-green-500">+10%</p>
                            </div>
                            <div className="flex items-center justify-between text-sm text-muted-foreground">
                              <p>From 70% to 80%</p>
                              <p>Last 30 days</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </DashboardShell>
      </main>
    </>
  )
}
