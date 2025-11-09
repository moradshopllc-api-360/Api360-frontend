'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import type { ActionSpec } from '@/lib/ai/actions'
import { validateActionSpec } from '@/lib/ai/actions'
import { useDocLogger } from '@/lib/ai/doc-logger'
import { apiFetch } from '@/config/api-config'

export interface UseAIAutowireOptions {
  onSuccess?: (data: any) => void
  onError?: (error: Error) => void
}

export interface UseAIAutowireReturn {
  execute: (spec: ActionSpec, data?: any) => Promise<any>
  loading: boolean
  error: Error | null
  response: any
  reset: () => void
}

export function useAIAutowire(options: UseAIAutowireOptions = {}): UseAIAutowireReturn {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [response, setResponse] = useState<any>(null)
  const { addLog } = useDocLogger()
  const router = useRouter()

  const { onSuccess, onError } = options

  const execute = useCallback(async (spec: ActionSpec, data?: any) => {
    const startTime = Date.now()
    setLoading(true)
    setError(null)
    setResponse(null)

    try {
      // Enhanced logging with action validation
      console.log(`🚀 [AI360] Starting execution:`, {
        method: spec.method,
        path: spec.path,
        hasData: !!data,
        dataType: data ? typeof data : 'none',
        timestamp: new Date().toISOString(),
        isNavigation: spec.method === 'NAVIGATE'
      })

      // Log the action start with more context
      addLog({
        type: 'info',
        message: `🚀 Executing ${spec.method} ${spec.path}`,
        action: `${spec.method} ${spec.path}`,
        data: {
          ...data,
          _metadata: {
            userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'SSR',
            timestamp: new Date().toISOString(),
            hasAuth: !!localStorage.getItem('auth-token') || !!sessionStorage.getItem('auth-token'),
            isNavigation: spec.method === 'NAVIGATE'
          }
        }
      })

      // Validate action spec before execution
      const validation = validateActionSpec ? validateActionSpec(spec) : { valid: true, warnings: [] }
      if (!validation.valid && validation.warnings.length > 0) {
        console.warn(`⚠️ [AI360] ActionSpec warnings:`, validation.warnings)
        addLog({
          type: 'warning',
          message: `ActionSpec validation warnings: ${validation.warnings.join(', ')}`,
          action: `${spec.method} ${spec.path}`,
          data: { warnings: validation.warnings }
        })
      }

      // Handle NAVIGATE method - use Next.js router instead of apiFetch
      if (spec.method === 'NAVIGATE') {
        console.log(`🧭 [AI360] Navigation action detected: ${spec.path}`)

        // Simulate navigation delay for consistency
        await new Promise(resolve => setTimeout(resolve, 100))

        // Navigate to the path
        router.push(spec.path)

        const duration = Date.now() - startTime
        const navigationData = {
          success: true,
          navigated_to: spec.path,
          navigation_type: 'frontend',
          duration
        }

        setResponse(navigationData)

        console.log(`🎉 [AI360] Navigation completed successfully:`, {
          path: spec.path,
          duration: `${duration}ms`,
          type: 'frontend_navigation'
        })

        addLog({
          type: 'success',
          message: `✅ Navigation successful: ${spec.path}`,
          action: `NAVIGATE ${spec.path}`,
          data: {
            ...navigationData,
            _metadata: {
              isNavigation: true,
              duration
            }
          },
          duration
        })

        if (onSuccess) {
          console.log(`🔄 [AI360] Calling onSuccess callback for navigation`)
          onSuccess(navigationData)
        }

        return navigationData
      }

      // Use centralized apiFetch which handles auth headers automatically for API methods
      const fetchOptions: RequestInit = {
        method: spec.method,
      }

      // Add body for methods that support it
      if (data && ['POST', 'PUT', 'PATCH'].includes(spec.method)) {
        fetchOptions.body = JSON.stringify(data)
        console.log(`📤 [AI360] Request body:`, {
          contentType: 'application/json',
          bodySize: JSON.stringify(data).length,
          hasPassword: !!data.password || !!data.newPassword
        })
      }

      console.log(`🌐 [AI360] Sending API request to ${spec.path}`)
      const res = await apiFetch(spec.path, fetchOptions)
      const duration = Date.now() - startTime

      // Check if this is a mock response
      const isMockResponse = res.headers.get('X-Mock-Response') === 'true'
      const isDevelopmentMode = res.headers.get('X-Development-Mode') === 'true'

      console.log(`📥 [AI360] Response received:`, {
        status: res.status,
        statusText: res.statusText,
        contentType: res.headers.get('content-type'),
        isMockResponse,
        isDevelopmentMode,
        duration: `${duration}ms`
      })

      if (!res.ok) {
        const errorText = await res.text()
        const error = new Error(`HTTP ${res.status}: ${errorText}`)

        // Enhanced error logging
        console.error(`❌ [AI360] Request failed:`, {
          status: res.status,
          statusText: res.statusText,
          errorText,
          path: spec.path,
          method: spec.method,
          duration: `${duration}ms`,
          isMockResponse
        })

        addLog({
          type: 'error',
          message: `❌ Request failed: ${res.status} ${res.statusText}`,
          action: `${spec.method} ${spec.path}`,
          data: {
            status: res.status,
            statusText: res.statusText,
            error: errorText,
            isMockResponse,
            duration
          },
          duration
        })

        throw error
      }

      // Handle different response types with enhanced logging
      const contentType = res.headers.get('content-type')
      let responseData: any

      console.log(`📊 [AI360] Processing response content:`, {
        contentType,
        contentLength: res.headers.get('content-length')
      })

      if (contentType?.includes('application/json')) {
        responseData = await res.json()
        console.log(`📋 [AI360] JSON response parsed:`, {
          keys: responseData ? Object.keys(responseData) : [],
          hasData: !!responseData,
          isArray: Array.isArray(responseData),
          isMockResponse
        })
      } else if (contentType?.includes('text/')) {
        responseData = await res.text()
        console.log(`📝 [AI360] Text response parsed:`, {
          length: responseData.length,
          preview: responseData.substring(0, 100)
        })
      } else {
        responseData = await res.blob()
        console.log(`📎 [AI360] Blob response received:`, {
          size: responseData.size,
          type: responseData.type
        })
      }

      setResponse(responseData)

      // Success logging with mock mode indicator
      const successMessage = isMockResponse
        ? `✅ Request successful (mock mode): ${spec.method} ${spec.path}`
        : `✅ Request successful: ${spec.method} ${spec.path}`

      console.log(`🎉 [AI360] Request completed successfully:`, {
        method: spec.method,
        path: spec.path,
        duration: `${duration}ms`,
        isMockResponse,
        responseType: typeof responseData
      })

      addLog({
        type: 'success',
        message: successMessage,
        action: `${spec.method} ${spec.path}`,
        data: {
          ...responseData,
          _metadata: {
            isMockResponse,
            duration,
            contentType
          }
        },
        duration
      })

      if (onSuccess) {
        console.log(`🔄 [AI360] Calling onSuccess callback`)
        onSuccess(responseData)
      }

      return responseData

    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error occurred')
      const duration = Date.now() - startTime

      // Enhanced error classification and logging
      const errorType = error.name || 'UNKNOWN_ERROR'
      const isNetworkError = error.message.includes('Failed to fetch') ||
                            error.message.includes('NETWORK_ERROR')

      console.error(`💥 [AI360] Execution failed:`, {
        errorType,
        errorMessage: error.message,
        method: spec.method,
        path: spec.path,
        duration: `${duration}ms`,
        isNetworkError,
        stack: error.stack?.split('\n').slice(0, 3).join('\n') // First 3 lines of stack
      })

      setError(error)

      addLog({
        type: 'error',
        message: `💥 Request failed: ${error.message} [${errorType}]`,
        action: `${spec.method} ${spec.path}`,
        data: {
          error: error.message,
          errorType,
          isNetworkError,
          duration,
          stack: error.stack?.split('\n').slice(0, 2) // First 2 lines for doc log
        },
        duration
      })

      if (onError) {
        console.log(`🔄 [AI360] Calling onError callback`)
        onError(error)
      }

      throw error

    } finally {
      setLoading(false)
      console.log(`🏁 [AI360] Execution finished in ${Date.now() - startTime}ms`)
    }
  }, [addLog, onSuccess, onError])

  const reset = useCallback(() => {
    setLoading(false)
    setError(null)
    setResponse(null)
  }, [])

  return {
    execute,
    loading,
    error,
    response,
    reset
  }
}

