import type React from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CONFIG } from "@/lib/config"
import type { User } from "next-auth"

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
    if (user?.name) {
      return user.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    }
    return fallbackText?.slice(0, 2).toUpperCase() || "U"
  }

  // Generate a consistent color based on the user's name or fallback
  const getColorClass = () => {
    const name = user?.name || fallbackText || "User"
    const seed = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    const colorOptions = [
      "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300",
      "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300",
      "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300",
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300",
      "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300",
      "bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-300",
    ]

    return colorOptions[seed % colorOptions.length]
  }

  // Generate a UI Avatars URL as fallback using configuration
  const getUIAvatarsUrl = () => {
    const name = encodeURIComponent(user?.name || fallbackText || "User")
    const size = CONFIG.UI.AVATAR_SIZE
    const bold = CONFIG.UI.AVATAR_BOLD ? 'true' : 'false'
    return `${CONFIG.API.UI_AVATARS_URL}/?name=${name}&background=random&color=fff&size=${size}&bold=${bold}`
  }

  return (
    <Avatar className={`${sizeClasses[size]} ${className}`}>
      {children || (
        <>
          <AvatarImage src={user?.image || undefined} alt={user?.name || "User avatar"} />
          <AvatarFallback className={getColorClass()}>{getInitials()}</AvatarFallback>
        </>
      )}
    </Avatar>
  )
}
