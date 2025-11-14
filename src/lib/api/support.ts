'use client'

import { apiClient } from './client'
import type {
  ApiResponse,
  PaginatedResponse,
  SupportTicket,
  SupportPriority,
  SupportStatus,
  CreateSupportTicketRequest,
  UpdateSupportTicketRequest
} from '@/types/api'

export class SupportService {
  constructor(private client: typeof apiClient) {}

  // Create a new support ticket
  async createTicket(ticketData: CreateSupportTicketRequest): Promise<ApiResponse<SupportTicket>> {
    return this.client.post<SupportTicket>('/support/tickets', ticketData)
  }

  // Get support tickets for current user
  async getTickets(params?: {
    page?: number
    limit?: number
    status?: SupportStatus
    priority?: SupportPriority
    search?: string
    sort?: 'created_at' | 'updated_at' | 'priority'
    order?: 'asc' | 'desc'
  }): Promise<ApiResponse<PaginatedResponse<SupportTicket>>> {
    return this.client.get<PaginatedResponse<SupportTicket>>('/support/tickets', params)
  }

  // Get specific ticket
  async getTicket(ticketId: string): Promise<ApiResponse<SupportTicket>> {
    return this.client.get<SupportTicket>(`/support/tickets/${ticketId}`)
  }

  // Update ticket
  async updateTicket(ticketId: string, data: UpdateSupportTicketRequest): Promise<ApiResponse<SupportTicket>> {
    return this.client.patch<SupportTicket>(`/support/tickets/${ticketId}`, data)
  }

  // Add message to ticket
  async addMessage(ticketId: string, message: string, attachments?: File[]): Promise<ApiResponse<SupportTicket>> {
    if (attachments && attachments.length > 0) {
      // If there are attachments, use FormData
      const formData = new FormData()
      formData.append('message', message)
      attachments.forEach(file => formData.append('attachments', file))

      return this.client.request<SupportTicket>(`/support/tickets/${ticketId}/messages`, {
        method: 'POST',
        body: formData,
        headers: {
          // Don't set Content-Type for FormData
          ...this.client.getAuthHeaders?.() || {}
        }
      })
    }

    return this.client.post<SupportTicket>(`/support/tickets/${ticketId}/messages`, { message })
  }

  // Get ticket messages
  async getMessages(ticketId: string, params?: {
    page?: number
    limit?: number
  }): Promise<ApiResponse<PaginatedResponse<{
    id: string
    ticket_id: string
    message: string
    is_from_user: boolean
    created_at: string
    attachments?: Array<{
      id: string
      name: string
      url: string
      size: number
    }>
  }>>> {
    return this.client.get<PaginatedResponse<any>>(`/support/tickets/${ticketId}/messages`, params)
  }

  // Close ticket
  async closeTicket(ticketId: string, reason?: string): Promise<ApiResponse<SupportTicket>> {
    return this.client.patch<SupportTicket>(`/support/tickets/${ticketId}`, {
      status: 'closed',
      resolution_note: reason
    })
  }

  // Reopen ticket
  async reopenTicket(ticketId: string, reason: string): Promise<ApiResponse<SupportTicket>> {
    return this.client.patch<SupportTicket>(`/support/tickets/${ticketId}`, {
      status: 'open',
      note: reason
    })
  }

  // Get ticket statistics
  async getTicketStats(): Promise<ApiResponse<{
    total: number
    open: number
    in_progress: number
    resolved: number
    closed: number
    avg_response_time: number
    avg_resolution_time: number
  }>> {
    return this.client.get<any>('/support/tickets/stats')
  }

  // Admin-only operations

  // Get all tickets (admin view)
  async getAllTickets(params?: {
    page?: number
    limit?: number
    status?: SupportStatus
    priority?: SupportPriority
    user_id?: string
    search?: string
    sort?: 'created_at' | 'updated_at' | 'priority'
    order?: 'asc' | 'desc'
  }): Promise<ApiResponse<PaginatedResponse<SupportTicket>>> {
    return this.client.get<PaginatedResponse<SupportTicket>>('/admin/support/tickets', params)
  }

  // Assign ticket to user
  async assignTicket(ticketId: string, userId: string): Promise<ApiResponse<SupportTicket>> {
    return this.client.patch<SupportTicket>(`/admin/support/tickets/${ticketId}`, {
      assigned_to: userId
    })
  }

