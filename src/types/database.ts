// Supabase Database Type Definitions
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          user_id: string
          name: string
          email: string
          avatar_url: string | null
          role: 'user' | 'admin' | 'manager'
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          name: string
          email: string
          avatar_url?: string | null
          role?: 'user' | 'admin' | 'manager'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          email?: string
          avatar_url?: string | null
          role?: 'user' | 'admin' | 'manager'
          updated_at?: string
        }
      }
      support_tickets: {
        Row: {
          id: string
          user_id: string
          subject: string
          message: string
          priority: 'low' | 'medium' | 'high' | 'urgent'
          status: 'open' | 'in_progress' | 'resolved' | 'closed'
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          subject: string
          message: string
          priority?: 'low' | 'medium' | 'high' | 'urgent'
          status?: 'open' | 'in_progress' | 'resolved' | 'closed'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          subject?: string
          message?: string
          priority?: 'low' | 'medium' | 'high' | 'urgent'
          status?: 'open' | 'in_progress' | 'resolved' | 'closed'
          updated_at?: string
        }
      }
      user_activities: {
        Row: {
          id: string
          user_id: string
          action: string
          details: Record<string, any> | null
          ip_address: string | null
          user_agent: string | null
          created_at: string
        }
        Insert: {
          user_id: string
          action: string
          details?: Record<string, any> | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          action?: string
          details?: Record<string, any> | null
          ip_address?: string | null
          user_agent?: string | null
        }
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

// Extended types for application use
export interface User {
  id: string
  email: string
  name?: string
  avatar_url?: string
  role?: 'user' | 'admin' | 'manager'
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

export interface Profile {
  id: string
  user_id: string
  name: string
  email: string
  avatar_url: string | null
  role: 'user' | 'admin' | 'manager'
  created_at: string
  updated_at: string
  // Additional profile fields can be added here
}

export interface SupportTicket {
  id: string
  user_id: string
  subject: string
  message: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'open' | 'in_progress' | 'resolved' | 'closed'
  created_at: string
  updated_at: string
  // Additional ticket fields can be added here
}

export interface UserActivity {
  id: string
  user_id: string
  action: string
  details: Record<string, any> | null
  ip_address: string | null
  user_agent: string | null
  created_at: string
  // Additional activity fields can be added here
}