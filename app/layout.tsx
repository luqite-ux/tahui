import React from "react"
import type { Metadata } from 'next'
import { getLocale } from 'next-intl/server'
import { DM_Sans, Playfair_Display } from 'next/font/google'

import './globals.css'
import { SITE_URL, DEFAULT_TITLE, DEFAULT_DESCRIPTION, ORGANIZATION } from '@/lib/seo'

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans'
})
const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair'
})

const keywords = 'seamless knitwear manufacturer, sweater factory in China, OEM ODM knitwear supplier, wholegarment sweater manufacturer, knitwear factory Shanghai'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_TITLE,
    template: '%s | Tahui Sweater Factory',
  },
  description: DEFAULT_DESCRIPTION,
  keywords,
  authors: [{ name: 'Tahui Sweater Factory', url: SITE_URL }],
  creator: 'Tahui Sweater Factory',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: 'Tahui Sweater Factory',
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [{ url: '/images/logo.png', width: 512, height: 512, alt: 'Tahui Sweater Factory' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  icons: {
    icon: '/icon.png',
    apple: '/apple-touch-icon.png',
  },
  alternates: { canonical: SITE_URL },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: ORGANIZATION.name,
      url: ORGANIZATION.url,
      logo: { '@type': 'ImageObject', url: ORGANIZATION.logo },
      address: {
        '@type': 'PostalAddress',
        ...ORGANIZATION.address,
      },
      contactPoint: {
        '@type': 'ContactPoint',
        ...ORGANIZATION.contactPoint,
      },
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: SITE_URL,
      name: ORGANIZATION.name,
      publisher: { '@id': `${SITE_URL}/#organization` },
      inLanguage: 'en-US',
    },
  ],
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const locale = await getLocale()
  return (
    <html lang={locale}>
      <body className={`${dmSans.variable} ${playfair.variable} font-sans antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  )
}