  // Unassign ticket
  async unassignTicket(ticketId: string): Promise<ApiResponse<SupportTicket>> {
    return this.client.patch<SupportTicket>(`/admin/support/tickets/${ticketId}`, {
      assigned_to: null
    })
  }

  // Update ticket priority
  async updateTicketPriority(ticketId: string, priority: SupportPriority): Promise<ApiResponse<SupportTicket>> {
    return this.client.patch<SupportTicket>(`/admin/support/tickets/${ticketId}`, {
      priority
    })
  }

  // Bulk update tickets
  async bulkUpdateTickets(ticketIds: string[], updates: {
    status?: SupportStatus
    priority?: SupportPriority
    assigned_to?: string | null
  }): Promise<ApiResponse<{ updated: number; failed: string[] }>> {
    return this.client.patch<{ updated: number; failed: string[] }>('/admin/support/tickets/bulk', {
      ticket_ids: ticketIds,
      updates
    })
  }

  // Export tickets
  async exportTickets(params?: {
    status?: SupportStatus
    priority?: SupportPriority
    start_date?: string
    end_date?: string
    format?: 'csv' | 'xlsx'
  }): Promise<ApiResponse<{ download_url: string }>> {
    return this.client.get<{ download_url: string }>('/admin/support/tickets/export', params)
  }

  // Get canned responses
  async getCannedResponses(): Promise<ApiResponse<Array<{
    id: string
    title: string
    content: string
    tags: string[]
    usage_count: number
  }>>> {
    return this.client.get<Array<any>>('/support/canned-responses')
  }

  // Create canned response
  async createCannedResponse(data: {
    title: string
    content: string
    tags?: string[]
  }): Promise<ApiResponse<any>> {
    return this.client.post<any>('/admin/support/canned-responses', data)
  }

  // Update canned response
  async updateCannedResponse(id: string, data: {
    title?: string
    content?: string
    tags?: string[]
  }): Promise<ApiResponse<any>> {
    return this.client.patch<any>(`/admin/support/canned-responses/${id}`, data)
  }

  // Delete canned response
  async deleteCannedResponse(id: string): Promise<ApiResponse<void>> {
    return this.client.delete<void>(`/admin/support/canned-responses/${id}`)
  }
}

// Create singleton instance
export const supportService = new SupportService(apiClient)

// Utility function to get priority color
export function getPriorityColor(priority: SupportPriority): string {
  switch (priority) {
    case 'urgent':
      return 'text-red-600 bg-red-50'
    case 'high':
      return 'text-orange-600 bg-orange-50'
    case 'medium':
      return 'text-yellow-600 bg-yellow-50'
    case 'low':
      return 'text-green-600 bg-green-50'
    default:
      return 'text-gray-600 bg-gray-50'
  }
}

// Utility function to get status color
export function getStatusColor(status: SupportStatus): string {
  switch (status) {
    case 'open':
      return 'text-blue-600 bg-blue-50'
    case 'in_progress':
      return 'text-purple-600 bg-purple-50'
    case 'resolved':
      return 'text-green-600 bg-green-50'
    case 'closed':
      return 'text-gray-600 bg-gray-50'
    default:
      return 'text-gray-600 bg-gray-50'
  }
}

// Utility function to format ticket age
export function formatTicketAge(createdAt: string): string {
  const created = new Date(createdAt)
  const now = new Date()
  const diffMs = now.getTime() - created.getTime()
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffHours < 1) {
    return 'Just now'
  } else if (diffHours < 24) {
    return `${diffHours}h ago`
  } else if (diffDays < 7) {
    return `${diffDays}d ago`
  } else {
    return created.toLocaleDateString()
  }
}

// Utility function to check if ticket is overdue
export function isTicketOverdue(ticket: SupportTicket): boolean {
  if (ticket.status === 'closed' || ticket.status === 'resolved') return false

  const created = new Date(ticket.created_at)
  const now = new Date()
  const diffMs = now.getTime() - created.getTime()
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))

  // Define SLA based on priority
  const slaHours = {
    urgent: 2,
    high: 8,
    medium: 24,
    low: 72
  }

  return diffHours > (slaHours[ticket.priority] || 24)
}