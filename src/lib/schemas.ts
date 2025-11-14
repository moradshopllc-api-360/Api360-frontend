import { z } from 'zod'
import type { UserRole, SupportPriority, SupportStatus } from '@/types/api'

// Authentication schemas
export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required')
})

export const registerSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  role: z.enum(['manager', 'crewmember', 'driver']).optional().default('crewmember')
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export const passwordResetRequestSchema = z.object({
  email: z.string().email('Please enter a valid email address')
})

export const passwordResetConfirmSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  newPassword: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  confirmPassword: z.string().min(1, 'Please confirm your password')
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  confirmPassword: z.string().min(1, 'Please confirm your password')
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

// User profile schemas
export const updateProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  email: z.string().email('Please enter a valid email address').optional(),
  avatar_url: z.string().url('Please enter a valid URL').optional()
})

export const userPreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']).optional(),
  language: z.string().min(2).max(5).optional(),
  notifications: z.object({
    email: z.boolean().default(true),
    push: z.boolean().default(true),
    sms: z.boolean().default(false)
  }).optional(),
  dashboard: z.object({
    default_view: z.string().optional(),
    widgets: z.array(z.string()).optional()
  }).optional()
})

// Support ticket schemas
export const createSupportTicketSchema = z.object({
  subject: z.string().min(3, 'Subject must be at least 3 characters').max(200, 'Subject must be less than 200 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters').max(5000, 'Message must be less than 5000 characters'),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium')
})

export const updateSupportTicketSchema = z.object({
  status: z.enum(['open', 'in_progress', 'resolved', 'closed']).optional(),
  message: z.string().min(1, 'Message is required').max(5000, 'Message must be less than 5000 characters').optional()
})

export const addTicketMessageSchema = z.object({
  message: z.string().min(1, 'Message is required').max(5000, 'Message must be less than 5000 characters'),
  attachments: z.array(z.instanceof(File)).optional()
})

// Admin user management schemas
export const createUserSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  role: z.enum(['manager', 'crewmember', 'driver']),
  is_active: z.boolean().default(true)
})

export const updateUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  email: z.string().email('Please enter a valid email address').optional(),
  role: z.enum(['manager', 'crewmember', 'driver']).optional(),
  is_active: z.boolean().optional()
})

// Search and filtering schemas
export const searchSchema = z.object({
  query: z.string().optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
  sort: z.string().optional(),
  order: z.enum(['asc', 'desc']).default('desc')
})

export const userSearchSchema = searchSchema.extend({
  role: z.enum(['manager', 'crewmember', 'driver']).optional(),
  is_active: z.boolean().optional()
})

export const ticketSearchSchema = searchSchema.extend({
  status: z.enum(['open', 'in_progress', 'resolved', 'closed']).optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  user_id: z.string().optional()
})

// Form field types for react-hook-form
export type LoginFormData = z.infer<typeof loginSchema>
export type RegisterFormData = z.infer<typeof registerSchema>
export type PasswordResetRequestFormData = z.infer<typeof passwordResetRequestSchema>
export type PasswordResetConfirmFormData = z.infer<typeof passwordResetConfirmSchema>
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>
export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>
export type UserPreferencesFormData = z.infer<typeof userPreferencesSchema>
export type CreateSupportTicketFormData = z.infer<typeof createSupportTicketSchema>
export type UpdateSupportTicketFormData = z.infer<typeof updateSupportTicketSchema>
export type AddTicketMessageFormData = z.infer<typeof addTicketMessageSchema>
export type CreateUserData = z.infer<typeof createUserSchema>
export type UpdateUserData = z.infer<typeof updateUserSchema>
export type SearchFormData = z.infer<typeof searchSchema>
export type UserSearchFormData = z.infer<typeof userSearchSchema>
export type TicketSearchFormData = z.infer<typeof ticketSearchSchema>

// Validation error messages
export const VALIDATION_MESSAGES = {
  email: {
    invalid: 'Please enter a valid email address',
    required: 'Email is required'
  },
  password: {
    required: 'Password is required',
    too_short: 'Password must be at least 8 characters',
    weak: 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
  },
  name: {
    required: 'Name is required',
    too_short: 'Name must be at least 2 characters'
  },
  confirmPassword: {
    required: 'Please confirm your password',
    mismatch: 'Passwords do not match'
  },
  subject: {
    required: 'Subject is required',
    too_short: 'Subject must be at least 3 characters',
    too_long: 'Subject must be less than 200 characters'
  },
  message: {
    required: 'Message is required',
    too_short: 'Message must be at least 10 characters',
    too_long: 'Message must be less than 5000 characters'
  }
}

// Helper functions for validation
export function validatePassword(password: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  if (password.length < 8) {
    errors.push(VALIDATION_MESSAGES.password.too_short)
  }

  if (!/(?=.*[a-z])/.test(password)) {
    errors.push('Password must contain at least one lowercase letter')
  }

  if (!/(?=.*[A-Z])/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
  }

  if (!/(?=.*\d)/.test(password)) {
    errors.push('Password must contain at least one number')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

export function validateEmail(email: string): { isValid: boolean; error?: string } {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!email) {
    return { isValid: false, error: VALIDATION_MESSAGES.email.required }
  }

  if (!emailRegex.test(email)) {
    return { isValid: false, error: VALIDATION_MESSAGES.email.invalid }
  }

  return { isValid: true }
}

export function validateFileSize(file: File, maxSize: number = 5 * 1024 * 1024): { isValid: boolean; error?: string } {
  if (file.size > maxSize) {
    return {
      isValid: false,
      error: `File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`
    }
  }

  return { isValid: true }
}

export function validateFileType(file: File, allowedTypes: string[]): { isValid: boolean; error?: string } {
  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: `File type ${file.type} is not allowed. Allowed types: ${allowedTypes.join(', ')}`
    }
  }

  return { isValid: true }
}