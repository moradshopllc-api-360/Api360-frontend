'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { authService, handleAuthError } from '@/lib/api'
import { useRouter } from 'next/navigation'

// Re-export useAuth from context for convenience
export { useAuth }

export function useAuthActions() {
  const { user, loading, isAuthenticated, error, clearError, refreshUser } = useAuth()
  const router = useRouter()
  const [actionLoading, setActionLoading] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)

  const clearActionError = () => setActionError(null)

  const login = async (email: string, password: string, persist: boolean = true) => {
    setActionLoading(true)
    setActionError(null)
    clearError()

    try {
      const response = await authService.login({ email, password })

      if (!response.success) {
        const errorMessage = handleAuthError(response)
        setActionError(errorMessage)
        throw new Error(errorMessage)
      }

      // Redirect is handled by the auth context
      return response.data

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed'
      setActionError(errorMessage)
      throw err
    } finally {
      setActionLoading(false)
    }
  }

  const register = async (email: string, password: string, name: string, role: string = 'crewmember') => {
    setActionLoading(true)
    setActionError(null)
    clearError()

    try {
      const response = await authService.register({
        email,
        password,
        name,
        role: role as any
      })

      if (!response.success) {
        const errorMessage = handleAuthError(response)
        setActionError(errorMessage)
        throw new Error(errorMessage)
      }

      // Redirect is handled by the auth context
      return response.data

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Registration failed'
      setActionError(errorMessage)
      throw err
    } finally {
      setActionLoading(false)
    }
  }

  const resetPassword = async (email: string) => {
    setActionLoading(true)
    setActionError(null)
    clearError()

    try {
      const response = await authService.requestPasswordReset(email)

      if (!response.success) {
        const errorMessage = response.error || 'Password reset failed'
        setActionError(errorMessage)
        throw new Error(errorMessage)
      }

      // Show success message and redirect
      router.push('/auth/login?message=password-reset-sent')

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Password reset failed'
      setActionError(errorMessage)
      throw err
    } finally {
      setActionLoading(false)
    }
  }

  const changePassword = async (currentPassword: string, newPassword: string) => {
    setActionLoading(true)
    setActionError(null)
    clearError()

    try {
      const response = await authService.changePassword(currentPassword, newPassword)

      if (!response.success) {
        const errorMessage = response.error || 'Password change failed'
        setActionError(errorMessage)
        throw new Error(errorMessage)
      }

      return response.data

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Password change failed'
      setActionError(errorMessage)
      throw err
    } finally {
      setActionLoading(false)
    }
  }

  const updateProfile = async (data: any) => {
    setActionLoading(true)
    setActionError(null)
    clearError()

    try {
      const response = await authService.updateProfile(data)

      if (!response.success) {
        const errorMessage = response.error || 'Profile update failed'
        setActionError(errorMessage)
        throw new Error(errorMessage)
      }

      // Refresh user data
      await refreshUser()

      return response.data

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Profile update failed'
      setActionError(errorMessage)
      throw err
    } finally {
      setActionLoading(false)
    }
  }

  return {
    user,
    loading,
    actionLoading,
    isAuthenticated,
    error: error || actionError,
    login,
    register,
    resetPassword,
    changePassword,
    updateProfile,
    clearError: clearActionError,
    refreshUser
  }
}

// Hook for checking authentication status
export function useRequireAuth(redirectTo: string = '/auth/login') {
  const { isAuthenticated, loading } = useAuth()
  const router = useRouter()

  // This is now handled by the auth context hook
  return { isAuthenticated, loading }
}

// Hook for redirecting authenticated users away from auth pages
export function useRedirectIfAuthenticated(redirectTo: string = '/dashboard') {
  const { isAuthenticated, loading } = useAuth()
  const router = useRouter()

  // This is now handled by the auth context hook
  return { isAuthenticated, loading }
}

// Hook for role-based access control
export function useRequireRole(allowedRoles: string[]) {
  const { user, isAuthenticated, loading } = useAuth()
  const router = useRouter()

  // This is now handled by the auth context hook
  return {
    user,
    isAuthenticated,
    loading,
    hasRequiredRole: user ? allowedRoles.includes(user.role) : false
  }
}

// Utility hook for form validation
export function useAuthFormValidation() {
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateEmail = (email: string): string | null => {
    if (!email) return 'Email is required'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return 'Please enter a valid email address'
    }
    return null
  }

  const validatePassword = (password: string): string | null => {
    if (!password) return 'Password is required'
    if (password.length < 8) return 'Password must be at least 8 characters'
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    }
    return null
  }

  const validateName = (name: string): string | null => {
    if (!name) return 'Name is required'
    if (name.length < 2) return 'Name must be at least 2 characters'
    return null
  }

  const validateConfirmPassword = (password: string, confirmPassword: string): string | null => {
    if (!confirmPassword) return 'Please confirm your password'
    if (password !== confirmPassword) return 'Passwords do not match'
    return null
  }

  const validateLoginForm = (email: string, password: string) => {
    const newErrors: Record<string, string> = {}

    const emailError = validateEmail(email)
    if (emailError) newErrors.email = emailError

    const passwordError = validatePassword(password)
    if (passwordError) newErrors.password = passwordError

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateRegisterForm = (email: string, password: string, confirmPassword: string, name: string) => {
    const newErrors: Record<string, string> = {}

    const emailError = validateEmail(email)
    if (emailError) newErrors.email = emailError

    const nameError = validateName(name)
    if (nameError) newErrors.name = nameError

    const passwordError = validatePassword(password)
    if (passwordError) newErrors.password = passwordError

    const confirmPasswordError = validateConfirmPassword(password, confirmPassword)
    if (confirmPasswordError) newErrors.confirmPassword = confirmPasswordError

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const clearErrors = () => setErrors({})
  const clearError = (field: string) => {
    setErrors(prev => {
      const newErrors = { ...prev }
      delete newErrors[field]
      return newErrors
    })
  }

  return {
    errors,
    validateEmail,
    validatePassword,
    validateName,
    validateConfirmPassword,
    validateLoginForm,
    validateRegisterForm,
    clearErrors,
    clearError
  }
}