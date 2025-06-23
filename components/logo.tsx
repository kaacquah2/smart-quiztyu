import Link from "next/link"
import { Brain } from "lucide-react"
import { ROUTES } from "@/lib/routes"

interface LogoProps {
  size?: "sm" | "md" | "lg"
  className?: string
  showLink?: boolean
}

export function Logo({ size = "md", className = "", showLink = true }: LogoProps) {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-10 w-10",
  }

  const textSizes = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  }

  const logoContent = (
    <>
      <Brain className={`${sizeClasses[size]} text-primary`} />
      <span className={`font-bold ${textSizes[size]}`}>
        Smart Quiz
      </span>
    </>
  )

  if (showLink) {
    return (
      <Link href={ROUTES.HOME} className={`inline-flex items-center gap-1.5 ${className}`}>
        {logoContent}
      </Link>
    )
  }

  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      {logoContent}
    </div>
  )
}

// Add the LogoWithTagline export that was missing
export function LogoWithTagline({ className, size = "md" }: { className?: string; size?: "sm" | "md" | "lg" }) {
  return <Logo size={size} className={className} />
}
