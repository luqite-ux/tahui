/**
 * 全站 SEO 常量，用于 metadata、sitemap、JSON-LD 等
 */

/** 默认语言（与 i18n/routing 一致），该语言不显示在 URL 前缀中 */
const DEFAULT_LOCALE = 'en'

/**
 * 带语言的 canonical 路径：默认语言不加前缀，其它语言加 /locale 前缀
 */
export function canonicalPath(path: string, locale: string): string {
  return locale === DEFAULT_LOCALE ? path : `/${locale}${path}`
}

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://www.tahui-factory.cn'

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
