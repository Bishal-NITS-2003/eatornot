import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = new URL(request.url); // Parse the request URL
  const path = url.pathname; // Extract the pathname

  const token = request.cookies.get('signInToken')?.value || ""; // Get the token

  // If the token exists and the user is not already on the dashboard, redirect to /dashboard
  if (token && path !== '/dashboard') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // If the token does not exist and the user is not on a public path, redirect to /signIn
  const isPublicPath = path === '/signIn' || path === '/signUp' || path === '/';
  if (!token && !isPublicPath) {
    return NextResponse.redirect(new URL('/signIn', request.url));
  }

  // Allow the request to proceed
  return NextResponse.next();
}

// Config to define the paths where the middleware applies
export const config = {
  matcher: ['/', '/dashboard', '/signIn', '/signUp'], // Apply middleware to these paths
};
