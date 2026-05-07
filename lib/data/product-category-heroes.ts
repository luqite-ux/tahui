/**
 * 产品聚合页「分类 Hero」文案与结构数据。
 * 第一步：仅配置 seamless（无缝服装）；其余分类确认样式后在此数组追加条目即可统一渲染。
 */

import { isSeamlessProductCategory, type SeamlessCategoryMeta } from "@/lib/is-seamless-product-category"

export type ProductCategoryHeroLocaleCopy = {
  eyebrow: string
  /** 中文主标题（中文站为大标题） */
  titleZh: string
  /** 英文副标题（中文站为小字）；英文站可作主标题 */
  titleEn: string
  /** 法文站主标题，可选 */
  titleFr?: string
  features: [string, string, string]
  breadcrumb?: string
}

export type ProductCategoryHeroDefinition = {
  /** 与 Sanity productCategory.id 一致 */
  id: string
  locales: {
    zh: ProductCategoryHeroLocaleCopy
    en: ProductCategoryHeroLocaleCopy
    fr: ProductCategoryHeroLocaleCopy
  }
}

export const PRODUCT_CATEGORY_HERO_DEFINITIONS: ProductCategoryHeroDefinition[] = [
  {
    id: "seamless",
    locales: {
      zh: {
        eyebrow: "SEAMLESS CLOTHING · 新品系列",
        titleZh: "无缝服装",
        titleEn: "Seamless knitwear",
        features: ["一体成型", "高弹舒适", "支持定制"],
        breadcrumb: "产品 / 无缝服装",
      },
      en: {
        eyebrow: "SEAMLESS CLOTHING · NEW SEASON",
        titleZh: "无缝服装",
        titleEn: "Seamless Knitwear",
        features: ["Whole-garment construction", "Stretch comfort", "OEM & ODM"],
        breadcrumb: "Products / Seamless Knitwear",
      },
      fr: {
        eyebrow: "SEAMLESS CLOTHING · NOUVELLE SÉRIE",
        titleZh: "无缝服装",
        titleEn: "Maille sans couture",
        titleFr: "Maille sans couture",
        features: ["Confection intégrale", "Confort extensible", "OEM & ODM"],
        breadcrumb: "Produits / Maille sans couture",
      },
    },
  },
]

export function getProductCategoryHeroCopy(
  categoryId: string,
  locale: string
): ProductCategoryHeroLocaleCopy | null {
  const def = PRODUCT_CATEGORY_HERO_DEFINITIONS.find((d) => d.id === categoryId)
  if (!def) return null
  const loc = locale === "zh" ? "zh" : locale === "fr" ? "fr" : "en"
  return def.locales[loc]
}

/** 与 Sanity id 不完全等于 seamless 时，仍可根据标题识别无缝大类并套用同一套 Hero */
export function getProductCategoryHeroCopyResolved(
  categoryId: string,
  locale: string,
  meta: SeamlessCategoryMeta
): ProductCategoryHeroLocaleCopy | null {
  if (!isSeamlessProductCategory(categoryId, meta)) return null
  return getProductCategoryHeroCopy("seamless", locale)
}

export function pickHeroTitles(copy: ProductCategoryHeroLocaleCopy, locale: string) {
  if (locale === "zh") {
    return { primary: copy.titleZh, secondary: copy.titleEn }
  }
  if (locale === "fr") {
    const primary = copy.titleFr ?? copy.titleEn
    return { primary, secondary: copy.titleZh }
  }
  return { primary: copy.titleEn, secondary: copy.titleZh }
}
