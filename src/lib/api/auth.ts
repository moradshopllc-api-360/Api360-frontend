'use client'

import { apiClient } from './client'
import type {
  ApiResponse,
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  RefreshTokenResponse,
  User,
  AuthTokens
} from '@/types/api'

export class AuthService {
  constructor(private client: typeof apiClient) {}

  async login(credentials: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    const response = await this.client.post<AuthResponse>('/auth/login', credentials)

    if (response.success && response.data) {
      // Store authentication token
      this.client.setAuth(response.data.tokens.access_token)
    }

    return response
  }

  async register(userData: RegisterRequest): Promise<ApiResponse<AuthResponse>> {
    const response = await this.client.post<AuthResponse>('/auth/register', userData)

    if (response.success && response.data) {
      // Store authentication token
      this.client.setAuth(response.data.tokens.access_token)
    }

    return response
  }

  async logout(): Promise<ApiResponse<void>> {
    const response = await this.client.post<void>('/auth/logout')

    // Clear local authentication regardless of API response
    this.client.clearAuth()

    return response
  }

  async refreshToken(): Promise<ApiResponse<RefreshTokenResponse>> {
    const response = await this.client.post<RefreshTokenResponse>('/auth/refresh')

    if (response.success && response.data) {
      // Update stored authentication token
      this.client.setAuth(response.data.tokens.access_token)
    }

    return response
  }

  async requestPasswordReset(email: string): Promise<ApiResponse<void>> {
    return this.client.post<void>('/auth/password-reset', { email })
  }

  async confirmPasswordReset(token: string, newPassword: string): Promise<ApiResponse<void>> {
    return this.client.post<void>('/auth/password-reset/confirm', {
      token,
      new_password: newPassword
    })
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<ApiResponse<void>> {
    return this.client.post<void>('/auth/change-password', {
      current_password: currentPassword,
      new_password: newPassword
    })
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    return this.client.get<User>('/auth/me')
  }

  async updateProfile(data: Partial<User>): Promise<ApiResponse<User>> {
    return this.client.patch<User>('/auth/me', data)
  }

  async verifyEmail(token: string): Promise<ApiResponse<void>> {
    return this.client.post<void>('/auth/verify-email', { token })
  }

  async resendVerificationEmail(): Promise<ApiResponse<void>> {
    return this.client.post<void>('/auth/resend-verification')
  }

  async enable2FA(): Promise<ApiResponse<{ secret: string; qr_code: string }>> {
    return this.client.post<{ secret: string; qr_code: string }>('/auth/2fa/enable')
  }

  async verify2FA(token: string): Promise<ApiResponse<void>> {
    return this.client.post<void>('/auth/2fa/verify', { token })
  }

  async disable2FA(): Promise<ApiResponse<void>> {
    return this.client.post<void>('/auth/2fa/disable')
  }

  // Check if user is authenticated (validate current token)
  async isAuthenticated(): Promise<boolean> {
    if (!this.client.hasAuth()) {
      return false
    }

    try {
      const response = await this.getCurrentUser()
      return response.success
    } catch (error) {
      return false
    }
  }

  // Get authentication status and user info in one call
  async getAuthStatus(): Promise<ApiResponse<{ authenticated: boolean; user?: User }>> {
    if (!this.client.hasAuth()) {
      return {
        data: { authenticated: false },
        success: true,
        status: 200
      }
    }

    try {
      const response = await this.getCurrentUser()
      if (response.success && response.data) {
        return {
          data: { authenticated: true, user: response.data },
          success: true,
          status: response.status
        }
      }

      // If we get here, the token is invalid, clear it
      this.client.clearAuth()

      return {
        data: { authenticated: false },
        success: true,
        status: response.status
      }
    } catch (error) {
      // Clear invalid token
      this.client.clearAuth()

      return {
        data: { authenticated: false },
        success: true,
        status: 401
      }
    }
  }
}

// Create singleton instance
export const authService = new AuthService(apiClient)

// Utility function to initialize auth state
export async function initializeAuth(): Promise<{ authenticated: boolean; user?: User }> {
  try {
    const response = await authService.getAuthStatus()
    return response.data || { authenticated: false }
  } catch (error) {
    return { authenticated: false }
  }
}

// Utility function to handle authentication errors
export function handleAuthError(error: ApiResponse<any>): string {
  if (error.status === 401) {
    return 'Invalid credentials. Please check your email and password.'
  }
  if (error.status === 403) {
    return 'Access denied. You do not have permission to perform this action.'
  }
  if (error.status === 409) {
    return 'Account already exists. Please try logging in instead.'
  }
  if (error.status === 422) {
    return 'Invalid input. Please check your information and try again.'
  }
  if (error.status === 429) {
    return 'Too many requests. Please wait a moment and try again.'
  }
  if (error.status >= 500) {
    return 'Server error. Please try again later.'
  }

  return error.error || 'Authentication failed. Please try again.'
}

// Utility function to validate authentication state
export function validateAuthState(user: User | null): boolean {
  if (!user) return false

  // Check if user account is active
  if (!user.is_active) return false

  // Additional validation can be added here
  return true
}

// Legacy Supabase compatibility functions
// These functions provide backward compatibility with old Supabase imports

// Client-side signOut function (compatibility with @/lib/supabase/client)
export async function signOut(): Promise<void> {
  try {
    await authService.logout()
  } catch (error) {
    // Even if logout fails, clear local auth
    apiClient.clearAuth()
  }
}

// Client-side signUpWithEmail function (compatibility with @/lib/supabase/client)
// Supports both old signature (email, password, metadata) and new signature (RegisterRequest)
export async function signUpWithEmail(
  emailOrUserData: string | RegisterRequest,
  password?: string,
  metadata?: string
): Promise<ApiResponse<AuthResponse>> {
  // Handle old signature: signUpWithEmail(email, password, metadata)
  if (typeof emailOrUserData === 'string' && password) {
    const userData: RegisterRequest = {
      email: emailOrUserData,
      password,
      name: metadata || 'User',
      role: undefined
    }
    return authService.register(userData)
  }

  // Handle new signature: signUpWithEmail(userData)
  if (typeof emailOrUserData === 'object') {
    return authService.register(emailOrUserData)
  }

  // Fallback - this should not happen
  throw new Error('Invalid parameters for signUpWithEmail')
}

// Server-side getCurrentUser function (compatibility with @/lib/supabase/server)
export async function getSupabaseServerUser(): Promise<User | null> {
  try {
    const response = await authService.getCurrentUser()
    return response.success ? response.data || null : null
  } catch (error) {
    return null
  }
}

// Supabase client compatibility object
// This provides a minimal compatibility layer for components expecting supabase client
export const supabase = {
  auth: {
    signOut: () => signOut(),
    signUpWithEmail: (userData: RegisterRequest) => signUpWithEmail(userData),
    getCurrentUser: () => getSupabaseServerUser(),
    exchangeCodeForSession: async (code: string) => {
      // Stub for OAuth callback - this would need to be implemented based on the FastAPI backend
      console.warn('OAuth exchangeCodeForSession not implemented in FastAPI compatibility layer')
      return {
        data: {
          session: {
            user: {
              id: '',
              email: '',
              name: null
            }
          },
          user: null
        },
        error: { message: 'OAuth callback not implemented' }
      }
    },
  },
  // Add other supabase methods as needed
}