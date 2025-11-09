// Form Validation Utilities
import { z } from 'zod'

// Common validation schemas
export const commonSchemas = {
  // Email validation
  email: z.string().email('Invalid email address').min(1, 'Email is required'),

  // Password validation
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),

  // Name validation
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces'),

  // Username validation
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be less than 20 characters')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores and hyphens'),

  // Phone validation
  phone: z.string()
    .regex(/^\+?[\d\s-()]+$/, 'Invalid phone number format')
    .min(10, 'Phone number must be at least 10 digits'),

  // URL validation
  url: z.string().url('Invalid URL format'),

  // UUID validation
  uuid: z.string().uuid('Invalid UUID format'),

  // Date validation
  date: z.string().refine((date) => !isNaN(Date.parse(date)), 'Invalid date format'),

  // Number validation
  positiveNumber: z.number().positive('Number must be positive'),
  nonNegativeNumber: z.number().nonnegative('Number must be non-negative'),

  // Text validation
  shortText: z.string().max(100, 'Text must be less than 100 characters'),
  mediumText: z.string().max(500, 'Text must be less than 500 characters'),
  longText: z.string().max(2000, 'Text must be less than 2000 characters')
}

// Auth-specific validation schemas
export const authSchemas = {
  // Login form
  login: z.object({
    email: commonSchemas.email,
    password: z.string().min(1, 'Password is required'),
    remember: z.boolean().optional()
  }),

  // Register form
  register: z.object({
    email: commonSchemas.email,
    password: commonSchemas.password,
    confirmPassword: z.string(),
    name: commonSchemas.name,
    acceptTerms: z.boolean().refine(val => val === true, 'You must accept the terms and conditions')
  }).refine(data => data.password === data.confirmPassword, {
    message: 'Passwords don\'t match',
    path: ['confirmPassword']
  }),

  // Password reset request
  passwordResetRequest: z.object({
    email: commonSchemas.email
  }),

  // Password reset confirmation
  passwordResetConfirm: z.object({
    token: commonSchemas.uuid,
    newPassword: commonSchemas.password,
    confirmPassword: z.string()
  }).refine(data => data.newPassword === data.confirmPassword, {
    message: 'Passwords don\'t match',
    path: ['confirmPassword']
  }),

  // Change password
  changePassword: z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: commonSchemas.password,
    confirmPassword: z.string()
  }).refine(data => data.newPassword === data.confirmPassword, {
    message: 'Passwords don\'t match',
    path: ['confirmPassword']
  }),

  // Update profile
  updateProfile: z.object({
    name: commonSchemas.name.optional(),
    email: commonSchemas.email.optional(),
    avatar_url: commonSchemas.url.optional().or(z.literal(''))
  })
}

// Support ticket validation schemas
export const supportSchemas = {
  createTicket: z.object({
    subject: z.string().min(3, 'Subject must be at least 3 characters').max(100, 'Subject must be less than 100 characters'),
    message: z.string().min(10, 'Message must be at least 10 characters').max(2000, 'Message must be less than 2000 characters'),
    priority: z.enum(['low', 'medium', 'high', 'urgent'], {
      errorMap: () => ({ message: 'Priority must be one of: low, medium, high, urgent' })
    })
  }),

  updateTicket: z.object({
    status: z.enum(['open', 'in_progress', 'resolved', 'closed']).optional(),
    message: z.string().min(1, 'Message cannot be empty').max(2000, 'Message must be less than 2000 characters').optional()
  })
}

// Validation utility functions
export class ValidationUtils {
  // Validate email format
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // Validate password strength
  static getPasswordStrength(password: string): {
    score: number
    feedback: string[]
    isStrong: boolean
  } {
    const feedback: string[] = []
    let score = 0

    if (password.length >= 8) score++
    else feedback.push('Password should be at least 8 characters long')

    if (/[A-Z]/.test(password)) score++
    else feedback.push('Password should contain uppercase letters')

    if (/[a-z]/.test(password)) score++
    else feedback.push('Password should contain lowercase letters')

    if (/[0-9]/.test(password)) score++
    else feedback.push('Password should contain numbers')

    if (/[^A-Za-z0-9]/.test(password)) score++
    else feedback.push('Password should contain special characters')

    return {
      score,
      feedback,
      isStrong: score >= 4
    }
  }

  // Sanitize user input
  static sanitizeInput(input: string): string {
    return input
      .trim()
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .replace(/javascript:/gi, '') // Remove potential JavaScript
      .replace(/on\w+=/gi, '') // Remove potential event handlers
  }

  // Validate file upload
  static validateFile(file: File, options: {
    maxSize?: number // in bytes
    allowedTypes?: string[]
    maxFileNameLength?: number
  }): { isValid: boolean; error?: string } {
    const { maxSize = 5 * 1024 * 1024, allowedTypes = [], maxFileNameLength = 255 } = options

    // Check file size
    if (file.size > maxSize) {
      return {
        isValid: false,
        error: `File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`
      }
    }

    // Check file type
    if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        error: `File type ${file.type} is not allowed`
      }
    }

    // Check file name length
    if (file.name.length > maxFileNameLength) {
      return {
        isValid: false,
        error: `File name must be less than ${maxFileNameLength} characters`
      }
    }

    return { isValid: true }
  }

  // Check if password is commonly used (basic implementation)
  static isCommonPassword(password: string): boolean {
    const commonPasswords = [
      'password', '123456', '123456789', 'qwerty', 'abc123',
      'password123', 'admin', 'letmein', 'welcome', 'monkey'
    ]
    return commonPasswords.includes(password.toLowerCase())
  }

  // Generate password suggestions
  static generatePasswordSuggestions(length = 12): string[] {
    const suggestions: string[] = []
    const chars = {
      uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      lowercase: 'abcdefghijklmnopqrstuvwxyz',
      numbers: '0123456789',
      symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
    }

    for (let i = 0; i < 3; i++) {
      let password = ''
      const allChars = Object.values(chars).join('')

      for (let j = 0; j < length; j++) {
        password += allChars.charAt(Math.floor(Math.random() * allChars.length))
      }

      // Ensure password has at least one of each type
      if (!/[A-Z]/.test(password)) {
        password = password.slice(0, -1) + chars.uppercase.charAt(Math.floor(Math.random() * chars.uppercase.length))
      }
      if (!/[a-z]/.test(password)) {
        password = password.slice(0, -1) + chars.lowercase.charAt(Math.floor(Math.random() * chars.lowercase.length))
      }
      if (!/[0-9]/.test(password)) {
        password = password.slice(0, -1) + chars.numbers.charAt(Math.floor(Math.random() * chars.numbers.length))
      }
      if (!/[^A-Za-z0-9]/.test(password)) {
        password = password.slice(0, -1) + chars.symbols.charAt(Math.floor(Math.random() * chars.symbols.length))
      }

      suggestions.push(password)
    }

    return suggestions
  }
}

// Note: useFormValidation hook should be implemented in a separate file with React imports
// This is a placeholder for the hook structure