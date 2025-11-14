'use client'

import type { useDocLogger } from '@/lib/ai/doc-logger'

// Core API Client Configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
const WS_BASE_URL = API_BASE_URL.replace(/^http/, 'ws')

export interface ApiResponse<T = any> {
  data?: T
  error?: string
  message?: string
  status: number
  success: boolean
}

export interface ApiError {
  detail: string
  status: number
  code?: string
  field?: string
}

export interface ApiRequestOptions extends RequestInit {
  timeout?: number
  retries?: number
  retryDelay?: number
}

export class ApiClient {
  private baseUrl: string
  private wsUrl: string
  private defaultHeaders: Record<string, string>
  private requestTimeout: number = 60000 // 60 seconds default

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl
    this.wsUrl = baseUrl.replace(/^http/, 'ws')
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }
  }

  getAuthHeaders(): Record<string, string> {
    const headers: Record<string, string> = {}

    // Try to get auth token from multiple sources
    const token = this.getAuthToken()

    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    return headers
  }

  private getAuthToken(): string | null {
    if (typeof window === 'undefined') return null

    // Priority: localStorage > sessionStorage > cookies
    return (
      localStorage.getItem('auth-token') ||
      sessionStorage.getItem('auth-token') ||
      this.getCookie('auth-token')
    )
  }

  private setAuthToken(token: string, persist: boolean = true): void {
    if (typeof window === 'undefined') return

    if (persist) {
      localStorage.setItem('auth-token', token)
    } else {
      sessionStorage.setItem('auth-token', token)
    }
  }

  private clearAuthToken(): void {
    if (typeof window === 'undefined') return

    localStorage.removeItem('auth-token')
    sessionStorage.removeItem('auth-token')
    this.deleteCookie('auth-token')
  }

  private getCookie(name: string): string | null {
    if (typeof document === 'undefined') return null

    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)

    if (parts.length === 2) {
      return parts.pop()?.split(';').shift() || null
    }

    return null
  }

  private setCookie(name: string, value: string, days: number = 7): void {
    if (typeof document === 'undefined') return

    const expires = new Date()
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000)
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;secure;samesite=strict`
  }

  private deleteCookie(name: string): void {
    if (typeof document === 'undefined') return

    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`
  }

  async request<T>(
    endpoint: string,
    options: ApiRequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const startTime = Date.now()
    const url = `${this.baseUrl}${endpoint}`

    // Use docLogger dynamically imported to avoid SSR issues
    let addLog: ReturnType<typeof useDocLogger>['addLog'] = () => {}

    try {
      const { useDocLogger } = await import('@/lib/ai/doc-logger')
      const logger = useDocLogger()
      addLog = logger.addLog
    } catch (error) {
      // Silently fail if docLogger is not available
    }

    const {
      timeout = this.requestTimeout,
      retries = 3,
      retryDelay = 1000,
      headers: customHeaders,
      ...fetchOptions
    } = options

    const headers = {
      ...this.defaultHeaders,
      ...this.getAuthHeaders(),
      ...customHeaders,
    }

    let lastError: Error | null = null

    // Retry logic with exponential backoff
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        addLog({
          type: 'info',
          message: `API Request: ${options.method || 'GET'} ${endpoint}${attempt > 0 ? ` (attempt ${attempt + 1})` : ''}`,
          action: 'API_REQUEST',
          data: {
            endpoint,
            method: options.method,
            attempt: attempt + 1,
            headers: Object.keys(headers)
          }
        })

        // Create AbortController for timeout
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), timeout)

        const response = await fetch(url, {
          ...fetchOptions,
          headers,
          signal: controller.signal,
        })

        clearTimeout(timeoutId)
        const duration = Date.now() - startTime

        // Handle different response types
        const contentType = response.headers.get('content-type')
        let data: any

        if (contentType?.includes('application/json')) {
          data = await response.json()
        } else if (contentType?.includes('text/')) {
          data = await response.text()
        } else {
          data = await response.blob()
        }

        if (!response.ok) {
          const error: ApiError = typeof data === 'object' ? data : {
            detail: typeof data === 'string' ? data : 'Request failed',
            status: response.status
          }

          addLog({
            type: 'error',
            message: `API Error: ${response.status} ${error.detail}`,
            action: 'API_ERROR',
            data: { endpoint, status: response.status, error: error.detail },
            duration
          })

          // Don't retry on authentication errors or client errors (4xx)
          if (response.status >= 400 && response.status < 500) {
            return {
              error: error.detail,
              status: response.status,
              success: false,
            }
          }

          throw new Error(error.detail)
        }

        addLog({
          type: 'success',
          message: `API Success: ${options.method || 'GET'} ${endpoint}`,
          action: 'API_SUCCESS',
          data: { endpoint, status: response.status },
          duration
        })

        return {
          data,
          status: response.status,
          success: true,
        }

      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error')

        // Don't retry on abort or network errors that indicate no connection
        if (lastError.name === 'AbortError' ||
            (lastError.message.includes('fetch') && attempt < retries)) {
          // Wait before retry with exponential backoff
          await new Promise(resolve => setTimeout(resolve, retryDelay * Math.pow(2, attempt)))
          continue
        }

        break
      }
    }

    const duration = Date.now() - startTime
    const errorMessage = lastError?.message || 'Request failed'

    addLog({
      type: 'error',
      message: `API Request Failed: ${errorMessage}`,
      action: 'API_REQUEST_FAILED',
      data: { endpoint, error: errorMessage, attempts: retries + 1 },
      duration
    })

    return {
      error: errorMessage,
      status: 0,
      success: false,
    }
  }

  // HTTP Methods
  async get<T>(endpoint: string, params?: Record<string, any>, options?: ApiRequestOptions): Promise<ApiResponse<T>> {
    const url = params ? `${endpoint}?${new URLSearchParams(params).toString()}` : endpoint
    return this.request<T>(url, { ...options, method: 'GET' })
  }

  async post<T>(endpoint: string, data?: any, options?: ApiRequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async put<T>(endpoint: string, data?: any, options?: ApiRequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async patch<T>(endpoint: string, data?: any, options?: ApiRequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async delete<T>(endpoint: string, options?: ApiRequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' })
  }

  // File upload
  async upload<T>(endpoint: string, file: File, additionalData?: Record<string, any>, options?: ApiRequestOptions): Promise<ApiResponse<T>> {
    const formData = new FormData()
    formData.append('file', file)

    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, String(value))
      })
    }

    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: formData,
      headers: {
        // Don't set Content-Type for FormData, browser will set it with boundary
        ...this.getAuthHeaders(),
      },
    })
  }

  // WebSocket connection
  createWebSocket(path: string = '/ws'): WebSocket | null {
    if (typeof window === 'undefined') return null

    const token = this.getAuthToken()
    if (!token) return null

    const wsUrl = `${this.wsUrl}${path}?authorization=${encodeURIComponent(token)}`

    try {
      return new WebSocket(wsUrl)
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error)
      return null
    }
  }

  // Authentication token management
  setAuth(token: string, persist: boolean = true): void {
    this.setAuthToken(token, persist)
    this.setCookie('auth-token', token, 7) // 7 days
  }

  clearAuth(): void {
    this.clearAuthToken()
  }

  hasAuth(): boolean {
    return !!this.getAuthToken()
  }
}

// Create singleton instance
export const apiClient = new ApiClient()

// Hook for using the API client
export function useApiClient() {
  return apiClient
}

// Helper function for authenticated requests
export function createAuthenticatedRequest<T = any>(
  client: ApiClient,
  endpoint: string,
  options: ApiRequestOptions = {}
): Promise<ApiResponse<T>> {
  if (!client.hasAuth()) {
    return Promise.resolve({
      error: 'No authentication token available',
      status: 401,
      success: false,
    })
  }

  return client.request<T>(endpoint, options)
}