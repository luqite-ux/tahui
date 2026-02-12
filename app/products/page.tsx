import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, CheckCircle, Sparkles, Palette, Scissors } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "Products | Tahui Sweater Factory - Seamless Knitwear Manufacturer",
  description:
    "Explore our product range: seamless knitwear, multi-material collections, and advanced craftsmanship. OEM & ODM knitwear manufacturing from Shanghai, China.",
}

/* ─── Category Data ─── */

const categoryNav = [
  { id: "seamless", label: "Seamless Knitwear", icon: Sparkles },
  { id: "multi-material", label: "Multi-Material Collection", icon: Palette },
  { id: "craftsmanship", label: "Advanced Craftsmanship", icon: Scissors },
]

/** 将子分类名称转为 URL 锚点用的 slug */
function subCategorySlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s*&\s*/g, "-")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
}

interface SubCategory {
  name: string
  description: string
  image: string
}

interface Category {
  id: string
  number: string
  title: string
  description: string
  image: string
  icon: typeof Sparkles
  items: SubCategory[]
}

const categories: Category[] = [
  {
    id: "seamless",
    number: "01",
    title: "Seamless Knitwear",
    description:
      "Innovative seamless sweaters and base layers produced using advanced fully automatic seamless knitting technology for ultimate comfort and fit.",
    image: "/images/category-seamless.jpg",
    icon: Sparkles,
    items: [
      {
        name: "Seamless Sweaters",
        description:
          "Premium WholeGarment sweaters with zero side-seams for superior comfort and clean silhouettes.",
        image: "/images/product-seamless-sweaters.jpg",
      },
      {
        name: "Seamless Underwear",
        description:
          "Next-to-skin base layers with body-mapped construction and ultra-smooth bonded edges.",
        image: "/images/product-seamless-underwear.jpg",
      },
      {
        name: "Vests",
        description:
          "Sleeveless knit vests in seamless and fully fashioned construction, available in wool, cotton, and blends.",
        image: "/images/product-vests.jpg",
      },
    ],
  },
  {
    id: "multi-material",
    number: "02",
    title: "Multi-Material Collection",
    description:
      "A wide range of premium knitwear and blankets crafted from diverse materials including wool, silk, cotton, linen, and specialized fancy yarns.",
    image: "/images/category-materials.jpg",
    icon: Palette,
    items: [
      {
        name: "Sweaters",
        description:
          "Classic pullovers in merino wool, cashmere, cotton, silk, and custom blends with jacquard, intarsia, and cable patterns.",
        image: "/images/product-sweaters.jpg",
      },
      {
        name: "Cardigans",
        description:
          "Button-front and open-front cardigans in lightweight to chunky weights with premium hardware options.",
        image: "/images/product-cardigans.jpg",
      },
      {
        name: "Hoodies & Sweatshirts",
        description:
          "Knitted hoodies with seamless hood construction in cotton, wool, and luxury blends.",
        image: "/images/product-hoodies.jpg",
      },
      {
        name: "Dresses",
        description:
          "Elegant knitwear dresses from body-contouring seamless styles to flowing midi lengths.",
        image: "/images/product-dresses.jpg",
      },
      {
        name: "Skirts & Pants",
        description:
          "Pencil skirts, A-line, pleated knit skirts, and knitted trousers, available as coordinating sets.",
        image: "/images/product-skirts.jpg",
      },
      {
        name: "Scarves & Shawls",
        description:
          "Lightweight summer wraps to luxurious winter scarves in wool, cashmere, silk, and linen.",
        image: "/images/product-scarves.jpg",
      },
      {
        name: "Accessories",
        description:
          "Beanies, gloves, mittens, socks, and leg warmers for gift collections and seasonal drops.",
        image: "/images/product-accessories.jpg",
      },
      {
        name: "Blankets",
        description:
          "Premium knitted throws and blankets with cable, waffle, and textured patterns.",
        image: "/images/product-blankets.jpg",
      },
    ],
  },
  {
    id: "craftsmanship",
    number: "03",
    title: "Advanced Craftsmanship",
    description:
      "Showcasing our diverse processing capabilities, from jacquard and hand-knitting to embroidery, beading, and custom dyeing techniques.",
    image: "/images/category-craftsmanship.jpg",
    icon: Scissors,
    items: [
      {
        name: "Jacquard",
        description:
          "Intricate multi-colour jacquard patterns and Fair Isle designs on computerised flat-bed machines.",
        image: "/images/product-jacquard.jpg",
      },
      {
        name: "Embroidery & Beading",
        description:
          "Hand and machine embroidery, sequin application, bead work, and mixed-media embellishments.",
        image: "/images/product-embroidery.jpg",
      },
      {
        name: "Custom Dyeing",
        description:
          "Garment dyeing, tie-dye, ombre, and gradient effects with lab-dip matching and small-batch colour development.",
        image: "/images/product-dyeing.jpg",
      },
    ],
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
  bgClass,
}: {
  category: Category
  bgClass?: string
}) {
  const Icon = category.icon
  const hasMultipleItems = category.items.length > 1

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
          {hasMultipleItems && (
            <Link
              href={`/products#${category.id}`}
              className="group/more inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-accent transition-colors duration-300 shrink-0"
            >
              View More
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/more:translate-x-0.5" />
            </Link>
          )}
        </div>

        {/* Title */}
        <h2 className="text-3xl font-bold tracking-tight text-foreground lg:text-4xl leading-[1.1] mb-4">
          {category.title}
        </h2>

        {/* Description */}
        <p className="text-muted-foreground leading-relaxed max-w-2xl mb-10">
          {category.description}
        </p>

        {/* Representative product image */}
        <div className="group relative mb-14 lg:mb-16">
          <div className="aspect-[16/9] lg:aspect-[21/9] rounded-2xl overflow-hidden bg-warm/40 shadow-md ring-1 ring-border/20 relative">
            <Image
              src={category.image || "/placeholder.svg"}
              alt={`${category.title} representative product`}
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/10 via-transparent to-transparent" />
          </div>
        </div>

        {/* Sub-category grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
          {category.items.map((item) => {
            const itemSlug = subCategorySlug(item.name)
            const anchorId = `${category.id}-${itemSlug}`
            return (
              <Card
                key={item.name}
                id={anchorId}
                className="group/card bg-card rounded-2xl border-border/40 shadow-sm hover:shadow-lg hover:shadow-accent/[0.04] hover:-translate-y-0.5 transition-all duration-500 ease-out overflow-hidden relative scroll-mt-24"
              >
                {/* Product image */}
                <div className="relative aspect-[4/3] overflow-hidden bg-warm/30">
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover/card:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/5 via-transparent to-transparent" />
                </div>
                {/* Top accent line on hover */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[2px] w-0 group-hover/card:w-2/3 bg-gradient-to-r from-transparent via-accent to-transparent rounded-b-full transition-all duration-500" />
                <CardContent className="p-5">
                  <h3 className="font-bold text-foreground group-hover/card:text-primary transition-colors duration-300 leading-tight text-base">
                    {item.name}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed line-clamp-2">
                    {item.description}
                  </p>
                  <Link
                    href={`/products#${anchorId}`}
                    className="inline-flex items-center gap-1 mt-3 text-xs font-medium text-accent/70 hover:text-accent transition-colors duration-300"
                  >
                    View
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ─── Page ─── */

export default function ProductsPage() {
  return (
    <div className="min-h-screen">
      <Header />

      {/* ── Hero ── */}
      <section className="pt-28 pb-16 lg:pt-36 lg:pb-20 bg-gradient-to-br from-secondary via-background to-warm/30 relative overflow-hidden">
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

      {/* ── Category Sections ── */}
      {categories.map((cat, i) => (
        <div key={cat.id}>
          {i > 0 && (
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
            </div>
          )}
          <CategorySection
            category={cat}
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
