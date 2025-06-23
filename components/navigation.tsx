"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { NAVIGATION_ITEMS } from "@/lib/routes"
import { 
  LayoutDashboard, 
  GraduationCap, 
  BookOpen, 
  Library, 
  Calendar, 
  BarChart3, 
  Users, 
  User 
} from "lucide-react"

// Icon mapping
const iconMap = {
  LayoutDashboard,
  GraduationCap,
  BookOpen,
  Library,
  Calendar,
  BarChart3,
  Users,
  User,
}

interface NavigationProps {
  className?: string
  onItemClick?: () => void
}

export function Navigation({ className = "", onItemClick }: NavigationProps) {
  const pathname = usePathname()

  const isActive = (href: string) => {
    return pathname === href
  }

  return (
    <nav className={`flex items-center space-x-8 ${className}`}>
      {NAVIGATION_ITEMS.map((item) => {
        const Icon = iconMap[item.icon as keyof typeof iconMap]
        
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`text-sm font-medium transition-colors hover:text-primary px-2 py-1 rounded-md hover:bg-muted/50 ${
              isActive(item.href) ? "text-primary bg-muted/30" : "text-muted-foreground"
            }`}
            onClick={onItemClick}
          >
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}

// Mobile navigation component
export function MobileNavigation({ onItemClick }: { onItemClick?: () => void }) {
  const pathname = usePathname()

  const isActive = (href: string) => {
    return pathname === href
  }

  return (
    <nav className="flex flex-col gap-4">
      {NAVIGATION_ITEMS.map((item) => {
        const Icon = iconMap[item.icon as keyof typeof iconMap]
        
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`text-base flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
              isActive(item.href) ? "font-medium text-primary bg-muted/30" : "text-muted-foreground hover:bg-muted/50"
            }`}
            onClick={onItemClick}
          >
            <Icon className="h-4 w-4" />
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
} 