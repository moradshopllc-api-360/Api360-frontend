"use client"

import { ReactNode, useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import { AppSidebar } from "@/app/(main)/dashboard/_components/sidebar/app-sidebar"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
import { useNavigationLoading } from "@/hooks/use-navigation-loading"
import { useAuth } from "@/contexts/auth-context"
import {
  SIDEBAR_VARIANT_VALUES,
  SIDEBAR_COLLAPSIBLE_VALUES,
  CONTENT_LAYOUT_VALUES,
  NAVBAR_STYLE_VALUES,
  type SidebarVariant,
  type SidebarCollapsible,
  type ContentLayout,
  type NavbarStyle,
} from "@/types/preferences/layout"

import { AccountSwitcher } from "./_components/sidebar/account-switcher"
import { SearchDialog } from "./_components/sidebar/search-dialog"
import { ThemeSwitcher } from "./_components/sidebar/theme-switcher"

interface ClientLayoutProps {
  children: ReactNode
  layoutPreferences: {
    contentLayout: ContentLayout
    variant: SidebarVariant
    collapsible: SidebarCollapsible
    navbarStyle: NavbarStyle
  }
  defaultOpen: boolean
}

export function ClientLayout({ children, layoutPreferences, defaultOpen }: ClientLayoutProps) {
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const { user, loading, isDevelopmentMode } = useAuth()

  // Initialize navigation loading for dashboard pages
  useNavigationLoading()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Security check: redirect unauthorized users
  useEffect(() => {
    if (mounted && !loading && !user && !isDevelopmentMode) {
      console.warn('🚨 [SECURITY] Unauthorized access attempt to dashboard - redirecting to login')
      router.push('/auth/login?redirect_to=/dashboard')
      return
    }
  }, [mounted, loading, user, isDevelopmentMode, router])

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading Dashboard...</p>
        </div>
      </div>
    )
  }

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Verifying authentication...</p>
        </div>
      </div>
    )
  }

  // Show unauthorized state if not authenticated and not in development mode
  if (!user && !isDevelopmentMode) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md p-6">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-red-600 mb-2">Access Denied</h2>
          <p className="text-muted-foreground mb-4">
            You need to be authenticated to access the dashboard.
          </p>
          <button
            onClick={() => router.push('/auth/login?redirect_to=/dashboard')}
            className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            Sign In
          </button>
        </div>
      </div>
    )
  }

  // Development mode warning
  if (isDevelopmentMode && !user) {
    console.warn('🚀 [DEV] Dashboard accessed in development mode without authentication')
  }

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar variant={layoutPreferences.variant} collapsible={layoutPreferences.collapsible} />
      <SidebarInset
        data-content-layout={layoutPreferences.contentLayout}
        className={cn(
          "data-[content-layout=centered]:!mx-auto data-[content-layout=centered]:max-w-screen-2xl",
          // Adds right margin for inset sidebar in centered layout up to 113rem.
          // On wider screens with collapsed sidebar, removes margin and sets margin auto for alignment.
          "max-[113rem]:peer-data-[variant=inset]:!mr-2 min-[101rem]:peer-data-[variant=inset]:peer-data-[state=collapsed]:!mr-auto",
        )}
      >
        <header
          data-navbar-style={layoutPreferences.navbarStyle}
          className={cn(
            "flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12",
            // Handle sticky navbar style with conditional classes so blur, background, z-index, and rounded corners remain consistent across all SidebarVariant layouts.
            "data-[navbar-style=sticky]:bg-background/50 data-[navbar-style=sticky]:sticky data-[navbar-style=sticky]:top-0 data-[navbar-style=sticky]:z-50 data-[navbar-style=sticky]:overflow-hidden data-[navbar-style=sticky]:rounded-t-[inherit] data-[navbar-style=sticky]:backdrop-blur-md",
          )}
        >
          <div className="flex w-full items-center justify-between px-4 lg:px-6">
            <div className="flex items-center gap-1 lg:gap-2">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />
              <SearchDialog />
            </div>
            <div className="flex items-center gap-2">
              <ThemeSwitcher />
              <AccountSwitcher />
            </div>
          </div>
        </header>
        <div className="h-full p-4 md:p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}