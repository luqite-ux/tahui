import Image from "next/image"
import { ArrowRight, CheckCircle, Factory, Award, Globe, Layers, Settings, Shield, Calendar, TrendingUp, Gauge, Cpu } from "lucide-react"
import { getTranslations } from "next-intl/server"
import { Link } from "@/i18n/routing"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { HeroCarousel } from "@/components/hero-carousel"
import { client } from "@/sanity/lib/client"
import { urlFor } from "@/sanity/lib/image"
import { PRODUCT_CATEGORIES_QUERY } from "@/sanity/lib/queries"
import { CategorySection } from "@/components/CategorySection"
import { getUnifiedCategories } from "@/lib/unified-content"

export const revalidate = 60

const statsKeys = [
  { value: "20+", key: "yearsExperience", icon: Calendar },
  { value: "8.3M+", key: "annualExport", icon: TrendingUp },
  { value: "100K", key: "monthlyCapacity", icon: Gauge },
  { value: "200+", key: "knittingMachines", icon: Cpu },
] as const

const advantageKeys = ["wholegarment", "oemOdm", "globalExport", "isoCertified"] as const
const certKeys = [
  { nameKey: "iso9001", descKey: "qualityMgmt" },
  { nameKey: "iso14001", descKey: "envMgmt" },
  { nameKey: "iso45001", descKey: "ohsMgmt" },
] as const

const HERO_FALLBACK = [
  { src: "/images/hero-model.png", altKey: "heroFallbackAlt1" as const },
  { src: "/images/hero-model-2.png", altKey: "heroFallbackAlt2" as const },
  { src: "/images/hero-model-3.png", altKey: "heroFallbackAlt3" as const },
  { src: "/images/hero-model-4.png", altKey: "heroFallbackAlt4" as const },
]

const advantageIcons = [Layers, Settings, Globe, Shield]

type Props = { params: Promise<{ locale: string }> }

