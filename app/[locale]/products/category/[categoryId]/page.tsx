import type { Metadata } from "next"
import Image from "next/image"
import { Link, redirect } from "@/i18n/routing"
import { notFound } from "next/navigation"
import { SITE_URL, canonicalPath } from "@/lib/seo"
import { getTranslations } from "next-intl/server"
import { ArrowLeft } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { client } from "@/sanity/lib/client"
import { urlFor } from "@/sanity/lib/image"
import { getProductDisplayName, getProductDisplayDescription } from "@/lib/product-locale"
import { getCategoryDisplayTitle } from "@/lib/category-locale"
import { normalizeId } from "@/lib/normalize-id"

const PRODUCTS_BY_CATEGORY_QUERY = `*[_type == "product" && category->id == $categoryId] | order(order asc, name asc) {
  _id,
  name,
  nameZh,
  nameFr,
  "slug": slug.current,
  description,
  descriptionZh,
  descriptionFr,
  "categoryTitle": category->title,
  images
}`

const CATEGORY_BY_ID_QUERY = `*[_type == "productCategory" && id == $categoryId][0]{
  id,
  number,
  title,
  titleZh,
  titleFr,
  image
}`

export const revalidate = 60
export const dynamicParams = true
/** Footer 等组件使用 getLocale()/headers；禁止把本页当静态段渲染，否则会 DYNAMIC_SERVER_USAGE → 500 */
export const dynamic = "force-dynamic"

type Props = { params: Promise<{ locale: string; categoryId: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, categoryId } = await params
  const t = await getTranslations({ locale, namespace: "products" })
  const normalizedCategoryId = normalizeId(categoryId)
  try {
    const category = await client.fetch<{
      title?: string
      titleZh?: string | null
      titleFr?: string | null
    } | null>(CATEGORY_BY_ID_QUERY, { categoryId: normalizedCategoryId })
    const title = category?.title
      ? getCategoryDisplayTitle(
          { title: category.title, titleZh: category.titleZh, titleFr: category.titleFr },
          locale
        )
      : null
    if (!title) return { title: t("metaTitle") }
    const path = canonicalPath(
      `/products/category/${encodeURIComponent(normalizedCategoryId)}`,
      locale
    )
    return {
      title: `${title} - TAHUI Sweater Factory`,
      description: t("categoryMetaDescription", { category: title }),
      alternates: { canonical: `${SITE_URL}${path}` },
    }
  } catch {
    return { title: t("metaTitle") }
  }
}

