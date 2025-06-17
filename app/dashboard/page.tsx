"use client"

import { Badge } from "@/components/ui/badge"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { RecentQuizzes } from "@/components/recent-quizzes"
import { RecommendedResources } from "@/components/recommended-resources"
import { ProgramSelector } from "@/components/program-selector"
import { AIRecommendations } from "@/components/ai-recommendations"
import { CalendarDays, BookOpen, Users, BarChart3, Clock, Award, Video } from "lucide-react"
import { LogoWithTagline } from "@/components/logo"
import { UserAvatar } from "@/components/user-avatar"

export default function DashboardPage() {
  const [selectedProgram, setSelectedProgram] = useState("computer-science")
  const [selectedYear, setSelectedYear] = useState("1")
  const [selectedSemester, setSelectedSemester] = useState("1")

  return (
    <>
      <DashboardHeader />
      <DashboardShell>
        <div className="flex flex-col gap-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
              <p className="text-muted-foreground">
                Welcome back! Here you can view your recent quizzes and recommended resources.
              </p>
              <LogoWithTagline className="hidden lg:block" />
            </div>
            <div className="flex items-center gap-4">
              <UserAvatar user={{ name: "John Doe" }} className="h-12 w-12 border-2 border-primary/10" fallback="JD" />
              <div>
                <p className="font-medium">John Doe</p>
                <p className="text-sm text-muted-foreground">Computer Science, Year 2</p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Quizzes Taken</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8</div>
                <p className="text-xs text-muted-foreground">+2 from last week</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">76%</div>
                <p className="text-xs text-muted-foreground">+4% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Study Hours</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24</div>
                <p className="text-xs text-muted-foreground">+6 from last week</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Study Streak</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">5 days</div>
                <p className="text-xs text-muted-foreground">Keep it up!</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="grid grid-cols-2 md:grid-cols-6 lg:w-auto">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
              <TabsTrigger value="ai-recommendations">AI Recommendations</TabsTrigger>
              <TabsTrigger value="schedule">Schedule</TabsTrigger>
              <TabsTrigger value="social">Social</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-full lg:col-span-4">
                  <CardHeader>
                    <CardTitle>Recent Quizzes</CardTitle>
                    <CardDescription>Your recently taken quizzes and scores.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <RecentQuizzes />
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full" asChild>
                      <Link href="/quizzes">View All Quizzes</Link>
                    </Button>
                  </CardFooter>
                </Card>
                <Card className="col-span-full lg:col-span-3">
                  <CardHeader>
                    <CardTitle>Recommended Resources</CardTitle>
                    <CardDescription>Personalized learning resources based on your performance.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <RecommendedResources />
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full" asChild>
                      <Link href="/resources">View All Resources</Link>
                    </Button>
                  </CardFooter>
                </Card>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-full lg:col-span-3">
                  <CardHeader>
                    <CardTitle>Upcoming Schedule</CardTitle>
                    <CardDescription>Your planned study sessions and quizzes.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 rounded-lg border p-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                          <CalendarDays className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">Database Systems Quiz</p>
                          <p className="text-sm text-muted-foreground">Today, 3:00 PM</p>
                        </div>
                        <Button size="sm">Start</Button>
                      </div>
                      <div className="flex items-center gap-4 rounded-lg border p-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                          <BookOpen className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">Data Structures Study Session</p>
                          <p className="text-sm text-muted-foreground">Tomorrow, 10:00 AM</p>
                        </div>
                        <Button size="sm" variant="outline">
                          View
                        </Button>
                      </div>
                      <div className="flex items-center gap-4 rounded-lg border p-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                          <Users className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">Algorithms Study Group</p>
                          <p className="text-sm text-muted-foreground">May 20, 4:00 PM</p>
                        </div>
                        <Button size="sm" variant="outline">
                          View
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full" asChild>
                      <Link href="/scheduler">View Full Schedule</Link>
                    </Button>
                  </CardFooter>
                </Card>
                <Card className="col-span-full lg:col-span-4">
                  <CardHeader>
                    <CardTitle>AI-Powered Recommendations</CardTitle>
                    <CardDescription>Personalized suggestions based on your learning patterns.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="rounded-lg border p-4">
                        <h3 className="font-medium">Dynamic Programming Fundamentals</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          A comprehensive course covering dynamic programming from basics to advanced techniques.
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge
                            variant="secondary"
                            className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300"
                          >
                            Intermediate
                          </Badge>
                          <Badge variant="secondary">Video Course</Badge>
                        </div>
                      </div>
                      <div className="rounded-lg border p-4">
                        <h3 className="font-medium">Database Indexing Strategies</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Understand how database indexing works and learn best practices for optimizing query
                          performance.
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge
                            variant="secondary"
                            className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300"
                          >
                            Intermediate
                          </Badge>
                          <Badge variant="secondary">Article</Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full" asChild>
                      <Link href="/resources?tab=ai-recommendations">View All Recommendations</Link>
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="quizzes" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Take a New Quiz</CardTitle>
                  <CardDescription>Select your program, year, and semester to find quizzes.</CardDescription>
                </CardHeader>
                <CardContent>
                  <ProgramSelector
                    selectedProgram={selectedProgram}
                    selectedYear={selectedYear}
                    selectedSemester={selectedSemester}
                    onProgramChange={setSelectedProgram}
                    onYearChange={setSelectedYear}
                    onSemesterChange={setSelectedSemester}
                  />

                  <div className="mt-6">
                    <h3 className="text-lg font-medium mb-4">Available Courses</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedProgram === "computer-science" && selectedYear === "1" && selectedSemester === "1" && (
                        <>
                          <Link href={`/quiz/intro-to-cs`}>
                            <Card className="hover:bg-muted cursor-pointer transition-colors">
                              <CardHeader className="p-4">
                                <CardTitle className="text-base">Introduction to Computer Science</CardTitle>
                              </CardHeader>
                            </Card>
                          </Link>
                          <Link href={`/quiz/math-for-cs`}>
                            <Card className="hover:bg-muted cursor-pointer transition-colors">
                              <CardHeader className="p-4">
                                <CardTitle className="text-base">Mathematics for Computer Science</CardTitle>
                              </CardHeader>
                            </Card>
                          </Link>
                          <Link href={`/quiz/intro-to-python`}>
                            <Card className="hover:bg-muted cursor-pointer transition-colors">
                              <CardHeader className="p-4">
                                <CardTitle className="text-base">Introduction to Programming (Python)</CardTitle>
                              </CardHeader>
                            </Card>
                          </Link>
                          <Link href={`/quiz/fundamentals-computing`}>
                            <Card className="hover:bg-muted cursor-pointer transition-colors">
                              <CardHeader className="p-4">
                                <CardTitle className="text-base">Fundamentals of Computing</CardTitle>
                              </CardHeader>
                            </Card>
                          </Link>
                          <Link href={`/quiz/communication-skills`}>
                            <Card className="hover:bg-muted cursor-pointer transition-colors">
                              <CardHeader className="p-4">
                                <CardTitle className="text-base">Communication Skills</CardTitle>
                              </CardHeader>
                            </Card>
                          </Link>
                        </>
                      )}

                      {selectedProgram === "computer-science" && selectedYear === "1" && selectedSemester === "2" && (
                        <>
                          <Link href={`/quiz/data-structures`}>
                            <Card className="hover:bg-muted cursor-pointer transition-colors">
                              <CardHeader className="p-4">
                                <CardTitle className="text-base">Data Structures and Algorithms</CardTitle>
                              </CardHeader>
                            </Card>
                          </Link>
                          <Link href={`/quiz/discrete-math`}>
                            <Card className="hover:bg-muted cursor-pointer transition-colors">
                              <CardHeader className="p-4">
                                <CardTitle className="text-base">Discrete Mathematics</CardTitle>
                              </CardHeader>
                            </Card>
                          </Link>
                          <Link href={`/quiz/database-systems`}>
                            <Card className="hover:bg-muted cursor-pointer transition-colors">
                              <CardHeader className="p-4">
                                <CardTitle className="text-base">Database Systems I</CardTitle>
                              </CardHeader>
                            </Card>
                          </Link>
                        </>
                      )}

                      {/* Add more conditions for other programs, years, and semesters */}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="resources" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Learning Resources</CardTitle>
                  <CardDescription>Personalized resources to help you improve.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="rounded-lg border p-4">
                      <h3 className="font-medium">Introduction to Programming (Python)</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Based on your recent quiz performance, we recommend these resources:
                      </p>
                      <ul className="mt-3 space-y-2">
                        <li className="text-sm flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-primary" />
                          <a href="#" className="text-primary hover:underline">
                            Python Data Structures Tutorial
                          </a>
                        </li>
                        <li className="text-sm flex items-center gap-2">
                          <Video className="h-4 w-4 text-primary" />
                          <a href="#" className="text-primary hover:underline">
                            Video: Functions and Recursion in Python
                          </a>
                        </li>
                      </ul>
                    </div>

                    <div className="rounded-lg border p-4">
                      <h3 className="font-medium">Mathematics for Computer Science</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Based on your recent quiz performance, we recommend these resources:
                      </p>
                      <ul className="mt-3 space-y-2">
                        <li className="text-sm flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-primary" />
                          <a href="#" className="text-primary hover:underline">
                            Linear Algebra Fundamentals
                          </a>
                        </li>
                        <li className="text-sm flex items-center gap-2">
                          <CalendarDays className="h-4 w-4 text-primary" />
                          <a href="#" className="text-primary hover:underline">
                            Practice Exercises: Calculus for CS
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/resources">Browse All Resources</Link>
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="ai-recommendations" className="space-y-4">
              <AIRecommendations />
            </TabsContent>
            <TabsContent value="schedule" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Study Schedule</CardTitle>
                  <CardDescription>Your upcoming study sessions and quizzes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="rounded-lg border p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                            <CalendarDays className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-medium">Database Systems Quiz</h3>
                            <p className="text-sm text-muted-foreground">Today, 3:00 PM - 4:00 PM</p>
                          </div>
                        </div>
                        <Badge>High Priority</Badge>
                      </div>
                    </div>
                    <div className="rounded-lg border p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                            <BookOpen className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-medium">Data Structures Study Session</h3>
                            <p className="text-sm text-muted-foreground">Tomorrow, 10:00 AM - 12:00 PM</p>
                          </div>
                        </div>
                        <Badge variant="outline">Medium Priority</Badge>
                      </div>
                    </div>
                    <div className="rounded-lg border p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                            <Users className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-medium">Algorithms Study Group</h3>
                            <p className="text-sm text-muted-foreground">May 20, 4:00 PM - 6:00 PM</p>
                          </div>
                        </div>
                        <Badge variant="outline">Medium Priority</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/scheduler">View Full Schedule</Link>
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="social" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Social Activity</CardTitle>
                  <CardDescription>Recent activity from your connections</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="rounded-lg border p-4">
                      <div className="flex gap-4">
                        <UserAvatar user={{ name: "Alex Johnson" }} fallback="AJ" />
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium">Alex Johnson</p>
                            <p className="text-sm text-muted-foreground">@alexj</p>
                          </div>
                          <p className="mt-1">
                            Completed the <span className="font-medium">Data Structures and Algorithms</span> quiz with
                            a score of <span className="font-medium">92%</span>
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">2 hours ago</p>
                        </div>
                      </div>
                    </div>
                    <div className="rounded-lg border p-4">
                      <div className="flex gap-4">
                        <UserAvatar user={{ name: "Michael Chen" }} fallback="MC" />
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium">Michael Chen</p>
                            <p className="text-sm text-muted-foreground">@mchen</p>
                          </div>
                          <p className="mt-1">
                            Earned the <span className="font-medium">Perfect Score</span> achievement!
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">5 hours ago</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/social">View Social Hub</Link>
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </DashboardShell>
    </>
  )
}
