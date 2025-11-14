'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { authService, userService, supportService } from '@/lib/api'
import { queryKeys, optimisticUpdate, rollbackOptimisticUpdate } from './client'
import type { User, SupportTicket } from '@/types/api'

// Auth hooks
export function useAuthUser() {
  return useQuery({
    queryKey: queryKeys.auth.user(),
    queryFn: () => authService.getCurrentUser(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1, // Only retry once for auth failures
  })
}

export function useLogin() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authService.login({ email, password }),
    onSuccess: (data) => {
      if (data.success && data.data) {
        // Set user data in cache
        queryClient.setQueryData(queryKeys.auth.user(), {
          success: true,
          data: data.data.user,
          status: 200
        })

        // Invalidate user-related queries
        queryClient.invalidateQueries({ queryKey: queryKeys.users.profile() })
        queryClient.invalidateQueries({ queryKey: queryKeys.users.stats() })
      }
    },
  })
}

export function useRegister() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      email,
      password,
      name,
      role = 'crewmember'
    }: {
      email: string
      password: string
      name: string
      role?: string
    }) => authService.register({ email, password, name, role: role as any }),
    onSuccess: (data) => {
      if (data.success && data.data) {
        // Set user data in cache
        queryClient.setQueryData(queryKeys.auth.user(), {
          success: true,
          data: data.data.user,
          status: 200
        })
      }
    },
  })
}

export function useLogout() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      // Clear all query data
      queryClient.clear()
    },
  })
}

export function useRefreshUser() {
  return useMutation({
    mutationFn: () => authService.getCurrentUser(),
    onSuccess: (data, variables, context) => {
      if (data.success && data.data) {
        // This will update the cache automatically
      }
    },
  })
}

// User hooks
export function useUserProfile() {
  return useQuery({
    queryKey: queryKeys.users.profile(),
    queryFn: () => userService.getProfile(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useUserStats() {
  return useQuery({
    queryKey: queryKeys.users.stats(),
    queryFn: () => userService.getStats(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

export function useUserActivities(params?: any) {
  return useQuery({
    queryKey: queryKeys.users.activities(params),
    queryFn: () => userService.getActivities(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

export function useUserPreferences() {
  return useQuery({
    queryKey: queryKeys.users.preferences(),
    queryFn: () => userService.getPreferences(),
    staleTime: 30 * 60 * 1000, // 30 minutes
  })
}

export function useUpdateProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Partial<User>) => userService.updateProfile(data),
    onMutate: async (newData) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.users.profile() })

      // Snapshot the previous value
      const previousUser = queryClient.getQueryData(queryKeys.users.profile())

      // Optimistically update to the new value
      optimisticUpdate(queryClient, [...queryKeys.users.profile()], (old: any) => {
        if (old?.success && old.data) {
          return {
            ...old,
            data: { ...old.data, ...newData }
          }
        }
        return old
      })

      // Return a context object with the snapshotted value
      return { previousUser }
    },
    onError: (err, newData, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousUser) {
        rollbackOptimisticUpdate(queryClient, [...queryKeys.users.profile()], context.previousUser)
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: queryKeys.users.profile() })
    },
  })
}

export function useUpdatePreferences() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (preferences: Record<string, any>) =>
      userService.updatePreferences(preferences),
    onMutate: async (newPreferences) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.users.preferences() })

      const previousPreferences = queryClient.getQueryData(queryKeys.users.preferences())

      optimisticUpdate(queryClient, [...queryKeys.users.preferences()], (old: any) => {
        if (old?.success && old.data) {
          return {
            ...old,
            data: { ...old.data, ...newPreferences }
          }
        }
        return old
      })

      return { previousPreferences }
    },
    onError: (err, newData, context) => {
      if (context?.previousPreferences) {
        rollbackOptimisticUpdate(queryClient, [...queryKeys.users.preferences()], context.previousPreferences)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.preferences() })
    },
  })
}

export function useUploadAvatar() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (file: File) => userService.uploadAvatar(file),
    onSuccess: (data) => {
      if (data.success && data.data) {
        // Update the user profile with new avatar
        queryClient.setQueryData(queryKeys.users.profile(), (old: any) => {
          if (old?.success && old.data) {
            return {
              ...old,
              data: { ...old.data, avatar_url: data.data?.avatar_url }
            }
          }
          return old
        })
      }
    },
  })
}

