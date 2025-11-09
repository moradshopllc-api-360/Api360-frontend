"use client"

import { useEffect, useRef, useCallback } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useLoading } from '@/contexts/loading-context'

export function useRouteTransitions() {
  const { showLoading, hideLoading } = useLoading()
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const previousPathname = useRef(pathname)
  const isLoadingRef = useRef(false)
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)

  const clearLoadingTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = undefined
    }
  }, [])

  const hideLoadingWithTimeout = useCallback(() => {
    clearLoadingTimeout()

    // Always hide loading after a max timeout to prevent infinite loading
    timeoutRef.current = setTimeout(() => {
      hideLoading()
      isLoadingRef.current = false
    }, 3000) // 3 seconds max loading time
  }, [clearLoadingTimeout, hideLoading])

  // Monitor pathname changes for route transitions
  useEffect(() => {
    // Check if this is a route change (not initial load)
    if (previousPathname.current !== pathname && previousPathname.current !== '/') {
      // Show loading when route changes
      if (!isLoadingRef.current) {
        isLoadingRef.current = true
        showLoading('Loading...')

        // Hide loading after a reasonable time
        hideLoadingWithTimeout()
      }
    }

    // Update previous pathname
    previousPathname.current = pathname

    // Hide loading when route is completed
    const hideTimeout = setTimeout(() => {
      if (isLoadingRef.current) {
        hideLoading()
        isLoadingRef.current = false
      }
    }, 500) // Small delay to allow content to start rendering

    return () => clearTimeout(hideTimeout)
  }, [pathname, showLoading, hideLoading, hideLoadingWithTimeout])

  // Monitor search params changes for filtering/sorting
  useEffect(() => {
    if (previousPathname.current === pathname && searchParams.toString() !== '') {
      // Show loading for search/filter changes but with shorter duration
      showLoading('Updating...')
      hideLoadingWithTimeout()
    }
  }, [searchParams, pathname, showLoading, hideLoadingWithTimeout])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearLoadingTimeout()
      hideLoading()
    }
  }, [clearLoadingTimeout, hideLoading])

  // Enhanced router navigation with loading states
  const navigateWithLoading = useCallback((url: string, options?: {
    replace?: boolean,
    message?: string
  }) => {
    if (!isLoadingRef.current) {
      isLoadingRef.current = true
      showLoading(options?.message || 'Loading...')

      // Navigate
      if (options?.replace) {
        router.replace(url)
      } else {
        router.push(url)
      }

      // Auto-hide loading after navigation
      hideLoadingWithTimeout()
    }
  }, [router, showLoading, hideLoadingWithTimeout])

  return {
    navigateWithLoading,
    isLoading: isLoadingRef.current
  }
}