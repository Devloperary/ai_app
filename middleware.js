import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Define protected routes (wildcard match)
const isProtectedRoute = createRouteMatcher(['/dashboard(.*)', '/forum(.*)']);

export default clerkMiddleware(async (auth, req) => {
  // If the request is for a protected route, enforce authentication
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip internal files and static assets unless in query params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',

    // Always run middleware for API and tRPC routes
    '/(api|trpc)(.*)',
  ],
};
