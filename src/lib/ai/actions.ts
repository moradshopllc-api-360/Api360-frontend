// ActionSpec interface for AI Workflow System
export interface ActionSpec {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'NAVIGATE'
  path: string // Relative path only (e.g., '/auth/login' or '/dashboard/default')
  body?: any
  // Note: Headers are automatically handled by apiClient including auth token
  doc?: {
    title?: string
    description?: string
    parameters?: Record<string, any>
    examples?: any[]
  }
}

// Predefined actions for common operations using FastAPI backend
export const actions = {
  // Authentication actions
  auth: {
    login: {
      method: 'POST' as const,
      path: '/auth/login',
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
      path: '/auth/register',
      doc: {
        title: 'User Registration',
        description: 'Register new user account',
        parameters: {
          email: 'string',
          password: 'string',
          name: 'string',
          role: 'string (optional)'
        }
      }
    },
    logout: {
      method: 'POST' as const,
      path: '/auth/logout',
      doc: {
        title: 'User Logout',
        description: 'End user session'
      }
    },
    refreshToken: {
      method: 'POST' as const,
      path: '/auth/refresh',
      doc: {
        title: 'Refresh Token',
        description: 'Refresh authentication token'
      }
    },
    getCurrentUser: {
      method: 'GET' as const,
      path: '/auth/me',
      doc: {
        title: 'Get Current User',
        description: 'Retrieve current authenticated user information'
      }
    },
    updateProfile: {
      method: 'PATCH' as const,
      path: '/auth/me',
      doc: {
        title: 'Update User Profile',
        description: 'Update current user profile information',
        parameters: {
          name: 'string (optional)',
          email: 'string (optional)',
          avatar_url: 'string (optional)'
        }
      }
    },
    requestPasswordReset: {
      method: 'POST' as const,
      path: '/auth/password-reset',
      doc: {
        title: 'Request Password Reset',
        description: 'Request password reset email',
        parameters: {
          email: 'string'
        }
      }
    },
    confirmPasswordReset: {
      method: 'POST' as const,
      path: '/auth/password-reset/confirm',
      doc: {
        title: 'Confirm Password Reset',
        description: 'Reset password with token',
        parameters: {
          token: 'string',
          new_password: 'string'
        }
      }
    },
    changePassword: {
      method: 'POST' as const,
      path: '/auth/change-password',
      doc: {
        title: 'Change Password',
        description: 'Change user password',
        parameters: {
          current_password: 'string',
          new_password: 'string'
        }
      }
    }
  },

  // User management actions
  users: {
    getProfile: {
      method: 'GET' as const,
      path: '/users/me',
      doc: {
        title: 'Get User Profile',
        description: 'Retrieve current user profile information'
      }
    },
    updateProfile: {
      method: 'PATCH' as const,
      path: '/users/me',
      doc: {
        title: 'Update User Profile',
        description: 'Update current user profile information',
        parameters: {
          name: 'string',
          email: 'string',
          avatar_url: 'string'
        }
      }
    },
    getStats: {
      method: 'GET' as const,
      path: '/users/me/stats',
      doc: {
        title: 'Get User Statistics',
        description: 'Retrieve user activity and usage statistics'
      }
    },
    getActivities: {
      method: 'GET' as const,
      path: '/users/me/activities',
      doc: {
        title: 'Get User Activities',
        description: 'Retrieve user activity history',
        parameters: {
          limit: 'number (optional)',
          offset: 'number (optional)',
          action: 'string (optional)'
        }
      }
    },
    getPreferences: {
      method: 'GET' as const,
      path: '/users/me/preferences',
      doc: {
        title: 'Get User Preferences',
        description: 'Retrieve user preferences and settings'
      }
    },
    updatePreferences: {
      method: 'PATCH' as const,
      path: '/users/me/preferences',
      doc: {
        title: 'Update User Preferences',
        description: 'Update user preferences and settings',
        parameters: {
          preferences: 'object'
        }
      }
    },
    uploadAvatar: {
      method: 'POST' as const,
      path: '/users/me/avatar',
      doc: {
        title: 'Upload Avatar',
        description: 'Upload user avatar image',
        parameters: {
          file: 'File'
        }
      }
    }
  },

  // Support actions
  support: {
    createTicket: {
      method: 'POST' as const,
      path: '/support/tickets',
      doc: {
        title: 'Create Support Ticket',
        description: 'Create a new support ticket',
        parameters: {
          subject: 'string',
          message: 'string',
          priority: 'string (low|medium|high|urgent)'
        }
      }
    },
    getTickets: {
      method: 'GET' as const,
      path: '/support/tickets',
      doc: {
        title: 'Get Support Tickets',
        description: 'Retrieve user support tickets',
        parameters: {
          page: 'number (optional)',
          limit: 'number (optional)',
          status: 'string (optional)',
          priority: 'string (optional)'
        }
      }
    },
    getTicket: {
      method: 'GET' as const,
      path: '/support/tickets/{ticketId}',
      doc: {
        title: 'Get Support Ticket',
        description: 'Retrieve specific support ticket details',
        parameters: {
          ticketId: 'string'
        }
      }
    },
    updateTicket: {
      method: 'PATCH' as const,
      path: '/support/tickets/{ticketId}',
      doc: {
        title: 'Update Support Ticket',
        description: 'Update support ticket status or details',
        parameters: {
          ticketId: 'string',
          status: 'string (optional)',
          message: 'string (optional)'
        }
      }
    },
    addMessage: {
      method: 'POST' as const,
      path: '/support/tickets/{ticketId}/messages',
      doc: {
        title: 'Add Ticket Message',
        description: 'Add message to support ticket',
        parameters: {
          ticketId: 'string',
          message: 'string',
          attachments: 'File[] (optional)'
        }
      }
    },
    getMessages: {
      method: 'GET' as const,
      path: '/support/tickets/{ticketId}/messages',
      doc: {
        title: 'Get Ticket Messages',
        description: 'Retrieve support ticket messages',
        parameters: {
          ticketId: 'string',
          page: 'number (optional)',
          limit: 'number (optional)'
        }
      }
    },
    closeTicket: {
      method: 'PATCH' as const,
      path: '/support/tickets/{ticketId}',
      doc: {
        title: 'Close Support Ticket',
        description: 'Close support ticket with reason',
        parameters: {
          ticketId: 'string',
          reason: 'string (optional)'
        }
      }
    },
    getStats: {
      method: 'GET' as const,
      path: '/support/tickets/stats',
      doc: {
        title: 'Get Support Statistics',
        description: 'Retrieve support ticket statistics'
      }
    }
  },

  // Admin actions (require elevated permissions)
  admin: {
    getAllUsers: {
      method: 'GET' as const,
      path: '/admin/users',
      doc: {
        title: 'Get All Users',
        description: 'Retrieve all users (admin only)',
        parameters: {
          page: 'number (optional)',
          limit: 'number (optional)',
          role: 'string (optional)',
          is_active: 'boolean (optional)',
          search: 'string (optional)'
        }
      }
    },
    getUser: {
      method: 'GET' as const,
      path: '/admin/users/{userId}',
      doc: {
        title: 'Get User',
        description: 'Retrieve specific user details (admin only)',
        parameters: {
          userId: 'string'
        }
      }
    },
    updateUser: {
      method: 'PATCH' as const,
      path: '/admin/users/{userId}',
      doc: {
        title: 'Update User',
        description: 'Update user details (admin only)',
        parameters: {
          userId: 'string',
          name: 'string (optional)',
          email: 'string (optional)',
          role: 'string (optional)',
          is_active: 'boolean (optional)'
        }
      }
    },
    getAllTickets: {
      method: 'GET' as const,
      path: '/admin/support/tickets',
      doc: {
        title: 'Get All Support Tickets',
        description: 'Retrieve all support tickets (admin only)',
        parameters: {
          page: 'number (optional)',
          limit: 'number (optional)',
          status: 'string (optional)',
          priority: 'string (optional)',
          user_id: 'string (optional)'
        }
      }
    },
    assignTicket: {
      method: 'PATCH' as const,
      path: '/admin/support/tickets/{ticketId}',
      doc: {
        title: 'Assign Support Ticket',
        description: 'Assign support ticket to user (admin only)',
        parameters: {
          ticketId: 'string',
          assigned_to: 'string'
        }
      }
    }
  },

  // Navigation actions
  navigation: {
    autoRedirect: {
      method: 'NAVIGATE' as const,
      path: '/dashboard',
      doc: {
        title: 'Auto Redirect to Dashboard',
        description: 'Automatically redirect authenticated user to dashboard page using frontend navigation',
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
    },
    toSettings: {
      method: 'NAVIGATE' as const,
      path: '/dashboard/settings',
      doc: {
        title: 'Navigate to Settings',
        description: 'Navigate to settings page',
        parameters: {
          section: 'string (optional)'
        }
      }
    },
    toProfile: {
      method: 'NAVIGATE' as const,
      path: '/dashboard/profile',
      doc: {
        title: 'Navigate to Profile',
        description: 'Navigate to user profile page'
      }
    }
  }
}

// Available endpoints in the FastAPI backend
const AVAILABLE_ENDPOINTS = [
  // Authentication endpoints
  '/auth/login',
  '/auth/register',
  '/auth/logout',
  '/auth/refresh',
  '/auth/me',
  '/auth/password-reset',
  '/auth/password-reset/confirm',
  '/auth/change-password',
  '/auth/verify-email',
  '/auth/resend-verification',

  // User endpoints
  '/users/me',
  '/users/me/stats',
  '/users/me/activities',
  '/users/me/preferences',
  '/users/me/avatar',
  '/users/me/sessions',
  '/users/me/export',
  '/users/me/delete-account',

  // Support endpoints
  '/support/tickets',
  '/support/tickets/stats',
  '/support/canned-responses',

  // Admin endpoints
  '/admin/users',
  '/admin/support/tickets',
  '/admin/support/canned-responses'
]

// Available navigation routes (frontend routes)
const AVAILABLE_NAVIGATION_ROUTES = [
  '/dashboard',
  '/dashboard/settings',
  '/dashboard/profile',
  '/dashboard/crm',
  '/dashboard/finance',
  '/auth/login',
  '/',
  '/unauthorized'
]

// Validate if endpoint exists or has navigation support
function validateEndpoint(path: string, method: string = 'GET'): { valid: boolean; hasEndpoint: boolean; isNavigation: boolean } {
  const hasEndpoint = AVAILABLE_ENDPOINTS.some(endpoint => {
    // Handle dynamic paths with parameters
    const endpointPattern = endpoint.replace(/\{[^}]+\}/g, '[^/]+')
    const regex = new RegExp(`^${endpointPattern}$`)
    return regex.test(path)
  })

  const isNavigation = method === 'NAVIGATE' && AVAILABLE_NAVIGATION_ROUTES.includes(path)

  return {
    valid: hasEndpoint || isNavigation,
    hasEndpoint,
    isNavigation
  }
}

