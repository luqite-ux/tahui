import type { Metadata } from "next"
import Image from "next/image"
import { Link } from "@/i18n/routing"
import { SITE_URL } from "@/lib/seo"
import { getTranslations } from "next-intl/server"
import { ArrowRight, Target, Heart, Handshake, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "About Us - 20+ Years of Knitwear Excellence",
  description: "Learn about Tahui Sweater Factory's 20+ year history in knitwear manufacturing. Shanghai-based, ISO certified, global export.",
  alternates: { canonical: `${SITE_URL}/about` },
}

export default async function AboutPage() {
  const t = await getTranslations("about")

  const statsI18n = [
    { value: "20+", labelKey: "statsYears" as const },
    { value: "500+", labelKey: "statsTeam" as const },
    { value: "50+", labelKey: "statsBrands" as const },
    { value: "30+", labelKey: "statsCountries" as const },
  ]

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-28 pb-20 lg:pt-36 lg:pb-24 bg-gradient-to-br from-secondary via-background to-warm/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="animate-fade-up text-sm font-semibold text-accent tracking-wider uppercase mb-5">{t("heroTag")}</p>
              <h1 className="animate-fade-up-delay-1 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl text-balance leading-[1.1]">{t("heroTitle")}</h1>
              <p className="animate-fade-up-delay-2 mt-7 text-lg leading-relaxed text-muted-foreground">{t("heroP1")}</p>
              <p className="animate-fade-up-delay-3 mt-4 text-lg leading-relaxed text-muted-foreground">{t("heroP2")}</p>
            </div>
            <div className="animate-slide-in-right relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden relative shadow-2xl shadow-primary/10">
                <Image src="/images/factory-gate.jpg" alt="Shanghai Tahui Knitting Factory entrance" fill className="object-cover" priority />
                <div className="absolute inset-0 bg-gradient-to-tr from-accent/5 to-transparent" />
              </div>
              <div className="absolute -bottom-4 -right-4 h-24 w-24 bg-accent/8 rounded-2xl -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {statsI18n.map((stat) => (
              <div key={stat.labelKey} className="text-center">
                <p className="text-5xl font-bold tracking-tight">{stat.value}</p>
                <p className="mt-2 text-sm opacity-75">{t(stat.labelKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story Timeline */}
      <section className="py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <p className="text-sm font-semibold text-accent tracking-wider uppercase mb-4">{t("historyTag")}</p>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">{t("journeyTitle")}</h2>
            <p className="mt-5 text-lg text-muted-foreground leading-relaxed">{t("journeySub")}</p>
          </div>
          <div className="relative">
            <div className="absolute left-4 lg:left-1/2 top-0 bottom-0 w-0.5 bg-border lg:-translate-x-0.5" />
            <div className="space-y-12">
              {(["2003", "2008", "2012", "2016", "2020", "2024"] as const).map((year, index) => (
                <div key={year} className={`relative flex items-start gap-8 ${index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"}`}>
                  <div className={`hidden lg:block flex-1 ${index % 2 === 0 ? "text-right" : "text-left"}`}>
                    <div className="inline-block">
                      <p className="text-3xl font-bold text-accent">{year}</p>
                      <h3 className="mt-1 text-xl font-bold text-foreground">{t(`timeline${year}Title`)}</h3>
                      <p className="mt-2 text-muted-foreground max-w-md">{t(`timeline${year}Desc`)}</p>
                    </div>
                  </div>
                  <div className="absolute left-4 lg:left-1/2 h-4 w-4 rounded-full bg-accent border-4 border-background -translate-x-1/2 mt-1" />
                  <div className="flex-1 pl-12 lg:pl-0">
                    <div className="lg:hidden">
                      <p className="text-3xl font-bold text-accent">{year}</p>
                      <h3 className="mt-1 text-xl font-bold text-foreground">{t(`timeline${year}Title`)}</h3>
                      <p className="mt-2 text-muted-foreground">{t(`timeline${year}Desc`)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24 lg:py-32 bg-secondary">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            <div className="p-8 lg:p-10 rounded-2xl bg-card border border-border/60">
              <p className="text-sm font-semibold text-accent tracking-wider uppercase mb-4">{t("missionTag")}</p>
              <h2 className="text-2xl font-bold tracking-tight text-foreground lg:text-3xl">{t("missionTitle")}</h2>
              <p className="mt-5 text-muted-foreground leading-relaxed">{t("missionP")}</p>
            </div>
            <div className="p-8 lg:p-10 rounded-2xl bg-card border border-border/60">
              <p className="text-sm font-semibold text-accent tracking-wider uppercase mb-4">{t("visionTag")}</p>
              <h2 className="text-2xl font-bold tracking-tight text-foreground lg:text-3xl">{t("visionTitle")}</h2>
              <p className="mt-5 text-muted-foreground leading-relaxed">{t("visionP")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <p className="text-sm font-semibold text-accent tracking-wider uppercase mb-4">{t("principlesTag")}</p>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">{t("valuesTitle")}</h2>
            <p className="mt-5 text-lg text-muted-foreground leading-relaxed">{t("valuesSub")}</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {([Target, Handshake, TrendingUp, Heart] as const).map((Icon, i) => (
              <div key={i} className="group text-center p-6 rounded-xl bg-card border border-border/60 hover:border-accent/30 hover:shadow-lg hover:-translate-y-1 transition-all duration-500">
                <div className="mx-auto h-14 w-14 rounded-xl bg-accent/10 flex items-center justify-center mb-5 group-hover:bg-accent/20 transition-colors duration-300">
                  <Icon className="h-7 w-7 text-accent" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-3">{t(`value${i + 1}Title`)}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{t(`value${i + 1}Desc`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 lg:py-32 bg-secondary">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden relative shadow-xl">
                <Image src="/images/linking-workshop.jpg" alt="Tahui Sweater Factory production team" fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-tr from-accent/5 to-transparent" />
              </div>
              <div className="absolute -bottom-4 -left-4 h-24 w-24 bg-accent/8 rounded-2xl -z-10" />
            </div>
            <div>
              <p className="text-sm font-semibold text-accent tracking-wider uppercase mb-4">{t("teamTag")}</p>
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl leading-tight">{t("teamTitle")}</h2>
              <p className="mt-5 text-lg text-muted-foreground leading-relaxed">{t("teamP1")}</p>
              <p className="mt-4 text-muted-foreground leading-relaxed">{t("teamP2")}</p>
              <div className="mt-10">
                <Button className="bg-primary hover:bg-accent transition-all duration-300" asChild>
                  <Link href="/factory-tour">{t("meetTeam")}<ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partnership Section */}
      <section className="py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-sm font-semibold text-accent tracking-wider uppercase mb-4">{t("partnershipTag")}</p>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">{t("partnershipTitle")}</h2>
            <p className="mt-5 text-lg text-muted-foreground leading-relaxed">{t("partnershipP")}</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 lg:py-32 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
        <div className="relative mx-auto max-w-4xl px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">{t("ctaTitle")}</h2>
          <p className="mt-5 text-lg text-primary-foreground/75 leading-relaxed">{t("ctaP")}</p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Button size="lg" variant="secondary" className="hover:bg-accent hover:text-accent-foreground transition-all duration-300" asChild>
              <Link href="/contact">{t("getInTouch")}<ArrowRight className="ml-2 h-5 w-5" /></Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:border-accent/50 transition-all duration-300" asChild>
              <Link href="/products">{t("viewProducts")}</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
