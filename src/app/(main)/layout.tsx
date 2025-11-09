import { ReactNode } from "react"

import { ProtectedRoute } from "@/components/auth/protected-route"

export default function MainLayout({
  children
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <ProtectedRoute
      requireAuth={false} // Don't require auth for all (main) routes, just specific ones
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      }
    >
      {children}
    </ProtectedRoute>
  )
}