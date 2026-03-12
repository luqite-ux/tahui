import type { Metadata } from 'next'
import { SITE_URL, canonicalPath } from '@/lib/seo'
import { getTranslations } from 'next-intl/server'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'contact' })
  const title = t('metaTitle')
  const description = t('metaDescription')
  const path = canonicalPath('/contact', locale)
  return {
    title,
    description,
    openGraph: {
      title: t('metaOgTitle'),
      description: t('metaOgDescription'),
      url: `${SITE_URL}${path}`,
    },
    alternates: { canonical: `${SITE_URL}${path}` },
  }
}

export default function ContactLayout({
  children,
}: { children: React.ReactNode }) {
  return children
}
