import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

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
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
              <TabsTrigger value="science-tech">Science & Technology</TabsTrigger>
              <TabsTrigger value="engineering">Engineering</TabsTrigger>
              <TabsTrigger value="humanities">Humanities & Social Sciences</TabsTrigger>
              <TabsTrigger value="health">Health Sciences</TabsTrigger>
            </TabsList>
            <TabsContent value="science-tech" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Link href="/dashboard?program=computer-science" className="block">
                  <Card className="h-full hover:bg-muted/50 transition-colors">
                    <CardHeader>
                      <CardTitle>BSc. Computer Science</CardTitle>
                      <CardDescription>
                        Study of algorithms, programming languages, and computer systems
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Covers programming, algorithms, data structures, software engineering, and more.
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full">
                        View Courses
                      </Button>
                    </CardFooter>
                  </Card>
                </Link>
                <Link href="/dashboard?program=mathematics" className="block">
                  <Card className="h-full hover:bg-muted/50 transition-colors">
                    <CardHeader>
                      <CardTitle>BSc. Mathematics</CardTitle>
                      <CardDescription>Study of numbers, quantities, shapes, and patterns</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Covers algebra, calculus, statistics, discrete mathematics, and more.
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full">
                        View Courses
                      </Button>
                    </CardFooter>
                  </Card>
                </Link>
                <Link href="/dashboard?program=physics" className="block">
                  <Card className="h-full hover:bg-muted/50 transition-colors">
                    <CardHeader>
                      <CardTitle>BSc. Physics</CardTitle>
                      <CardDescription>Study of matter, energy, and the interactions between them</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Covers mechanics, thermodynamics, electromagnetism, quantum physics, and more.
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full">
                        View Courses
                      </Button>
                    </CardFooter>
                  </Card>
                </Link>
              </div>
            </TabsContent>
            <TabsContent value="engineering" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Link href="/dashboard?program=electrical-engineering" className="block">
                  <Card className="h-full hover:bg-muted/50 transition-colors">
                    <CardHeader>
                      <CardTitle>BSc. Electrical and Electronic Engineering</CardTitle>
                      <CardDescription>Study of electrical systems, electronics, and power generation</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Covers circuits, power systems, control systems, telecommunications, and more.
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full">
                        View Courses
                      </Button>
                    </CardFooter>
                  </Card>
                </Link>
                <Link href="/dashboard?program=civil-engineering" className="block">
                  <Card className="h-full hover:bg-muted/50 transition-colors">
                    <CardHeader>
                      <CardTitle>BSc. Civil Engineering</CardTitle>
                      <CardDescription>
                        Study of design, construction, and maintenance of the built environment
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Covers structures, materials, geotechnics, hydraulics, transportation, and more.
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full">
                        View Courses
                      </Button>
                    </CardFooter>
                  </Card>
                </Link>
                <Link href="/dashboard?program=mechanical-engineering" className="block">
                  <Card className="h-full hover:bg-muted/50 transition-colors">
                    <CardHeader>
                      <CardTitle>BSc. Mechanical Engineering</CardTitle>
                      <CardDescription>Study of machines, energy, and mechanical systems</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Covers thermodynamics, fluid mechanics, materials, manufacturing, and more.
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full">
                        View Courses
                      </Button>
                    </CardFooter>
                  </Card>
                </Link>
              </div>
            </TabsContent>
            <TabsContent value="humanities" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Link href="/dashboard?program=business-admin" className="block">
                  <Card className="h-full hover:bg-muted/50 transition-colors">
                    <CardHeader>
                      <CardTitle>BSc. Business Administration</CardTitle>
                      <CardDescription>Study of business operations, management, and strategy</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Covers accounting, finance, marketing, human resources, operations, and more.
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full">
                        View Courses
                      </Button>
                    </CardFooter>
                  </Card>
                </Link>
                <Link href="/dashboard?program=economics" className="block">
                  <Card className="h-full hover:bg-muted/50 transition-colors">
                    <CardHeader>
                      <CardTitle>BA. Economics</CardTitle>
                      <CardDescription>
                        Study of production, distribution, and consumption of goods and services
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Covers microeconomics, macroeconomics, econometrics, development economics, and more.
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full">
                        View Courses
                      </Button>
                    </CardFooter>
                  </Card>
                </Link>
                <Link href="/dashboard?program=sociology" className="block">
                  <Card className="h-full hover:bg-muted/50 transition-colors">
                    <CardHeader>
                      <CardTitle>BA. Sociology</CardTitle>
                      <CardDescription>Study of society, social relationships, and institutions</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Covers social theory, research methods, social stratification, and more.
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full">
                        View Courses
                      </Button>
                    </CardFooter>
                  </Card>
                </Link>
              </div>
            </TabsContent>
            <TabsContent value="health" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Link href="/dashboard?program=nursing" className="block">
                  <Card className="h-full hover:bg-muted/50 transition-colors">
                    <CardHeader>
                      <CardTitle>BSc. Nursing</CardTitle>
                      <CardDescription>Study of patient care, health promotion, and disease prevention</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Covers anatomy, physiology, pharmacology, nursing care, and more.
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full">
                        View Courses
                      </Button>
                    </CardFooter>
                  </Card>
                </Link>
                <Link href="/dashboard?program=pharmacy" className="block">
                  <Card className="h-full hover:bg-muted/50 transition-colors">
                    <CardHeader>
                      <CardTitle>BSc. Pharmacy</CardTitle>
                      <CardDescription>Study of drugs, their preparation, and their effects</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Covers pharmacology, medicinal chemistry, pharmaceutics, and more.
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full">
                        View Courses
                      </Button>
                    </CardFooter>
                  </Card>
                </Link>
                <Link href="/dashboard?program=biomedical-science" className="block">
                  <Card className="h-full hover:bg-muted/50 transition-colors">
                    <CardHeader>
                      <CardTitle>BSc. Biomedical Science</CardTitle>
                      <CardDescription>
                        Study of biological sciences related to human health and disease
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Covers anatomy, physiology, biochemistry, microbiology, and more.
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full">
                        View Courses
                      </Button>
                    </CardFooter>
                  </Card>
                </Link>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DashboardShell>
    </>
  )
}
