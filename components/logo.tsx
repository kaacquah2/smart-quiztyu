import { Brain, Lightbulb } from "lucide-react"
import Link from "next/link"

type LogoProps = {
  variant?: "default" | "icon-only" | "with-tagline"
  size?: "sm" | "md" | "lg"
  className?: string
}

export function Logo({ variant = "default", size = "md", className = "" }: LogoProps) {
  // Size classes
  const sizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  }

  // Icon size based on text size
  const iconSizes = {
    sm: 18,
    md: 22,
    lg: 26,
  }

  const iconSize = iconSizes[size]

  // Render icon-only variant
  if (variant === "icon-only") {
    return (
      <div className={`relative inline-flex items-center justify-center ${className}`}>
        <Brain size={iconSize * 1.2} className="text-primary animate-pulse" />
        <Lightbulb
          size={iconSize * 0.7}
          className="absolute text-yellow-400 top-0 right-0 transform -translate-y-1/4 translate-x-1/4"
        />
      </div>
    )
  }

  // Render default or with-tagline variant
  return (
    <Link href="/" className={`inline-flex items-center gap-1.5 ${className}`}>
      <div className="relative">
        <Brain size={iconSize} className="text-primary" />
        <Lightbulb
          size={iconSize * 0.6}
          className="absolute text-yellow-400 top-0 right-0 transform -translate-y-1/4 translate-x-1/4"
        />
      </div>
      <div className="flex flex-col">
        <span className={`font-bold leading-none ${sizeClasses[size]}`}>
          <span className="font-normal">Smart</span>
          <span className="text-primary">Quiz</span>
        </span>
        {variant === "with-tagline" && (
          <span className="text-xs text-muted-foreground leading-tight">Learn Smarter, Achieve More</span>
        )}
      </div>
    </Link>
  )
}

// Add the LogoWithTagline export that was missing
export function LogoWithTagline({ className, size = "md" }: { className?: string; size?: "sm" | "md" | "lg" }) {
  return <Logo variant="with-tagline" size={size} className={className} />
}
