"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut, useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, LogOut } from "lucide-react"
import { MobileNav } from "@/components/mobile-nav"
import { UserAvatar } from "@/components/user-avatar"
import { Logo } from "@/components/logo"
import { useIsMobile } from "@/hooks/use-mobile"

export function DashboardHeader() {
  const pathname = usePathname()
  const isMobile = useIsMobile()
  const { data: session } = useSession()

  const user = {
    name: session?.user?.name || "User",
    email: session?.user?.email || "user@example.com",
  }

  const isActive = (path: string) => {
    return pathname === path
  }

  const handleLogout = () => {
    signOut({ callbackUrl: "/" })
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Logo />
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="mr-2 md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pr-0">
            <MobileNav />
          </SheetContent>
        </Sheet>
        <div className="flex items-center gap-2 md:hidden">
          <Logo size="sm" />
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav className="flex items-center space-x-2 md:space-x-4">
            <div className="hidden md:flex md:items-center md:gap-6">
              <Link
                href="/dashboard"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive("/dashboard") ? "text-primary" : "text-muted-foreground"
                }`}
              >
                Dashboard
              </Link>
              <Link
                href="/programs"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive("/programs") ? "text-primary" : "text-muted-foreground"
                }`}
              >
                Programs
              </Link>
              <Link
                href="/resources"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive("/resources") ? "text-primary" : "text-muted-foreground"
                }`}
              >
                Resources
              </Link>
              <Link
                href="/analytics"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive("/analytics") ? "text-primary" : "text-muted-foreground"
                }`}
              >
                Analytics
              </Link>
              <Link
                href="/scheduler"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive("/scheduler") ? "text-primary" : "text-muted-foreground"
                }`}
              >
                Scheduler
              </Link>
              <Link
                href="/social"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive("/social") ? "text-primary" : "text-muted-foreground"
                }`}
              >
                Social
              </Link>
            </div>
          </nav>
          <div className="flex items-center gap-2">
            <Link href="/profile">
              <UserAvatar user={user} size={isMobile ? "sm" : "md"} />
            </Link>
            <Button
              variant="outline"
              size="icon"
              onClick={handleLogout}
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
