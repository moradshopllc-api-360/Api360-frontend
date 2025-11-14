'use client'

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { authService, initializeAuth, validateAuthState } from '@/lib/api'
import type { User, AuthTokens } from '@/types/api'

interface AuthContextType {
  user: User | null
  loading: boolean
  error: string | null
  isAuthenticated: boolean
  login: (email: string, password: string, persist?: boolean) => Promise<void>
  register: (email: string, password: string, name: string, role?: string) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
  clearError: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  // Initialize auth state on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        setLoading(true)
        const { authenticated, user: authUser } = await initializeAuth()

        if (authenticated && authUser && validateAuthState(authUser)) {
          setUser(authUser)
          setIsAuthenticated(true)
          setError(null)
        } else {
          setUser(null)
          setIsAuthenticated(false)
        }
      } catch (err) {
        console.error('Failed to initialize auth:', err)
        setUser(null)
        setIsAuthenticated(false)
        setError('Failed to initialize authentication')
      } finally {
        setLoading(false)
      }
    }

    initAuth()
  }, [])

  // Auto-refresh user session periodically
  useEffect(() => {
    if (!isAuthenticated) return

    const refreshInterval = setInterval(async () => {
      try {
        await refreshUser()
      } catch (error) {
        console.error('Failed to refresh user session:', error)
        // Don't set error here to avoid annoying user
      }
    }, 5 * 60 * 1000) // Refresh every 5 minutes

    return () => clearInterval(refreshInterval)
  }, [isAuthenticated])

  // Auto-logout on token expiration
  useEffect(() => {
    if (!isAuthenticated || !user) return

    const checkTokenExpiration = () => {
      // This is a simple check - in a real app, you'd decode the JWT or use refresh tokens
      const lastActivity = localStorage.getItem('last-activity')
      if (lastActivity) {
        const timeSinceLastActivity = Date.now() - parseInt(lastActivity)
        const maxInactivity = 30 * 60 * 1000 // 30 minutes

        if (timeSinceLastActivity > maxInactivity) {
          logout()
        }
      }
    }

    const activityCheck = setInterval(checkTokenExpiration, 60 * 1000) // Check every minute

    return () => clearInterval(activityCheck)
  }, [isAuthenticated, user])

  const login = useCallback(async (email: string, password: string, persist: boolean = true): Promise<void> => {
    setLoading(true)
    setError(null)

    try {
      const response = await authService.login({ email, password })

      if (!response.success) {
        throw new Error(response.error || 'Login failed')
      }

      if (!response.data) {
        throw new Error('No user data received')
      }

      const { user: authUser, tokens } = response.data

      if (!validateAuthState(authUser)) {
        throw new Error('Account is not active or invalid')
      }

      setUser(authUser)
      setIsAuthenticated(true)

      // Store last activity timestamp
      localStorage.setItem('last-activity', Date.now().toString())

      // Redirect based on user role
      const redirectPath = getRoleBasedRedirect(authUser)
      router.push(redirectPath)

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [router])

  const register = useCallback(async (
    email: string,
    password: string,
    name: string,
    role: string = 'crewmember'
  ): Promise<void> => {
    setLoading(true)
    setError(null)

    try {
      const response = await authService.register({
        email,
        password,
        name,
        role: role as any
      })

      if (!response.success) {
        throw new Error(response.error || 'Registration failed')
      }

      if (!response.data) {
        throw new Error('No user data received')
      }

      const { user: authUser } = response.data

      if (!validateAuthState(authUser)) {
        throw new Error('Account was created but is not active')
      }

      setUser(authUser)
      setIsAuthenticated(true)

      // Store last activity timestamp
      localStorage.setItem('last-activity', Date.now().toString())

      // Redirect to dashboard
      router.push('/dashboard')

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Registration failed'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [router])

  const logout = useCallback(async (): Promise<void> => {
    try {
      setLoading(true)
      await authService.logout()
    } catch (err) {
      console.error('Logout error:', err)
      // Continue with logout even if API call fails
    } finally {
      // Clear local state regardless of API response
      setUser(null)
      setIsAuthenticated(false)
      setError(null)

      // Clear activity timestamp
      localStorage.removeItem('last-activity')

      setLoading(false)
      router.push('/auth/login')
    }
  }, [router])

  const refreshUser = useCallback(async (): Promise<void> => {
    try {
      const response = await authService.getCurrentUser()

      if (response.success && response.data && validateAuthState(response.data)) {
        setUser(response.data)
        setIsAuthenticated(true)

        // Update activity timestamp
        localStorage.setItem('last-activity', Date.now().toString())
      } else {
        // User is no longer valid, log them out
        await logout()
      }
    } catch (err) {
      console.error('Failed to refresh user:', err)
      // Don't automatically logout on refresh failure - might be network issue
    }
  }, [logout])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const value: AuthContextType = {
    user,
    loading,
    error,
    isAuthenticated,
    login,
    register,
    logout,
    refreshUser,
    clearError
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Helper function to get role-based redirect path
function getRoleBasedRedirect(user: User): string {
  switch (user.role) {
    case 'manager':
      return '/dashboard'
    case 'crewmember':
      return '/dashboard'
    case 'driver':
      return '/dashboard' // For now, driver also goes to dashboard
    default:
      return '/dashboard'
  }
}

// Hook for requiring authentication
export function useRequireAuth(redirectTo: string = '/auth/login') {
  const { isAuthenticated, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push(redirectTo)
    }
  }, [isAuthenticated, loading, router, redirectTo])

  return { isAuthenticated, loading }
}

// Hook for redirecting authenticated users away from auth pages
export function useRedirectIfAuthenticated(redirectTo: string = '/dashboard') {
  const { isAuthenticated, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.push(redirectTo)
    }
  }, [isAuthenticated, loading, router, redirectTo])

  return { isAuthenticated, loading }
}

// Hook for role-based access control
export function useRequireRole(allowedRoles: string[]) {
  const { user, isAuthenticated, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push('/auth/login')
        return
      }

      if (user && !allowedRoles.includes(user.role)) {
        router.push('/unauthorized')
        return
      }
    }
  }, [isAuthenticated, user, loading, allowedRoles, router])

  return {
    user,
    isAuthenticated,
    loading,
    hasRequiredRole: user ? allowedRoles.includes(user.role) : false
  }
}