'use client'

import { apiClient } from './client'
import type {
  ApiResponse,
  PaginatedResponse,
  User,
  UserStats,
  UserActivity,
  UserRole
} from '@/types/api'

export class UserService {
  constructor(private client: typeof apiClient) {}

  // Get current user profile
  async getProfile(): Promise<ApiResponse<User>> {
    return this.client.get<User>('/users/me')
  }

  // Update current user profile
  async updateProfile(data: Partial<User>): Promise<ApiResponse<User>> {
    return this.client.patch<User>('/users/me', data)
  }

  // Upload user avatar
  async uploadAvatar(file: File): Promise<ApiResponse<{ avatar_url: string }>> {
    return this.client.upload<{ avatar_url: string }>('/users/me/avatar', file)
  }

  // Get user statistics
  async getStats(): Promise<ApiResponse<UserStats>> {
    return this.client.get<UserStats>('/users/me/stats')
  }

  // Get user activities
  async getActivities(params?: {
    limit?: number
    offset?: number
    action?: string
    start_date?: string
    end_date?: string
  }): Promise<ApiResponse<PaginatedResponse<UserActivity>>> {
    return this.client.get<PaginatedResponse<UserActivity>>('/users/me/activities', params)
  }

  // Get user preferences
  async getPreferences(): Promise<ApiResponse<Record<string, any>>> {
    return this.client.get<Record<string, any>>('/users/me/preferences')
  }

  // Update user preferences
  async updatePreferences(preferences: Record<string, any>): Promise<ApiResponse<Record<string, any>>> {
    return this.client.patch<Record<string, any>>('/users/me/preferences', { preferences })
  }

  // Admin-only operations (will require additional permissions)

  // Get all users (admin only)
  async getUsers(params?: {
    limit?: number
    offset?: number
    role?: UserRole
    is_active?: boolean
    search?: string
  }): Promise<ApiResponse<PaginatedResponse<User>>> {
    return this.client.get<PaginatedResponse<User>>('/admin/users', params)
  }

  // Get specific user (admin only)
  async getUser(userId: string): Promise<ApiResponse<User>> {
    return this.client.get<User>(`/admin/users/${userId}`)
  }

  // Update user (admin only)
  async updateUser(userId: string, data: Partial<User>): Promise<ApiResponse<User>> {
    return this.client.patch<User>(`/admin/users/${userId}`, data)
  }

  // Deactivate user (admin only)
  async deactivateUser(userId: string): Promise<ApiResponse<void>> {
    return this.client.patch<void>(`/admin/users/${userId}`, { is_active: false })
  }

  // Activate user (admin only)
  async activateUser(userId: string): Promise<ApiResponse<void>> {
    return this.client.patch<void>(`/admin/users/${userId}`, { is_active: true })
  }

  // Change user role (admin only)
  async changeUserRole(userId: string, role: UserRole): Promise<ApiResponse<User>> {
    return this.client.patch<User>(`/admin/users/${userId}`, { role })
  }

  // Delete user (admin only)
  async deleteUser(userId: string): Promise<ApiResponse<void>> {
    return this.client.delete<void>(`/admin/users/${userId}`)
  }

  // Get user activities for specific user (admin only)
  async getUserActivities(
    userId: string,
    params?: {
      limit?: number
      offset?: number
      action?: string
      start_date?: string
      end_date?: string
    }
  ): Promise<ApiResponse<PaginatedResponse<UserActivity>>> {
    return this.client.get<PaginatedResponse<UserActivity>>(`/admin/users/${userId}/activities`, params)
  }

  // Export user data (GDPR compliance)
  async exportUserData(): Promise<ApiResponse<{ download_url: string }>> {
    return this.client.post<{ download_url: string }>('/users/me/export')
  }

  // Delete user account (self-service)
  async deleteAccount(password: string): Promise<ApiResponse<void>> {
    return this.client.post<void>('/users/me/delete-account', { password })
  }

  // Get user sessions
  async getSessions(): Promise<ApiResponse<Array<{
    id: string
    created_at: string
    last_active: string
    ip_address: string
    user_agent: string
    is_current: boolean
  }>>> {
    return this.client.get<Array<any>>('/users/me/sessions')
  }

  // Revoke session
  async revokeSession(sessionId: string): Promise<ApiResponse<void>> {
    return this.client.delete<void>(`/users/me/sessions/${sessionId}`)
  }

  // Revoke all sessions (except current)
  async revokeAllSessions(): Promise<ApiResponse<void>> {
    return this.client.post<void>('/users/me/sessions/revoke-all')
  }
}

// Create singleton instance
export const userService = new UserService(apiClient)

// Utility function to get user display name
export function getUserDisplayName(user: User): string {
  return user.name || user.email || 'Unknown User'
}

// Utility function to get user avatar URL with fallback
export function getUserAvatarUrl(user: User, size: number = 40): string {
  if (user.avatar_url) {
    return user.avatar_url
  }

  // Generate a consistent avatar based on user email/name
  const seed = user.email || user.id
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(getUserDisplayName(user))}&size=${size}&background=random`
}

// Utility function to check if user can perform action
export function canUserPerformAction(user: User | null, action: string): boolean {
  if (!user || !user.is_active) return false

  // Define user role permissions
  const rolePermissions = {
    manager: [
      'read:all',
      'write:users',
      'write:settings',
      'write:finance',
      'write:crm'
    ],
    crewmember: [
      'read:dashboard',
      'read:crm',
      'write:support',
      'read:support'
    ],
    driver: [
      'read:dashboard',
      'read:support',
      'write:support'
    ]
  }

  const userPermissions = rolePermissions[user.role] || []
  return userPermissions.includes(action) || action.startsWith('read:')
}

// Utility function to get role-based redirect
export function getRoleBasedRedirect(user: User): string {
  switch (user.role) {
    case 'manager':
      return '/dashboard'
    case 'crewmember':
      return '/dashboard'
    case 'driver':
      return '/dashboard' // For now, driver also goes to dashboard
    default:
      return '/dashboard'
  }
}