
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// The paths that require authentication.
const protectedPaths = ['/dashboard']

export function middleware(request: NextRequest) {
  const token = request.cookies.get('firebaseIdToken');
  const { pathname } = request.nextUrl

  // If the user is trying to access a protected path without a token,
  // redirect them to the login page.
  if (protectedPaths.some(path => pathname.startsWith(path)) && !token) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname) // Optionally, redirect back after login
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: '/dashboard/:path*',
}
