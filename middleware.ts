import { NextResponse as ServiceGuardNextResponse, type NextRequest as ServiceGuardRequest } from 'next/server'
import { isServiceGuardExcludedPath, isWebsiteServiceAvailable } from './lib/service-status'
import createMiddleware from 'next-intl/middleware'
import { NextResponse, type NextRequest } from 'next/server'
import { routing } from './i18n/routing'
import { SESSION_COOKIE } from './lib/admin-session'

const intlMiddleware = createMiddleware(routing)

function existingServiceExpiryIntegration(request: NextRequest) {
  const { pathname } = request.nextUrl
  if (pathname.startsWith('/admin')) {
    const isPublic = pathname.startsWith('/admin/login') || pathname.startsWith('/admin/logout')
    if (!isPublic && !request.cookies.get(SESSION_COOKIE)?.value) {
      const url = request.nextUrl.clone()
      url.pathname = '/admin/login'
      url.searchParams.set('reason', 'unauthorized')
      return NextResponse.redirect(url)
    }
    return NextResponse.next()
  }
  return intlMiddleware(request)
}

export const config = {
  matcher: ['/admin/:path*', '/((?!api|admin|_next|_vercel|studio|.*\\..*).*)'],
}

export async function middleware(request: ServiceGuardRequest) {
  if (request.nextUrl.pathname === '/service-expired') return ServiceGuardNextResponse.next()
  if (!isServiceGuardExcludedPath(request.nextUrl.pathname) && !await isWebsiteServiceAvailable()) return ServiceGuardNextResponse.rewrite(new URL('/service-expired', request.url))
  return existingServiceExpiryIntegration(request)
}
