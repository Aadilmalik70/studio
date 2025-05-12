
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from '@/lib/firebase/config'; // Ensure this path is correct

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const publicPaths = ['/login', '/signup', '/']; // Add any other public paths

  // Allow public paths
  if (publicPaths.some(path => pathname === path || (path.endsWith('/') && pathname.startsWith(path)))) {
    return NextResponse.next();
  }
  
  // Try to get the token from cookies
  // Note: Firebase client-side SDK manages token refresh.
  // For server-side protection with middleware, you typically verify an ID token.
  // This is a simplified check. For robust server-side validation, you'd use Firebase Admin SDK.
  const idToken = request.cookies.get('firebaseIdToken')?.value; // Assuming you store it

  // If accessing /app/* or /app/admin/*
  if (pathname.startsWith('/app')) {
    if (!idToken) {
      // No token, redirect to login
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // For this simplified example, we are not verifying the token here.
    // In a production app, you MUST verify the ID token using Firebase Admin SDK on a backend or Edge Function.
    // Since middleware runs on the edge, a full Admin SDK setup might be complex.
    // A common pattern is to have an API route for token verification that the middleware calls,
    // or to rely on client-side checks after initial load for pages that can tolerate it.

    // Admin check for /app/admin
    if (pathname.startsWith('/app/admin')) {
      // This is a placeholder for admin check logic.
      // A proper implementation would decode the ID token and check for custom admin claims.
      // For now, we'll assume the AuthContext handles isAdmin and client-side redirects if needed,
      // or the page itself performs an admin check.
      // This middleware example only checks for general authentication for /app.
      // To truly protect /app/admin server-side, you'd need to:
      // 1. Ensure the ID token contains an `admin: true` custom claim.
      // 2. Verify this token (e.g., using an edge function or Firebase Admin SDK if possible here).
      // For now, we allow if authenticated, relying on client-side AuthContext for fine-grained admin access.
      // Or, if you have a way to get user email from a verified token here, you could check against NEXT_PUBLIC_ADMIN_EMAIL.
    }
    
    return NextResponse.next();
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
