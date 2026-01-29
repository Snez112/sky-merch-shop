import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  // Check if maintenance mode is enabled via environment variable
  // Note: Environment variables in middleware are read at build time (static) or runtime (dynamic)
  // For easy toggling without rebuilds, consider using Edge Config or a database check
  // But for simple use cases, env var + restart is sufficient.
  const maintenanceMode = process.env.MAINTENANCE_MODE === 'true';

  if (maintenanceMode) {
    const { pathname } = req.nextUrl;

    // Allow access to the maintenance page itself
    if (pathname === '/maintenance') {
      return NextResponse.next();
    }

    // Allow static files, images, favicon, api routes, and next internals
    // We probably want to allow API routes so admin dashboard (if any) or background jobs might still work,
    // or block them too depending on requirements. Here we allow them for safety.
    if (
      pathname.startsWith('/_next') ||
      pathname.startsWith('/static') ||
      pathname.startsWith('/api') || 
      pathname.endsWith('.ico') ||
      pathname.endsWith('.png') ||
      pathname.endsWith('.jpg') ||
      pathname.endsWith('.svg')
    ) {
      return NextResponse.next();
    }

    // Redirect everything else to maintenance page
    return NextResponse.redirect(new URL('/maintenance', req.url));
  }
  
  // If not in maintenance mode, but user tries to access /maintenance page,
  // redirect them back to home or 404? 
  // Let's redirect to home so they don't see the maintenance page when the site is live.
  if (req.nextUrl.pathname === '/maintenance') {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
}

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
