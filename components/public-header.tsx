"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Logo } from "@/components/logo"
import { ROUTES } from "@/lib/routes"

interface PublicHeaderProps {
  showAuthButtons?: boolean
}

export function PublicHeader({ showAuthButtons = true }: PublicHeaderProps) {
  return (
    <header className="relative z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4">
          <Link href={ROUTES.HOME}>
            <Logo showLink={false} />
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <ThemeToggle />
          {showAuthButtons && (
            <>
              <Link href={ROUTES.LOGIN}>
                <Button variant="outline" size="sm">
                  Login
                </Button>
              </Link>
              <Link href={ROUTES.SIGNUP}>
                <Button size="sm">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
} 