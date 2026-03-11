import type { Metadata } from "next"
import Image from "next/image"
import { Link } from "@/i18n/routing"
import { SITE_URL } from "@/lib/seo"
import { getTranslations } from "next-intl/server"
import { ArrowRight, Building2, Cpu, Users, Package, BarChart3, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductionFloorGallery } from "@/components/production-floor-gallery"

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "factoryTour" })
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: { canonical: `${SITE_URL}/factory-tour` },
  }
}

const statKeys = ["statArea", "statMachines", "statWorkers", "statCapacity", "statOperation", "statExport"] as const
const factoryStatIcons = [Building2, Cpu, Users, Package, Clock, BarChart3]
const factoryStatValues = ["15,000 m²", "200+", "500+", "100K", "24/7", "$8.3M+"]

const facilityIds = ["productionFloor", "sampleCenter", "qualityLab", "finishingDept", "warehouseLogistics"] as const
const facilityImages = [
  "/images/seamless-machine-1.png",
  "/images/sorting-workshop.jpg",
  "/images/finishing-workshop.jpg",
  "/images/steaming-workshop-1.jpg",
  "/images/warehouse.jpg",
] as const

const digitalFeatureIds = ["productionTracking", "qualityDashboard", "inventoryManagement", "orderManagement"] as const

export default async function FactoryTourPage() {
  const t = await getTranslations("factoryTour")

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-28 pb-20 lg:pt-36 lg:pb-24 bg-gradient-to-br from-secondary via-background to-warm/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="animate-fade-up text-sm font-semibold text-accent tracking-wider uppercase mb-5">{t("heroTag")}</p>
            <h1 className="animate-fade-up-delay-1 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl text-balance leading-[1.1]">{t("heroTitle")}</h1>
            <p className="animate-fade-up-delay-2 mt-7 text-lg leading-relaxed text-muted-foreground">{t("heroP")}</p>
            <div className="animate-fade-up-delay-3 mt-10">
              <Button size="lg" className="bg-primary hover:bg-accent transition-all duration-300 hover:shadow-lg" asChild>
                <Link href="/contact">{t("scheduleTour")}<ArrowRight className="ml-2 h-5 w-5" /></Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Factory Stats */}
      <section className="py-16 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {statKeys.map((key, i) => {
              const Icon = factoryStatIcons[i]
              return (
                <div key={key} className="text-center group">
                  <div className="mx-auto h-12 w-12 rounded-full bg-primary-foreground/10 flex items-center justify-center mb-3 group-hover:bg-accent/20 transition-colors duration-300">
                    <Icon className="h-6 w-6" />
                  </div>
                  <p className="text-3xl font-bold">{factoryStatValues[i]}</p>
                  <p className="text-sm opacity-75">{t(key)}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Facility Areas */}
      <section className="py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <p className="text-sm font-semibold text-accent tracking-wider uppercase mb-4">{t("facilitiesTag")}</p>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">{t("facilitiesTitle")}</h2>
            <p className="mt-5 text-lg text-muted-foreground leading-relaxed">{t("facilitiesSub")}</p>
          </div>
          <div className="space-y-24">
            {facilityIds.map((facilityId, index) => (
              <div key={facilityId} className="grid lg:grid-cols-2 gap-16 items-center">
                <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                  {index === 0 ? (
                    <ProductionFloorGallery />
                  ) : (
                    <div className="relative">
                      <div className="aspect-[4/3] rounded-2xl overflow-hidden relative shadow-lg">
                        <Image
                          src={facilityImages[index] || "/placeholder.svg"}
                          alt={t(`facilities.${facilityId}.imageAlt`)}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-tr from-accent/5 to-transparent" />
                      </div>
                      <div className={`absolute -bottom-4 ${index % 2 === 0 ? '-right-4' : '-left-4'} h-24 w-24 bg-accent/8 rounded-2xl -z-10`} />
                    </div>
                  )}
                </div>
                <div className={index % 2 === 1 ? "lg:order-1" : ""}>
                  <h3 className="text-2xl font-bold tracking-tight text-foreground lg:text-3xl">{t(`facilities.${facilityId}.title`)}</h3>
                  <p className="mt-5 text-muted-foreground leading-relaxed">{t(`facilities.${facilityId}.description`)}</p>
                  <div className="mt-6 grid sm:grid-cols-2 gap-3">
                    {(t.raw(`facilities.${facilityId}.features`) as string[]).map((feature) => (
                      <div key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="h-2 w-2 rounded-full bg-accent" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Digital Management */}
      <section className="py-24 lg:py-32 bg-secondary">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-sm font-semibold text-accent tracking-wider uppercase mb-4">{t("digitalTag")}</p>
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl leading-tight">{t("digitalTitle")}</h2>
              <p className="mt-5 text-lg text-muted-foreground leading-relaxed">{t("digitalP")}</p>
              <div className="mt-8 grid sm:grid-cols-2 gap-6">
                {digitalFeatureIds.map((id) => (
                  <div key={id} className="p-4 rounded-xl bg-card border border-border/60">
                    <h3 className="font-bold text-foreground">{t(`digitalFeatures.${id}.title`)}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{t(`digitalFeatures.${id}.description`)}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden relative shadow-xl">
                <Image src="/images/factory-gate.jpg" alt={t("digitalImageAlt")} fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-tr from-accent/5 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 lg:py-32 bg-gradient-to-br from-secondary via-warm/30 to-secondary relative overflow-hidden">
        <div className="absolute top-1/2 left-0 w-64 h-64 bg-accent/8 rounded-full blur-3xl -translate-y-1/2" />
        <div className="relative mx-auto max-w-4xl px-6 lg:px-8 text-center">
          <p className="text-sm font-semibold text-accent tracking-wider uppercase mb-4">{t("visitTag")}</p>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">{t("visitTitle")}</h2>
          <p className="mt-5 text-lg text-muted-foreground leading-relaxed">{t("visitP")}</p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Button size="lg" className="bg-primary hover:bg-accent transition-all duration-300 hover:shadow-lg" asChild>
              <Link href="/contact">{t("scheduleTour")}<ArrowRight className="ml-2 h-5 w-5" /></Link>
            </Button>
            <Button size="lg" variant="outline" className="border-accent/30 hover:bg-accent/10 hover:border-accent/50 transition-all duration-300 bg-transparent" asChild>
              <Link href="/manufacturing">{t("viewCapabilities")}</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
