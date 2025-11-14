"use client"

import { useAuth } from "@/contexts/auth-context"

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: "MANAGER" | "CREW_MEMBER"
  fallback?: React.ReactNode
  requireAuth?: boolean
}

export function ProtectedRoute({ children, requiredRole, fallback, requireAuth = true }: ProtectedRouteProps) {
  const { user, loading, error } = useAuth()

  // Show loading state while checking authentication
  if (loading) {
    return fallback || (
      <div className="flex items-center justify-center min-h-64">
        <div className="flex flex-col items-center gap-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  
  // Show error state if authentication failed
  if (error) {
    return fallback || (
      <div className="flex items-center justify-center min-h-64">
        <div className="flex flex-col items-center gap-2 text-center max-w-md">
          <div className="text-destructive">
            <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-destructive font-medium">Authentication Error</p>
          <p className="text-muted-foreground text-sm">{error}</p>
        </div>
      </div>
    )
  }

  // If not authenticated and authentication is required
  if (requireAuth && !user) {
    return fallback || (
      <div className="flex items-center justify-center min-h-64">
        <div className="flex flex-col items-center gap-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    )
  }

  // For now, all authenticated users have access
  // Role-based access can be implemented later using user.user_metadata
  return <>{children}</>
}