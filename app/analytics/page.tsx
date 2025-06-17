"use client"

import { useState, useEffect } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Calendar, BarChart3, PieChart, ArrowDown, ArrowUp, TrendingUp, CalendarIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ChartTooltip } from "@/components/ui/chart"
import { format } from "date-fns"
import dynamic from "next/dynamic"

// Dynamically import Recharts components with SSR disabled
const RechartsBarChart = dynamic(() => import("recharts").then((mod) => mod.BarChart), { ssr: false })
const RechartsLineChart = dynamic(() => import("recharts").then((mod) => mod.LineChart), { ssr: false })
const RechartsPieChart = dynamic(() => import("recharts").then((mod) => mod.PieChart), { ssr: false })
const RechartsAreaChart = dynamic(() => import("recharts").then((mod) => mod.AreaChart), { ssr: false })
const Pie = dynamic(() => import("recharts").then((mod) => mod.Pie), { ssr: false })
const Bar = dynamic(() => import("recharts").then((mod) => mod.Bar), { ssr: false })
const Area = dynamic(() => import("recharts").then((mod) => mod.Area), { ssr: false })
const Line = dynamic(() => import("recharts").then((mod) => mod.Line), { ssr: false })
const XAxis = dynamic(() => import("recharts").then((mod) => mod.XAxis), { ssr: false })
const YAxis = dynamic(() => import("recharts").then((mod) => mod.YAxis), { ssr: false })
const CartesianGrid = dynamic(() => import("recharts").then((mod) => mod.CartesianGrid), { ssr: false })
const Legend = dynamic(() => import("recharts").then((mod) => mod.Legend), { ssr: false })
const ResponsiveContainer = dynamic(() => import("recharts").then((mod) => mod.ResponsiveContainer), { ssr: false })
const Cell = dynamic(() => import("recharts").then((mod) => mod.Cell), { ssr: false })

const courseData = [
  { name: "Introduction to Computer Science", score: 85, avg: 75, quizzes: 3 },
  { name: "Programming in Python", score: 92, avg: 70, quizzes: 4 },
  { name: "Data Structures", score: 78, avg: 72, quizzes: 2 },
  { name: "Discrete Mathematics", score: 65, avg: 68, quizzes: 3 },
  { name: "Web Development", score: 88, avg: 74, quizzes: 2 },
]

const weeklyData = [
  { name: "Week 1", score: 65, avgScore: 60 },
  { name: "Week 2", score: 70, avgScore: 62 },
  { name: "Week 3", score: 75, avgScore: 65 },
  { name: "Week 4", score: 72, avgScore: 68 },
  { name: "Week 5", score: 78, avgScore: 70 },
  { name: "Week 6", score: 82, avgScore: 72 },
  { name: "Week 7", score: 80, avgScore: 73 },
  { name: "Week 8", score: 85, avgScore: 75 },
  { name: "Week 9", score: 90, avgScore: 78 },
  { name: "Week 10", score: 92, avgScore: 80 },
]

const subjectData = [
  { name: "Programming", value: 35, color: "#4f46e5" },
  { name: "Mathematics", value: 20, color: "#0ea5e9" },
  { name: "Theory", value: 15, color: "#10b981" },
  { name: "Web Dev", value: 15, color: "#f59e0b" },
  { name: "Databases", value: 10, color: "#ef4444" },
  { name: "Others", value: 5, color: "#8b5cf6" },
]

const topicStrengthData = [
  { name: "Algorithms", score: 90 },
  { name: "Data Structures", score: 85 },
  { name: "OOP Concepts", score: 78 },
  { name: "Web Security", score: 65 },
  { name: "Database Design", score: 72 },
  { name: "UI/UX Design", score: 80 },
  { name: "Machine Learning", score: 60 },
  { name: "Networking", score: 55 },
]

