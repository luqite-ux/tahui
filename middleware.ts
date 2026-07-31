import createMiddleware from 'next-intl/middleware'
import { NextResponse, type NextRequest } from 'next/server'
import { routing } from './i18n/routing'
import { SESSION_COOKIE } from './lib/admin-session'

const intlMiddleware = createMiddleware(routing)

export default function middleware(request: NextRequest) {
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
