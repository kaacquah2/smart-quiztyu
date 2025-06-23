import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PublicHeader } from "@/components/public-header"
import { ArrowRight, BookOpen, Brain, GraduationCap, Users } from "lucide-react"
import { ROUTES } from "@/lib/routes"

export default function Home() {
  return (
    <>
      <PublicHeader />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-b from-background to-muted">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Smart Quiz System with <span className="text-primary">Personalized Recommendations</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Enhance your learning experience with our intelligent quiz platform designed specifically for university
              students. Get personalized recommendations based on your performance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={ROUTES.DASHBOARD}>
                <Button size="lg" className="gap-2">
                  Go to Dashboard <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href={ROUTES.PROGRAMS}>
                <Button size="lg" variant="outline" className="gap-2">
                  Explore Programs <GraduationCap className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-card rounded-lg p-6 shadow-sm border">
                <div className="bg-primary/10 p-3 rounded-full w-fit mb-4">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Program-Specific Quizzes</h3>
                <p className="text-muted-foreground">
                  Access quizzes tailored to your specific program, year, and semester courses.
                </p>
              </div>

              <div className="bg-card rounded-lg p-6 shadow-sm border">
                <div className="bg-primary/10 p-3 rounded-full w-fit mb-4">
                  <Brain className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Personalized Learning</h3>
                <p className="text-muted-foreground">
                  Receive customized learning resources based on your quiz performance.
                </p>
              </div>

              <div className="bg-card rounded-lg p-6 shadow-sm border">
                <div className="bg-primary/10 p-3 rounded-full w-fit mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Progress Tracking</h3>
                <p className="text-muted-foreground">
                  Monitor your learning progress and identify areas for improvement.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16 bg-muted">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="bg-primary text-primary-foreground rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                  1
                </div>
                <h3 className="font-medium mb-2">Select Your Program</h3>
                <p className="text-sm text-muted-foreground">Choose your program, year, and semester</p>
              </div>

              <div className="text-center">
                <div className="bg-primary text-primary-foreground rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                  2
                </div>
                <h3 className="font-medium mb-2">Take a Quiz</h3>
                <p className="text-sm text-muted-foreground">Complete quizzes for your selected courses</p>
              </div>

              <div className="text-center">
                <div className="bg-primary text-primary-foreground rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                  3
                </div>
                <h3 className="font-medium mb-2">Get Your Score</h3>
                <p className="text-sm text-muted-foreground">See your results with detailed feedback</p>
              </div>

              <div className="text-center">
                <div className="bg-primary text-primary-foreground rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                  4
                </div>
                <h3 className="font-medium mb-2">Receive Recommendations</h3>
                <p className="text-sm text-muted-foreground">Get personalized learning resources</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Enhance Your Learning?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Join thousands of students who are improving their academic performance with our Smart Quiz System.
            </p>
            <Link href={ROUTES.SIGNUP}>
              <Button size="lg">Get Started Today</Button>
            </Link>
          </div>
        </section>
      </main>
    </>
  )
}
