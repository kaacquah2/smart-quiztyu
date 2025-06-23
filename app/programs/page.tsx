import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { programs } from "@/lib/program-data"

// Categorize programs
const programCategories = {
  "science-tech": programs.filter(p => 
    p.id === "computer-science" || 
    p.id === "mathematics" || 
    p.id === "physics"
  ),
  "engineering": programs.filter(p => 
    p.id === "electrical-engineering" || 
    p.id === "mechanical-engineering" || 
    p.id === "civil-engineering"
  ),
  "humanities": programs.filter(p => 
    p.id === "business-admin" || 
    p.id === "economics" || 
    p.id === "sociology"
  ),
  "health": programs.filter(p => 
    p.id === "nursing" || 
    p.id === "pharmacy" || 
    p.id === "biomedical-science"
  )
}

export default function ProgramsPage() {
  return (
    <>
      <DashboardHeader />
      <DashboardShell>
        <div className="flex flex-col gap-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Academic Programs</h1>
            <p className="text-muted-foreground">Browse available programs and their courses to find quizzes.</p>
          </div>

          <Tabs defaultValue="science-tech" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 gap-2 p-2">
              <TabsTrigger value="science-tech" className="px-4 py-2 text-sm">Science & Technology</TabsTrigger>
              <TabsTrigger value="engineering" className="px-4 py-2 text-sm">Engineering</TabsTrigger>
              <TabsTrigger value="humanities" className="px-4 py-2 text-sm">Humanities & Social Sciences</TabsTrigger>
              <TabsTrigger value="health" className="px-4 py-2 text-sm">Health Sciences</TabsTrigger>
            </TabsList>
            
            {Object.entries(programCategories).map(([category, categoryPrograms]) => (
              <TabsContent key={category} value={category} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {categoryPrograms.map((program) => (
                    <Link key={program.id} href={`/dashboard?program=${program.id}`} className="block">
                      <Card className="h-full hover:bg-muted/50 transition-colors">
                        <CardHeader>
                          <CardTitle>{program.title}</CardTitle>
                          <CardDescription>
                            {program.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground">
                            {program.years.length} years • {program.years.reduce((total, year) => 
                              total + year.semesters.reduce((semTotal, semester) => 
                                semTotal + semester.courses.length, 0), 0
                            )} courses
                          </p>
                        </CardContent>
                        <CardFooter>
                          <Button variant="outline" className="w-full">
                            View Courses
                          </Button>
                        </CardFooter>
                      </Card>
                    </Link>
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
