import type React from "react"
interface DashboardShellProps {
  children: React.ReactNode
}

export function DashboardShell({ children }: DashboardShellProps) {
  return <div className="container mx-auto px-4 py-8 max-w-7xl">{children}</div>
}
