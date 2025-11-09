'use client'

import { useState, useEffect } from 'react'
import { useAuth as useAuthContext } from '@/contexts/auth-context'
import { signInWithEmail, signUpWithEmail, resetPassword as resetPasswordSupabase } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

// Re-export useAuth from context for convenience
export const useAuth = useAuthContext

export function useAuthActions() {
  const { user, loading, refreshSession } = useAuth()
  const router = useRouter()
  const [actionLoading, setActionLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const login = async (email: string, password: string) => {
    setActionLoading(true)
    setError(null)

    try {
      await signInWithEmail(email, password)
      await refreshSession()
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message || 'Login failed')
      throw err
    } finally {
      setActionLoading(false)
    }
  }

  const register = async (email: string, password: string, name?: string) => {
    setActionLoading(true)
    setError(null)

    try {
      await signUpWithEmail(email, password, name)
      // Note: With Supabase, user might need to confirm email first
      router.push('/auth/login?message=check-email')
    } catch (err: any) {
      setError(err.message || 'Registration failed')
      throw err
    } finally {
      setActionLoading(false)
    }
  }

  const resetPassword = async (email: string) => {
    setActionLoading(true)
    setError(null)

    try {
      await resetPasswordSupabase(email)
      router.push('/auth/login?message=password-reset-sent')
    } catch (err: any) {
      setError(err.message || 'Password reset failed')
      throw err
    } finally {
      setActionLoading(false)
    }
  }

  return {
    user,
    loading,
    actionLoading,
    error,
    login,
    register,
    resetPassword,
    clearError: () => setError(null)
  }
}

// Hook for checking authentication status
export function useRequireAuth() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
    }
  }, [user, loading, router])

  return { user, loading }
}

// Hook for redirecting authenticated users away from auth pages
export function useRedirectIfAuthenticated() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard')
    }
  }, [user, loading, router])

  return { user, loading }
}