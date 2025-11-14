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
    "/terms",
    "/unauthorized"
  ]

  // Check if the current path is public
  const isPublicPath = publicPaths.some(path =>
    pathname.startsWith(path)
  )

  // Root path is public - shows landing page
  const isRootPath = pathname === "/"

  // Static assets that don't need auth check
  const isStaticAsset = /\.(ico|png|jpg|jpeg|gif|svg|webp|css|js|woff|woff2|ttf|eot)$/.test(pathname)

  // Skip authentication for static assets and root path
  if (isStaticAsset || isRootPath) {
    return NextResponse.next()
  }

  // Check for authentication token in cookies or headers
  const authHeader = request.headers.get('authorization')
  const token = request.cookies.get('auth-token')?.value || authHeader?.replace('Bearer ', '')

  // If user is not authenticated and trying to access protected routes
  if (!token && !isPublicPath) {
    const url = new URL("/auth/login", request.url)
    url.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(url)
  }

  // If user is authenticated and trying to access auth pages, redirect to dashboard
  if (token && isPublicPath && pathname.startsWith("/auth")) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // Role-based access control for specific routes
  if (token && !isPublicPath) {
    // Define routes that require specific roles
    const protectedRoutes = {
      '/dashboard/settings': ['manager'],
      '/dashboard/finance': ['manager'],
      '/dashboard/users': ['manager'],
      '/admin': ['manager']
    }

    // Check if current path requires specific role
    for (const [route, allowedRoles] of Object.entries(protectedRoutes)) {
      if (pathname.startsWith(route)) {
        // For now, we'll check the token and assume role validation happens client-side
        // In a real implementation, you'd decode the JWT to get user role
        // or make a request to validate the token and get user info

        // For simplicity, we're doing basic token validation here
        // You might want to validate the token with your backend
        const isValidToken = await validateToken(token)

        if (!isValidToken) {
          // Token is invalid, redirect to login
          const url = new URL("/auth/login", request.url)
          url.searchParams.set("callbackUrl", pathname)
          return NextResponse.redirect(url)
        }

        // TODO: Add role-based validation
        // You could decode the JWT to get user role, or call an API endpoint
        // For now, we'll allow access to all authenticated users

        break
      }
    }
  }

  // Add security headers
  const response = NextResponse.next()
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('X-XSS-Protection', '1; mode=block')

  // Add Content Security Policy
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https: blob:",
    "font-src 'self' data:",
    "connect-src 'self' ws: wss:",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'"
  ].join('; ')

  response.headers.set('Content-Security-Policy', csp)

  return response
}

// Helper function to validate token (mock implementation)
// In a real application, you'd validate the JWT with your backend or decode it
async function validateToken(token: string): Promise<boolean> {
  try {
    // This is a simple check - in production, you'd:
    // 1. Decode the JWT to check expiration
    // 2. Verify the signature with your backend
    // 3. Make an API call to validate the token

    // For now, just check if it's a non-empty string
    if (!token || token.length < 10) {
      return false
    }

    // You could also make a request to your backend to validate the token:
    // const response = await fetch(`${process.env.API_URL}/auth/validate`, {
    //   headers: { Authorization: `Bearer ${token}` }
    // })
    // return response.ok

    return true
  } catch (error) {
    console.error('Token validation error:', error)
    return false
  }
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
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|woff|woff2|ttf|eot)$).*)",
  ],
}