export default async function HomePage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "home" })
  const tProducts = await getTranslations({ locale, namespace: "products" })
  const tCommon = await getTranslations({ locale, namespace: "common" })

  let heroSlides: { src: string; alt: string }[] = HERO_FALLBACK.map((s) => ({ src: s.src, alt: t(s.altKey) }))
  try {
    const homepage = await client.fetch<{
      heroSlides?: Array<{ image?: unknown; alt?: string | null } | null>
    } | null>(`*[_type == "homepage"][0]{ heroSlides[] { image, alt } }`)
    if (homepage?.heroSlides?.length) {
      heroSlides = homepage.heroSlides
        .filter((s): s is { image: unknown; alt?: string | null } => s != null && s.image != null)
        .map((s) => ({
          src: urlFor(s.image as any).width(1200).url(),
          alt: s.alt ?? "",
        }))
    }
  } catch {
    /* fallback */
  }

  let productCategories: Array<{
    _id: string
    id?: string | null
    number?: string | null
    order?: number | null
    title: string
    titleZh?: string | null
    titleFr?: string | null
    image?: unknown
  }> = []
  const unifiedCategories = await getUnifiedCategories()
  if (unifiedCategories !== null) productCategories = unifiedCategories
  else try {
    productCategories = await client.fetch(PRODUCT_CATEGORIES_QUERY)
  } catch {
    /* empty */
  }

  return (
    <div className="min-h-screen">
      <Header />

      <section className="relative pt-24 pb-16 lg:pt-28 lg:pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-secondary via-secondary to-warm/40" />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid lg:grid-cols-[44%_56%] gap-8 lg:gap-0 items-center">
            <div className="relative z-10 flex flex-col justify-center">
              <div className="absolute -left-6 lg:-left-8 top-0 w-[3px] h-24 bg-gradient-to-b from-accent via-accent/60 to-transparent rounded-full animate-fade-up" />
              <p className="animate-fade-up text-xs font-semibold text-accent tracking-[0.2em] uppercase mb-4 flex items-center gap-2">
                <span className="inline-block w-5 h-px bg-accent" />
                {t("heroTag")}
              </p>
              <h1 className="animate-fade-up-delay-1 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-[3.25rem] text-balance leading-[1.08]">
                {t("heroTitleBefore")}
                <span className="text-primary relative">
                  {t("heroHighlight")}
                  <span className="absolute -bottom-0.5 left-0 w-full h-[2px] bg-accent/30 rounded-full" />
                </span>
                {t("heroTitleAfter")}
              </h1>
              <p className="animate-fade-up-delay-2 mt-5 text-base leading-relaxed text-muted-foreground max-w-md">
                {t("heroSubtitle")}
              </p>
              <div className="animate-fade-up-delay-3 mt-8 flex flex-wrap gap-3">
                <Button size="default" className="bg-primary text-primary-foreground hover:bg-primary/85 hover:shadow-xl hover:shadow-primary/15 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 ease-out" asChild>
                  <Link href="/contact">
                    {t("getQuote")}
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </Link>
                </Button>
                <Button size="default" variant="outline" className="border-border text-foreground/80 bg-transparent hover:bg-warm hover:border-accent/40 hover:text-foreground transition-all duration-300 ease-out" asChild>
                  <Link href="/factory-tour">{t("exploreFactory")}</Link>
                </Button>
              </div>
            </div>
            <div className="relative lg:-ml-12 animate-slide-in-right">
              <div className="animate-float-slow relative min-h-[520px] sm:min-h-[600px] lg:min-h-[640px]">
                <HeroCarousel slides={heroSlides} />
              </div>
              <div className="absolute bottom-8 right-6 lg:bottom-10 lg:right-8 bg-card/90 backdrop-blur-md rounded-2xl px-4 py-3 shadow-lg shadow-foreground/[0.04] z-10">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-xl bg-accent/10 flex items-center justify-center">
                    <Factory className="h-4 w-4 text-accent/70" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground/80 text-xs leading-tight">{t("capacityLabel")}</p>
                    <p className="text-[10px] text-muted-foreground/70">{t("capacitySub")}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="animate-fade-up-delay-3 mt-16 lg:mt-20 pt-10 border-t border-border/50">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 lg:gap-10">
              {statsKeys.map((stat) => (
                <div key={stat.key} className="group flex items-start gap-4 p-4 rounded-xl hover:bg-warm/60 transition-all duration-300 cursor-default">
                  <div className="h-10 w-10 rounded-lg bg-primary/[0.07] group-hover:bg-accent/15 flex items-center justify-center shrink-0 transition-colors duration-300">
                    <stat.icon className="h-5 w-5 text-primary/70 group-hover:text-accent transition-colors duration-300" />
                  </div>
                  <div>
                    <p className="text-3xl lg:text-4xl font-bold text-primary tracking-tight group-hover:text-accent transition-colors duration-300">{stat.value}</p>
                    <p className="mt-0.5 text-sm text-muted-foreground">{t(`stats.${stat.key}`)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <p className="text-sm font-semibold text-accent tracking-wider uppercase mb-4">{t("collectionsTag")}</p>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">{t("collectionsTitle")}</h2>
            <p className="mt-5 text-lg text-muted-foreground leading-relaxed">{t("collectionsSubtitle")}</p>
          </div>
          <CategorySection locale={locale} categories={productCategories} />
          <div className="mt-14 text-center">
            <Button variant="outline" className="border-accent/30 hover:bg-accent/10 hover:border-accent/50 transition-all duration-300 bg-transparent" asChild>
              <Link href="/products">
                {t("viewAllProducts")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-24 lg:py-32 bg-secondary">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <p className="text-sm font-semibold text-accent tracking-wider uppercase mb-4">{t("strengthsTag")}</p>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">{t("strengthsTitle")}</h2>
            <p className="mt-5 text-lg text-muted-foreground leading-relaxed">{t("strengthsSubtitle")}</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {advantageKeys.map((key, i) => {
              const Icon = advantageIcons[i]
              return (
                <div key={key} className="group relative text-center p-7 rounded-2xl bg-card border border-border/50 shadow-sm hover:shadow-xl hover:shadow-accent/8 hover:-translate-y-2 transition-all duration-500 ease-out overflow-hidden">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[3px] w-0 group-hover:w-3/5 bg-gradient-to-r from-transparent via-accent to-transparent rounded-b-full transition-all duration-500" />
                  <div className="mx-auto h-14 w-14 rounded-xl bg-primary/[0.06] flex items-center justify-center mb-5 group-hover:bg-accent/15 group-hover:scale-110 transition-all duration-400">
                    <Icon className="h-6 w-6 text-primary/70 group-hover:text-accent transition-colors duration-300" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">{t(`advantages.${key}.title`)}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{t(`advantages.${key}.description`)}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <p className="text-sm font-semibold text-accent tracking-wider uppercase mb-4">{t("manufacturingTag")}</p>
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl leading-tight">{t("manufacturingTitle")}</h2>
              <p className="mt-5 text-lg text-muted-foreground leading-relaxed">{t("manufacturingSubtitle")}</p>
              <ul className="mt-8 space-y-4">
                {[0, 1, 2, 3, 4].map((i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                    <span className="text-muted-foreground leading-relaxed">{t(`manufacturingBullets.${i}`)}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-10">
                <Button className="bg-primary hover:bg-primary/90 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20" asChild>
                  <Link href="/manufacturing">
                    {tCommon("learnMore")}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="relative">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden relative shadow-xl">
                  <Image src="/images/seamless-machine-1.png" alt={t("manufacturingImageAlt")} fill className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-tr from-accent/5 to-transparent" />
                </div>
                <div className="absolute -bottom-6 -right-6 h-32 w-32 bg-accent/8 rounded-2xl -z-10" />
                <div className="absolute -top-4 -left-4 h-20 w-20 bg-primary/5 rounded-full -z-10" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 lg:py-32 bg-primary relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent/[0.07] rounded-full blur-[80px] translate-y-1/3 -translate-x-1/4" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p className="text-sm font-semibold tracking-[0.2em] uppercase mb-4 flex items-center justify-center gap-3">
              <span className="inline-block w-8 h-px bg-accent/60" />
              <span className="text-accent">{t("certSection.trustCompliance")}</span>
              <span className="inline-block w-8 h-px bg-accent/60" />
            </p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              <span className="text-primary-foreground">{t("certSection.certifiedQuality")}</span>
              <span className="text-accent"> & </span>
              <span className="text-primary-foreground">{t("certSection.compliance")}</span>
            </h2>
            <p className="mt-5 text-lg text-primary-foreground/70 leading-relaxed">{t("certSection.paragraph")}</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-6 lg:gap-8">
            {certKeys.map((cert) => (
              <div key={cert.nameKey} className="group relative text-center p-8 lg:p-10 rounded-2xl bg-primary-foreground/[0.04] border border-primary-foreground/[0.08] hover:bg-primary-foreground/[0.08] hover:border-accent/30 transition-all duration-500 ease-out hover:-translate-y-2 overflow-hidden">
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] w-0 group-hover:w-4/5 bg-gradient-to-r from-transparent via-accent to-transparent rounded-t-full transition-all duration-500" />
                <div className="mx-auto h-16 w-16 rounded-2xl bg-accent/15 flex items-center justify-center mb-6 group-hover:bg-accent/25 group-hover:scale-110 transition-all duration-400">
                  <Award className="h-7 w-7 text-accent" strokeWidth={1.5} />
                </div>
                <h3 className="text-2xl font-bold text-primary-foreground group-hover:text-accent transition-colors duration-300">{t(`certifications.${cert.nameKey}`)}</h3>
                <p className="mt-2 text-primary-foreground/60 group-hover:text-primary-foreground/80 transition-colors duration-300">{t(`certifications.${cert.descKey}`)}</p>
              </div>
            ))}
          </div>
          <div className="mt-14 text-center">
            <Button variant="secondary" className="hover:bg-accent hover:text-accent-foreground hover:scale-[1.02] hover:shadow-lg transition-all duration-300 ease-out" asChild>
              <Link href="/quality">{t("certSection.viewCertifications")}</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-24 lg:py-32 bg-secondary">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <p className="text-sm font-semibold text-accent tracking-wider uppercase mb-4">{t("factory.behindScenes")}</p>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">{t("factory.insideFactory")}</h2>
            <p className="mt-5 text-lg text-muted-foreground leading-relaxed">{t("factory.subtitle")}</p>
          </div>
          <div className="flex flex-col gap-8 lg:gap-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 lg:gap-10">
              {[
                { src: "/images/factory-linking.jpg", altKey: "factory.linkingWorkshop", titleKey: "factory.linkingWorkshop", stepKey: "factory.step1", descKey: "factory.linkingDesc" },
                { src: "/images/factory-finishing.jpg", altKey: "factory.handFinishing", titleKey: "factory.handFinishing", stepKey: "factory.step2", descKey: "factory.handFinishingDesc" },
              ].map((item) => (
                <div key={item.src} className="group">
                  <Card className="overflow-hidden rounded-2xl border-border/50 bg-card shadow-sm hover:shadow-2xl hover:shadow-accent/8 hover:-translate-y-2 transition-all duration-500 ease-out relative">
                    <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-accent via-accent/40 to-transparent rounded-l-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="aspect-[4/3] bg-warm/50 relative overflow-hidden">
                      <Image src={item.src} alt={t(item.altKey)} fill className="object-cover saturate-[0.88] group-hover:saturate-100 group-hover:scale-105 transition-all duration-700 ease-out" />
                      <div className="absolute inset-0 bg-gradient-to-t from-foreground/15 via-transparent to-accent/[0.03]" />
                    </div>
                    <CardContent className="p-6 lg:p-7">
                      <p className="text-[11px] font-semibold text-accent tracking-wider uppercase mb-2">{t(item.stepKey)}</p>
                      <h3 className="text-lg font-bold text-foreground group-hover:text-accent transition-colors duration-300">{t(item.titleKey)}</h3>
                      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{t(item.descKey)}</p>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 lg:gap-10">
              {[
                { src: "/images/factory-sorting.jpg", altKey: "factory.qualitySorting", titleKey: "factory.qualitySorting", stepKey: "factory.step3", descKey: "factory.qualitySortingDesc" },
                { src: "/images/factory-pressing.jpg", altKey: "factory.steamPressing", titleKey: "factory.steamPressing", stepKey: "factory.step4", descKey: "factory.steamPressingDesc" },
                { src: "/images/factory-packaging.jpg", altKey: "factory.packaging", titleKey: "factory.packaging", stepKey: "factory.step5", descKey: "factory.packagingDesc" },
              ].map((item) => (
                <div key={item.src} className="group">
                  <Card className="overflow-hidden rounded-2xl border-border/50 bg-card shadow-sm hover:shadow-2xl hover:shadow-accent/8 hover:-translate-y-2 transition-all duration-500 ease-out relative">
                    <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-accent via-accent/40 to-transparent rounded-l-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="aspect-[4/3] bg-warm/50 relative overflow-hidden">
                      <Image src={item.src} alt={t(item.altKey)} fill className="object-cover saturate-[0.88] group-hover:saturate-100 group-hover:scale-105 transition-all duration-700 ease-out" />
                      <div className="absolute inset-0 bg-gradient-to-t from-foreground/15 via-transparent to-accent/[0.03]" />
                    </div>
                    <CardContent className="p-6 lg:p-7">
                      <p className="text-[11px] font-semibold text-accent tracking-wider uppercase mb-2">{t(item.stepKey)}</p>
                      <h3 className="text-lg font-bold text-foreground group-hover:text-accent transition-colors duration-300">{t(item.titleKey)}</h3>
                      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{t(item.descKey)}</p>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-14 text-center">
            <Button variant="outline" className="border-accent/30 hover:bg-accent/10 hover:border-accent/50 transition-all duration-300 bg-transparent" asChild>
              <Link href="/factory-tour">{t("factory.virtualTour")}</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-24 lg:py-32 bg-gradient-to-br from-secondary via-warm/30 to-secondary relative overflow-hidden">
        <div className="absolute top-1/2 left-0 w-64 h-64 bg-accent/8 rounded-full blur-3xl -translate-y-1/2" />
        <div className="absolute top-1/2 right-0 w-48 h-48 bg-primary/5 rounded-full blur-2xl -translate-y-1/2" />
        <div className="relative mx-auto max-w-4xl px-6 lg:px-8 text-center">
          <p className="text-sm font-semibold text-accent tracking-wider uppercase mb-4">{t("cta.startToday")}</p>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">{tProducts("ctaTitle")}</h2>
          <p className="mt-5 text-lg text-muted-foreground leading-relaxed">{tProducts("ctaSubtitle")}</p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Button size="lg" className="bg-primary hover:bg-primary/90 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20" asChild>
              <Link href="/contact">
                {tProducts("getStartedToday")}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-accent/30 hover:bg-accent/10 hover:border-accent/50 transition-all duration-300 bg-transparent" asChild>
              <Link href="mailto:info@tahui-factory.cn">{t("cta.emailUsDirectly")}</Link>
            </Button>
          </div>
          <p className="mt-8 text-sm text-muted-foreground">{t("cta.whatsappText")}</p>
        </div>
      </section>

      <Footer />
    </div>
  )
}
