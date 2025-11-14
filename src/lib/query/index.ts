// Query module exports
export {
  QueryClientProvider,
  createQueryClient,
  queryKeys,
  invalidateRelatedQueries,
  optimisticUpdate,
  rollbackOptimisticUpdate,
  prefetchQuery
} from './client'

export {
  // Auth hooks
  useAuthUser,
  useLogin,
  useRegister,
  useLogout,
  useRefreshUser,
  // User hooks
  useUserProfile,
  useUserStats,
  useUserActivities,
  useUserPreferences,
  useUpdateProfile,
  useUpdatePreferences,
  useUploadAvatar,
  // Support hooks
  useSupportTickets,
  useSupportTicket,
  useSupportMessages,
  useSupportStats,
  useCreateTicket,
  useUpdateTicket,
  useAddMessage,
  useCloseTicket,
  // Admin hooks
  useAllUsers,
  useAllSupportTickets
} from './hooks'