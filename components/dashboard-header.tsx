"use client"

import Link from "next/link"
import { signOut, useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, LogOut } from "lucide-react"
import { MobileNav } from "@/components/mobile-nav"
import { UserAvatar } from "@/components/user-avatar"
import { Logo } from "@/components/logo"
import { Navigation } from "@/components/navigation"
import { useIsMobile } from "@/hooks/use-mobile"
import { ROUTES } from "@/lib/routes"

export function DashboardHeader() {
  const isMobile = useIsMobile()
  const { data: session } = useSession()

  const user = {
    name: session?.user?.name || "User",
    email: session?.user?.email || "user@example.com",
  }

  const handleLogout = () => {
    signOut({ callbackUrl: ROUTES.HOME })
  }

  return (
    <header className="relative z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
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
          <div className="hidden md:flex md:items-center md:gap-6">
            <Navigation />
          </div>
          <div className="flex items-center gap-2">
            <Link href={ROUTES.PROFILE}>
              <UserAvatar user={user} size={isMobile ? "sm" : "md"} />
            </Link>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleLogout()}
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
