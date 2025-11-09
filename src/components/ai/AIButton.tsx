'use client'

import React, { ButtonHTMLAttributes, forwardRef } from 'react'
import { useAIAutowire } from '@/hooks/use-ai-autowire'
import type { ActionSpec } from '@/lib/ai/actions'
import { useDocLogger } from '@/lib/ai/doc-logger'
import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface AIButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {
  spec: ActionSpec
  data?: any
  onActionStart?: () => void
  onActionSuccess?: (data: any) => void
  onActionError?: (error: Error) => void
  loadingText?: string
  errorText?: string
  showLogOnSuccess?: boolean
  showLogOnError?: boolean
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon' | 'icon-sm' | 'icon-lg'
  children?: React.ReactNode
}

export const AIButton = forwardRef<HTMLButtonElement, AIButtonProps>(({
  spec,
  data,
  onActionStart,
  onActionSuccess,
  onActionError,
  loadingText = 'Loading...',
  errorText = 'Error',
  showLogOnSuccess = false,
  showLogOnError = true,
  variant = 'default',
  size = 'default',
  children,
  disabled,
  className = '',
  ...props
}, ref) => {
  const { execute, loading, error, response } = useAIAutowire({
    onSuccess: (data) => {
      onActionSuccess?.(data)
      if (showLogOnSuccess) {
        // Success is already logged by useAIAutowire
      }
    },
    onError: (err) => {
      onActionError?.(err)
      if (showLogOnError) {
        // Error is already logged by useAIAutowire
      }
    }
  })

  const { addLog } = useDocLogger()

  const handleClick = async () => {
    try {
      onActionStart?.()
      await execute(spec, data)
    } catch (err) {
      // Error is already handled by useAIAutowire
    }
  }

  const isLoading = loading
  const hasError = !!error

  const buttonContent = isLoading ? (
    <>
      <span className="animate-spin" aria-hidden="true">⟳</span>
      {loadingText}
    </>
  ) : hasError ? (
    <>
      <span aria-hidden="true">⚠️</span>
      {errorText}
    </>
  ) : (
    children
  )

  const buttonClassName = cn(
    buttonVariants({ variant, size }),
    {
      'opacity-50 cursor-not-allowed': disabled || isLoading,
      'border-destructive text-destructive': hasError,
    },
    className
  )

  return (
    <>
      <Button
        ref={ref}
        className={buttonClassName}
        onClick={handleClick}
        disabled={disabled || isLoading}
        variant={variant}
        size={size}
        {...props}
      >
        {buttonContent}
      </Button>

      {/* Inline error display */}
      {hasError && (
        <div className="mt-2 p-2 bg-destructive/10 border border-destructive/20 rounded-md text-destructive text-sm" role="alert">
          {error.message}
        </div>
      )}

      {/* Inline success display */}
      {!hasError && response && showLogOnSuccess && (
        <div className="mt-2 p-2 bg-primary/10 border border-primary/20 rounded-md text-primary text-sm" role="status">
          ✓ Action completed successfully
        </div>
      )}
    </>
  )
})

AIButton.displayName = 'AIButton'

// Specialized button components for common actions
export function LoginButton({
  email,
  password,
  onLogin,
  children = 'Login',
  ...props
}: {
  email: string
  password: string
  onLogin?: (data: any) => void
  children?: React.ReactNode
} & Omit<AIButtonProps, 'spec' | 'data' | 'onActionSuccess'>) {
  const spec = {
    method: 'POST' as const,
    path: '/api/auth/login',
    doc: {
      title: 'User Login',
      description: 'Authenticate user with email and password'
    }
  }

  return (
    <AIButton
      spec={spec}
      data={{ email, password }}
      onActionSuccess={onLogin}
      loadingText="Signing in..."
      errorText="Login failed"
      {...props}
    >
      {children}
    </AIButton>
  )
}

