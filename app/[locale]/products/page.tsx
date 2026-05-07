import type { Metadata } from "next"
import Image from "next/image"
import { Link } from "@/i18n/routing"
import { SITE_URL, canonicalPath } from "@/lib/seo"
import { ArrowRight, CheckCircle, Sparkles, Palette, Scissors } from "lucide-react"
import { getTranslations } from "next-intl/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { client } from "@/sanity/lib/client"
import { urlFor } from "@/sanity/lib/image"
import { getProductDisplayName, getProductDisplayDescription } from "@/lib/product-locale"
import { PRODUCT_CATEGORIES_QUERY } from "@/sanity/lib/queries"
import { getCategoryDisplayTitle } from "@/lib/category-locale"
import { ProductCategoryHero } from "@/components/product-category-hero"
import { getProductCategoryHeroCopyResolved } from "@/lib/data/product-category-heroes"
import { isSeamlessProductCategory } from "@/lib/is-seamless-product-category"

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "products" })
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: { canonical: `${SITE_URL}${canonicalPath("/products", locale)}` },
  }
}

/** 产品页定时重新拉取 Sanity 数据，便于后台更新后前台更新 */
export const revalidate = 60

const PRODUCTS_QUERY = `*[_type == "product"] | order(order asc, name asc) {
  _id,
  name,
  nameZh,
  nameFr,
  "slug": slug.current,
  description,
  descriptionZh,
  descriptionFr,
  "categoryId": category->id,
  "categoryTitle": category->title,
  images
}`

/* ─── Category Data ─── */
const categoryIcons = [Sparkles, Palette, Scissors]

type SanityProduct = {
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
  images?: Array<{ asset?: { _ref?: string }; alt?: string | null } | null>
}

interface CategoryConfig {
  id: string
  number: string
  title: string
  titleZh?: string | null
  titleFr?: string | null
  description?: string | null
  image?: unknown
  icon: typeof Sparkles
}
const materialIds = ["wool", "cotton", "cashmere", "silk", "linen", "fancyYarns"] as const

/** 仅无缝大类使用「一体成型」；其它分类用通用卖点，避免误导 */
function getCategoryFeatures(locale: string, isSeamless: boolean): string[] {
  if (locale === "zh") {
    return isSeamless
      ? ["一体成型", "高弹舒适", "支持定制"]
      : ["精湛工艺", "高弹舒适", "支持定制"]
  }
  if (locale === "fr") {
    return isSeamless
      ? ["Confection intégrale", "Confort extensible", "OEM & ODM"]
      : ["Savoir-faire soigné", "Confort extensible", "OEM & ODM"]
  }
  return isSeamless
    ? ["Whole-garment construction", "Stretch comfort", "OEM & ODM"]
    : ["Fine craftsmanship", "Stretch comfort", "OEM & ODM"]
}

