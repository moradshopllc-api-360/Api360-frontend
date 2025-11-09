// API Configuration
export const API_CONFIG = {
  // Base URLs for different environments
  BASE_URLS: {
    development: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
    production: process.env.NEXT_PUBLIC_API_URL || 'https://api.api360.com',
    staging: process.env.NEXT_PUBLIC_API_URL || 'https://staging-api.api360.com'
  },

  // Current environment
  get BASE_URL() {
    const env = process.env.NODE_ENV as keyof typeof this.BASE_URLS
    return this.BASE_URLS[env] || this.BASE_URLS.development
  },

  // API endpoints
  ENDPOINTS: {
    // Authentication
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      LOGOUT: '/auth/logout',
      REFRESH: '/auth/refresh',
      VERIFY_EMAIL: '/auth/verify-email',
      PASSWORD_RESET: '/auth/password-reset',
      PASSWORD_RESET_CONFIRM: '/auth/password-reset/confirm'
    },

    // Users
    USERS: {
      ME: '/users/me',
      PROFILE: '/users/me/profile',
      STATS: '/users/me/stats',
      ACTIVITIES: '/users/me/activities',
      PREFERENCES: '/users/me/preferences'
    },

    // Dashboard
    DASHBOARD: {
      OVERVIEW: '/dashboard/overview',
      STATS: '/dashboard/stats',
      RECENT_ACTIVITY: '/dashboard/recent-activity',
      CHARTS: '/dashboard/charts'
    },

    // Support
    SUPPORT: {
      TICKETS: '/support/tickets',
      TICKET: (id: string) => `/support/tickets/${id}`,
      CREATE_TICKET: '/support/tickets',
      UPDATE_TICKET: (id: string) => `/support/tickets/${id}`,
      FAQ: '/support/faq',
      CONTACT: '/support/contact'
    },

    // Admin (if needed)
    ADMIN: {
      USERS: '/admin/users',
      USER: (id: string) => `/admin/users/${id}`,
      STATS: '/admin/stats',
      ACTIVITIES: '/admin/activities',
      SETTINGS: '/admin/settings'
    }
  },

  // Request timeout in milliseconds
  TIMEOUT: 30000,

  // Retry configuration
  RETRY: {
    ATTEMPTS: 3,
    DELAY: 1000,
    BACKOFF_FACTOR: 2
  },

  // Cache configuration
  CACHE: {
    TTL: 5 * 60 * 1000, // 5 minutes
    KEY_PREFIX: 'api360_'
  },

  // WebSocket configuration
  WEBSOCKET: {
    URL: process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000/ws',
    RECONNECT_ATTEMPTS: 5,
    RECONNECT_DELAY: 2000
  }
}

// API Response types
export interface PaginationParams {
  limit?: number
  offset?: number
  page?: number
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  limit: number
  offset: number
  has_next: boolean
  has_previous: boolean
}

export interface ApiResponse<T = any> {
  data?: T
  error?: string
  message?: string
  status: number
  success: boolean
}

// Error types
export interface ApiError {
  detail: string
  status: number
  code?: string
  field?: string
}

export interface ValidationError extends ApiError {
  field: string
  value?: any
}

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503
} as const

// API Request configuration
export interface RequestConfig {
  timeout?: number
  retries?: number
  cache?: boolean
  cacheTTL?: number
  headers?: Record<string, string>
}

// Default request configuration
export const DEFAULT_REQUEST_CONFIG: RequestConfig = {
  timeout: API_CONFIG.TIMEOUT,
  retries: API_CONFIG.RETRY.ATTEMPTS,
  cache: false
}

// Auth header helper
export function authHeader(): Record<string, string> {
  // Try to get token from localStorage or sessionStorage
  const token =
    typeof window !== 'undefined'
      ? localStorage.getItem('auth-token') || sessionStorage.getItem('auth-token')
      : null

  // Return auth header if token exists, otherwise return empty object
  return token ? { 'Authorization': `Bearer ${token}` } : {}
}

// Mock responses for development mode when backend is not available
const MOCK_RESPONSES: Record<string, any> = {
  '/api/auth/login': {
    ok: true,
    status: 200,
    json: async () => ({
      success: true,
      data: {
        user: { id: '1', email: 'dev@example.com', name: 'Dev User' },
        token: 'mock-jwt-token-development'
      },
      message: 'Login successful (mock mode)'
    })
  },
  '/api/auth/register': {
    ok: true,
    status: 201,
    json: async () => ({
      success: true,
      data: {
        user: { id: '2', email: 'newuser@example.com', name: 'New User' },
        token: 'mock-jwt-token-development'
      },
      message: 'Registration successful (mock mode)'
    })
  },
  '/api/auth/logout': {
    ok: true,
    status: 200,
    json: async () => ({
      success: true,
      message: 'Logout successful (mock mode)'
    })
  },
  '/api/auth/google': {
    ok: true,
    status: 200,
    json: async () => ({
      success: true,
      data: {
        url: 'https://accounts.google.com/oauth/authorize?mock=true'
      },
      message: 'Google OAuth URL generated (mock mode)'
    })
  },
  '/api/support/tickets': {
    ok: true,
    status: 200,
    json: async () => ({
      success: true,
      data: {
        tickets: [
          { id: '1', subject: 'Mock Ticket 1', status: 'open' },
          { id: '2', subject: 'Mock Ticket 2', status: 'resolved' }
        ]
      },
      message: 'Support tickets retrieved (mock mode)'
    })
  }
}

