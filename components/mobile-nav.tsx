"use client"

import * as React from "react"
import Link from "next/link"
import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, LogOut } from "lucide-react"
import { Logo } from "@/components/logo"
import { MobileNavigation } from "@/components/navigation"
import { ROUTES } from "@/lib/routes"

export function MobileNav() {
  const [open, setOpen] = React.useState(false)

  const handleLogout = () => {
    signOut({ callbackUrl: ROUTES.HOME })
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
          <Link href={ROUTES.HOME} className="flex items-center">
            <Logo size="lg" showLink={false} />
          </Link>
          <MobileNavigation onItemClick={() => setOpen(false)} />
          <div className="flex flex-col gap-2 mt-auto">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => handleLogout()}
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
