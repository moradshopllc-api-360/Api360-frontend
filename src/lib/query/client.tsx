'use client'

import { QueryClient, QueryClientProvider as BaseQueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import React, { useState } from 'react'

// Create a client
export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // With SSR, we usually want to set some default staleTime
        // above 0 to avoid refetching immediately on the client
        staleTime: 60 * 1000, // 1 minute
        retry: (failureCount, error) => {
          // Don't retry on 4xx errors (client errors)
          if (error && typeof error === 'object' && 'status' in error) {
            const status = (error as any).status
            if (status >= 400 && status < 500) return false
          }
          // Retry up to 3 times for other errors
          return failureCount < 3
        },
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff, max 30s
        refetchOnWindowFocus: false, // Disable automatic refetch on window focus
        refetchOnReconnect: true, // Refetch on reconnect
      },
      mutations: {
        retry: (failureCount, error) => {
          // Don't retry mutations on 4xx errors
          if (error && typeof error === 'object' && 'status' in error) {
            const status = (error as any).status
            if (status >= 400 && status < 500) return false
          }
          // Retry mutations up to 2 times
          return failureCount < 2
        },
      },
    },
  })
}

// Query client provider component
export function AppQueryClientProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => createQueryClient())

  return (
    <BaseQueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </BaseQueryClientProvider>
  )
}

// Export as QueryClientProvider for backward compatibility
export const QueryClientProvider = AppQueryClientProvider

// Query key factory functions for consistent key generation
export const queryKeys = {
  // Auth queries
  auth: {
    all: ['auth'] as const,
    user: () => [...queryKeys.auth.all, 'user'] as const,
    session: () => [...queryKeys.auth.all, 'session'] as const,
  },

  // User queries
  users: {
    all: ['users'] as const,
    profile: () => [...queryKeys.users.all, 'profile'] as const,
    stats: () => [...queryKeys.users.all, 'stats'] as const,
    activities: (params?: any) => [...queryKeys.users.all, 'activities', params] as const,
    preferences: () => [...queryKeys.users.all, 'preferences'] as const,
    sessions: () => [...queryKeys.users.all, 'sessions'] as const,
    list: (params?: any) => [...queryKeys.users.all, 'list', params] as const,
    detail: (id: string) => [...queryKeys.users.all, 'detail', id] as const,
  },

  // Support queries
  support: {
    all: ['support'] as const,
    tickets: (params?: any) => [...queryKeys.support.all, 'tickets', params] as const,
    ticket: (id: string) => [...queryKeys.support.all, 'ticket', id] as const,
    messages: (ticketId: string, params?: any) => [...queryKeys.support.all, 'messages', ticketId, params] as const,
    stats: () => [...queryKeys.support.all, 'stats'] as const,
    cannedResponses: () => [...queryKeys.support.all, 'canned-responses'] as const,
  },

  // System queries
  system: {
    all: ['system'] as const,
    config: () => [...queryKeys.system.all, 'config'] as const,
    health: () => [...queryKeys.system.all, 'health'] as const,
  },
}

// Invalidate related queries helper
export function invalidateRelatedQueries(queryClient: QueryClient, key: string[]) {
  queryClient.invalidateQueries({
    predicate: (query) => {
      const queryKey = query.queryKey
      return queryKey.some(k =>
        Array.isArray(k) ? k.some(sk => typeof sk === 'string' && key.includes(sk)) : typeof k === 'string' && key.includes(k)
      )
    }
  })
}

// Optimistic update helpers
export function optimisticUpdate<T>(
  queryClient: QueryClient,
  queryKey: any[],
  updateFn: (old: T | undefined) => T | undefined
) {
  queryClient.setQueryData(queryKey, updateFn)
}

export function rollbackOptimisticUpdate(
  queryClient: QueryClient,
  queryKey: any[],
  previousValue: any
) {
  queryClient.setQueryData(queryKey, previousValue)
}

// Prefetch helper
export function prefetchQuery(
  queryClient: QueryClient,
  queryKey: any[],
  queryFn: () => Promise<any>,
  options?: any
) {
  return queryClient.prefetchQuery({
    queryKey,
    queryFn,
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  })
}