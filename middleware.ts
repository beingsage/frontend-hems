import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import type { User, Role } from "@/lib/security/rbac"

// Routes that don't require authentication
const publicRoutes = ["/login", "/signup", "/api/auth/login", "/api/auth/signup"]

// Asset routes that don't require authentication
const assetRoutes = ["/_next", "/favicon.ico", "/images", "/assets"]

// Routes with specific role requirements
const roleRequirements: Record<string, string[]> = {
  "/admin": ["admin"],
  "/engineer": ["admin", "engineer"],
  "/security": ["admin", "security"],
  "/api/admin": ["admin"],
}

// Helper function to redirect to login
function redirectToLogin(request: NextRequest) {
  const url = request.nextUrl.clone()
  url.pathname = "/login"
  url.searchParams.set("from", request.nextUrl.pathname)
  return NextResponse.redirect(url)
}

// Helper function to verify token
function verifyToken(token: string) {
  try {
    const decoded = JSON.parse(atob(token))
    if (!decoded.id || !decoded.email) {
      throw new Error("Invalid token structure")
    }
    return decoded
  } catch {
    throw new Error("Invalid token")
  }
}

// Helper function to check if user is authenticated
function isAuthenticated(request: NextRequest): boolean {
  const token = request.cookies.get("auth-token")?.value
  const user = request.cookies.get("user")?.value
  return !!(token && user)
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Handle home route specially
  if (pathname === "/" || pathname === "/home") {
    // If authenticated, redirect to dashboard
    if (isAuthenticated(request)) {
      const url = request.nextUrl.clone()
      url.pathname = "/dashboard"
      return NextResponse.redirect(url)
    }
    // If not authenticated, redirect to login
    return redirectToLogin(request)
  }

  // Allow public routes and asset routes
  if (publicRoutes.some(route => pathname.startsWith(route)) ||
      assetRoutes.some(route => pathname.startsWith(route))) {
    // If user is already authenticated and tries to access login/signup, redirect to dashboard
    if (isAuthenticated(request) && (pathname === "/login" || pathname === "/signup")) {
      const url = request.nextUrl.clone()
      url.pathname = "/dashboard"
      return NextResponse.redirect(url)
    }
    return NextResponse.next()
  }

  // Check authentication for protected routes
  if (!isAuthenticated(request)) {
    return redirectToLogin(request)
  }

  // Get token from cookies
  const token = request.cookies.get("auth-token")?.value
  const userCookie = request.cookies.get("user")?.value

  if (!token || !userCookie) {
    return redirectToLogin(request)
  }

  try {
    // Verify token and get user
    const user = JSON.parse(userCookie) // Use parsed user cookie instead of verifying token again

    // Check role requirements if they exist for the route
    for (const [route, requiredRoles] of Object.entries(roleRequirements)) {
      if (pathname.startsWith(route)) {
        // Check if user's role is included in the required roles
        if (!requiredRoles.includes(user.role)) {
          return new NextResponse(
            JSON.stringify({ error: "Insufficient permissions" }),
            { status: 403, headers: { "Content-Type": "application/json" } }
          )
        }
      }
    }

    // Add user info to request headers for downstream use
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set("x-user-id", user.id)
    requestHeaders.set("x-user-email", user.email)

    const response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })

    return response
  } catch (error) {
    // If token verification fails, redirect to login
    return redirectToLogin(request)
  }
}

export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico).*)"],
}