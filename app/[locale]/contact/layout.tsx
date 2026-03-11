import type { Metadata } from 'next'
import { SITE_URL } from '@/lib/seo'
import { getTranslations } from 'next-intl/server'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'contact' })
  const title = t('metaTitle')
  const description = t('metaDescription')
  return {
    title,
    description,
    openGraph: {
      title: t('metaOgTitle'),
      description: t('metaOgDescription'),
      url: `${SITE_URL}/contact`,
    },
    alternates: { canonical: `${SITE_URL}/contact` },
  }
}

export default function ContactLayout({
  children,
}: { children: React.ReactNode }) {
  return children
}