const monthlyActivityData = [
  { date: "Jan", quizzes: 10, resources: 5 },
  { date: "Feb", quizzes: 12, resources: 8 },
  { date: "Mar", quizzes: 15, resources: 10 },
  { date: "Apr", quizzes: 14, resources: 12 },
  { date: "May", quizzes: 18, resources: 15 },
  { date: "Jun", quizzes: 20, resources: 18 },
  { date: "Jul", quizzes: 22, resources: 20 },
  { date: "Aug", quizzes: 25, resources: 22 },
  { date: "Sep", quizzes: 28, resources: 25 },
  { date: "Oct", quizzes: 30, resources: 28 },
  { date: "Nov", quizzes: 35, resources: 30 },
  { date: "Dec", quizzes: 40, resources: 35 },
]

// Create a client-side only wrapper component for charts
function ClientOnlyChart({ children }) {
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

  return children
}

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("all")
  const [date, setDate] = useState(null)

  // Set date only on client side to avoid hydration mismatch
  useEffect(() => {
    setDate(new Date())
  }, [])

  return (
    <>
      <DashboardHeader />
      <DashboardShell>
        <div className="flex flex-col gap-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Performance Analytics</h1>
              <p className="text-muted-foreground">Track your learning progress and identify areas for improvement</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="gap-1">
                    <CalendarIcon className="h-4 w-4" />
                    {date ? format(date, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <CalendarComponent mode="single" selected={date} onSelect={setDate} initialFocus />
                </PopoverContent>
              </Popover>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Time Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Last 7 Days</SelectItem>
                  <SelectItem value="month">Last 30 Days</SelectItem>
                  <SelectItem value="semester">Current Semester</SelectItem>
                  <SelectItem value="year">Academic Year</SelectItem>
                  <SelectItem value="all">All Time</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">78%</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <ArrowUp className="mr-1 h-4 w-4 text-green-500" />
                  <span className="text-green-500 font-medium">+5.2%</span>
                  <span className="ml-1">from last month</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Quizzes</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">32</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <ArrowUp className="mr-1 h-4 w-4 text-green-500" />
                  <span className="text-green-500 font-medium">+8</span>
                  <span className="ml-1">from last month</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Improvement Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12.5%</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <ArrowUp className="mr-1 h-4 w-4 text-green-500" />
                  <span className="text-green-500 font-medium">+2.1%</span>
                  <span className="ml-1">from initial scores</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Weak Areas</CardTitle>
                <PieChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <ArrowDown className="mr-1 h-4 w-4 text-green-500" />
                  <span className="text-green-500 font-medium">-2</span>
                  <span className="ml-1">from last month</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="courses">Courses</TabsTrigger>
              <TabsTrigger value="topics">Topics</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card className="col-span-1">
                  <CardHeader>
                    <CardTitle>Score Trends</CardTitle>
                    <CardDescription>Your quiz scores compared to class average</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    <ClientOnlyChart>
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsLineChart data={weeklyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis domain={[0, 100]} />
                          <ChartTooltip
                            content={({ active, payload }) => {
                              if (active && payload && payload.length) {
                                return (
                                  <div className="rounded-lg border bg-background p-2 shadow-sm">
                                    <div className="grid grid-cols-2 gap-2">
                                      <div className="flex flex-col">
                                        <span className="text-[0.70rem] uppercase text-muted-foreground">
                                          Your Score
                                        </span>
                                        <span className="font-bold text-[0.85rem]">{payload[0].value}%</span>
                                      </div>
                                      <div className="flex flex-col">
                                        <span className="text-[0.70rem] uppercase text-muted-foreground">Average</span>
                                        <span className="font-bold text-[0.85rem]">{payload[1].value}%</span>
                                      </div>
                                    </div>
                                  </div>
                                )
                              }
                              return null
                            }}
                          />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="score"
                            name="Your Score"
                            stroke="#4f46e5"
                            strokeWidth={2}
                            dot={{ r: 4 }}
                            activeDot={{ r: 6 }}
                          />
                          <Line
                            type="monotone"
                            dataKey="avgScore"
                            name="Class Average"
                            stroke="#94a3b8"
                            strokeDasharray="5 5"
                            strokeWidth={2}
                            dot={{ r: 4 }}
                          />
                        </RechartsLineChart>
                      </ResponsiveContainer>
                    </ClientOnlyChart>
                  </CardContent>
                </Card>

                <Card className="col-span-1">
                  <CardHeader>
                    <CardTitle>Subject Distribution</CardTitle>
                    <CardDescription>Quiz attempts by subject area</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    <ClientOnlyChart>
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsPieChart>
                          <Pie
                            data={subjectData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={2}
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            labelLine={false}
                          >
                            {subjectData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <ChartTooltip
                            content={({ active, payload }) => {
                              if (active && payload && payload.length) {
                                return (
                                  <div className="rounded-lg border bg-background p-2 shadow-sm">
                                    <div className="flex flex-col">
                                      <span className="text-[0.70rem] uppercase text-muted-foreground">Subject</span>
                                      <span className="font-bold text-[0.85rem]">{payload[0].name}</span>
                                      <span className="text-[0.70rem] uppercase text-muted-foreground mt-1">
                                        Percentage
                                      </span>
                                      <span className="font-bold text-[0.85rem]">{payload[0].value}%</span>
                                    </div>
                                  </div>
                                )
                              }
                              return null
                            }}
                          />
                          <Legend />
                        </RechartsPieChart>
                      </ResponsiveContainer>
                    </ClientOnlyChart>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Knowledge Gap Analysis</CardTitle>
                  <CardDescription>Identify areas that need improvement</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="rounded-lg border p-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">Web Security</h3>
                        <Badge
                          variant="outline"
                          className="bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300"
                        >
                          High Priority
                        </Badge>
                      </div>
                      <div className="mt-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Mastery</span>
                          <span>35%</span>
                        </div>
                        <div className="h-2 mt-1 bg-muted rounded-full overflow-hidden">
                          <div className="bg-red-500 h-full rounded-full" style={{ width: "35%" }}></div>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        Your score is 30% below average for your program.
                      </p>
                    </div>

                    <div className="rounded-lg border p-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">Networking Concepts</h3>
                        <Badge
                          variant="outline"
                          className="bg-amber-100 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300"
                        >
                          Medium Priority
                        </Badge>
                      </div>
                      <div className="mt-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Mastery</span>
                          <span>55%</span>
                        </div>
                        <div className="h-2 mt-1 bg-muted rounded-full overflow-hidden">
                          <div className="bg-amber-500 h-full rounded-full" style={{ width: "55%" }}></div>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        Your score is 15% below average for your program.
                      </p>
                    </div>

                    <div className="rounded-lg border p-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">Machine Learning Basics</h3>
                        <Badge
                          variant="outline"
                          className="bg-amber-100 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300"
                        >
                          Medium Priority
                        </Badge>
                      </div>
                      <div className="mt-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Mastery</span>
                          <span>60%</span>
                        </div>
                        <div className="h-2 mt-1 bg-muted rounded-full overflow-hidden">
                          <div className="bg-amber-500 h-full rounded-full" style={{ width: "60%" }}></div>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        Your score is 10% below average for your program.
                      </p>
                    </div>
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
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsBarChart data={courseData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} tick={{ fontSize: 12 }} />
                        <YAxis domain={[0, 100]} />
                        <ChartTooltip
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              return (
                                <div className="rounded-lg border bg-background p-2 shadow-sm">
                                  <div className="grid grid-cols-3 gap-2">
                                    <div className="flex flex-col">
                                      <span className="text-[0.70rem] uppercase text-muted-foreground">Your Score</span>
                                      <span className="font-bold text-[0.85rem]">{payload[0].value}%</span>
                                    </div>
                                    <div className="flex flex-col">
                                      <span className="text-[0.70rem] uppercase text-muted-foreground">
                                        Class Average
                                      </span>
                                      <span className="font-bold text-[0.85rem]">{payload[1].value}%</span>
                                    </div>
                                    <div className="flex flex-col">
                                      <span className="text-[0.70rem] uppercase text-muted-foreground">
                                        Quizzes Taken
                                      </span>
                                      <span className="font-bold text-[0.85rem]">{payload[2].value}</span>
                                    </div>
                                  </div>
                                </div>
                              )
                            }
                            return null
                          }}
                        />
                        <Legend />
                        <Bar dataKey="score" name="Your Score" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="avg" name="Class Average" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="quizzes" name="Quizzes Taken" fill="#10b981" radius={[4, 4, 0, 0]} />
                      </RechartsBarChart>
                    </ResponsiveContainer>
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
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Programming in Python</p>
                          <p className="text-sm text-muted-foreground">4 quizzes completed</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">92%</p>
                          <p className="text-xs text-muted-foreground">+22% above average</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Web Development</p>
                          <p className="text-sm text-muted-foreground">2 quizzes completed</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">88%</p>
                          <p className="text-xs text-muted-foreground">+14% above average</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Introduction to Computer Science</p>
                          <p className="text-sm text-muted-foreground">3 quizzes completed</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">85%</p>
                          <p className="text-xs text-muted-foreground">+10% above average</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Courses Needing Improvement</CardTitle>
                    <CardDescription>Subjects where you scored below your average</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Discrete Mathematics</p>
                          <p className="text-sm text-muted-foreground">3 quizzes completed</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">65%</p>
                          <p className="text-xs text-muted-foreground">-3% below average</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Data Structures</p>
                          <p className="text-sm text-muted-foreground">2 quizzes completed</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">78%</p>
                          <p className="text-xs text-muted-foreground">+6% above average</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Database Systems</p>
                          <p className="text-sm text-muted-foreground">1 quiz completed</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">75%</p>
                          <p className="text-xs text-muted-foreground">+2% above average</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Topics Tab */}
            <TabsContent value="topics" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Topic Strengths and Weaknesses</CardTitle>
                  <CardDescription>Your performance across different topics</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ClientOnlyChart>
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsBarChart
                        data={topicStrengthData}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" domain={[0, 100]} />
                        <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 12 }} />
                        <ChartTooltip
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              const score = payload[0].value as number
                              let level = "Expert"
                              let color = "text-green-500"

                              if (score < 60) {
                                level = "Needs Improvement"
                                color = "text-red-500"
                              } else if (score < 75) {
                                level = "Intermediate"
                                color = "text-amber-500"
                              } else if (score < 90) {
                                level = "Advanced"
                                color = "text-blue-500"
                              }

                              return (
                                <div className="rounded-lg border bg-background p-2 shadow-sm">
                                  <div className="flex flex-col">
                                    <span className="text-[0.70rem] uppercase text-muted-foreground">Topic</span>
                                    <span className="font-bold text-[0.85rem]">{payload[0].name}</span>
                                    <span className="text-[0.70rem] uppercase text-muted-foreground mt-1">Score</span>
                                    <span className="font-bold text-[0.85rem]">{score}%</span>
                                    <span className={`text-[0.85rem] font-medium mt-1 ${color}`}>{level}</span>
                                  </div>
                                </div>
                              )
                            }
                            return null
                          }}
                        />
                        <Bar dataKey="score" name="Mastery Score" radius={[0, 4, 4, 0]}>
                          {topicStrengthData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={
                                entry.score >= 80
                                  ? "#10b981"
                                  : entry.score >= 70
                                    ? "#3b82f6"
                                    : entry.score >= 60
                                      ? "#f59e0b"
                                      : "#ef4444"
                              }
                            />
                          ))}
                        </Bar>
                      </RechartsBarChart>
                    </ResponsiveContainer>
                  </ClientOnlyChart>
                </CardContent>
              </Card>

              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Recommended Focus Areas</CardTitle>
                    <CardDescription>Topics you should focus on improving</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <span className="flex h-2 w-2 rounded-full bg-red-500"></span>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="font-medium">Networking</p>
                            <p className="font-medium">55%</p>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Focus on TCP/IP protocols and network security
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className="flex h-2 w-2 rounded-full bg-red-500"></span>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="font-medium">Machine Learning</p>
                            <p className="font-medium">60%</p>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Review classification algorithms and model evaluation
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className="flex h-2 w-2 rounded-full bg-amber-500"></span>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="font-medium">Web Security</p>
                            <p className="font-medium">65%</p>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Practice more on XSS prevention and authentication
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Recent Improvements</CardTitle>
                    <CardDescription>Topics where you've shown the most progress</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <span className="flex h-2 w-2 rounded-full bg-green-500"></span>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="font-medium">Algorithms</p>
                            <p className="font-medium text-green-500">+15%</p>
                          </div>
                          <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <p>From 75% to 90%</p>
                            <p>Last 30 days</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className="flex h-2 w-2 rounded-full bg-green-500"></span>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="font-medium">OOP Concepts</p>
                            <p className="font-medium text-green-500">+12%</p>
                          </div>
                          <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <p>From 66% to 78%</p>
                            <p>Last 30 days</p>
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

            {/* Activity Tab */}
            <TabsContent value="activity" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Activity Trends</CardTitle>
                  <CardDescription>Your monthly quiz and resource activity</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ClientOnlyChart>
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsAreaChart data={monthlyActivityData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
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
                        <XAxis dataKey="date" />
                        <YAxis />
                        <CartesianGrid strokeDasharray="3 3" />
                        <ChartTooltip
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              return (
                                <div className="rounded-lg border bg-background p-2 shadow-sm">
                                  <div className="grid grid-cols-2 gap-2">
                                    <div className="flex flex-col">
                                      <span className="text-[0.70rem] uppercase text-muted-foreground">
                                        Quizzes Taken
                                      </span>
                                      <span className="font-bold text-[0.85rem]">{payload[0].value}</span>
                                    </div>
                                    <div className="flex flex-col">
                                      <span className="text-[0.70rem] uppercase text-muted-foreground">
                                        Resources Viewed
                                      </span>
                                      <span className="font-bold text-[0.85rem]">{payload[1].value}</span>
                                    </div>
                                  </div>
                                </div>
                              )
                            }
                            return null
                          }}
                        />
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
                      </RechartsAreaChart>
                    </ResponsiveContainer>
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
                    <CardTitle>Time Distribution</CardTitle>
                    <CardDescription>When you're most active during the day</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[200px]">
                      <ClientOnlyChart>
                        <ResponsiveContainer width="100%" height="100%">
                          <RechartsBarChart
                            data={[
                              { time: "Morning", count: 12 },
                              { time: "Afternoon", count: 18 },
                              { time: "Evening", count: 30 },
                              { time: "Night", count: 8 },
                            ]}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="time" />
                            <YAxis />
                            <ChartTooltip
                              content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                  return (
                                    <div className="rounded-lg border bg-background p-2 shadow-sm">
                                      <div className="flex flex-col">
                                        <span className="text-[0.70rem] uppercase text-muted-foreground">
                                          Time of Day
                                        </span>
                                        <span className="font-bold text-[0.85rem]">{payload[0].name}</span>
                                        <span className="text-[0.70rem] uppercase text-muted-foreground mt-1">
                                          Activities
                                        </span>
                                        <span className="font-bold text-[0.85rem]">{payload[0].value}</span>
                                      </div>
                                    </div>
                                  )
                                }
                                return null
                              }}
                            />
                            <Bar dataKey="count" name="Activities" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                          </RechartsBarChart>
                        </ResponsiveContainer>
                      </ClientOnlyChart>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      You're most active in the evenings between 7pm and 10pm.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DashboardShell>
    </>
  )
}
