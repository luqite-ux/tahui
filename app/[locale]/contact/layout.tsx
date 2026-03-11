import type { Metadata } from 'next'
import { SITE_URL } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'Contact Tahui Sweater Factory for OEM/ODM knitwear, samples, or factory visits. Email, phone, WhatsApp, and Shanghai address. Get a quote for seamless knitwear manufacturing.',
  openGraph: {
    title: 'Contact Us | Tahui Sweater Factory',
    description: 'Contact Tahui for knitwear manufacturing inquiries. Shanghai-based, worldwide export.',
    url: `${SITE_URL}/contact`,
  },
  alternates: { canonical: `${SITE_URL}/contact` },
}

export default function ContactLayout({
  children,
}: { children: React.ReactNode }) {
  return children
}
