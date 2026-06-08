import type { Metadata } from "next"
import Image from "next/image"
import { Link } from "@/i18n/routing"
import { SITE_URL, canonicalPath } from "@/lib/seo"
import { getTranslations } from "next-intl/server"
import { ArrowRight, Award, Shield, Leaf, Users, CheckCircle } from "lucide-react"
import { client } from "@/sanity/lib/client"
import { HonorCard } from "@/components/honor-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

type Props = { params: Promise<{ locale: string }> }

export const revalidate = 60

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "quality" })
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: { canonical: `${SITE_URL}${canonicalPath("/quality", locale)}` },
  }
}

const certifications = [
  { id: "iso9001", icon: Award, name: "ISO 9001:2015" },
  { id: "iso14001", icon: Leaf, name: "ISO 14001:2015" },
  { id: "iso45001", icon: Users, name: "ISO 45001:2018" },
] as const

const qualityProcessSteps = ["01", "02", "03", "04", "05", "06"] as const
const qualityCommitmentIds = ["zeroTolerance", "traceability", "training", "clientStandards"] as const

const HONORS_QUERY = `*[_type == "honor"] | order(order asc, title asc) {
  _id,
  title,
  titleEn,
  description,
  category,
  orientation,
  image,
  "imageAlt": image.alt,
  "fileName": image.asset->originalFilename,
  "pdfUrl": pdfFile.asset->url
}`

/** 常见中文证书名称 → 英文展示（Sanity 未填 titleEn 时使用） */
const HONOR_TITLE_ZH_TO_EN: Record<string, string> = {
  '质量管理体系': 'Quality Management System',
  '质量体系': 'Quality Management System',
  '环境管理体系': 'Environmental Management System (ISO 14001)',
  '环境体系': 'Environmental Management System',
  '职业健康安全体系': 'Occupational Health & Safety (ISO 45001)',
  '职业健康体系': 'Occupational Health & Safety System',
  '上海名牌': 'Shanghai Famous Brand',
  '专精特新证书': 'Specialized SME Certificate',
  '新著名商标': 'Well-Known Trademark',
  '海关信用认定书': 'Customs Credit Certification',
  '高新技术企业认定': 'High-Tech Enterprise Certification',
  '专利证书合集': 'Patent Certificates Collection',
  '绿色低碳企业信用评价示范企业': 'Green Low-Carbon Enterprise Credit Evaluation Model Enterprise',
  '绿色低碳信用评价示范企业': 'Green Low-Carbon Enterprise Credit Evaluation Model Enterprise',
  '绿色信用评价AAA企业': 'AAA Green Low-Carbon Enterprise Credit Rating',
  '绿色低碳信用评价AAA级企业': 'AAA Green Low-Carbon Enterprise Credit Rating',
  '上海加星': 'Shanghai Star Enterprise',
  'BSCI 2025 认证': 'BSCI 2025 Certificate',
  'BSCI 2025 现场报告': 'BSCI 2025 Photo Report',
}

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

function isLikelyUuid(s: string): boolean {
  return UUID_REGEX.test((s ?? '').trim())
}

function honorDisplayTitle(honor: {
  title?: string | null
  titleEn?: string | null
  imageAlt?: string | null
  fileName?: string | null
}): string {
  const zh = (honor.title ?? '').trim()
  const en = (honor.titleEn ?? '').trim()
  const alt = (honor.imageAlt ?? '').trim()
  const fn = (honor.fileName ?? '').trim()
  if (isLikelyUuid(zh)) {
    if (fn.includes('5ac830a7')) return 'Green Low-Carbon Enterprise Credit Evaluation Model Enterprise'
    if (fn.includes('9996e34e') || fn.includes('e33edd11')) return 'AAA Green Low-Carbon Enterprise Credit Rating'
    if (alt && !isLikelyUuid(alt) && alt.length > 2)
      return HONOR_TITLE_ZH_TO_EN[alt] ?? alt
    if (en && !isLikelyUuid(en)) return HONOR_TITLE_ZH_TO_EN[en] ?? en
  }
  if (en && en !== zh && !isLikelyUuid(en)) return HONOR_TITLE_ZH_TO_EN[zh] ?? en
  return HONOR_TITLE_ZH_TO_EN[zh] ?? (zh && !isLikelyUuid(zh) ? zh : null) ?? en ?? (alt || 'Certificate')
}

const CATEGORY_ORDER = ['iso', 'bsci', 'patent', 'honor', 'green', 'other'] as const

/** 判定是否为 ISO 相关证书（按名称关键字） */
const ISO_KEYWORDS = [
  'iso', '9001', '14001', '45001',
  '质量', '环境', '职业健康', '质量管理', '环境管理', '职业健康安全',
  'quality management', 'environmental', 'occupational',
]

const GREEN_KEYWORDS = [
  '绿色', '低碳', '碳中和', '承诺示范',
  'green', 'low-carbon', 'low carbon', 'carbon neutral',
  'credit rating', '信用评价',
]

