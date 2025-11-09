import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Define public paths that don't require authentication
  const publicPaths = [
    "/auth/login",
    "/auth/register",
    "/password-recovery",
    "/support",
    "/policy",
    "/privacy",
    "/terms"
  ]

  // Check if the current path is public
  const isPublicPath = publicPaths.some(path =>
    pathname.startsWith(path)
  )

  // Root path is public - shows landing page
  const isRootPath = pathname === "/"

  // Static assets and API routes that don't need auth check
  const isStaticAsset = /\.(ico|png|jpg|jpeg|gif|svg|webp|css|js)$/.test(pathname)
  const isAPIRoute = pathname.startsWith("/api/")

  // Skip authentication for static assets and API routes
  if (isStaticAsset || isAPIRoute) {
    return NextResponse.next()
  }

  // Development mode: Check if Supabase is configured
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const isDevelopmentMode = !supabaseUrl || !supabaseAnonKey ||
                           supabaseUrl === 'https://placeholder.supabase.co' ||
                           supabaseAnonKey === 'placeholder-key'

  if (isDevelopmentMode) {
    // In development mode with no Supabase config, allow access to all routes
    // but add a header to indicate development mode
    console.warn('Development mode: Authentication bypassed in middleware')
    const response = NextResponse.next()
    response.headers.set('X-Development-Mode', 'true')
    response.headers.set('X-Frame-Options', 'DENY')
    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
    return response
  }

  // Check for authentication token in headers or cookies
  const authHeader = request.headers.get('authorization')
  const token = request.cookies.get('auth-token')?.value || authHeader?.replace('Bearer ', '')

  // If user is not authenticated and trying to access protected routes
  if (!token && !isPublicPath && !isRootPath) {
    const url = new URL("/auth/login", request.url)
    url.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(url)
  }

  // If user is authenticated and trying to access auth pages
  if (token && isPublicPath && pathname.startsWith("/auth")) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // Add security headers
  const response = NextResponse.next()
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}