/**
 * Supabase Client Compatibility Layer
 * This module provides backward compatibility with the old Supabase client imports
 */

// Re-export functions from the new API layer
export {
  signOut,
  signUpWithEmail,
  supabase
} from '@/lib/api/auth'

// Re-export any other needed functions
export {
  authService,
  AuthService,
  handleAuthError,
  validateAuthState
} from '@/lib/api/auth'