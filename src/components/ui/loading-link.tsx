"use client"

import Link from "next/link"
import { useCallback } from "react"
import { useLoading } from "@/contexts/loading-context"

interface LoadingLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string
  children: React.ReactNode
  loadingMessage?: string
  disabled?: boolean
}

export function LoadingLink({
  href,
  children,
  loadingMessage = "Loading...",
  disabled = false,
  className,
  onClick,
  ...props
}: LoadingLinkProps) {
  const { showLoading } = useLoading()

  const handleClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    if (disabled) {
      e.preventDefault()
      return
    }

    // Show loading state immediately on click
    showLoading(loadingMessage)

    // Call original onClick if provided
    onClick?.(e)
  }, [disabled, loadingMessage, showLoading, onClick])

  return (
    <Link
      href={href}
      className={className}
      onClick={handleClick}
      {...props}
    >
      {children}
    </Link>
  )
}