/**
 * Supabase Server Compatibility Layer
 * This module provides backward compatibility with the old Supabase server imports
 */

// Re-export functions from the new API layer
export {
  getSupabaseServerUser
} from '@/lib/api/auth'

// Re-export any other needed server-side functions
export {
  authService,
  initializeAuth,
  validateAuthState
} from '@/lib/api/auth'