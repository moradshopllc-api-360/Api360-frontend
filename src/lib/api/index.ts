// API module exports
export { ApiClient, apiClient, useApiClient, createAuthenticatedRequest } from './client'
export { AuthService, authService, initializeAuth, handleAuthError, validateAuthState } from './auth'
export { UserService, userService, getUserDisplayName, getUserAvatarUrl, canUserPerformAction, getRoleBasedRedirect } from './users'
export { SupportService, supportService, getPriorityColor, getStatusColor, formatTicketAge, isTicketOverdue } from './support'
export {
  WebSocketManager,
  NotificationWebSocket,
  ActivityWebSocket,
  notificationWs,
  activityWs,
  useWebSocket,
  useRealtimeNotifications
} from './websockets'

// Re-export types for convenience
export type {
  ApiResponse,
  ApiError,
  ApiRequestOptions
} from './client'