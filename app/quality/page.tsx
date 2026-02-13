import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { SITE_URL } from "@/lib/seo"
import { ArrowRight, Award, Shield, Leaf, Users, CheckCircle } from "lucide-react"
import { client } from "@/sanity/lib/client"
import { HonorCard } from "@/components/honor-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "Quality & Certifications - ISO Certified Manufacturer",
  description: "Learn about our ISO 9001, ISO 14001, and ISO 45001 certifications. Quality management, environmental and occupational health systems.",
  alternates: { canonical: `${SITE_URL}/quality` },
}

const certifications = [
  { icon: Award, name: "ISO 9001:2015", title: "Quality Management System", description: "Our ISO 9001 certification demonstrates our commitment to consistent quality in all processes.", benefits: ["Documented quality procedures", "Continuous improvement processes", "Customer satisfaction focus", "Consistent product quality", "Risk-based approach", "Regular internal audits"] },
  { icon: Leaf, name: "ISO 14001:2015", title: "Environmental Management System", description: "We are committed to minimizing our environmental impact through responsible manufacturing practices.", benefits: ["Waste reduction programs", "Energy efficiency measures", "Sustainable sourcing options", "Pollution prevention", "Environmental compliance", "Continuous improvement"] },
  { icon: Users, name: "ISO 45001:2018", title: "Occupational Health & Safety", description: "The safety and wellbeing of our workforce is paramount.", benefits: ["Safe working conditions", "Regular safety training", "Hazard identification", "Emergency preparedness", "Worker health programs", "Incident investigation"] },
]

const qualityProcess = [
  { step: "01", title: "Incoming Material Inspection", description: "Every yarn shipment undergoes comprehensive testing including weight verification, color matching, and visual inspection." },
  { step: "02", title: "In-Line Quality Checks", description: "Regular checks throughout production monitoring gauge consistency, pattern accuracy, and stitch quality." },
  { step: "03", title: "Assembly Inspection", description: "All linking, seaming, finishing, and trim operations inspected for workmanship quality." },
  { step: "04", title: "Final Product Inspection", description: "Every finished garment undergoes 100% inspection against approved samples." },
  { step: "05", title: "AQL Sampling", description: "Statistical sampling according to AQL standards, typically AQL 2.5 or stricter." },
  { step: "06", title: "Pre-Shipment Audit", description: "Final audit to verify quantities, packing quality, and documentation accuracy." },
]

const qualityCommitments = [
  { title: "Zero Tolerance Policy", description: "We maintain zero tolerance for critical defects. Any garment not meeting our standards is rejected." },
  { title: "Traceability", description: "Full traceability from yarn lot to finished garment for quick issue identification." },
  { title: "Continuous Training", description: "Our team receives ongoing training in quality standards and inspection techniques." },
  { title: "Client Standards", description: "We adapt our quality protocols to meet specific client requirements and brand-specific QC manuals." },
]

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

/** 证书分类配置：标题 + 说明文字 */
const HONOR_CATEGORIES: Record<
  string,
  { label: string; description: string }
> = {
  iso: {
    label: 'ISO Certifications',
    description:
      'Our internationally recognized ISO certifications ensure consistent quality management, environmental responsibility, and occupational health and safety across all operations.',
  },
  bsci: {
    label: 'Social Responsibility & Compliance',
    description:
      'We maintain BSCI and other social compliance certifications, demonstrating our commitment to ethical manufacturing, fair labor practices, and responsible supply chain management.',
  },
  patent: {
    label: 'Patents & Innovation',
    description:
      'Our patents reflect our continuous investment in knitwear technology and process innovation, supporting our position as a leading manufacturer in the industry.',
  },
  honor: {
    label: 'Honors & Recognitions',
    description:
      'Government and industry recognitions including Shanghai Famous Brand, High-Tech Enterprise status, and Well-Known Trademark that validate our excellence.',
  },
  green: {
    label: 'Green Low-Carbon Credit',
    description:
      'Green and low-carbon enterprise credit evaluations recognize our commitment to sustainable and environmentally responsible manufacturing practices.',
  },
  other: {
    label: 'Other Certifications',
    description:
      'Additional qualifications and certifications that support our comprehensive quality and compliance framework.',
  },
}

