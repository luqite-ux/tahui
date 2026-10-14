import createNextIntlPlugin from 'next-intl/plugin'
import path from 'path'
import { fileURLToPath } from 'url'

const withNextIntl = createNextIntlPlugin('./i18n/request.ts')
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const adminUrl = process.env.NEXT_PUBLIC_ADMIN_URL?.trim().replace(/[\r\n]/g, '').replace(/\/$/, '')

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  turbopack: {
    // Fix: ensure Turbopack resolves Next.js from repo root
    root: __dirname,
  },
  async rewrites() {
    if (!adminUrl) return []
    return {
      afterFiles: [
        { source: '/admin', destination: `${adminUrl}/admin` },
        { source: '/admin/:path*', destination: `${adminUrl}/admin/:path*` },
        { source: '/api/admin/:path*', destination: `${adminUrl}/api/admin/:path*` },
      ],
    }
  },
}

export default withNextIntl(nextConfig)
