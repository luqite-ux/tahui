import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { SITE_URL } from "@/lib/seo"
import { ArrowRight, CheckCircle, Sparkles, Palette, Scissors } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { client } from "@/sanity/lib/client"
import { urlFor } from "@/sanity/lib/image"

export const metadata: Metadata = {
  title: "Products - Seamless Knitwear Manufacturer",
  description:
    "Explore our product range: seamless knitwear, multi-material collections, and advanced craftsmanship. OEM & ODM knitwear manufacturing from Shanghai, China.",
  alternates: { canonical: `${SITE_URL}/products` },
}

/** 产品页定时重新拉取 Sanity 数据，便于后台更新后前台更新 */
export const revalidate = 60

const PRODUCTS_QUERY = `*[_type == "product"] | order(order asc, name asc) {
  _id,
  name,
  "slug": slug.current,
  description,
  "categoryId": category->id,
  "categoryTitle": category->title,
  images
}`

/* ─── Category Data ─── */

const categoryNav = [
  { id: "seamless", label: "Seamless Knitwear", icon: Sparkles },
  { id: "multi-material", label: "Multi-Material Collection", icon: Palette },
  { id: "craftsmanship", label: "Advanced Craftsmanship", icon: Scissors },
]

type SanityProduct = {
  _id: string
  name: string
  slug?: string | null
  description?: string | null
  categoryId?: string | null
  categoryTitle?: string | null
  images?: Array<{ asset?: { _ref?: string }; alt?: string | null } | null>
}

interface CategoryConfig {
  id: string
  number: string
  title: string
  description: string
  image: string
  icon: typeof Sparkles
}

const categoryConfigs: CategoryConfig[] = [
  {
    id: "seamless",
    number: "01",
    title: "Seamless Knitwear",
    description:
      "Innovative seamless sweaters and base layers produced using advanced fully automatic seamless knitting technology for ultimate comfort and fit.",
    image: "/images/category-seamless.jpg",
    icon: Sparkles,
  },
  {
    id: "multi-material",
    number: "02",
    title: "Multi-Material Collection",
    description:
      "A wide range of premium knitwear and blankets crafted from diverse materials including wool, silk, cotton, linen, and specialized fancy yarns.",
    image: "/images/category-materials.jpg",
    icon: Palette,
  },
  {
    id: "craftsmanship",
    number: "03",
    title: "Advanced Craftsmanship",
    description:
      "Showcasing our diverse processing capabilities, from jacquard and hand-knitting to embroidery, beading, and custom dyeing techniques.",
    image: "/images/category-craftsmanship.jpg",
    icon: Scissors,
  },
]

const materials = [
  { name: "Wool", note: "Merino, lambswool, specialty wools" },
  { name: "Cotton", note: "Organic & conventional" },
  { name: "Cashmere", note: "Pure & blends" },
  { name: "Silk", note: "Pure silk & silk blends" },
  { name: "Linen", note: "Summer-weight yarns" },
  { name: "Fancy Yarns", note: "Bouclé, mohair, chenille" },
]

/* ─── Category Section Component ─── */

