import type { Metadata } from "next"
import Image from "next/image"
import { Link } from "@/i18n/routing"
import { notFound } from "next/navigation"
import { SITE_URL, canonicalPath } from "@/lib/seo"
import { getTranslations } from "next-intl/server"
import { ArrowLeft } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { client } from "@/sanity/lib/client"
import { urlFor } from "@/sanity/lib/image"
import { getProductDisplayName, getProductDisplayDescription } from "@/lib/product-locale"
import { getCategoryDisplayTitle } from "@/lib/category-locale"
import { contentImageUrl, getUnifiedProduct, getUnifiedProducts, type ContentImage, type UnifiedProduct } from "@/lib/unified-content"

const PRODUCT_FIELDS = `_id, name, nameZh, nameFr, "slug": slug.current, description, descriptionZh, descriptionFr, "categoryId": category->id, "categoryTitle": category->title, "categoryTitleZh": category->titleZh, "categoryTitleFr": category->titleFr, images`
const PRODUCT_BY_SLUG_QUERY = `*[_type == "product" && slug.current == $slug][0] { ${PRODUCT_FIELDS} }`
const PRODUCT_BY_ID_QUERY = `*[_type == "product" && _id == $id][0] { ${PRODUCT_FIELDS} }`

const ALL_PRODUCT_SLUGS_QUERY = `*[_type == "product" && defined(slug.current)]{ "slug": slug.current }`
const ALL_PRODUCT_IDS_QUERY = `*[_type == "product" && !defined(slug.current)]{ "_id": _id }`

export const revalidate = 60
export const dynamicParams = true

type Props = { params: Promise<{ locale: string; slug: string }> }

const META_PRODUCT_FIELDS = "name, nameZh, nameFr, description, descriptionZh, descriptionFr"
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  const tProducts = await getTranslations({ locale, namespace: "products" })
  let product: any = await getUnifiedProduct(slug)
  if (product === undefined) product = await client.fetch<{
    name?: string
    nameZh?: string | null
    nameFr?: string | null
    description?: string | null
    descriptionZh?: string | null
    descriptionFr?: string | null
  } | null>(
    `*[_type == "product" && slug.current == $slug][0]{ ${META_PRODUCT_FIELDS} }`,
    { slug }
  )
  if (product === undefined || !product) {
    product = await client.fetch<typeof product>(
      `*[_type == "product" && _id == $id][0]{ ${META_PRODUCT_FIELDS} }`,
      { id: slug }
    )
  }
  if (!product?.name) return { title: tProducts("productMetaFallbackTitle") }
  const displayName = getProductDisplayName(product, locale)
  const displayDesc = getProductDisplayDescription(product, locale)
  const path = canonicalPath(`/products/${slug}`, locale)
  return {
    title: `${displayName} - TAHUI Sweater Factory`,
    description: displayDesc ?? tProducts("productMetaDescriptionFallback", { name: displayName }),
    alternates: { canonical: `${SITE_URL}${path}` },
  }
}

export async function generateStaticParams() {
  return []
}

export default async function ProductDetailPage({ params }: Props) {
  const { locale, slug } = await params
  let product: any = await getUnifiedProduct(slug)
  if (product === undefined) product = await client.fetch<{
    _id: string
    name: string
    nameZh?: string | null
    nameFr?: string | null
    slug?: string | null
    description?: string | null
    descriptionZh?: string | null
    descriptionFr?: string | null
    categoryId?: string | null
    categoryTitle?: string | null
    categoryTitleZh?: string | null
    categoryTitleFr?: string | null
    images?: Array<{ asset?: { _ref?: string }; alt?: string | null } | null>
  } | null>(PRODUCT_BY_SLUG_QUERY, { slug })
  if (product === undefined || !product) {
    product = await client.fetch<typeof product>(PRODUCT_BY_ID_QUERY, { id: slug })
  }

  if (!product) notFound()

  const tNav = await getTranslations({ locale, namespace: "nav" })
  const tProducts = await getTranslations({ locale, namespace: "products" })
  const tCommon = await getTranslations({ locale, namespace: "common" })

  const categoryHref = product.categoryId
    ? `/products/category/${encodeURIComponent(product.categoryId)}`
    : "/products"
  const displayName = getProductDisplayName(product, locale)
  const displayDescription = getProductDisplayDescription(product, locale)
  const categoryTitle = product.categoryId
    ? getCategoryDisplayTitle(
        {
          title: product.categoryTitle ?? product.categoryId,
          titleZh: product.categoryTitleZh,
          titleFr: product.categoryTitleFr,
        },
        locale
      )
    : null

  return (
    <div className="min-h-screen">
      <Header />

      <article className="pt-24 pb-16 lg:pt-28 lg:pb-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link href="/products" className="hover:text-accent transition-colors">
              {tNav("products")}
            </Link>
            {categoryTitle && (
              <>
                <span aria-hidden>/</span>
                <Link href={categoryHref} className="hover:text-accent transition-colors">
                  {categoryTitle}
                </Link>
              </>
            )}
            <span aria-hidden>/</span>
            <span className="text-foreground font-medium">{displayName}</span>
          </nav>

          <div className="grid lg:grid-cols-2 gap-10 lg:gap-14">
            {/* 图片区：多图展示 */}
            <div className="space-y-4">
              {product.images && product.images.length > 0 ? (
                <>
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-warm/30 shadow-md ring-1 ring-border/20">
                    <Image
                      src={contentImageUrl(product.images[0]) ?? urlFor(product.images[0] as any).width(1200).height(900).url()}
                      alt={product.images[0]?.alt ?? displayName}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      priority
                    />
                  </div>
                  {product.images.length > 1 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {product.images.slice(1, 7).map((img: ContentImage, i: number) => (
                        <div
                          key={i}
                          className="relative aspect-square rounded-xl overflow-hidden bg-warm/30 ring-1 ring-border/20"
                        >
                          {img?.asset || contentImageUrl(img) ? (
                            <Image
                              src={contentImageUrl(img) ?? urlFor(img as any).width(600).height(600).url()}
                              alt={img?.alt ?? `${displayName} ${i + 2}`}
                              fill
                              className="object-cover"
                              sizes="(max-width: 640px) 50vw, 20vw"
                            />
                          ) : null}
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="aspect-[4/3] rounded-2xl bg-warm/30 flex items-center justify-center text-muted-foreground">
                  {tCommon("noImage")}
                </div>
              )}
            </div>

            {/* 介绍区 */}
            <div>
              {categoryTitle && (
                <p className="text-sm font-semibold text-accent tracking-[0.15em] uppercase mb-2">
                  {categoryTitle}
                </p>
              )}
              <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl leading-tight">
                {displayName}
              </h1>

              {displayDescription && (
                <div className="mt-6 prose prose-neutral dark:prose-invert max-w-none">
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                    {displayDescription}
                  </p>
                </div>
              )}

              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  href={categoryHref}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-border bg-card text-sm font-medium text-foreground hover:border-accent hover:text-accent transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  {tProducts("backToCollection")}
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  {tCommon("getQuote")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </article>

      <Footer />
    </div>
  )
}