// Development mode detection
function isDevelopmentMode(): boolean {
  return process.env.NODE_ENV === 'development' ||
         process.env.NEXT_PUBLIC_AI360_DEBUG === 'true'
}

// Check if we should use mock responses
function shouldUseMockResponse(path: string): boolean {
  return isDevelopmentMode() &&
         process.env.NEXT_PUBLIC_USE_MOCK_API !== 'false' &&
         MOCK_RESPONSES[path] !== undefined
}

// Enhanced error classification
function classifyError(error: any): { type: string; isNetwork: boolean; isServer: boolean; canRetry: boolean } {
  if (error instanceof TypeError) {
    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
      return { type: 'NETWORK_ERROR', isNetwork: true, isServer: false, canRetry: true }
    }
    if (error.message.includes('CORS')) {
      return { type: 'CORS_ERROR', isNetwork: true, isServer: false, canRetry: false }
    }
  }

  if (error.name === 'AbortError') {
    return { type: 'TIMEOUT_ERROR', isNetwork: true, isServer: false, canRetry: true }
  }

  return { type: 'UNKNOWN_ERROR', isNetwork: false, isServer: false, canRetry: false }
}

// Create mock response object
function createMockResponse(path: string): Response {
  const mockData = MOCK_RESPONSES[path]
  return {
    ok: mockData.ok,
    status: mockData.status,
    statusText: 'OK (Mock)',
    headers: new Headers({
      'Content-Type': 'application/json',
      'X-Mock-Response': 'true',
      'X-Development-Mode': 'true'
    }),
    json: mockData.json,
    text: async () => JSON.stringify(await mockData.json()),
    blob: async () => new Blob([JSON.stringify(await mockData.json())], { type: 'application/json' }),
    arrayBuffer: async () => new TextEncoder().encode(JSON.stringify(await mockData.json())).buffer,
    formData: async () => new FormData(),
    bodyUsed: false,
    clone: () => createMockResponse(path)
  } as Response
}

// Base API fetch function with enhanced error handling and fallbacks
export async function apiFetch(
  path: string,
  options: RequestInit = {},
  config: RequestConfig = {}
): Promise<Response> {
  const url = path.startsWith('http') ? path : `${API_CONFIG.BASE_URL}${path}`

  // Check if we should use mock response for development
  if (shouldUseMockResponse(path)) {
    console.warn(`🚀 [AI360] Using mock response for ${path} (development mode)`)
    return createMockResponse(path)
  }

  const headers = {
    'Content-Type': 'application/json',
    ...authHeader(),
    ...options.headers,
    ...config.headers
  }

  const fetchOptions: RequestInit = {
    ...options,
    headers,
    // Add timeout for requests
    signal: AbortSignal.timeout(config.timeout || API_CONFIG.TIMEOUT)
  }

  try {
    console.log(`🌐 [AI360] API Request: ${fetchOptions.method || 'GET'} ${url}`)

    const response = await fetch(url, fetchOptions)

    console.log(`✅ [AI360] API Response: ${response.status} ${response.statusText} for ${url}`)

    return response

  } catch (error) {
    const errorClassification = classifyError(error)

    console.error(`❌ [AI360] API Error: ${errorClassification.type} for ${url}`, {
      error: error instanceof Error ? error.message : error,
      classification: errorClassification,
      url,
      method: fetchOptions.method || 'GET'
    })

    // Enhanced error handling with fallback to mock in development
    if (errorClassification.isNetwork && isDevelopmentMode() && shouldUseMockResponse(path)) {
      console.warn(`🔄 [AI360] Network error in development, falling back to mock response for ${path}`)
      return createMockResponse(path)
    }

    // Throw enhanced error with more context
    const enhancedError = new Error(
      `API request failed: ${error instanceof Error ? error.message : 'Unknown error'} ` +
      `(${fetchOptions.method || 'GET'} ${url}) [${errorClassification.type}]`
    )

    enhancedError.name = 'ApiFetchError'
    ;(enhancedError as any).originalError = error
    ;(enhancedError as any).classification = errorClassification
    ;(enhancedError as any).url = url
    ;(enhancedError as any).method = fetchOptions.method || 'GET'

    throw enhancedError
  }
}

// Enhanced API fetch with retry logic
export async function apiFetchWithRetry(
  path: string,
  options: RequestInit = {},
  config: RequestConfig = {}
): Promise<Response> {
  const maxRetries = config.retries || API_CONFIG.RETRY.ATTEMPTS
  let lastError: Error

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await apiFetch(path, options, config)
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error')

      // Don't retry on client errors (4xx)
      if (error instanceof Error && error.message.includes('4')) {
        throw lastError
      }

      // Wait before retry (exponential backoff)
      if (attempt < maxRetries) {
        const delay = API_CONFIG.RETRY.DELAY * Math.pow(API_CONFIG.RETRY.BACKOFF_FACTOR, attempt)
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
  }

  throw lastError!
}

// Helper function for common API methods
export const api = {
  get: (path: string, config?: RequestConfig) =>
    apiFetchWithRetry(path, { method: 'GET' }, config),

  post: (path: string, data?: any, config?: RequestConfig) =>
    apiFetchWithRetry(path, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined
    }, config),

  put: (path: string, data?: any, config?: RequestConfig) =>
    apiFetchWithRetry(path, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined
    }, config),

  patch: (path: string, data?: any, config?: RequestConfig) =>
    apiFetchWithRetry(path, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined
    }, config),

  delete: (path: string, config?: RequestConfig) =>
    apiFetchWithRetry(path, { method: 'DELETE' }, config)
}

// Constants for API configuration
export const API_BASE = API_CONFIG.BASE_URL