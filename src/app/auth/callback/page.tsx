'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { AIButton } from '@/components/ai/AIButton'
import { InlineSpinner } from '@/components/ui/global-spinner'
import { CheckCircle2, XCircle, AlertCircle, RefreshCw, Home } from 'lucide-react'
import { useDocLogger } from '@/lib/ai/doc-logger'
import { createAction } from '@/lib/ai/actions'

export default function AuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [authStep, setAuthStep] = useState<'processing' | 'verifying' | 'completing' | 'success' | 'error'>('processing')
  const { addLog } = useDocLogger()

  // ActionSpec for auth retry
  const retryAuthAction = createAction({
    method: 'GET' as const,
    path: '/auth/login',
    doc: {
      title: 'Retry Authentication',
      description: 'Redirect to login page to retry authentication'
    }
  })

  // ActionSpec for home redirect
  const homeRedirectAction = createAction({
    method: 'GET' as const,
    path: '/',
    doc: {
      title: 'Go to Home',
      description: 'Redirect to homepage'
    }
  })

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const code = searchParams.get('code')
        const error = searchParams.get('error')
        const errorDescription = searchParams.get('error_description')

        addLog({
          type: 'info',
          message: 'Processing OAuth callback',
          action: 'Auth Callback',
          data: { hasCode: !!code, hasError: !!error }
        })

        if (error) {
          setAuthStep('error')
          setError(errorDescription || error)
          setLoading(false)
          addLog({
            type: 'error',
            message: `OAuth error: ${errorDescription || error}`,
            action: 'Auth Callback',
            data: { error, errorDescription }
          })
          return
        }

        if (!code) {
          setAuthStep('error')
          setError('No authorization code received')
          setLoading(false)
          addLog({
            type: 'error',
            message: 'No authorization code received in callback',
            action: 'Auth Callback'
          })
          return
        }

        setAuthStep('verifying')
        addLog({
          type: 'info',
          message: 'Exchanging authorization code for session',
          action: 'Auth Callback',
          data: { codeLength: code.length }
        })

        // Exchange the code for a session
        const { data, error: sessionError } = await supabase.auth.exchangeCodeForSession(code)

        if (sessionError) {
          setAuthStep('error')
          setError(sessionError.message)
          setLoading(false)
          addLog({
            type: 'error',
            message: `Session creation failed: ${sessionError.message}`,
            action: 'Auth Callback',
            data: { error: sessionError.message }
          })
          return
        }

        if (data.session) {
          setAuthStep('completing')
          addLog({
            type: 'success',
            message: 'Session created successfully',
            action: 'Auth Callback',
            data: { userId: data.session.user?.id, email: data.session.user?.email }
          })

          // Successfully authenticated
          setSuccess(true)
          setAuthStep('success')
          setLoading(false)

          // Log successful authentication
          addLog({
            type: 'success',
            message: 'Authentication completed successfully',
            action: 'Auth Callback',
            data: { redirectTo: searchParams.get('redirect_to') || '/dashboard' }
          })

          // Redirect to dashboard or the URL they were trying to access
          setTimeout(() => {
            const redirectTo = searchParams.get('redirect_to') || '/dashboard'
            router.push(redirectTo)
            router.refresh()
          }, 2000) // 2 second delay to show success state
        } else {
          setAuthStep('error')
          setError('Failed to create session')
          setLoading(false)
          addLog({
            type: 'error',
            message: 'Session creation failed - no session returned',
            action: 'Auth Callback'
          })
        }
      } catch (err) {
        setAuthStep('error')
        console.error('Auth callback error:', err)
        setError('An unexpected error occurred during authentication')
        setLoading(false)
        addLog({
          type: 'error',
          message: `Unexpected error: ${err instanceof Error ? err.message : 'Unknown error'}`,
          action: 'Auth Callback'
        })
      }
    }

    handleAuthCallback()
  }, [searchParams, router, addLog])

  const handleRetry = () => {
    addLog({
      type: 'info',
      message: 'User requested authentication retry',
      action: 'Auth Callback'
    })
    router.push('/auth/login')
  }

  const handleGoHome = () => {
    addLog({
      type: 'info',
      message: 'User navigated to homepage',
      action: 'Auth Callback'
    })
    router.push('/')
  }

  // Loading states
  if (loading) {
    return (
      <main>
        <div className="grid h-dvh justify-center p-2 lg:grid-cols-2">
          {/* Left Panel - Logo Section */}
          <div className="bg-primary relative order-2 hidden h-full rounded-3xl lg:flex">
            <div className="text-primary-foreground absolute top-4 w-full">
              <div className="flex flex-col items-center">
                <div className="text-primary-foreground [&_img]:invert dark:[&_img]:invert-0">
                  <img
                    src="/logos/una.svg"
                    alt="API360 Logo"
                    className="size-[720px]"
                  />
                </div>
                <h1 className="text-2xl font-medium relative mt-4">
                  Authentication
                  <span className="absolute -top-2 -right-2 text-sm font-normal">®</span>
                </h1>
              </div>
            </div>

            <div className="absolute left-1/2 top-1/2 flex w-full -translate-x-1/2 -translate-y-1/2 justify-center px-10 lg:top-2/3">
              <div className="text-primary-foreground flex flex-col items-center space-y-4 max-w-md text-center">
                <div className="space-y-2">
                  <h3 className="text-xl font-medium">Secure Authentication</h3>
                  <p className="text-sm opacity-90">
                    We're processing your authentication request securely.
                  </p>
                </div>
              </div>
            </div>

            <div className="absolute bottom-4 md:bottom-5 lg:bottom-5 flex w-full justify-between px-4 md:px-6 lg:px-10">
              <div className="text-xs md:text-sm text-primary-foreground">
                © 2025 Api360®. All rights reserved.
              </div>
            </div>
          </div>

          {/* Right Panel - Loading Status */}
          <div className="relative order-1 flex h-full">
            <div className="mx-auto flex w-full flex-col justify-center space-y-8 sm:w-[350px]">
              {/* Dynamic Universal Spinner based on current step */}
              <div className="flex justify-center">
                <InlineSpinner
                  size="lg"
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    )
  }

  // Success state
  if (success) {
    return (
      <main>
        <div className="grid h-dvh justify-center p-2 lg:grid-cols-2">
          {/* Left Panel - Logo Section */}
          <div className="bg-primary relative order-2 hidden h-full rounded-3xl lg:flex">
            <div className="text-primary-foreground absolute top-7 w-full">
              <div className="flex flex-col items-center">
                <div className="text-primary-foreground [&_img]:invert dark:[&_img]:invert-0 relative">
                  <img
                    src="/logos/una.svg"
                    alt="API360 Logo"
                    className="size-[720px]"
                  />
                  <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-2">
                    <CheckCircle2 className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h1 className="text-2xl font-medium relative mt-4">
                  Authentication Complete
                  <span className="absolute -top-2 -right-2 text-sm font-normal">®</span>
                </h1>
              </div>
            </div>

            <div className="absolute left-1/2 top-1/2 flex w-full -translate-x-1/2 -translate-y-1/2 justify-center px-10 lg:top-2/3">
              <div className="text-primary-foreground flex flex-col items-center space-y-4 max-w-md text-center">
                <div className="space-y-2">
                  <h3 className="text-xl font-medium">Welcome Back!</h3>
                  <p className="text-sm opacity-90">
                    Your authentication was successful. Redirecting to dashboard...
                  </p>
                </div>
              </div>
            </div>

            <div className="absolute bottom-4 md:bottom-5 lg:bottom-5 flex w-full justify-between px-4 md:px-6 lg:px-10">
              <div className="text-xs md:text-sm text-primary-foreground">
                © 2025 Api360®. All rights reserved.
              </div>
            </div>
          </div>

          {/* Right Panel - Success Status */}
          <div className="relative order-1 flex h-full">
            <div className="mx-auto flex w-full flex-col justify-center space-y-8 sm:w-[350px]">
              <div className="space-y-6">
                <div className="flex flex-col items-center space-y-3">
                  <div className="bg-green-100 rounded-full p-3">
                    <CheckCircle2 className="w-8 h-8 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-semibold text-green-600">Authentication Successful!</h2>
                  <p className="text-muted-foreground text-center">
                    Welcome back! You are being redirected to your dashboard.
                  </p>
                </div>

                {/* Success Indicator */}
                <div className="flex items-center justify-center space-x-2 text-green-600">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="text-sm font-medium">Session Established</span>
                </div>

                {/* Auto-redirect countdown */}
                <div className="text-sm text-muted-foreground text-center">
                  Redirecting in <span className="font-mono">2</span> seconds...
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    )
  }

  // Error state
  if (error) {
    return (
      <main>
        <div className="grid h-dvh justify-center p-2 lg:grid-cols-2">
          {/* Left Panel - Logo Section */}
          <div className="bg-primary relative order-2 hidden h-full rounded-3xl lg:flex">
            <div className="text-primary-foreground absolute top-7 w-full">
              <div className="flex flex-col items-center">
                <div className="text-primary-foreground [&_img]:invert dark:[&_img]:invert-0 relative">
                  <img
                    src="/logos/una.svg"
                    alt="API360 Logo"
                    className="size-[720px]"
                  />
                  <div className="absolute -bottom-2 -right-2 bg-red-500 rounded-full p-2">
                    <XCircle className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h1 className="text-2xl font-medium relative mt-4">
                  Authentication Failed
                  <span className="absolute -top-2 -right-2 text-sm font-normal">®</span>
                </h1>
              </div>
            </div>

            <div className="absolute left-1/2 top-1/2 flex w-full -translate-x-1/2 -translate-y-1/2 justify-center px-10 lg:top-2/3">
              <div className="text-primary-foreground flex flex-col items-center space-y-4 max-w-md text-center">
                <div className="space-y-2">
                  <h3 className="text-xl font-medium">Authentication Error</h3>
                  <p className="text-sm opacity-90">
                    There was an issue with your authentication. Please try again.
                  </p>
                </div>
              </div>
            </div>

            <div className="absolute bottom-4 md:bottom-5 lg:bottom-5 flex w-full justify-between px-4 md:px-6 lg:px-10">
              <div className="text-xs md:text-sm text-primary-foreground">
                © 2025 Api360®. All rights reserved.
              </div>
            </div>
          </div>

          {/* Right Panel - Error Status */}
          <div className="relative order-1 flex h-full">
            <div className="mx-auto flex w-full flex-col justify-center space-y-8 sm:w-[350px]">
              <div className="space-y-6">
                <div className="flex flex-col items-center space-y-3">
                  <div className="mx-auto mb-2">
                    <img
                      src="/logos/una.svg"
                      alt="API360 Logo"
                      className="w-72 h-72 mx-auto"
                    />
                  </div>
                  <h2 className="text-xl font-semibold">Authentication Failed</h2>
                  <p className="text-muted-foreground text-sm leading-relaxed text-center">
                    {error}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3 w-full">
                  <AIButton
                    spec={retryAuthAction}
                    onActionSuccess={handleRetry}
                    loadingText="Redirecting..."
                    errorText="Redirect Failed"
                    className="w-full"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Try Again
                  </AIButton>

                  <AIButton
                    spec={homeRedirectAction}
                    onActionSuccess={handleGoHome}
                    variant="outline"
                    loadingText="Going home..."
                    errorText="Redirect Failed"
                    className="w-full"
                  >
                    <Home className="w-4 h-4 mr-2" />
                    Go to Homepage
                  </AIButton>
                </div>

                {/* Additional Help */}
                <div className="text-xs text-muted-foreground text-center">
                  If this problem persists, please contact our support team for assistance.
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return null
}