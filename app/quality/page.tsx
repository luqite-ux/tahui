import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { SITE_URL } from "@/lib/seo"
import { ArrowRight, Award, Shield, Leaf, Users, CheckCircle, FileDown } from "lucide-react"
import { client } from "@/sanity/lib/client"
import { urlFor } from "@/sanity/lib/image"
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
  "titleEn": coalesce(titleEn, title),
  description,
  category,
  image,
  "pdfUrl": pdfFile.asset->url
}`

export default async function QualityPage() {
  let honors: Array<{
    _id: string
    title: string
    titleEn: string
    description?: string | null
    category?: string | null
    image?: { asset?: { _ref?: string }; alt?: string | null } | null
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

      {/* Honors & Qualifications Gallery - 从 Sanity 后台管理 */}
      {honors.length > 0 && (
        <section className="py-24 lg:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <p className="text-sm font-semibold text-accent tracking-wider uppercase mb-4">Honors & Qualifications</p>
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">Our Certificates & Honors</h2>
              <p className="mt-5 text-lg text-muted-foreground leading-relaxed">Awards, certifications, and qualifications that demonstrate our commitment to excellence.</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {honors.map((honor) => (
                <div
                  key={honor._id}
                  className="group bg-card rounded-xl overflow-hidden border border-border/60 hover:border-accent/30 hover:shadow-lg transition-all duration-500"
                >
                  <div className="aspect-[4/3] bg-muted relative">
                    {honor.image?.asset ? (
                      <Image
                        src={urlFor(honor.image).width(600).height(450).url()}
                        alt={honor.image?.alt ?? honor.titleEn}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                    ) : honor.pdfUrl ? (
                      <a href={honor.pdfUrl} target="_blank" rel="noopener noreferrer" className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-muted text-muted-foreground hover:text-accent transition-colors">
                        <FileDown className="h-16 w-16" />
                        <span className="text-sm font-medium px-4 text-center">{honor.titleEn}</span>
                        <span className="text-xs">Click to download PDF</span>
                      </a>
                    ) : null}
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-foreground">{honor.titleEn}</h3>
                    {honor.description && <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{honor.description}</p>}
                    {honor.pdfUrl && honor.image?.asset && (
                      <a
                        href={honor.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-flex items-center gap-2 text-sm text-accent hover:underline"
                      >
                        <FileDown className="h-4 w-4" /> Download PDF
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
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
