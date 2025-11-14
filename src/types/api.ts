// Frontend Type Definitions for External FastAPI Backend
// These types define the contracts between the frontend and external backend

// User and Authentication Types
export interface User {
  id: string
  email: string
  name?: string
  avatar_url?: string
  role: UserRole
  is_active: boolean
  created_at: string
  updated_at: string
  last_login?: string
}

export type UserRole = 'manager' | 'crewmember' | 'driver'

export interface AuthTokens {
  access_token: string
  refresh_token: string
  token_type: 'bearer'
  expires_in: number
}

export interface AuthUser {
  user: User
  tokens: AuthTokens
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  name: string
  role?: UserRole
}

export interface AuthResponse {
  user: User
  tokens: AuthTokens
}

export interface RefreshTokenResponse {
  tokens: AuthTokens
}

// Support System Types
export interface SupportTicket {
  id: string
  user_id: string
  subject: string
  message: string
  priority: SupportPriority
  status: SupportStatus
  created_at: string
  updated_at: string
  resolved_at?: string
}

export type SupportPriority = 'low' | 'medium' | 'high' | 'urgent'
export type SupportStatus = 'open' | 'in_progress' | 'resolved' | 'closed'

export interface CreateSupportTicketRequest {
  subject: string
  message: string
  priority?: SupportPriority
}

export interface UpdateSupportTicketRequest {
  status?: SupportStatus
  message?: string
}

// User Activity Types
export interface UserActivity {
  id: string
  user_id: string
  action: string
  details?: Record<string, any>
  ip_address?: string
  user_agent?: string
  created_at: string
}

export interface UserStats {
  total_activities: number
  tickets_created: number
  tickets_resolved: number
  last_login?: string
}

// API Response Types
export interface ApiResponse<T = any> {
  data?: T
  error?: string
  message?: string
  status: number
  success: boolean
}

export interface PaginatedResponse<T = any> {
  items: T[]
  total: number
  page: number
  limit: number
  has_next: boolean
  has_prev: boolean
}

export interface ApiError {
  detail: string
  status: number
  code?: string
  field?: string
}

// WebSocket Message Types
export interface WebSocketMessage {
  type: string
  data: any
  timestamp: string
  id?: string
}

export interface WebSocketAuth {
  authorization: string
}

// Mapbox Integration Types
export interface MapboxLocation {
  latitude: number
  longitude: number
  address?: string
  city?: string
  state?: string
  country?: string
}

export interface GeocodingResponse {
  features: Array<{
    id: string
    place_name: string
    center: [number, number] // [longitude, latitude]
    geometry: {
      type: string
      coordinates: [number, number] // [longitude, latitude]
    }
    place_type: string[]
    relevance: number
  }>
  attribution: string
}

// Excel Import Types
export interface ExcelImportConfig {
  required_columns: string[]
  optional_columns?: string[]
  data_mapping: Record<string, string>
  validation_rules?: Record<string, (value: any) => boolean>
}

export interface ExcelImportResult {
  success: boolean
  rows_processed: number
  rows_imported: number
  errors: Array<{
    row: number
    field: string
    error: string
    value: any
  }>
}

// System Configuration Types
export interface SystemConfig {
  features: {
    mapbox: {
      enabled: boolean
      access_token?: string
      default_center: [number, number]
      default_zoom: number
    }
    ai_workflow: {
      enabled: boolean
      log_level: 'debug' | 'info' | 'warn' | 'error'
      checkpoints_enabled: boolean
    }
  }
  auth: {
    session_timeout: number
    refresh_threshold: number
    max_login_attempts: number
  }
}

// Role-based Access Control
export interface Permission {
  resource: string
  action: string
  conditions?: Record<string, any>
}

export type RolePermissions = {
  [role in UserRole]: Permission[]
}

export const ROLE_PERMISSIONS: RolePermissions = {
  manager: [
    { resource: 'dashboard', action: 'read' },
    { resource: 'crm', action: 'read' },
    { resource: 'finance', action: 'read' },
    { resource: 'users', action: 'read' },
    { resource: 'users', action: 'write' },
    { resource: 'support', action: 'read' },
    { resource: 'support', action: 'write' },
    { resource: 'settings', action: 'read' },
    { resource: 'settings', action: 'write' },
  ],
  crewmember: [
    { resource: 'dashboard', action: 'read' },
    { resource: 'crm', action: 'read' },
    { resource: 'support', action: 'read' },
    { resource: 'support', action: 'write' },
  ],
  driver: [
    { resource: 'dashboard', action: 'read' },
    { resource: 'support', action: 'read' },
    { resource: 'support', action: 'write' },
  ]
}

// Helper function to check user permissions
export function hasPermission(
  user: User | null,
  resource: string,
  action: string
): boolean {
  if (!user) return false

  const permissions = ROLE_PERMISSIONS[user.role]
  return permissions.some(
    permission =>
      permission.resource === resource &&
      permission.action === action
  )
}

// Navigation Types
export interface NavItem {
  title: string
  href: string
  icon?: string
  description?: string
  roles?: UserRole[]
  disabled?: boolean
  badge?: string
}

export interface NavSection {
  title: string
  items: NavItem[]
  roles?: UserRole[]
}