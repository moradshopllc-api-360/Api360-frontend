"use client"

import { useLoading } from "@/contexts/loading-context"
import { cn } from "@/lib/utils"

interface GlobalSpinnerProps {
  className?: string
}

export function GlobalSpinner({ className }: GlobalSpinnerProps) {
  const { isLoading, loadingMessage } = useLoading()

  if (!isLoading) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className={cn("text-center", className)}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">{loadingMessage}</p>
      </div>
    </div>
  )
}

// Compact spinner version for inline use
interface InlineSpinnerProps {
  size?: "sm" | "md" | "lg"
  message?: string
  className?: string
}

export function InlineSpinner({
  size = "md",
  message,
  className
}: InlineSpinnerProps) {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-12 w-12"
  }

  const messageSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base"
  }

  return (
    <div className={cn("flex items-center justify-center gap-2", className)}>
      <div className={cn("animate-spin rounded-full border-b-2 border-primary", sizeClasses[size])}></div>
      {message && (
        <p className={cn("text-muted-foreground", messageSizeClasses[size])}>{message}</p>
      )}
    </div>
  )
}

// Full page spinner for route transitions
interface PageSpinnerProps {
  message?: string
}

export function PageSpinner({ message = "Loading..." }: PageSpinnerProps) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">{message}</p>
      </div>
    </div>
  )
}