import type { Metadata } from "next"
import Image from "next/image"
import { Link } from "@/i18n/routing"
import { notFound } from "next/navigation"
import { SITE_URL } from "@/lib/seo"
import { ArrowLeft } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { client } from "@/sanity/lib/client"
import { urlFor } from "@/sanity/lib/image"

const CATEGORY_IDS = ["seamless", "multi-material", "craftsmanship"] as const
const CATEGORY_TITLES: Record<string, string> = {
  seamless: "Seamless Knitwear",
  "multi-material": "Multi-Material Collection",
  craftsmanship: "Advanced Craftsmanship",
}

const PRODUCTS_BY_CATEGORY_QUERY = `*[_type == "product" && category->id == $categoryId] | order(order asc, name asc) {
  _id,
  name,
  "slug": slug.current,
  description,
  "categoryTitle": category->title,
  images
}`

export const revalidate = 60

type Props = { params: Promise<{ categoryId: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { categoryId } = await params
  const title = CATEGORY_TITLES[categoryId]
  if (!title) return { title: "Products" }
  return {
    title: `${title} - TAHUI Sweater Factory`,
    description: `Browse all ${title} products. OEM & ODM knitwear manufacturing.`,
    alternates: { canonical: `${SITE_URL}/products/category/${categoryId}` },
  }
}

export async function generateStaticParams() {
  return CATEGORY_IDS.map((categoryId) => ({ categoryId }))
}

export default async function CategoryProductsPage({ params }: Props) {
  const { categoryId } = await params
  if (!CATEGORY_IDS.includes(categoryId as (typeof CATEGORY_IDS)[number])) {
    notFound()
  }

  const products = await client.fetch<
    Array<{
      _id: string
      name: string
      slug?: string | null
      description?: string | null
      categoryTitle?: string | null
      images?: Array<{ asset?: { _ref?: string }; alt?: string | null } | null>
    }>
  >(PRODUCTS_BY_CATEGORY_QUERY, { categoryId })

  const categoryTitle = CATEGORY_TITLES[categoryId]

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
            Back to Products
          </Link>

          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl mb-4">
            {categoryTitle}
          </h1>
          <p className="text-muted-foreground max-w-2xl mb-12">
            All products in this collection. Available for OEM & ODM.
          </p>

          {products.length === 0 ? (
            <p className="text-muted-foreground py-12">No products in this category yet.</p>
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
                            alt={firstImage?.alt ?? product.name}
                            fill
                            className="object-cover transition-transform duration-700 ease-out group-hover/card:scale-105"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/50 text-sm">
                            No image
                          </div>
                        )}
                      </div>
                      <CardContent className="p-5">
                        {product.categoryTitle && (
                          <p className="text-xs font-medium text-accent uppercase tracking-wider mb-1">
                            {product.categoryTitle}
                          </p>
                        )}
                        <h2 className="font-bold text-foreground text-base leading-tight">
                          {product.name}
                        </h2>
                        {product.description && (
                          <p className="mt-2 text-sm text-muted-foreground leading-relaxed line-clamp-3">
                            {product.description}
                          </p>
                        )}
                        <span className="inline-flex items-center gap-1 mt-3 text-xs font-medium text-accent/70 group-hover/card:text-accent transition-colors">
                          View details →
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
