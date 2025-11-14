/**
 * Supabase Module Compatibility Layer
 * This module provides backward compatibility for the entire Supabase module
 */

// Client-side exports
export {
  signOut,
  signUpWithEmail,
  supabase
} from './client'

// Server-side exports
export {
  getSupabaseServerUser
} from './server'

// Re-export API layer functions for convenience
export {
  authService,
  AuthService,
  initializeAuth,
  handleAuthError,
  validateAuthState
} from '@/lib/api/auth'