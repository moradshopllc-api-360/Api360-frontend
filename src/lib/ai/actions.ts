// ActionSpec interface for AI Workflow System
export interface ActionSpec {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'NAVIGATE'
  path: string // Relative path only (e.g., '/api/auth/login' or '/dashboard/default')
  body?: any
  // Note: Headers are automatically handled by apiFetch() including auth token
  doc?: {
    title?: string
    description?: string
    parameters?: Record<string, any>
    examples?: any[]
  }
}

// Predefined actions for common operations
export const actions = {
  // Authentication actions
  auth: {
    login: {
      method: 'POST' as const,
      path: '/api/auth/login',
      doc: {
        title: 'User Login',
        description: 'Authenticate user with credentials',
        parameters: {
          email: 'string',
          password: 'string'
        }
      }
    },
    register: {
      method: 'POST' as const,
      path: '/api/auth/register',
      doc: {
        title: 'User Registration',
        description: 'Register new user account',
        parameters: {
          email: 'string',
          password: 'string',
          name: 'string'
        }
      }
    },
    logout: {
      method: 'POST' as const,
      path: '/api/auth/logout',
      doc: {
        title: 'User Logout',
        description: 'End user session'
      }
    },
    refreshToken: {
      method: 'POST' as const,
      path: '/api/auth/refresh',
      doc: {
        title: 'Refresh Token',
        description: 'Refresh authentication token'
      }
    },
    google: {
      oauth: {
        method: 'GET' as const,
        path: '/api/auth/google',
        doc: {
          title: 'Google OAuth',
          description: 'Initiate Google OAuth authentication flow',
          parameters: {
            provider: 'google',
            redirect_to: 'string (optional)'
          },
          examples: [
            {
              description: 'Start Google authentication',
              parameters: {
                provider: 'google',
                redirect_to: '/dashboard'
              }
            }
          ]
        }
      },
      callback: {
        method: 'POST' as const,
        path: '/api/auth/google/callback',
        doc: {
          title: 'Google OAuth Callback',
          description: 'Handle Google OAuth callback',
          parameters: {
            code: 'string',
            state: 'string'
          }
        }
      }
    }
  },

  // User management actions
  users: {
    getProfile: {
      method: 'GET' as const,
      path: '/api/users/profile',
      doc: {
        title: 'Get User Profile',
        description: 'Retrieve current user profile information'
      }
    },
    updateProfile: {
      method: 'PUT' as const,
      path: '/api/users/profile',
      doc: {
        title: 'Update User Profile',
        description: 'Update current user profile information',
        parameters: {
          name: 'string',
          email: 'string',
          avatar: 'string'
        }
      }
    }
  },

  // Dashboard actions
  dashboard: {
    getStats: {
      method: 'GET' as const,
      path: '/api/dashboard/stats',
      doc: {
        title: 'Get Dashboard Stats',
        description: 'Retrieve dashboard statistics and metrics'
      }
    },
    getRecentActivity: {
      method: 'GET' as const,
      path: '/api/dashboard/activity',
      doc: {
        title: 'Get Recent Activity',
        description: 'Retrieve recent user activity'
      }
    }
  },

  // Support actions
  support: {
    createTicket: {
      method: 'POST' as const,
      path: '/api/support/tickets',
      doc: {
        title: 'Create Support Ticket',
        description: 'Create a new support ticket',
        parameters: {
          subject: 'string',
          message: 'string',
          priority: 'string'
        }
      }
    },
    getTickets: {
      method: 'GET' as const,
      path: '/api/support/tickets',
      doc: {
        title: 'Get Support Tickets',
        description: 'Retrieve user support tickets'
      }
    }
  },

  // Recovery actions
  recovery: {
    requestPasswordReset: {
      method: 'POST' as const,
      path: '/api/recovery/password',
      doc: {
        title: 'Request Password Reset',
        description: 'Request password reset email',
        parameters: {
          email: 'string'
        }
      }
    },
    resetPassword: {
      method: 'POST' as const,
      path: '/api/recovery/password/reset',
      doc: {
        title: 'Reset Password',
        description: 'Reset password with token',
        parameters: {
          token: 'string',
          newPassword: 'string'
        }
      }
    },
    requestUsernameRecovery: {
      method: 'POST' as const,
      path: '/api/recovery/username',
      doc: {
        title: 'Request Username Recovery',
        description: 'Request username recovery email',
        parameters: {
          email: 'string'
        }
      }
    }
  },

  // Navigation actions
  navigation: {
    autoRedirect: {
      method: 'NAVIGATE' as const,
      path: '/dashboard/default',
      doc: {
        title: 'Auto Redirect to Dashboard',
        description: 'Automatically redirect authenticated user to default dashboard page using frontend navigation',
        parameters: {
          trigger: 'cache_redirect',
          reason: 'Authenticated user landing on homepage'
        },
        examples: [
          {
            description: 'Automatic redirect when user lands on homepage while authenticated',
            parameters: {
              trigger: 'cache_redirect',
              reason: 'Authenticated user landing on homepage'
            }
          }
        ]
      }
    },
    toLogin: {
      method: 'NAVIGATE' as const,
      path: '/auth/login',
      doc: {
        title: 'Navigate to Login',
        description: 'Navigate to login page for authentication',
        parameters: {
          redirect_to: 'string (optional)',
          reason: 'Unauthorized access attempt'
        },
        examples: [
          {
            description: 'Redirect unauthorized user to login',
            parameters: {
              redirect_to: '/dashboard',
              reason: 'Unauthorized access attempt'
            }
          }
        ]
      }
    },
    toHome: {
      method: 'NAVIGATE' as const,
      path: '/',
      doc: {
        title: 'Navigate to Homepage',
        description: 'Navigate to main homepage',
        parameters: {
          reason: 'User logout or session end'
        }
      }
    }
  }
}

