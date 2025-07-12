"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Users, BarChart3, ExternalLink } from "lucide-react"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then(res => res.json())

interface Program {
  id: string
  title: string
  description: string
  years: any[]
  statistics: {
    totalQuizzes: number
    totalResources: number
    totalSubmissions: number
    enrolledStudents: number
    totalCourses: number
  }
}

export default function ProgramsPage() {
  const { data: programs, error, isLoading } = useSWR<Program[]>("/api/programs", fetcher)

  if (isLoading) {
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

  if (error) {
    return (
      <>
        <DashboardHeader />
        <DashboardShell>
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Error loading programs. Please try again.</p>
          </div>
        </DashboardShell>
      </>
    )
  }

  if (!programs) return null

  // Dynamically categorize programs based on their properties
  const programCategories = {
    "science-tech": programs.filter(p => 
      p.title.toLowerCase().includes('computer') || 
      p.title.toLowerCase().includes('mathematics') || 
      p.title.toLowerCase().includes('physics') ||
      p.title.toLowerCase().includes('science')
    ),
    "engineering": programs.filter(p => 
      p.title.toLowerCase().includes('engineering') ||
      p.title.toLowerCase().includes('mechanical') ||
      p.title.toLowerCase().includes('electrical') ||
      p.title.toLowerCase().includes('civil') ||
      p.title.toLowerCase().includes('chemical')
    ),
    "humanities": programs.filter(p => 
      p.title.toLowerCase().includes('business') || 
      p.title.toLowerCase().includes('economics') || 
      p.title.toLowerCase().includes('sociology') ||
      p.title.toLowerCase().includes('law') ||
      p.title.toLowerCase().includes('arts')
    ),
    "health": programs.filter(p => 
      p.title.toLowerCase().includes('nursing') || 
      p.title.toLowerCase().includes('pharmacy') || 
      p.title.toLowerCase().includes('biomedical') ||
      p.title.toLowerCase().includes('medicine') ||
      p.title.toLowerCase().includes('health')
    ),
    "design": programs.filter(p => 
      p.title.toLowerCase().includes('architecture') ||
      p.title.toLowerCase().includes('design')
    )
  }

  // Only show categories that have programs
  const activeCategories = Object.entries(programCategories).filter(([_, programs]) => programs.length > 0)
  const defaultCategory = activeCategories.length > 0 ? activeCategories[0][0] : "science-tech"

  return (
    <>
      <DashboardHeader />
      <DashboardShell>
        <div className="flex flex-col gap-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Academic Programs</h1>
            <p className="text-muted-foreground">Browse available programs and their courses to find quizzes and resources.</p>
          </div>

          <Tabs defaultValue={defaultCategory} className="space-y-4">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 gap-2 p-2">
              {activeCategories.map(([category, categoryPrograms]) => (
                <TabsTrigger key={category} value={category} className="px-4 py-2 text-sm">
                  {category === "science-tech" && "Science & Technology"}
                  {category === "engineering" && "Engineering"}
                  {category === "humanities" && "Humanities & Social Sciences"}
                  {category === "health" && "Health Sciences"}
                  {category === "design" && "Design & Architecture"}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {activeCategories.map(([category, categoryPrograms]) => (
              <TabsContent key={category} value={category} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {categoryPrograms.map((program) => (
                    <Card key={program.id} className="h-full hover:bg-muted/50 transition-colors">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          {program.title}
                          {program.statistics.enrolledStudents > 0 && (
                            <Badge variant="secondary" className="text-xs">
                              {program.statistics.enrolledStudents} enrolled
                            </Badge>
                          )}
                        </CardTitle>
                        <CardDescription>
                          {program.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <BookOpen className="h-3 w-3" />
                            <span>{program.statistics.totalCourses} courses</span>
                          </div>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <BarChart3 className="h-3 w-3" />
                            <span>{program.statistics.totalQuizzes} quizzes</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <ExternalLink className="h-3 w-3" />
                          <span>{program.statistics.totalResources} resources</span>
                        </div>
                        {program.statistics.totalSubmissions > 0 && (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Users className="h-3 w-3" />
                            <span>{program.statistics.totalSubmissions} submissions</span>
                          </div>
                        )}
                      </CardContent>
                      <CardFooter className="flex gap-2">
                        <Link href={`/dashboard?program=${program.id}`} className="flex-1">
                          <Button variant="outline" className="w-full">
                            View Courses
                          </Button>
                        </Link>
                        <Link href={`/resources?programId=${program.id}`}>
                          <Button variant="ghost" size="sm">
                            Resources
                          </Button>
                        </Link>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </DashboardShell>
    </>
  )
}