// Hook for managing multiple concurrent requests
export function useAIAutowireBatch(options: UseAIAutowireOptions = {}) {
  const [batchLoading, setBatchLoading] = useState(false)
  const [results, setResults] = useState<Array<{ spec: ActionSpec; data?: any; error?: Error }>>([])
  const { addLog } = useDocLogger()
  const autowire = useAIAutowire(options)

  const executeBatch = useCallback(async (specs: Array<{ spec: ActionSpec; data?: any }>) => {
    setBatchLoading(true)
    setResults([])

    const startTime = Date.now()

    try {
      addLog({
        type: 'info',
        message: `Starting batch execution of ${specs.length} requests`
      })

      // Execute requests sequentially
      const batchResults: Array<{ spec: ActionSpec; data?: any; error?: Error }> = []

      for (const { spec, data } of specs) {
        try {
          const result = await autowire.execute(spec, data)
          batchResults.push({ spec, data: result, error: undefined })
        } catch (error) {
          batchResults.push({
            spec,
            data: undefined,
            error: error instanceof Error ? error : new Error('Unknown error')
          })
        }
      }

      setResults(batchResults)

      const duration = Date.now() - startTime
      const successCount = batchResults.filter(r => !r.error).length
      const errorCount = batchResults.filter(r => r.error).length

      addLog({
        type: successCount === specs.length ? 'success' : errorCount === specs.length ? 'error' : 'warning',
        message: `Batch completed: ${successCount} successful, ${errorCount} failed`,
        data: {
          total: specs.length,
          successful: successCount,
          failed: errorCount,
          duration
        },
        duration
      })

      return batchResults

    } catch (error) {
      const duration = Date.now() - startTime

      addLog({
        type: 'error',
        message: `Batch execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        duration
      })

      throw error

    } finally {
      setBatchLoading(false)
    }
  }, [addLog, autowire])

  const resetBatch = useCallback(() => {
    setResults([])
    setBatchLoading(false)
  }, [])

  return {
    executeBatch,
    batchLoading,
    results,
    resetBatch
  }
}