function normalizeCategoryId(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

function buildFallbackCategoriesFromProducts(products: SanityProduct[]): CategoryConfig[] {
  const byKey = new Map<string, { id: string; title: string }>()
  for (const p of products) {
    const rawId = p.categoryId?.trim() || p.categoryTitle?.trim() || ""
    const rawTitle = p.categoryTitle?.trim() || p.categoryId?.trim() || ""
    if (!rawId || !rawTitle) continue
    const id = normalizeCategoryId(rawId)
    if (!id) continue
    if (!byKey.has(id)) byKey.set(id, { id, title: rawTitle })
  }
  return Array.from(byKey.values())
    .slice(0, 12)
    .map((c, i) => ({
      id: c.id,
      number: String(i + 1).padStart(2, "0"),
      title: c.title,
      description: "",
      icon: categoryIcons[i % categoryIcons.length],
    }))
}

/* ─── Category Section Component ─── */

function CategorySection({
  category,
  products,
  locale,
  reverse,
  altBackground,
  t,
  tNav,
  tCommon,
}: {
  category: CategoryConfig
  products: SanityProduct[]
  locale: string
  reverse?: boolean
  altBackground?: boolean
  t: Awaited<ReturnType<typeof getTranslations>>
  tNav: Awaited<ReturnType<typeof getTranslations>>
  tCommon: Awaited<ReturnType<typeof getTranslations>>
}) {
  const Icon = category.icon
  const categoryHref = `/products/category/${encodeURIComponent(category.id)}`
  const title = getCategoryDisplayTitle(category, locale)
  const description = category.description?.trim() || "Timeless design meets exceptional comfort."
  const seamlessMeta = {
    title: category.title,
    titleZh: category.titleZh,
    titleFr: category.titleFr,
  }
  const isSeamlessCategory = isSeamlessProductCategory(category.id, seamlessMeta)
  const features = getCategoryFeatures(locale, isSeamlessCategory)
  const categoryImageUrl = category.image
    ? urlFor(category.image).width(1200).height(1200).url()
    : "/placeholder.svg"
  const heroCopy = getProductCategoryHeroCopyResolved(category.id, locale, seamlessMeta)
  const categoryNumberLabel = t("categoryLabel", { number: category.number })

  const productGrid =
    products.length > 0 ? (
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
        {products.map((product) => {
          const firstImage = product.images?.[0]
          const detailHref = product.slug
            ? `/products/${encodeURIComponent(product.slug)}`
            : `/products/${encodeURIComponent(product._id)}`
          return (
            <Link key={product._id} href={detailHref} className="block h-full">
              <Card className="group/card relative h-full overflow-hidden rounded-2xl border-border/40 bg-card shadow-sm transition-all duration-500 ease-out hover:-translate-y-0.5 hover:shadow-lg hover:shadow-accent/[0.04]">
                <div className="relative aspect-[4/3] overflow-hidden bg-warm/30">
                  {firstImage?.asset ? (
                    <Image
                      src={urlFor(firstImage).width(800).height(600).url()}
                      alt={firstImage?.alt ?? getProductDisplayName(product, locale)}
                      fill
                      className="object-cover transition-transform duration-700 ease-out group-hover/card:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground/50">
                      {tCommon("noImage")}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/5 via-transparent to-transparent" />
                </div>
                <div className="absolute left-1/2 top-0 h-[2px] w-0 -translate-x-1/2 rounded-b-full bg-gradient-to-r from-transparent via-accent to-transparent transition-all duration-500 group-hover/card:w-2/3" />
                <CardContent className="p-5">
                  <h3 className="text-base font-bold leading-tight text-foreground transition-colors duration-300 group-hover/card:text-primary">
                    {getProductDisplayName(product, locale)}
                  </h3>
                  {getProductDisplayDescription(product, locale) && (
                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                      {getProductDisplayDescription(product, locale)}
                    </p>
                  )}
                  <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-accent/70 transition-colors duration-300 group-hover/card:text-accent">
                    {t("viewDetails")}
                    <ArrowRight className="h-3 w-3" />
                  </span>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>
    ) : null

  return (
    <section id={category.id} className={`scroll-mt-20 py-16 lg:py-20 ${altBackground ? "bg-[#F8F8F7]" : ""}`}>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {heroCopy ? (
          <>
            <ProductCategoryHero
              locale={locale}
              copy={heroCopy}
              categoryNumberLabel={categoryNumberLabel}
              imageUrl={categoryImageUrl}
              imageAlt={t("categoryImageAlt", { category: title })}
              linkHref={categoryHref}
              buttonText={t("viewMoreProducts")}
              reverse={reverse}
              imagePriority={isSeamlessCategory}
            />
            {productGrid ? <div className="mt-12">{productGrid}</div> : null}
          </>
        ) : (
          <div className="mx-auto mb-12 max-w-7xl rounded-[40px] bg-[#F3F0EB] p-6 sm:p-8 lg:p-12">
            <div
              className={[
                "group flex flex-col items-center gap-8 md:flex-row md:items-center lg:gap-12",
                reverse ? "md:flex-row-reverse" : "",
              ].join(" ")}
            >
              <div
                className={[
                  "flex w-full flex-col justify-center md:w-1/2",
                  reverse ? "md:items-end md:text-right" : "md:items-start md:text-left",
                ].join(" ")}
              >
                <p className="text-xs uppercase tracking-[0.18em] text-foreground/45">
                  {category.title.toUpperCase()} · {t("categoryHeaderTagline")}
                </p>
                <span className="mt-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.15em] text-accent">
                  <Icon className="h-4 w-4" strokeWidth={1.5} />
                  {categoryNumberLabel}
                </span>
                <h2 className="mt-3 text-4xl font-bold leading-[1.08] tracking-tight text-foreground sm:text-5xl">
                  {title}
                </h2>
                <p className="mt-2 text-lg font-light text-foreground/55">{description}</p>
                <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-foreground/60">
                  {features.map((feature, idx) => (
                    <span key={feature} className="inline-flex items-center gap-2">
                      {idx === 0 ? (
                        <Sparkles className="h-3.5 w-3.5 text-foreground/50" strokeWidth={1.5} />
                      ) : idx === 1 ? (
                        <CheckCircle className="h-3.5 w-3.5 text-foreground/50" strokeWidth={1.5} />
                      ) : (
                        <Palette className="h-3.5 w-3.5 text-foreground/50" strokeWidth={1.5} />
                      )}
                      {feature}
                    </span>
                  ))}
                </div>
                <nav className="mt-5 text-sm text-foreground/50">
                  <ol className="flex flex-wrap items-center gap-2">
                    <li>{tNav("products")}</li>
                    <li>/</li>
                    <li className="text-foreground/70">{title}</li>
                  </ol>
                </nav>
                <div className="mt-7">
                  <Link
                    href={categoryHref}
                    className="group/more inline-flex items-center gap-2 rounded-full border border-accent bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground shadow-sm transition-all duration-300 hover:bg-accent/90 hover:shadow-md"
                  >
                    {t("viewMoreProducts")}
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/more:translate-x-0.5" />
                  </Link>
                </div>
              </div>

              <Link href={categoryHref} className="relative block w-full md:w-1/2">
                <div className="relative mx-auto aspect-[4/3] w-full max-h-[450px] max-w-[560px] overflow-hidden rounded-3xl border border-gray-100 bg-secondary/40 shadow-sm">
                  <Image
                    src={categoryImageUrl}
                    alt={t("categoryImageAlt", { category: title })}
                    fill
                    className="object-cover [object-position:50%_28%] transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                </div>
              </Link>
            </div>

            {productGrid ? <div className="mt-12">{productGrid}</div> : null}
          </div>
        )}
      </div>
    </section>
  )
}

/* ─── Page ─── */

export default async function ProductsPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "products" })
  const tNav = await getTranslations({ locale, namespace: "nav" })
  const tCommon = await getTranslations({ locale, namespace: "common" })

  let sanityProducts: SanityProduct[] = []
  let categoryConfigs: CategoryConfig[] = []
  const [productsResult, categoriesResult] = await Promise.allSettled([
    client.fetch<SanityProduct[]>(PRODUCTS_QUERY),
    client.fetch<
      Array<{
        _id: string
        id?: string | null
        number?: string | null
        title: string
        titleZh?: string | null
        titleFr?: string | null
        description?: string | null
        image?: unknown
      }>
    >(PRODUCT_CATEGORIES_QUERY),
  ])
  if (productsResult.status === "fulfilled") sanityProducts = productsResult.value
  if (categoriesResult.status === "fulfilled") {
    categoryConfigs = categoriesResult.value
      .filter((c) => Boolean(c.id))
      .slice(0, 12)
      .map((c, i) => ({
        id: c.id!,
        number: c.number ?? String(i + 1).padStart(2, "0"),
        title: c.title,
        titleZh: c.titleZh,
        titleFr: c.titleFr,
        description: c.description,
        image: c.image,
        icon: categoryIcons[i % categoryIcons.length],
      }))
  }
  if (categoryConfigs.length === 0 && sanityProducts.length > 0) {
    categoryConfigs = buildFallbackCategoriesFromProducts(sanityProducts)
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
              {t("ourCollections")}
            </p>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl text-balance leading-[1.08]">
              {t("premiumKnitwear")}
            </h1>
            <p className="mt-7 text-lg leading-relaxed text-muted-foreground max-w-2xl">
              {t("collectionsSubtitle")}
            </p>
          </div>

          {/* Anchor tabs */}
          <div className="mt-12 animate-fade-up-delay-2 flex flex-wrap gap-3">
            {categoryConfigs.map((cat) => (
              <a
                key={cat.id}
                href={`#${cat.id}`}
                className="group/tab inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-border/60 bg-card/80 backdrop-blur-sm text-sm font-medium text-foreground/80 hover:border-accent/50 hover:text-accent hover:shadow-md hover:shadow-accent/5 transition-all duration-300"
              >
                <cat.icon className="h-4 w-4 text-primary/60 group-hover/tab:text-accent transition-colors duration-300" strokeWidth={1.5} />
                {getCategoryDisplayTitle(cat, locale)}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Category Sections：每类展示前几个产品，主图与「更多」进入分类产品集 ── */}
      {productsByCategory.map(({ category, products }, i) => (
        <CategorySection
          key={category.id}
          category={category}
          products={products}
          locale={locale}
          reverse={i % 2 === 1}
          altBackground={i % 2 === 1}
          t={t}
          tNav={tNav}
          tCommon={tCommon}
        />
      ))}

      {/* ── Materials & Yarns ── */}
      <section className="py-24 lg:py-32 bg-secondary/50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-20">
            <p className="text-sm font-semibold text-accent tracking-[0.2em] uppercase mb-4">
              {t("materials")}
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl leading-[1.1]">
              {t("premiumMaterials")}
            </h2>
            <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
              {t("materialsSubtitle")}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
            {materialIds.map((id) => (
              <Card
                key={id}
                className="group bg-card rounded-2xl border-border/50 shadow-sm hover:shadow-xl hover:shadow-accent/6 hover:-translate-y-1 transition-all duration-500 ease-out overflow-hidden relative"
              >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[2px] w-0 group-hover:w-3/5 bg-gradient-to-r from-transparent via-accent to-transparent rounded-b-full transition-all duration-500" />
                <CardContent className="p-6 lg:p-7">
                  <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors duration-300">
                    {t(`materialsList.${id}`)}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {t(`materialsList.${id}Note`)}
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
                tag: t("oemTag"),
                title: t("oemTitle"),
                desc: t("oemDesc"),
                bullets: t.raw("oemBullets") as string[],
              },
              {
                tag: t("odmTag"),
                title: t("odmTitle"),
                desc: t("odmDesc"),
                bullets: t.raw("odmBullets") as string[],
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
            {t("ctaTitle")}
          </h2>
          <p className="mt-5 text-lg text-primary-foreground/70 leading-relaxed">
            {t("ctaSubtitle")}
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Button
              size="lg"
              variant="secondary"
              className="hover:bg-accent hover:text-accent-foreground hover:scale-[1.02] hover:shadow-lg transition-all duration-300 ease-out"
              asChild
            >
              <Link href="/contact">
                {t("getStartedToday")}
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
