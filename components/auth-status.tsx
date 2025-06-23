"use client"

import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function AuthStatus() {
  const { data: session, status } = useSession()

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Authentication Status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm font-medium">Status:</p>
          <Badge variant={status === "authenticated" ? "default" : status === "loading" ? "secondary" : "destructive"}>
            {status}
          </Badge>
        </div>
        
        {session?.user && (
          <div>
            <p className="text-sm font-medium">User Info:</p>
            <div className="text-sm space-y-1">
              <p>ID: {session.user.id || "Not set"}</p>
              <p>Email: {session.user.email || "Not set"}</p>
              <p>Name: {session.user.name || "Not set"}</p>
            </div>
          </div>
        )}
        
        {status === "unauthenticated" && (
          <div className="text-sm text-muted-foreground">
            <p>You are not logged in. Please log in to access protected features.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 