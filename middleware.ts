import { withAuth } from "next-auth/middleware"
import { PROTECTED_ROUTES } from "@/lib/routes"

export default withAuth(
  function middleware(req) {
    // Add any additional middleware logic here
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    },
  }
)

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/programs/:path*",
    "/quizzes/:path*",
    "/resources/:path*",
    "/scheduler/:path*",
    "/analytics/:path*",
    "/social/:path*",
    "/profile/:path*"
  ]
} 