function CategorySection({
  category,
  products,
  bgClass,
}: {
  category: CategoryConfig
  products: SanityProduct[]
  bgClass?: string
}) {
  const Icon = category.icon
  const categoryHref = `/products/category/${category.id}`

  return (
    <section id={category.id} className={`scroll-mt-20 py-20 lg:py-28 ${bgClass || ""}`}>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header row: number + title + View More */}
        <div className="flex items-start justify-between gap-6 mb-5">
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-accent tracking-[0.15em] uppercase flex items-center gap-2">
              <Icon className="h-4 w-4" strokeWidth={1.5} />
              Category {category.number}
            </span>
          </div>
          <Link
            href={categoryHref}
            className="group/more inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-accent transition-colors duration-300 shrink-0"
          >
            View More
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/more:translate-x-0.5" />
          </Link>
        </div>

        {/* Title */}
        <h2 className="text-3xl font-bold tracking-tight text-foreground lg:text-4xl leading-[1.1] mb-4">
          {category.title}
        </h2>

        {/* Description */}
        <p className="text-muted-foreground leading-relaxed max-w-2xl mb-10">
          {category.description}
        </p>

        {/* 分类主图：点击进入该分类全部产品 */}
        <Link href={categoryHref} className="group block relative mb-14 lg:mb-16">
          <div className="aspect-[16/9] lg:aspect-[21/9] rounded-2xl overflow-hidden bg-warm/40 shadow-md ring-1 ring-border/20 relative">
            <Image
              src={category.image || "/placeholder.svg"}
              alt={`${category.title} representative product`}
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/10 via-transparent to-transparent" />
          </div>
        </Link>

        {/* 该分类下前几个产品（最多 6 个），点击进入详情页 */}
        {products.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
            {products.map((product) => {
              const firstImage = product.images?.[0]
              const detailHref = product.slug ? `/products/${product.slug}` : `/products/${product._id}`
              return (
                <Link key={product._id} href={detailHref} className="block h-full">
                  <Card
                    className="group/card h-full bg-card rounded-2xl border-border/40 shadow-sm hover:shadow-lg hover:shadow-accent/[0.04] hover:-translate-y-0.5 transition-all duration-500 ease-out overflow-hidden relative"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-warm/30">
                      {firstImage?.asset ? (
                        <Image
                          src={urlFor(firstImage).width(800).height(600).url()}
                          alt={firstImage?.alt ?? product.name}
                          fill
                          className="object-cover transition-transform duration-700 ease-out group-hover/card:scale-105"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/50 text-sm">
                          No image
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-foreground/5 via-transparent to-transparent" />
                    </div>
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[2px] w-0 group-hover/card:w-2/3 bg-gradient-to-r from-transparent via-accent to-transparent rounded-b-full transition-all duration-500" />
                    <CardContent className="p-5">
                      <h3 className="font-bold text-foreground group-hover/card:text-primary transition-colors duration-300 leading-tight text-base">
                        {product.name}
                      </h3>
                      {product.description && (
                        <p className="mt-2 text-sm text-muted-foreground leading-relaxed line-clamp-2">
                          {product.description}
                        </p>
                      )}
                      <span className="inline-flex items-center gap-1 mt-3 text-xs font-medium text-accent/70 group-hover/card:text-accent transition-colors duration-300">
                        View details
                        <ArrowRight className="h-3 w-3" />
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
  )
}

/* ─── Page ─── */

export default async function ProductsPage() {
  let sanityProducts: Array<{
    _id: string
    name: string
    slug?: string | null
    description?: string | null
    categoryId?: string | null
    categoryTitle?: string | null
    images?: Array<{ asset?: { _ref?: string }; alt?: string | null } | null>
  }> = []
  try {
    sanityProducts = await client.fetch(PRODUCTS_QUERY)
  } catch {
    // 无 Sanity 或未配置时使用空列表
  }

  // 按分类分组，每个分类最多取前 6 个产品
  const productsByCategory = categoryConfigs.map((cat) => ({
    category: cat,
    products: sanityProducts.filter((p) => p.categoryId === cat.id).slice(0, 6),
  }))

  return (
    <div className="min-h-screen">
      <Header />

      {/* ── Hero ── */}
      <section className="pt-16 pb-16 lg:pt-24 lg:pb-20 bg-gradient-to-br from-secondary via-background to-warm/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-primary/[0.03] rounded-full blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-3xl animate-fade-up">
            <p className="text-sm font-semibold text-accent tracking-[0.2em] uppercase mb-5 flex items-center gap-2">
              <span className="inline-block w-6 h-px bg-accent" />
              Our Collections
            </p>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl text-balance leading-[1.08]">
              Premium Knitwear for Global Brands
            </h1>
            <p className="mt-7 text-lg leading-relaxed text-muted-foreground max-w-2xl">
              From seamless innovation to artisanal craft, explore our three
              core product lines. All items available for OEM production or full
              ODM development.
            </p>
          </div>

          {/* Anchor tabs */}
          <div className="mt-12 animate-fade-up-delay-2 flex flex-wrap gap-3">
            {categoryNav.map((cat) => (
              <a
                key={cat.id}
                href={`#${cat.id}`}
                className="group/tab inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-border/60 bg-card/80 backdrop-blur-sm text-sm font-medium text-foreground/80 hover:border-accent/50 hover:text-accent hover:shadow-md hover:shadow-accent/5 transition-all duration-300"
              >
                <cat.icon className="h-4 w-4 text-primary/60 group-hover/tab:text-accent transition-colors duration-300" strokeWidth={1.5} />
                {cat.label}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Category Sections：每类展示前几个产品，主图与「更多」进入分类产品集 ── */}
      {productsByCategory.map(({ category, products }, i) => (
        <div key={category.id}>
          {i > 0 && (
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
            </div>
          )}
          <CategorySection
            category={category}
            products={products}
            bgClass={i % 2 === 1 ? "bg-secondary/50" : ""}
          />
        </div>
      ))}

      {/* ── Materials & Yarns ── */}
      <section className="py-24 lg:py-32 bg-secondary/50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-20">
            <p className="text-sm font-semibold text-accent tracking-[0.2em] uppercase mb-4">
              Materials
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl leading-[1.1]">
              Premium Materials & Yarns
            </h2>
            <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
              We source the finest yarns from trusted suppliers worldwide,
              ensuring consistent quality and sustainable sourcing for every
              order.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
            {materials.map((m) => (
              <Card
                key={m.name}
                className="group bg-card rounded-2xl border-border/50 shadow-sm hover:shadow-xl hover:shadow-accent/6 hover:-translate-y-1 transition-all duration-500 ease-out overflow-hidden relative"
              >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[2px] w-0 group-hover:w-3/5 bg-gradient-to-r from-transparent via-accent to-transparent rounded-b-full transition-all duration-500" />
                <CardContent className="p-6 lg:p-7">
                  <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors duration-300">
                    {m.name}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {m.note}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── OEM / ODM ── */}
      <section className="py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8">
            {[
              {
                tag: "Custom Manufacturing",
                title: "OEM Services",
                desc: "Bring your designs to life. Provide tech packs, samples, or detailed specifications, and our team will produce your knitwear to exact requirements.",
                bullets: [
                  "Production from your tech packs",
                  "Sample matching and development",
                  "Private label and custom packaging",
                  "Flexible MOQ for qualified brands",
                  "Dedicated production planning",
                ],
              },
              {
                tag: "Design Partnership",
                title: "ODM Services",
                desc: "Leverage our design expertise. From trend research to sample development, our in-house team creates complete collections tailored to your brand.",
                bullets: [
                  "Trend research and forecasting",
                  "Original design development",
                  "Material sourcing and selection",
                  "Sample creation and iteration",
                  "Full technical documentation",
                ],
              },
            ].map((svc) => (
              <div
                key={svc.title}
                className="group relative p-8 lg:p-10 rounded-2xl bg-card border border-border/50 shadow-sm hover:shadow-xl hover:shadow-accent/6 hover:-translate-y-1 transition-all duration-500 ease-out overflow-hidden"
              >
                <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-accent via-accent/40 to-transparent rounded-l-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <p className="text-sm font-semibold text-accent tracking-[0.15em] uppercase mb-3">
                  {svc.tag}
                </p>
                <h2 className="text-2xl font-bold tracking-tight text-foreground">
                  {svc.title}
                </h2>
                <p className="mt-4 text-muted-foreground leading-relaxed">
                  {svc.desc}
                </p>
                <ul className="mt-6 space-y-3">
                  {svc.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-3">
                      <CheckCircle
                        className="h-5 w-5 text-accent shrink-0 mt-0.5"
                        strokeWidth={1.5}
                      />
                      <span className="text-muted-foreground text-sm">
                        {b}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 lg:py-32 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
        <div className="relative mx-auto max-w-4xl px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl leading-[1.1]">
            Ready to Develop Your Collection?
          </h2>
          <p className="mt-5 text-lg text-primary-foreground/70 leading-relaxed">
            Contact our team to discuss your product requirements, request
            samples, or schedule a virtual factory tour.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Button
              size="lg"
              variant="secondary"
              className="hover:bg-accent hover:text-accent-foreground hover:scale-[1.02] hover:shadow-lg transition-all duration-300 ease-out"
              asChild
            >
              <Link href="/contact">
                Get Started Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