// Support hooks
export function useSupportTickets(params?: any) {
  return useQuery({
    queryKey: queryKeys.support.tickets(params),
    queryFn: () => supportService.getTickets(params),
    staleTime: 60 * 1000, // 1 minute
  })
}

export function useSupportTicket(ticketId: string) {
  return useQuery({
    queryKey: queryKeys.support.ticket(ticketId),
    queryFn: () => supportService.getTicket(ticketId),
    staleTime: 30 * 1000, // 30 seconds
    enabled: !!ticketId,
  })
}

export function useSupportMessages(ticketId: string, params?: any) {
  return useQuery({
    queryKey: queryKeys.support.messages(ticketId, params),
    queryFn: () => supportService.getMessages(ticketId, params),
    staleTime: 30 * 1000, // 30 seconds
    enabled: !!ticketId,
  })
}

export function useSupportStats() {
  return useQuery({
    queryKey: queryKeys.support.stats(),
    queryFn: () => supportService.getTicketStats(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useCreateTicket() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: { subject: string; message: string; priority?: string }) =>
      supportService.createTicket(data as any),
    onSuccess: () => {
      // Invalidate tickets list
      queryClient.invalidateQueries({ queryKey: queryKeys.support.tickets() })
      queryClient.invalidateQueries({ queryKey: queryKeys.support.stats() })
    },
  })
}

export function useUpdateTicket() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ ticketId, data }: { ticketId: string; data: any }) =>
      supportService.updateTicket(ticketId, data),
    onMutate: async ({ ticketId, data }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.support.ticket(ticketId) })

      const previousTicket = queryClient.getQueryData(queryKeys.support.ticket(ticketId))

      optimisticUpdate(queryClient, [...queryKeys.support.ticket(ticketId)], (old: any) => {
        if (old?.success && old.data) {
          return {
            ...old,
            data: { ...old.data, ...data }
          }
        }
        return old
      })

      return { previousTicket }
    },
    onError: (err, variables, context) => {
      if (context?.previousTicket) {
        rollbackOptimisticUpdate(
          queryClient,
          [...queryKeys.support.ticket(variables.ticketId)],
          context.previousTicket
        )
      }
    },
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.support.ticket(variables.ticketId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.support.tickets() })
    },
  })
}

export function useAddMessage() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ ticketId, message, attachments }: {
      ticketId: string
      message: string
      attachments?: File[]
    }) => supportService.addMessage(ticketId, message, attachments),
    onSuccess: (data, variables) => {
      // Invalidate messages list
      queryClient.invalidateQueries({
        queryKey: queryKeys.support.messages(variables.ticketId)
      })
      // Invalidate ticket to update updated_at
      queryClient.invalidateQueries({
        queryKey: queryKeys.support.ticket(variables.ticketId)
      })
    },
  })
}

export function useCloseTicket() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ ticketId, reason }: { ticketId: string; reason?: string }) =>
      supportService.closeTicket(ticketId, reason),
    onMutate: async ({ ticketId }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.support.ticket(ticketId) })

      const previousTicket = queryClient.getQueryData(queryKeys.support.ticket(ticketId))

      optimisticUpdate(queryClient, [...queryKeys.support.ticket(ticketId)], (old: any) => {
        if (old?.success && old.data) {
          return {
            ...old,
            data: { ...old.data, status: 'closed' }
          }
        }
        return old
      })

      return { previousTicket }
    },
    onError: (err, variables, context) => {
      if (context?.previousTicket) {
        rollbackOptimisticUpdate(
          queryClient,
          [...queryKeys.support.ticket(variables.ticketId)],
          context.previousTicket
        )
      }
    },
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.support.ticket(variables.ticketId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.support.tickets() })
      queryClient.invalidateQueries({ queryKey: queryKeys.support.stats() })
    },
  })
}

// Admin hooks (for admin operations)
export function useAllUsers(params?: any) {
  return useQuery({
    queryKey: queryKeys.users.list(params),
    queryFn: () => userService.getUsers(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

export function useAllSupportTickets(params?: any) {
  return useQuery({
    queryKey: queryKeys.support.tickets(params),
    queryFn: () => supportService.getAllTickets(params),
    staleTime: 60 * 1000, // 1 minute
  })
}