export default async function CategoryProductsPage({ params }: Props) {
  const { locale, categoryId } = await params
  const normalizedCategoryId = normalizeId(categoryId)
  if (normalizedCategoryId && normalizedCategoryId !== categoryId) {
    redirect({ href: `/products/category/${normalizedCategoryId}`, locale })
  }

  const t = await getTranslations({ locale, namespace: "products" })
  const tNav = await getTranslations({ locale, namespace: "nav" })
  const tCommon = await getTranslations({ locale, namespace: "common" })

  let category:
    | {
        id?: string
        number?: string | null
        title?: string
        titleZh?: string | null
        titleFr?: string | null
      }
    | null = null

  let products:
    | Array<{
        _id: string
        name: string
        nameZh?: string | null
        nameFr?: string | null
        slug?: string | null
        description?: string | null
        descriptionZh?: string | null
        descriptionFr?: string | null
        categoryTitle?: string | null
        images?: Array<{ asset?: { _ref?: string }; alt?: string | null } | null>
      }>
    | null = null

  try {
    category = await client.fetch(CATEGORY_BY_ID_QUERY, { categoryId: normalizedCategoryId })
    if (!category?.id || !category.title) notFound()
    products = await client.fetch(PRODUCTS_BY_CATEGORY_QUERY, { categoryId: normalizedCategoryId })
  } catch {
    notFound()
  }

  const categoryTitle = getCategoryDisplayTitle(
    { title: category.title, titleZh: category.titleZh, titleFr: category.titleFr },
    locale
  )
  const headerImageUrl = (category as { image?: unknown } | null)?.image
    ? urlFor((category as { image: unknown }).image).width(2400).height(1200).url()
    : null

  return (
    <div className="min-h-screen">
      <Header />

      {/* Category Header */}
      <section className="pt-20 lg:pt-24">
        <div className="w-full shadow-sm overflow-hidden bg-[#F7F7F7]">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid items-center gap-8 py-10 lg:py-12 lg:grid-cols-12 min-h-[30vh] max-h-[40vh]">
              <div className="lg:col-span-7 xl:col-span-7">
                <p className="text-foreground/70 text-xs tracking-[0.28em] font-semibold">
                  {t("categoryHeaderTagline")}
                </p>
                <h1 className="mt-2 text-foreground font-bold tracking-tight text-3xl sm:text-4xl lg:text-5xl">
                  {categoryTitle}
                </h1>
                <nav className="mt-3 text-sm text-foreground/70">
                  <ol className="flex flex-wrap items-center gap-2">
                    <li>
                      <Link href="/" className="hover:text-foreground transition-colors">
                        {tNav("home")}
                      </Link>
                    </li>
                    <li className="opacity-60">/</li>
                    <li>
                      <Link href="/products" className="hover:text-foreground transition-colors">
                        {tNav("products")}
                      </Link>
                    </li>
                    <li className="opacity-60">/</li>
                    <li className="text-foreground font-semibold">{categoryTitle}</li>
                  </ol>
                </nav>
              </div>

              <div className="lg:col-span-5 xl:col-span-5">
                <div className="w-full flex justify-center lg:justify-end">
                  <div className="relative aspect-square w-[70vw] max-w-[320px] sm:max-w-[360px] lg:max-w-[420px]">
                    {headerImageUrl ? (
                      <Image
                        src={headerImageUrl}
                        alt={categoryTitle}
                        fill
                        priority
                        sizes="(max-width: 1024px) 70vw, 420px"
                        className="object-contain drop-shadow-md [filter:brightness(0.92)]"
                      />
                    ) : (
                      <div className="absolute inset-0 rounded-2xl bg-primary/10" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-14 lg:py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-accent transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("backToProducts")}
          </Link>

          <p className="text-muted-foreground max-w-2xl mb-12">
            {t("allInCollection")}
          </p>

          {products.length === 0 ? (
            <p className="text-muted-foreground py-12">{t("noProducts")}</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
              {products.map((product) => {
                const firstImage = product.images?.[0]
                const detailHref = product.slug
                  ? `/products/${encodeURIComponent(product.slug)}`
                  : `/products/${encodeURIComponent(product._id)}`
                return (
                  <Link key={product._id} href={detailHref} className="block h-full">
                    <Card
                      className="group/card h-full bg-card rounded-2xl border-border/40 shadow-sm hover:shadow-lg hover:shadow-accent/[0.04] hover:-translate-y-0.5 transition-all duration-500 ease-out overflow-hidden"
                    >
                      <div className="relative aspect-[4/3] overflow-hidden bg-warm/30">
                        {firstImage?.asset ? (
                          <Image
                            src={urlFor(firstImage).width(800).height(600).url()}
                            alt={firstImage?.alt ?? getProductDisplayName(product, locale)}
                            fill
                            className="object-cover transition-transform duration-700 ease-out group-hover/card:scale-105"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/50 text-sm">
                            {tCommon("noImage")}
                          </div>
                        )}
                      </div>
                      <CardContent className="p-5">
                        <p className="text-xs font-medium text-accent uppercase tracking-wider mb-1">
                          {categoryTitle}
                        </p>
                        <h2 className="font-bold text-foreground text-base leading-tight">
                          {getProductDisplayName(product, locale)}
                        </h2>
                        {getProductDisplayDescription(product, locale) && (
                          <p className="mt-2 text-sm text-muted-foreground leading-relaxed line-clamp-3">
                            {getProductDisplayDescription(product, locale)}
                          </p>
                        )}
                        <span className="inline-flex items-center gap-1 mt-3 text-xs font-medium text-accent/70 group-hover/card:text-accent transition-colors">
                          {t("viewDetails")} →
                        </span>
                      </CardContent>
                    </Card>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}
