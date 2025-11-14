// Legacy Database Types - Now Backend Agnostic
// These types are maintained for compatibility during migration

import type { User, UserRole, SupportTicket, SupportPriority, SupportStatus, UserActivity } from './api'

// Re-export main types from API for consistency
export {
  User,
  UserRole,
  SupportTicket,
  SupportPriority,
  SupportStatus,
  UserActivity
}

// Legacy compatibility types
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: User
        Insert: Partial<User>
        Update: Partial<User>
      }
      support_tickets: {
        Row: SupportTicket
        Insert: Omit<SupportTicket, 'id' | 'user_id' | 'created_at' | 'updated_at'>
        Update: Partial<SupportTicket>
      }
      user_activities: {
        Row: UserActivity
        Insert: Omit<UserActivity, 'id' | 'created_at'>
        Update: Partial<UserActivity>
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Extended types for application use (maintained for compatibility)
export interface Profile {
  id: string
  user_id: string
  name: string
  email: string
  avatar_url: string | null
  role: UserRole
  created_at: string
  updated_at: string
}

export interface AuthUser {
  id: string
  email: string
  name?: string
  user_metadata?: Record<string, any>
  app_metadata?: Record<string, any>
}

export interface Session {
  user: AuthUser
  access_token: string
  refresh_token: string
  expires_at: number
}