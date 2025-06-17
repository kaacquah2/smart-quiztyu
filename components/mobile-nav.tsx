"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut, useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, LogOut } from "lucide-react"
import { Logo } from "@/components/logo"

export function MobileNav() {
  const [open, setOpen] = React.useState(false)
  const pathname = usePathname()
  const { data: session } = useSession()

  const handleLogout = () => {
    signOut({ callbackUrl: "/" })
    setOpen(false)
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[80%] max-w-[300px] sm:max-w-sm">
        <div className="flex flex-col gap-6 py-6">
          <Link href="/" className="flex items-center">
            <Logo size="lg" />
          </Link>
          <nav className="flex flex-col gap-4">
            <Link
              href="/dashboard"
              className={`text-base ${
                pathname === "/dashboard" ? "font-medium text-primary" : "text-muted-foreground"
              }`}
              onClick={() => setOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              href="/programs"
              className={`text-base ${pathname === "/programs" ? "font-medium text-primary" : "text-muted-foreground"}`}
              onClick={() => setOpen(false)}
            >
              Programs
            </Link>
            <Link
              href="/quizzes"
              className={`text-base ${pathname === "/quizzes" ? "font-medium text-primary" : "text-muted-foreground"}`}
              onClick={() => setOpen(false)}
            >
              Quizzes
            </Link>
            <Link
              href="/resources"
              className={`text-base ${
                pathname === "/resources" ? "font-medium text-primary" : "text-muted-foreground"
              }`}
              onClick={() => setOpen(false)}
            >
              Resources
            </Link>
            <Link
              href="/scheduler"
              className={`text-base ${
                pathname === "/scheduler" ? "font-medium text-primary" : "text-muted-foreground"
              }`}
              onClick={() => setOpen(false)}
            >
              Scheduler
            </Link>
            <Link
              href="/analytics"
              className={`text-base ${
                pathname === "/analytics" ? "font-medium text-primary" : "text-muted-foreground"
              }`}
              onClick={() => setOpen(false)}
            >
              Analytics
            </Link>
            <Link
              href="/social"
              className={`text-base ${pathname === "/social" ? "font-medium text-primary" : "text-muted-foreground"}`}
              onClick={() => setOpen(false)}
            >
              Social
            </Link>
            <Link
              href="/profile"
              className={`text-base ${pathname === "/profile" ? "font-medium text-primary" : "text-muted-foreground"}`}
              onClick={() => setOpen(false)}
            >
              Profile
            </Link>
          </nav>
          <div className="flex flex-col gap-2 mt-auto">
            <Button
              variant="outline"
              className="w-full"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
