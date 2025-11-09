// Centralized Error Handling
import React from 'react'
import { toast } from 'sonner'

export interface AppError {
  code: string
  message: string
  details?: any
  timestamp: Date
  stack?: string
}

export class ErrorHandler {
  private static instance: ErrorHandler
  private errors: AppError[] = []

  private constructor() {}

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler()
    }
    return ErrorHandler.instance
  }

  // Handle and log errors
  handleError(error: Error | AppError | string, context?: string): AppError {
    const appError = this.normalizeError(error, context)
    this.errors.push(appError)
    this.logError(appError)
    return appError
  }

  // Normalize different error types
  private normalizeError(error: Error | AppError | string, context?: string): AppError {
    if (typeof error === 'string') {
      return {
        code: 'GENERIC_ERROR',
        message: error,
        timestamp: new Date(),
        details: context
      }
    }

    if ('code' in error) {
      return error as AppError
    }

    return {
      code: 'UNKNOWN_ERROR',
      message: error.message,
      timestamp: new Date(),
      details: { stack: error.stack, context }
    }
  }

  // Log error to console and external services
  private logError(error: AppError): void {
    // Console logging for development
    if (process.env.NODE_ENV === 'development') {
      console.error('🚨 App Error:', {
        code: error.code,
        message: error.message,
        details: error.details,
        timestamp: error.timestamp
      })
    }

    // TODO: Send to external logging service in production
    // await this.sendToLoggingService(error)
  }

  // Show user-friendly error message
  showError(error: AppError, fallbackMessage = 'An unexpected error occurred'): void {
    const userMessage = this.getUserFriendlyMessage(error)
    toast.error(userMessage || fallbackMessage)
  }

  // Get user-friendly error message
  private getUserFriendlyMessage(error: AppError): string {
    const errorMessages: Record<string, string> = {
      'NETWORK_ERROR': 'Network connection failed. Please check your internet connection.',
      'AUTHENTICATION_ERROR': 'Authentication failed. Please log in again.',
      'AUTHORIZATION_ERROR': 'You don\'t have permission to perform this action.',
      'VALIDATION_ERROR': 'Please check your input and try again.',
      'NOT_FOUND': 'The requested resource was not found.',
      'SERVER_ERROR': 'Server error occurred. Please try again later.',
      'TIMEOUT_ERROR': 'Request timed out. Please try again.',
      'UNKNOWN_ERROR': 'An unexpected error occurred. Please try again.',
      'GENERIC_ERROR': error.message
    }

    return errorMessages[error.code] || error.message
  }

  // Get recent errors
  getRecentErrors(limit = 10): AppError[] {
    return this.errors.slice(-limit)
  }

  // Clear error history
  clearErrors(): void {
    this.errors = []
  }

  // Get errors by code
  getErrorsByCode(code: string): AppError[] {
    return this.errors.filter(error => error.code === code)
  }
}

// Create singleton instance
export const errorHandler = ErrorHandler.getInstance()

// Error handling utilities
export function handleError(error: Error | AppError | string, context?: string): AppError {
  return errorHandler.handleError(error, context)
}

export function showError(error: Error | AppError | string, fallbackMessage?: string): void {
  const appError = handleError(error)
  errorHandler.showError(appError, fallbackMessage)
}

// Custom error classes
export class NetworkError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'NetworkError'
  }
}

export class AuthenticationError extends Error {
  constructor(message: string = 'Authentication failed') {
    super(message)
    this.name = 'AuthenticationError'
  }
}

export class AuthorizationError extends Error {
  constructor(message: string = 'Permission denied') {
    super(message)
    this.name = 'AuthorizationError'
  }
}

export class ValidationError extends Error {
  public field?: string
  public value?: any

  constructor(message: string, field?: string, value?: any) {
    super(message)
    this.name = 'ValidationError'
    this.field = field
    this.value = value
  }
}

export class NotFoundError extends Error {
  constructor(message: string = 'Resource not found') {
    super(message)
    this.name = 'NotFoundError'
  }
}

export class ServerError extends Error {
  constructor(message: string = 'Server error') {
    super(message)
    this.name = 'ServerError'
  }
}

// Error boundary for React components
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: React.ComponentType<{ error: Error; retry: () => void }>
) {
  return function ErrorBoundaryWrapper(props: P) {
    return (
      // This would be implemented with a proper ErrorBoundary component
      // For now, just render the component
      React.createElement(Component, props)
    )
  }
}

// Hook for error handling in components
export function useErrorHandler() {
  const handleError = (error: Error | AppError | string, context?: string) => {
    const appError = errorHandler.handleError(error, context)
    errorHandler.showError(appError)
    return appError
  }

  const showSuccess = (message: string) => {
    toast.success(message)
  }

  const showInfo = (message: string) => {
    toast.info(message)
  }

  const showWarning = (message: string) => {
    toast.warning(message)
  }

  return {
    handleError,
    showError,
    showSuccess,
    showInfo,
    showWarning,
    getRecentErrors: errorHandler.getRecentErrors.bind(errorHandler),
    clearErrors: errorHandler.clearErrors.bind(errorHandler)
  }
}