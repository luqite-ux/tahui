import type { Metadata } from "next"
import Image from "next/image"
import { Link } from "@/i18n/routing"
import { notFound } from "next/navigation"
import { SITE_URL } from "@/lib/seo"
import { getTranslations } from "next-intl/server"
import { ArrowLeft } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { client } from "@/sanity/lib/client"
import { urlFor } from "@/sanity/lib/image"

const PRODUCT_BY_SLUG_QUERY = `*[_type == "product" && slug.current == $slug][0] {
  _id,
  name,
  "slug": slug.current,
  description,
  "categoryId": category->id,
  "categoryTitle": category->title,
  images
}`

const PRODUCT_BY_ID_QUERY = `*[_type == "product" && _id == $id][0] {
  _id,
  name,
  "slug": slug.current,
  description,
  "categoryId": category->id,
  "categoryTitle": category->title,
  images
}`

const ALL_PRODUCT_SLUGS_QUERY = `*[_type == "product" && defined(slug.current)]{ "slug": slug.current }`
const ALL_PRODUCT_IDS_QUERY = `*[_type == "product" && !defined(slug.current)]{ "_id": _id }`

export const revalidate = 60

type Props = { params: Promise<{ locale: string; slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  const tProducts = await getTranslations({ locale, namespace: "products" })
  let product = await client.fetch<{ name?: string; description?: string | null } | null>(
    `*[_type == "product" && slug.current == $slug][0]{ name, description }`,
    { slug }
  )
  if (!product) {
    product = await client.fetch(
      `*[_type == "product" && _id == $id][0]{ name, description }`,
      { id: slug }
    )
  }
  if (!product?.name) return { title: tProducts("productMetaFallbackTitle") }
  return {
    title: `${product.name} - TAHUI Sweater Factory`,
    description: product.description ?? tProducts("productMetaDescriptionFallback", { name: product.name }),
    alternates: { canonical: `${SITE_URL}/products/${slug}` },
  }
}

export async function generateStaticParams() {
  const [bySlug, byId] = await Promise.all([
    client.fetch<{ slug: string }[]>(ALL_PRODUCT_SLUGS_QUERY),
    client.fetch<{ _id: string }[]>(ALL_PRODUCT_IDS_QUERY),
  ])
  return [...bySlug.map(({ slug }) => ({ slug })), ...byId.map(({ _id }) => ({ slug: _id }))]
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params
  let product = await client.fetch<{
    _id: string
    name: string
    slug?: string | null
    description?: string | null
    categoryId?: string | null
    categoryTitle?: string | null
    images?: Array<{ asset?: { _ref?: string }; alt?: string | null } | null>
  } | null>(PRODUCT_BY_SLUG_QUERY, { slug })
  if (!product) {
    product = await client.fetch<typeof product>(PRODUCT_BY_ID_QUERY, { id: slug })
  }

  if (!product) notFound()

  const tNav = await getTranslations("nav")
  const tProducts = await getTranslations("products")
  const tCommon = await getTranslations("common")

  const categoryHref = product.categoryId ? `/products/category/${product.categoryId}` : "/products"

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
            {product.categoryTitle && (
              <>
                <span aria-hidden>/</span>
                <Link href={categoryHref} className="hover:text-accent transition-colors">
                  {product.categoryTitle}
                </Link>
              </>
            )}
            <span aria-hidden>/</span>
            <span className="text-foreground font-medium">{product.name}</span>
          </nav>

          <div className="grid lg:grid-cols-2 gap-10 lg:gap-14">
            {/* 图片区：多图展示 */}
            <div className="space-y-4">
              {product.images && product.images.length > 0 ? (
                <>
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-warm/30 shadow-md ring-1 ring-border/20">
                    <Image
                      src={urlFor(product.images[0]).width(1200).height(900).url()}
                      alt={product.images[0]?.alt ?? product.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      priority
                    />
                  </div>
                  {product.images.length > 1 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {product.images.slice(1, 7).map((img, i) => (
                        <div
                          key={i}
                          className="relative aspect-square rounded-xl overflow-hidden bg-warm/30 ring-1 ring-border/20"
                        >
                          {img?.asset ? (
                            <Image
                              src={urlFor(img).width(600).height(600).url()}
                              alt={img?.alt ?? `${product.name} ${i + 2}`}
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
              {product.categoryTitle && (
                <p className="text-sm font-semibold text-accent tracking-[0.15em] uppercase mb-2">
                  {product.categoryTitle}
                </p>
              )}
              <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl leading-tight">
                {product.name}
              </h1>

              {product.description && (
                <div className="mt-6 prose prose-neutral dark:prose-invert max-w-none">
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                    {product.description}
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