const CATEGORY_ORDER = ['iso', 'bsci', 'patent', 'honor', 'green', 'other'] as const

/** 判定是否为 ISO 相关证书（按名称关键字） */
const ISO_KEYWORDS = [
  'iso', '9001', '14001', '45001',
  '质量', '环境', '职业健康', '质量管理', '环境管理', '职业健康安全',
  'quality management', 'environmental', 'occupational',
]

const GREEN_KEYWORDS = ['绿色', '低碳', 'green', 'low-carbon', 'credit rating', '信用评价']

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

/** 绿色低碳 AAA 与 示范 各自仅保留一张（后两张 AAA 相同） */
function getGreenDedupeKey(h: {
  title?: string | null
  titleEn?: string | null
  imageAlt?: string | null
  fileName?: string | null
  _id?: string
}): string {
  const t = `${h.title ?? ''} ${h.titleEn ?? ''} ${h.imageAlt ?? ''} ${h.fileName ?? ''}`.toLowerCase()
  if (t.includes('aaa') || t.includes('aaa级') || /信用评价aaa/i.test(t)) return 'green-aaa'
  if (t.includes('9996e34e') || t.includes('e33edd11')) return 'green-aaa'
  if (t.includes('示范') || t.includes('demonstration') || t.includes('5ac830a7')) return 'green-demo'
  return `green-${h._id ?? 'other'}`
}