// Available endpoints in the current project
const AVAILABLE_ENDPOINTS = [
  '/api/auth/google',
  '/api/auth/password-recovery',
  '/api/support',
  '/api/support/tickets'
]

// Available navigation routes (frontend routes)
const AVAILABLE_NAVIGATION_ROUTES = [
  '/dashboard/default',  // Navigation route for auto-redirect
  '/auth/login',         // Navigation route to login page
  '/'                    // Navigation route to homepage
]

// Development mode mock endpoints
const MOCK_ENDPOINTS = [
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/logout',
  '/api/users/profile',
  '/api/dashboard/stats',
  '/api/dashboard/activity',
  '/api/recovery/password',
  '/api/recovery/password/reset',
  '/api/recovery/username'
]

// Validate if endpoint exists or has mock support
function validateEndpoint(path: string, method: string = 'GET'): { valid: boolean; hasMock: boolean; available: boolean; isNavigation: boolean } {
  const isAvailable = AVAILABLE_ENDPOINTS.includes(path)
  const hasMock = MOCK_ENDPOINTS.includes(path)
  const isNavigation = method === 'NAVIGATE' && AVAILABLE_NAVIGATION_ROUTES.includes(path)

  return {
    valid: isAvailable || hasMock || isNavigation,
    hasMock,
    available: isAvailable,
    isNavigation
  }
}

// Enhanced error reporting for validation
function createValidationError(path: string, validation: ReturnType<typeof validateEndpoint>): Error {
  if (validation.available) {
    return new Error(`Endpoint ${path} is available but action validation failed`)
  }

  if (validation.isNavigation) {
    return new Error(`Navigation route ${path} is available but action validation failed`)
  }

  if (validation.hasMock) {
    return new Error(`Endpoint ${path} only available in mock/development mode`)
  }

  return new Error(
    `Path ${path} not found. Available endpoints: ${[...AVAILABLE_ENDPOINTS, ...MOCK_ENDPOINTS].join(', ')}. Available navigation routes: ${AVAILABLE_NAVIGATION_ROUTES.join(', ')}`
  )
}

// Helper function to create dynamic actions with validation
export function createAction(spec: Omit<ActionSpec, 'doc'> & { doc?: ActionSpec['doc'] }): ActionSpec {
  const validation = validateEndpoint(spec.path, spec.method)

  if (!validation.valid) {
    const error = createValidationError(spec.path, validation)
    console.error(`❌ [AI360] ActionSpec validation failed:`, {
      path: spec.path,
      method: spec.method,
      validation,
      availableEndpoints: AVAILABLE_ENDPOINTS,
      availableNavigationRoutes: AVAILABLE_NAVIGATION_ROUTES,
      mockEndpoints: MOCK_ENDPOINTS
    })

    // In development, we can still create the action but log a warning
    if (process.env.NODE_ENV === 'development' && validation.hasMock) {
      console.warn(`⚠️ [AI360] Using mock endpoint: ${spec.path}`)
    } else if (!validation.valid) {
      throw error
    }
  } else {
    const type = validation.isNavigation ? 'Navigation' : 'API'
    console.log(`✅ [AI360] ActionSpec validated: ${spec.method} ${spec.path} (${type})`)
  }

  return spec as ActionSpec
}

// Validate existing actions
export function validateActionSpec(spec: ActionSpec): { valid: boolean; warnings: string[] } {
  const warnings: string[] = []
  const validation = validateEndpoint(spec.path, spec.method)

  if (!validation.available && !validation.hasMock && !validation.isNavigation) {
    warnings.push(`Path ${spec.path} not found in available endpoints or navigation routes`)
  }

  if (!validation.available && validation.hasMock) {
    warnings.push(`Endpoint ${spec.path} only available in development mode`)
  }

  // Additional validation
  if (!spec.method) {
    warnings.push('Missing HTTP method or NAVIGATE')
  }

  if (!spec.path || !spec.path.startsWith('/')) {
    warnings.push('Invalid path format')
  }

  if (spec.method === 'NAVIGATE' && !validation.isNavigation) {
    warnings.push(`NAVIGATE method used but ${spec.path} is not in available navigation routes`)
  }

  return {
    valid: warnings.length === 0,
    warnings
  }
}

// Get all available endpoints (for debugging)
export function getAvailableEndpoints(): { real: string[]; mock: string[]; navigation: string[] } {
  return {
    real: AVAILABLE_ENDPOINTS,
    mock: MOCK_ENDPOINTS,
    navigation: AVAILABLE_NAVIGATION_ROUTES
  }
}

// Import API configuration
import { API_BASE } from '@/config/api-config'

// Helper to build full URLs (for legacy use only - prefer apiFetch() for new code)
export function buildUrl(path: string): string {
  return `${API_BASE}${path}`
}