import type React from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { User } from "@/lib/types"

type UserAvatarProps = {
  user?: Partial<User> | null
  className?: string
  size?: "sm" | "md" | "lg" | "xl"
  fallbackText?: string
  children?: React.ReactNode
}

export function UserAvatar({ user, className, size = "md", fallbackText, children }: UserAvatarProps) {
  // Size classes
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
    xl: "h-16 w-16",
  }

  // Get initials from name or use fallback
  const getInitials = () => {
    if (fallbackText) return fallbackText.substring(0, 2).toUpperCase()
    if (!user?.name) return "U"

    const nameParts = user.name.split(" ")
    if (nameParts.length === 1) return nameParts[0].substring(0, 2).toUpperCase()
    return (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase()
  }

  // Generate a consistent color based on the user's name or fallback
  const getColorClass = () => {
    const colorOptions = [
      "bg-red-500",
      "bg-orange-500",
      "bg-amber-500",
      "bg-yellow-500",
      "bg-lime-500",
      "bg-green-500",
      "bg-emerald-500",
      "bg-teal-500",
      "bg-cyan-500",
      "bg-sky-500",
      "bg-blue-500",
      "bg-indigo-500",
      "bg-violet-500",
      "bg-purple-500",
      "bg-fuchsia-500",
      "bg-pink-500",
      "bg-rose-500",
    ]

    const seed = (user?.name || fallbackText || "User").split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)

    return colorOptions[seed % colorOptions.length]
  }

  // Generate a UI Avatars URL as fallback
  const getUIAvatarsUrl = () => {
    const name = encodeURIComponent(user?.name || fallbackText || "User")
    return `https://ui-avatars.com/api/?name=${name}&background=random&color=fff&size=128&bold=true`
  }

  return (
    <Avatar className={`${sizeClasses[size]} ${className}`}>
      {children || (
        <>
          <AvatarImage src={user?.image || getUIAvatarsUrl()} alt={user?.name || "User avatar"} />
          <AvatarFallback className={getColorClass()}>{getInitials()}</AvatarFallback>
        </>
      )}
    </Avatar>
  )
}