/** 按展示名去重；绿色分类内 AAA/示范 各仅保留一张 */
function dedupeHonors(
  honors: Array<{
    _id: string
    title?: string | null
    titleEn?: string | null
    imageAlt?: string | null
  }>,
  category?: string
): typeof honors {
  const seen = new Set<string>()
  return honors.filter((h) => {
    let key: string
    if (category === 'green') {
      key = getGreenDedupeKey(h)
    } else {
      key = honorDisplayTitle(h).toLowerCase().replace(/\s+/g, '-')
      if (key === 'certificate' || key.length < 3) key = h._id
    }
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
    let cat = h.category && CATEGORY_ORDER.includes(h.category as (typeof CATEGORY_ORDER)[number])
      ? h.category
      : 'other'
    if (isIsoRelated(h)) cat = 'iso'
    else if (isGreenRelated(h)) cat = 'green'
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
  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-28 pb-20 lg:pt-36 lg:pb-24 bg-gradient-to-br from-secondary via-background to-warm/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="animate-fade-up text-sm font-semibold text-accent tracking-wider uppercase mb-5">Certifications & Quality</p>
              <h1 className="animate-fade-up-delay-1 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl text-balance leading-[1.1]">Certified Excellence in Every Garment</h1>
              <p className="animate-fade-up-delay-2 mt-7 text-lg leading-relaxed text-muted-foreground">Our triple ISO certification demonstrates our unwavering commitment to quality, environmental responsibility, and workplace safety.</p>
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
                <Image src="/images/quality-hero.jpg" alt="Quality inspection at Tahui Sweater Factory" fill className="object-cover" priority />
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
            <p className="text-sm font-semibold text-accent tracking-wider uppercase mb-4">International Standards</p>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">Our Certifications</h2>
            <p className="mt-5 text-lg text-muted-foreground leading-relaxed">Internationally recognized certifications that validate our commitment to excellence.</p>
          </div>
          <div className="space-y-12">
            {certifications.map((cert, index) => (
              <Card key={cert.name} className="overflow-hidden border-border/60 hover:border-accent/30 hover:shadow-lg transition-all duration-500">
                <CardContent className="p-0">
                  <div className="grid lg:grid-cols-2">
                    <div className={`p-8 lg:p-12 ${index % 2 === 1 ? "lg:order-2" : ""}`}>
                      <div className="flex items-center gap-4 mb-5">
                        <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center">
                          <cert.icon className="h-6 w-6 text-accent" />
                        </div>
                        <div>
                          <p className="font-bold text-accent">{cert.name}</p>
                          <p className="text-sm text-muted-foreground">{cert.title}</p>
                        </div>
                      </div>
                      <p className="text-muted-foreground leading-relaxed">{cert.description}</p>
                      <div className="mt-6 grid sm:grid-cols-2 gap-3">
                        {cert.benefits.map((benefit) => (
                          <div key={benefit} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-accent shrink-0" />
                            <span className="text-muted-foreground">{benefit}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className={`bg-muted aspect-[4/3] lg:aspect-auto relative ${index % 2 === 1 ? "lg:order-1" : ""}`}>
                      <Image src={`/images/cert-${index + 1}.jpg`} alt={cert.title} fill className="object-cover" />
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
              <p className="text-sm font-semibold text-accent tracking-wider uppercase mb-4">Honors & Qualifications</p>
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">Our Certificates & Honors</h2>
              <p className="mt-5 text-lg text-muted-foreground leading-relaxed">Awards, certifications, and qualifications organized by category.</p>
            </div>

            {(() => {
              const byCategory = groupHonorsByCategory(honors)
              return CATEGORY_ORDER.map((catKey) => {
                const items = byCategory.get(catKey) ?? []
              if (items.length === 0) return null
              const config = HONOR_CATEGORIES[catKey] ?? HONOR_CATEGORIES.other
              return (
                <div key={catKey} className="mb-20 last:mb-0">
                  <div className="mb-10">
                    <h3 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">{config.label}</h3>
                    <p className="mt-3 text-muted-foreground leading-relaxed max-w-3xl">{config.description}</p>
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
            <p className="text-sm font-semibold text-accent tracking-wider uppercase mb-4">Process</p>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">Our Quality Control Process</h2>
            <p className="mt-5 text-lg text-muted-foreground leading-relaxed">A rigorous six-stage quality control process ensures every garment meets our exacting standards.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {qualityProcess.map((step) => (
              <div key={step.step} className="group bg-card rounded-xl p-6 border border-border/60 hover:border-accent/30 hover:shadow-lg hover:-translate-y-1 transition-all duration-500">
                <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center mb-4 group-hover:bg-accent transition-colors duration-300">
                  <span className="text-sm font-bold text-primary-foreground">{step.step}</span>
                </div>
                <h3 className="font-bold text-lg text-foreground mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
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
              <p className="text-sm font-semibold text-accent tracking-wider uppercase mb-4">Our Promise</p>
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl leading-tight">Quality Commitments</h2>
              <p className="mt-5 text-lg text-muted-foreground leading-relaxed">Quality is not just a department at Tahui - it is a company-wide philosophy embedded in everything we do.</p>
              <div className="mt-8 space-y-6">
                {qualityCommitments.map((commitment) => (
                  <div key={commitment.title} className="p-5 rounded-xl bg-card border border-border/60 hover:border-accent/30 transition-all duration-300">
                    <h3 className="font-bold text-foreground">{commitment.title}</h3>
                    <p className="mt-1 text-muted-foreground text-sm leading-relaxed">{commitment.description}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-2xl overflow-hidden relative shadow-xl">
                <Image src="/images/quality-commitment.jpg" alt="Quality commitment at Tahui factory" fill className="object-cover" />
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
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">Experience Our Quality Standards</h2>
          <p className="mt-5 text-lg text-primary-foreground/75 leading-relaxed">Partner with a manufacturer that takes quality as seriously as you do.</p>
          <div className="mt-10">
            <Button size="lg" variant="secondary" className="hover:bg-accent hover:text-accent-foreground transition-all duration-300" asChild>
              <Link href="/contact">Start the Conversation<ArrowRight className="ml-2 h-5 w-5" /></Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