// Enhanced error reporting for validation
function createValidationError(path: string, validation: ReturnType<typeof validateEndpoint>): Error {
  if (validation.isNavigation) {
    return new Error(`Navigation route ${path} is available but action validation failed`)
  }

  if (validation.hasEndpoint) {
    return new Error(`Endpoint ${path} is available but action validation failed`)
  }

  return new Error(
    `Path ${path} not found. Available endpoints: ${AVAILABLE_ENDPOINTS.join(', ')}. Available navigation routes: ${AVAILABLE_NAVIGATION_ROUTES.join(', ')}`
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
      availableNavigationRoutes: AVAILABLE_NAVIGATION_ROUTES
    })

    throw error
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

  if (!validation.hasEndpoint && !validation.isNavigation) {
    warnings.push(`Path ${spec.path} not found in available endpoints or navigation routes`)
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
export function getAvailableEndpoints(): { endpoints: string[]; navigation: string[] } {
  return {
    endpoints: AVAILABLE_ENDPOINTS,
    navigation: AVAILABLE_NAVIGATION_ROUTES
  }
}

// Import API configuration
import { API_BASE_URL } from '@/lib/api/client'

// Helper to build full URLs (for legacy use only - prefer apiClient for new code)
export function buildUrl(path: string): string {
  return `${API_BASE_URL}${path}`
}