function isIsoRelated(h: { title?: string | null; titleEn?: string | null }): boolean {
  const t = `${(h.title ?? '').toLowerCase()} ${(h.titleEn ?? '').toLowerCase()}`
  return ISO_KEYWORDS.some((k) => t.includes(k.toLowerCase()))
}

function isGreenRelated(h: {
  title?: string | null
  titleEn?: string | null
  imageAlt?: string | null
  fileName?: string | null
}): boolean {
  const t = `${h.title ?? ''} ${h.titleEn ?? ''} ${h.imageAlt ?? ''} ${h.fileName ?? ''}`.toLowerCase()
  return (
    GREEN_KEYWORDS.some((k) => t.includes(k.toLowerCase())) ||
    /5ac830a7|9996e34e|e33edd11/.test(t)
  )
}

/** 按展示名去重；显示名为兜底值或过短时按 _id 去重，避免误合并 */
function dedupeHonors(
  honors: Array<{
    _id: string
    title?: string | null
    titleEn?: string | null
    imageAlt?: string | null
    fileName?: string | null
  }>,
  _category?: string
): typeof honors {
  const seen = new Set<string>()
  return honors.filter((h) => {
    let key = honorDisplayTitle(h).toLowerCase().replace(/\s+/g, '-')
    if (key === 'certificate' || key.length < 3) key = h._id
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

function groupHonorsByCategory(
  honors: Array<{
    category?: string | null
    title?: string | null
    titleEn?: string | null
    imageAlt?: string | null
    fileName?: string | null
    _id: string
  }>
): Map<string, typeof honors> {
  const map = new Map<string, typeof honors>()
  for (const c of CATEGORY_ORDER) map.set(c, [])
  for (const h of honors) {
    // Sanity 后台显式设置的 category 优先级最高；未设置时再走关键字推断兜底
    let cat: string
    if (h.category && CATEGORY_ORDER.includes(h.category as (typeof CATEGORY_ORDER)[number])) {
      cat = h.category
    } else if (isIsoRelated(h)) {
      cat = 'iso'
    } else if (isGreenRelated(h)) {
      cat = 'green'
    } else {
      cat = 'other'
    }
    map.get(cat)?.push(h)
  }
  for (const [k, arr] of map) map.set(k, dedupeHonors(arr, k))
  return map
}

export default async function QualityPage() {
  let honors: Array<{
    _id: string
    title: string
    titleEn: string
    description?: string | null
    category?: string | null
    orientation?: string | null
    image?: { asset?: { _ref?: string }; alt?: string | null } | null
    imageAlt?: string | null
    fileName?: string | null
    pdfUrl?: string | null
  }> = []
  try {
    honors = await client.fetch(HONORS_QUERY)
  } catch {
    // 无 Sanity 或未配置时忽略
  }

  const t = await getTranslations("quality")
  const tCommon = await getTranslations("common")

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
              <p className="animate-fade-up-delay-2 mt-7 text-lg leading-relaxed text-muted-foreground">{t("heroP")}</p>
              <div className="animate-fade-up-delay-3 mt-8 flex flex-wrap gap-3">
                {[{ icon: Shield, label: "ISO 9001" }, { icon: Leaf, label: "ISO 14001" }, { icon: Users, label: "ISO 45001" }].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full border border-accent/20">
                    <Icon className="h-4 w-4 text-accent" />
                    <span className="text-sm font-semibold text-accent">{label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="animate-slide-in-right relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden relative shadow-2xl shadow-primary/10">
                <Image src="/images/quality-hero.jpg" alt={t("heroImageAlt")} fill className="object-cover" priority />
                <div className="absolute inset-0 bg-gradient-to-tr from-accent/5 to-transparent" />
              </div>
              <div className="absolute -bottom-4 -right-4 h-24 w-24 bg-accent/8 rounded-2xl -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* Certifications Detail */}
      <section className="py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <p className="text-sm font-semibold text-accent tracking-wider uppercase mb-4">{t("certificationsTag")}</p>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">{t("certificationsTitle")}</h2>
            <p className="mt-5 text-lg text-muted-foreground leading-relaxed">{t("certificationsSub")}</p>
          </div>
          <div className="space-y-12">
            {certifications.map((cert, index) => (
              <Card key={cert.id} className="overflow-hidden border-border/60 hover:border-accent/30 hover:shadow-lg transition-all duration-500">
                <CardContent className="p-0">
                  <div className="grid lg:grid-cols-2">
                    <div className={`p-8 lg:p-12 ${index % 2 === 1 ? "lg:order-2" : ""}`}>
                      <div className="flex items-center gap-4 mb-5">
                        <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center">
                          <cert.icon className="h-6 w-6 text-accent" />
                        </div>
                        <div>
                          <p className="font-bold text-accent">{cert.name}</p>
                          <p className="text-sm text-muted-foreground">{t(`certificationsDetail.${cert.id}.title`)}</p>
                        </div>
                      </div>
                      <p className="text-muted-foreground leading-relaxed">{t(`certificationsDetail.${cert.id}.description`)}</p>
                      <div className="mt-6 grid sm:grid-cols-2 gap-3">
                        {(t.raw(`certificationsDetail.${cert.id}.benefits`) as string[]).map((benefit) => (
                          <div key={benefit} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-accent shrink-0" />
                            <span className="text-muted-foreground">{benefit}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className={`bg-muted aspect-[4/3] lg:aspect-auto relative ${index % 2 === 1 ? "lg:order-1" : ""}`}>
                      <Image src={`/images/cert-${index + 1}.jpg`} alt={t(`certificationsDetail.${cert.id}.imageAlt`)} fill className="object-cover" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Honors & Qualifications Gallery - 按分类展示 */}
      {honors.length > 0 && (
        <section className="py-24 lg:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <p className="text-sm font-semibold text-accent tracking-wider uppercase mb-4">{t("honorsTag")}</p>
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">{t("honorsTitle")}</h2>
              <p className="mt-5 text-lg text-muted-foreground leading-relaxed">{t("honorsSub")}</p>
            </div>

            {(() => {
              const byCategory = groupHonorsByCategory(honors)
              return CATEGORY_ORDER.map((catKey) => {
                const items = byCategory.get(catKey) ?? []
              if (items.length === 0) return null
              return (
                <div key={catKey} className="mb-20 last:mb-0">
                  <div className="mb-10">
                    <h3 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">{t(`honorCategories.${catKey}.label`)}</h3>
                    <p className="mt-3 text-muted-foreground leading-relaxed max-w-3xl">{t(`honorCategories.${catKey}.description`)}</p>
                  </div>
                  <div
                    className={`grid gap-8 ${
                      catKey === 'green' || catKey === 'other'
                        ? 'sm:grid-cols-2 lg:grid-cols-3'
                        : 'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                    }`}
                  >
                    {items.map((honor) => (
                      <HonorCard
                        key={honor._id}
                        _id={honor._id}
                        displayTitle={honorDisplayTitle({
                          ...honor,
                          imageAlt: honor.imageAlt ?? honor.image?.alt,
                        })}
                        description={honor.description}
                        image={honor.image}
                        pdfUrl={honor.pdfUrl}
                        orientation={
                          honor.orientation ??
                          (catKey === 'green' ? 'landscape' : catKey === 'other' ? 'tall' : undefined)
                        }
                      />
                    ))}
                  </div>
                </div>
              )
            })
            })()}
          </div>
        </section>
      )}

      {/* Quality Process */}
      <section className="py-24 lg:py-32 bg-secondary">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <p className="text-sm font-semibold text-accent tracking-wider uppercase mb-4">{t("processTag")}</p>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">{t("processTitle")}</h2>
            <p className="mt-5 text-lg text-muted-foreground leading-relaxed">{t("processSub")}</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {qualityProcessSteps.map((step) => (
              <div key={step} className="group bg-card rounded-xl p-6 border border-border/60 hover:border-accent/30 hover:shadow-lg hover:-translate-y-1 transition-all duration-500">
                <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center mb-4 group-hover:bg-accent transition-colors duration-300">
                  <span className="text-sm font-bold text-primary-foreground">{step}</span>
                </div>
                <h3 className="font-bold text-lg text-foreground mb-2">{t(`processSteps.${step}.title`)}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{t(`processSteps.${step}.description`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quality Commitments */}
      <section className="py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-sm font-semibold text-accent tracking-wider uppercase mb-4">{t("commitmentsTag")}</p>
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl leading-tight">{t("commitmentsTitle")}</h2>
              <p className="mt-5 text-lg text-muted-foreground leading-relaxed">{t("commitmentsP")}</p>
              <div className="mt-8 space-y-6">
                {qualityCommitmentIds.map((id) => (
                  <div key={id} className="p-5 rounded-xl bg-card border border-border/60 hover:border-accent/30 transition-all duration-300">
                    <h3 className="font-bold text-foreground">{t(`commitments.${id}.title`)}</h3>
                    <p className="mt-1 text-muted-foreground text-sm leading-relaxed">{t(`commitments.${id}.description`)}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-2xl overflow-hidden relative shadow-xl">
                <Image src="/images/quality-commitment.jpg" alt={t("commitmentsImageAlt")} fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-tr from-accent/5 to-transparent" />
              </div>
              <div className="absolute -top-4 -left-4 h-20 w-20 bg-primary/5 rounded-full -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 lg:py-32 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
        <div className="relative mx-auto max-w-4xl px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">{t("ctaTitle")}</h2>
          <p className="mt-5 text-lg text-primary-foreground/75 leading-relaxed">{t("ctaP")}</p>
          <div className="mt-10">
            <Button size="lg" variant="secondary" className="hover:bg-accent hover:text-accent-foreground transition-all duration-300" asChild>
              <Link href="/contact">{t("startConversation")}<ArrowRight className="ml-2 h-5 w-5" /></Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
