import type { Metadata } from "next"
import Image from "next/image"
import { Link } from "@/i18n/routing"
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

const CATEGORY_IDS = ["seamless", "multi-material", "craftsmanship"] as const

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

export const revalidate = 60

type Props = { params: Promise<{ locale: string; categoryId: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, categoryId } = await params
  const t = await getTranslations({ locale, namespace: "products" })
  const title = CATEGORY_IDS.includes(categoryId as (typeof CATEGORY_IDS)[number])
    ? t(`categories.${categoryId}.title`)
    : null
  if (!title) return { title: t("metaTitle") }
  const path = canonicalPath(`/products/category/${categoryId}`, locale)
  return {
    title: `${title} - TAHUI Sweater Factory`,
    description: t("categoryMetaDescription", { category: title }),
    alternates: { canonical: `${SITE_URL}${path}` },
  }
}

export async function generateStaticParams() {
  return CATEGORY_IDS.map((categoryId) => ({ categoryId }))
}

export default async function CategoryProductsPage({ params }: Props) {
  const { locale, categoryId } = await params
  if (!CATEGORY_IDS.includes(categoryId as (typeof CATEGORY_IDS)[number])) {
    notFound()
  }

  const t = await getTranslations({ locale, namespace: "products" })
  const tCommon = await getTranslations({ locale, namespace: "common" })

  const products = await client.fetch<
    Array<{
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
  >(PRODUCTS_BY_CATEGORY_QUERY, { categoryId })

  const categoryTitle = t(`categories.${categoryId}.title`)

  return (
    <div className="min-h-screen">
      <Header />

      <section className="pt-24 pb-16 lg:pt-28 lg:pb-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-accent transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("backToProducts")}
          </Link>

          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl mb-4">
            {categoryTitle}
          </h1>
          <p className="text-muted-foreground max-w-2xl mb-12">
            {t("allInCollection")}
          </p>

          {products.length === 0 ? (
            <p className="text-muted-foreground py-12">{t("noProducts")}</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
              {products.map((product) => {
                const firstImage = product.images?.[0]
                const detailHref = product.slug ? `/products/${product.slug}` : `/products/${product._id}`
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
