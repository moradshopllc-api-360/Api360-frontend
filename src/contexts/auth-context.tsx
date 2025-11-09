'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase, onAuthStateChange } from '@/lib/supabase/client'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  error: string | null
  isDevelopmentMode: boolean
  signOut: () => Promise<void>
  refreshSession: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDevelopmentMode, setIsDevelopmentMode] = useState(false)

  useEffect(() => {
    // Check if we're in development mode with placeholder credentials
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey ||
        supabaseUrl === 'https://placeholder.supabase.co' ||
        supabaseAnonKey === 'placeholder-key') {

      console.warn('Development mode: Supabase credentials not configured. Using mock authentication for development.')
      setIsDevelopmentMode(true)

      // Check for mock user in localStorage
      try {
        let mockUserStr = localStorage.getItem('dev-user')

        // Only create default user if no mock user exists
        if (!mockUserStr) {
          console.log('🚀 [API360 AuthContext] No mock user found, staying unauthenticated in development mode')
          setLoading(false)
          return
        }

        let mockUser = JSON.parse(mockUserStr)
        console.log('🚀 [API360 AuthContext] Loading mock user from localStorage:', mockUser.email)

        // Create a mock user object that matches Supabase User interface
        const user = {
          id: mockUser.id,
          email: mockUser.email,
          user_metadata: {
            name: mockUser.name,
            role: mockUser.role
          },
          app_metadata: {},
          aud: 'authenticated',
          created_at: mockUser.created_at
        } as User

        // Create a mock session
        const session = {
          user,
          access_token: 'dev-token',
          refresh_token: 'dev-refresh',
          expires_in: 3600,
          token_type: 'bearer'
        } as Session

        setUser(user)
        setSession(session)
      } catch (error) {
        console.error('❌ [API360 AuthContext] Error with mock user:', error)
        // Clear corrupted data
        localStorage.removeItem('dev-user')
      } finally {
        setLoading(false)
      }
      return
    }

    // Production mode with Supabase
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()

        if (error) {
          console.error('Error getting initial session:', error)
          setError(error.message)
          setSession(null)
          setUser(null)
        } else {
          setSession(session)
          setUser(session?.user ?? null)
          setError(null)
        }
      } catch (error) {
        console.error('Unexpected error getting initial session:', error)
        setError('Failed to initialize authentication')
        setSession(null)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = onAuthStateChange((event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setError(null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    try {
      console.log("🔐 [API360 AuthContext] Starting sign out process...")

      if (isDevelopmentMode) {
        // Development mode: clear the mock user and state
        console.log("🧹 [API360 AuthContext] Cleaning development mode state...")
        localStorage.removeItem('dev-user')
        localStorage.removeItem('dev-mode-visible')
        setUser(null)
        setSession(null)
        console.log("✅ [API360 AuthContext] Development mode sign out completed")
        return
      }

      // Production mode: clear Supabase session
      console.log("🔐 [API360 AuthContext] Signing out from Supabase...")
      await supabase.auth.signOut()

      // Clear local state
      setUser(null)
      setSession(null)

      // Clear any remaining tokens
      localStorage.removeItem('auth-token')
      sessionStorage.removeItem('auth-token')

      console.log("✅ [API360 AuthContext] Production mode sign out completed")
    } catch (error) {
      console.error('❌ [API360 AuthContext] Error signing out:', error)
      setError('Failed to sign out')

      // Even on error, try to clear state
      setUser(null)
      setSession(null)
    }
  }

  const refreshSession = async () => {
    if (isDevelopmentMode) {
      console.warn('Development mode: Session refresh not available')
      return
    }

    try {
      const { data: { session }, error } = await supabase.auth.refreshSession()

      if (error) {
        console.error('Error refreshing session:', error)
        setError(error.message)
        setSession(null)
        setUser(null)
      } else {
        setSession(session)
        setUser(session?.user ?? null)
        setError(null)
      }
    } catch (error) {
      console.error('Unexpected error refreshing session:', error)
      setError('Failed to refresh session')
    }
  }

  const value: AuthContextType = {
    user,
    session,
    loading,
    error,
    isDevelopmentMode,
    signOut: handleSignOut,
    refreshSession
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