export function RegisterButton({
  email,
  password,
  name,
  onRegister,
  children = 'Register',
  ...props
}: {
  email: string
  password: string
  name: string
  onRegister?: (data: any) => void
  children?: React.ReactNode
} & Omit<AIButtonProps, 'spec' | 'data' | 'onActionSuccess'>) {
  const spec = {
    method: 'POST' as const,
    path: '/api/auth/register',
    doc: {
      title: 'User Registration',
      description: 'Register new user account'
    }
  }

  return (
    <AIButton
      spec={spec}
      data={{ email, password, name }}
      onActionSuccess={onRegister}
      loadingText="Creating account..."
      errorText="Registration failed"
      {...props}
    >
      {children}
    </AIButton>
  )
}

export function LogoutButton({
  onLogout,
  children = 'Logout',
  ...props
}: {
  onLogout?: () => void
  children?: React.ReactNode
} & Omit<AIButtonProps, 'spec' | 'data' | 'onActionSuccess'>) {
  const spec = {
    method: 'POST' as const,
    path: '/api/auth/logout',
    doc: {
      title: 'User Logout',
      description: 'End user session'
    }
  }

  return (
    <AIButton
      spec={spec}
      onActionSuccess={() => {
        onLogout?.()
        // Clear local storage/session storage
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth-token')
          sessionStorage.removeItem('auth-token')
          window.location.href = '/auth/login'
        }
      }}
      loadingText="Signing out..."
      {...props}
    >
      {children}
    </AIButton>
  )
}

export function GoogleOAuthButton({
  redirectTo,
  onSuccess,
  children = 'Continue with Google',
  ...props
}: {
  redirectTo?: string
  onSuccess?: (data: any) => void
  children?: React.ReactNode
} & Omit<AIButtonProps, 'spec' | 'data' | 'onActionSuccess'>) {
  const spec = {
    method: 'GET' as const,
    path: '/api/auth/google',
    doc: {
      title: 'Google OAuth',
      description: 'Initiate Google OAuth authentication flow'
    }
  }

  const handleSuccess = (data: any) => {
    onSuccess?.(data)
    // If the response contains a redirect URL, navigate to it
    if (data?.url) {
      window.location.href = data.url
    }
  }

  return (
    <AIButton
      spec={spec}
      data={{ redirect_to: redirectTo }}
      onActionSuccess={handleSuccess}
      loadingText="Connecting to Google..."
      errorText="Google authentication failed"
      {...props}
    >
      {children}
    </AIButton>
  )
}

export function NavigationButton({
  to,
  redirectTo,
  reason,
  onSuccess,
  children,
  ...props
}: {
  to: string
  redirectTo?: string
  reason?: string
  onSuccess?: () => void
  children?: React.ReactNode
} & Omit<AIButtonProps, 'spec' | 'data' | 'onActionSuccess'>) {
  // Get the correct navigation action based on the destination
  let spec: any

  switch (to) {
    case '/auth/login':
      spec = {
        method: 'NAVIGATE' as const,
        path: '/auth/login',
        doc: {
          title: 'Navigate to Login',
          description: 'Navigate to login page for authentication'
        }
      }
      break
    case '/':
      spec = {
        method: 'NAVIGATE' as const,
        path: '/',
        doc: {
          title: 'Navigate to Homepage',
          description: 'Navigate to main homepage'
        }
      }
      break
    case '/dashboard/default':
      spec = {
        method: 'NAVIGATE' as const,
        path: '/dashboard/default',
        doc: {
          title: 'Navigate to Dashboard',
          description: 'Navigate to default dashboard page'
        }
      }
      break
    default:
      throw new Error(`Navigation destination "${to}" not supported. Supported destinations: /auth/login, /, /dashboard/default`)
  }

  const handleSuccess = () => {
    onSuccess?.()
    // Navigation is handled by the autowire system
  }

  return (
    <AIButton
      spec={spec}
      data={{
        redirect_to: redirectTo,
        reason: reason || 'Manual navigation'
      }}
      onActionSuccess={handleSuccess}
      loadingText="Navigating..."
      errorText="Navigation failed"
      {...props}
    >
      {children}
    </AIButton>
  )
}