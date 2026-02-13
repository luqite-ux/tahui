/**
 * 全站 SEO 常量，用于 metadata、sitemap、JSON-LD 等
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null) ||
  'https://www.tahui-factory.cn'

export const SITE_NAME = 'Tahui Sweater Factory'
export const DEFAULT_TITLE = 'Tahui Sweater Factory | Seamless Knitwear Manufacturer in China'
export const DEFAULT_DESCRIPTION =
  'Leading seamless knitwear manufacturer in Shanghai, China. 20+ years OEM & ODM experience, 100,000 pcs monthly capacity, ISO certified. WholeGarment technology specialist.'

export const ORGANIZATION = {
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/images/logo.png`,
  address: {
    streetAddress: 'No. 351 Tahui Road, Songjiang District',
    addressLocality: 'Shanghai',
    addressCountry: 'CN',
  },
  contactPoint: {
    email: 'info@tahui-factory.cn',
    telephone: '+86-166-2168-4217',
    contactType: 'customer service',
    areaServed: 'Worldwide',
    availableLanguage: ['English', 'Chinese'],
  },
}
