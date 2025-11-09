"use client"

import { useEffect, useState, useRef } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { useLoading } from '@/contexts/loading-context'

export function useNavigationLoading() {
  const { showLoading, hideLoading } = useLoading()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isNavigating, setIsNavigating] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)

  const clearTimer = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = undefined
    }
  }

  // Show loading during navigation
  const startNavigation = (message = 'Loading...') => {
    if (!isNavigating) {
      setIsNavigating(true)
      showLoading(message)

      // Auto-hide after 3 seconds max
      clearTimer()
      timeoutRef.current = setTimeout(() => {
        stopNavigation()
      }, 3000)
    }
  }

  const stopNavigation = () => {
    setIsNavigating(false)
    hideLoading()
    clearTimer()
  }

  // Monitor route changes
  useEffect(() => {
    // When pathname changes, hide loading after a short delay
    const timer = setTimeout(() => {
      if (isNavigating) {
        stopNavigation()
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [pathname])

  // Monitor search params changes
  useEffect(() => {
    if (searchParams.toString() && isNavigating) {
      const timer = setTimeout(() => {
        stopNavigation()
      }, 200)

      return () => clearTimeout(timer)
    }
  }, [searchParams])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearTimer()
      stopNavigation()
    }
  }, [])

  return {
    isNavigating,
    startNavigation,
    stopNavigation
  }
}