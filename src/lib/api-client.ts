'use client'

import { useDocLogger } from '@/lib/ai/doc-logger'

// API Client configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export interface ApiResponse<T = any> {
  data?: T
  error?: string
  message?: string
  status: number
}

export interface ApiError {
  detail: string
  status: number
  code?: string
}

export class ApiClient {
  private baseUrl: string
  private defaultHeaders: Record<string, string>

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    }
  }

  private getAuthHeaders(): Record<string, string> {
    const headers: Record<string, string> = {}

    // Try to get auth token from multiple sources
    const token =
      localStorage.getItem('auth-token') ||
      sessionStorage.getItem('auth-token') ||
      this.getCookie('auth-token')

    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    return headers
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

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const startTime = Date.now()
    const url = `${this.baseUrl}${endpoint}`
    const { addLog } = useDocLogger()

    const headers = {
      ...this.defaultHeaders,
      ...this.getAuthHeaders(),
      ...options.headers,
    }

    try {
      addLog({
        type: 'info',
        message: `API Request: ${options.method || 'GET'} ${endpoint}`,
        action: 'API_REQUEST',
        data: { endpoint, method: options.method, headers }
      })

      const response = await fetch(url, {
        ...options,
        headers,
      })

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
        const error: ApiError = typeof data === 'object' ? data : { detail: data, status: response.status }

        addLog({
          type: 'error',
          message: `API Error: ${response.status} ${error.detail}`,
          action: 'API_ERROR',
          data: { endpoint, status: response.status, error: error.detail },
          duration
        })

        return {
          error: error.detail,
          status: response.status,
        }
      }

      addLog({
        type: 'success',
        message: `API Success: ${options.method || 'GET'} ${endpoint}`,
        action: 'API_SUCCESS',
        data: { endpoint, data },
        duration
      })

      return {
        data,
        status: response.status,
      }

    } catch (error) {
      const duration = Date.now() - startTime
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'

      addLog({
        type: 'error',
        message: `API Request Failed: ${errorMessage}`,
        action: 'API_REQUEST_FAILED',
        data: { endpoint, error: errorMessage },
        duration
      })

      return {
        error: errorMessage,
        status: 0,
      }
    }
  }

  // HTTP Methods
  async get<T>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    const url = params ? `${endpoint}?${new URLSearchParams(params).toString()}` : endpoint
    return this.request<T>(url, { method: 'GET' })
  }

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async patch<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' })
  }

  // File upload
  async upload<T>(endpoint: string, file: File, additionalData?: Record<string, any>): Promise<ApiResponse<T>> {
    const formData = new FormData()
    formData.append('file', file)

    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, String(value))
      })
    }

    return this.request<T>(endpoint, {
      method: 'POST',
      body: formData,
      headers: {
        // Don't set Content-Type for FormData, browser will set it with boundary
        ...this.getAuthHeaders(),
      },
    })
  }
}

// Create singleton instance
export const apiClient = new ApiClient()

// Hook for using the API client
export function useApiClient() {
  return apiClient
}

// Service classes for different API endpoints
export class AuthService {
  constructor(private client: ApiClient) {}

  async login(credentials: { email: string; password: string }) {
    return this.client.post('/auth/login', credentials)
  }

  async register(userData: { email: string; password: string; name?: string }) {
    return this.client.post('/auth/register', userData)
  }

  async logout() {
    return this.client.post('/auth/logout')
  }

  async refreshToken() {
    return this.client.post('/auth/refresh')
  }

  async resetPassword(email: string) {
    return this.client.post('/auth/password-reset', { email })
  }

  async confirmResetPassword(token: string, newPassword: string) {
    return this.client.post('/auth/password-reset/confirm', { token, newPassword })
  }
}

export class UserService {
  constructor(private client: ApiClient) {}

  async getProfile() {
    return this.client.get('/users/me')
  }

  async updateProfile(data: Partial<{ name: string; email: string; avatar_url: string }>) {
    return this.client.put('/users/me', data)
  }

  async getStats() {
    return this.client.get('/users/me/stats')
  }

  async getActivities(params?: { limit?: number; offset?: number }) {
    return this.client.get('/users/me/activities', params)
  }
}

export class SupportService {
  constructor(private client: ApiClient) {}

  async createTicket(ticketData: { subject: string; message: string; priority: string }) {
    return this.client.post('/support/tickets', ticketData)
  }

  async getTickets(params?: { status?: string; limit?: number; offset?: number }) {
    return this.client.get('/support/tickets', params)
  }

  async getTicket(ticketId: string) {
    return this.client.get(`/support/tickets/${ticketId}`)
  }

  async updateTicket(ticketId: string, data: { status?: string; message?: string }) {
    return this.client.patch(`/support/tickets/${ticketId}`, data)
  }
}

// Create service instances
export const authService = new AuthService(apiClient)
export const userService = new UserService(apiClient)
export const supportService = new SupportService(apiClient)