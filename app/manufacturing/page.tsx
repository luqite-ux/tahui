import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, CheckCircle, Layers, Cpu, Palette, Shield, Sparkles, Scissors } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "Manufacturing Capability | Tahui Sweater Factory - WholeGarment Technology",
  description: "Discover our advanced seamless knitting technology, premium materials, and expert craftsmanship. 200+ WholeGarment machines, comprehensive QC, and digitalized production management.",
}

const technologies = [
  { icon: Layers, title: "WholeGarment Technology", description: "Our 200+ seamless knitting machines produce complete garments without side seams, offering superior comfort, reduced waste, and faster production times." },
  { icon: Scissors, title: "Fully Fashioned Knitting", description: "Traditional fully fashioned construction for classic knitwear pieces, with shaped panels and precise finishing for timeless elegance." },
  { icon: Cpu, title: "Computerized Production", description: "State-of-the-art computerized knitting systems enable complex patterns, precise gauge control, and consistent quality across large orders." },
  { icon: Shield, title: "Digital Management", description: "End-to-end digital production management ensures traceability, quality control, and real-time order tracking for transparent partnerships." },
]

const materials = [
  { name: "Wool & Merino", description: "From fine Australian merino to chunky British wool, we source premium wool yarns.", properties: ["Temperature regulating", "Naturally breathable", "Odor resistant", "Sustainable fiber"] },
  { name: "Cotton", description: "Organic and conventional cotton yarns in various weights for year-round knitwear.", properties: ["Soft and comfortable", "Hypoallergenic", "Easy care", "Organic options"] },
  { name: "Cashmere", description: "Luxurious cashmere and cashmere blends offering unparalleled softness.", properties: ["Ultra-soft feel", "Lightweight warmth", "Premium luxury", "Lasting quality"] },
  { name: "Silk & Silk Blends", description: "Pure silk and silk-blend yarns for elegant drape and natural sheen.", properties: ["Natural luster", "Temperature regulating", "Elegant drape", "Luxurious feel"] },
  { name: "Synthetics & Blends", description: "High-quality acrylic, nylon, and performance blends for durability.", properties: ["Easy care", "Durable", "Color-fast", "Cost-effective"] },
  { name: "Specialty Yarns", description: "Alpaca, mohair, linen, and innovative sustainable fibers.", properties: ["Unique textures", "Sustainable options", "Special properties", "Distinctive look"] },
]

const techniques = [
  { icon: Sparkles, name: "Jacquard Knitting", description: "Complex multi-color patterns and motifs through computerized jacquard technology." },
  { icon: Palette, name: "Intarsia", description: "Color-block designs with clean color changes for bold graphic patterns." },
  { name: "Cable & Aran", description: "Traditional cable patterns and Aran stitches adding texture and heritage appeal." },
  { name: "Embroidery", description: "Hand and machine embroidery for logos, decorative elements, and intricate detailing." },
  { name: "Hand Crochet", description: "Artisanal hand crochet details and trim work for unique finishing touches." },
  { name: "Print & Dye", description: "Garment dyeing, piece dyeing, and various printing techniques for color customization." },
]

const qcSteps = [
  { step: "01", title: "Raw Material Inspection", description: "Every yarn batch tested for weight, color consistency, and quality." },
  { step: "02", title: "In-Process Checking", description: "Continuous monitoring for gauge accuracy, pattern alignment, and stitch quality." },
  { step: "03", title: "Assembly Quality Control", description: "Linking, finishing, and assembly inspected for precision and craftsmanship." },
  { step: "04", title: "Final Inspection", description: "100% inspection against approved samples and AQL standards." },
  { step: "05", title: "Pre-Shipment Audit", description: "Final quality audit and documentation review before shipping." },
]

export default function ManufacturingPage() {
  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-28 pb-20 lg:pt-36 lg:pb-24 bg-gradient-to-br from-secondary via-background to-warm/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="animate-fade-up text-sm font-semibold text-accent tracking-wider uppercase mb-5">
                Manufacturing Capability
              </p>
              <h1 className="animate-fade-up-delay-1 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl text-balance leading-[1.1]">
                Advanced Seamless Knitting Technology
              </h1>
              <p className="animate-fade-up-delay-2 mt-7 text-lg leading-relaxed text-muted-foreground">
                Our state-of-the-art manufacturing facility combines cutting-edge WholeGarment 
                technology with traditional craftsmanship. With over 200 seamless knitting machines 
                and comprehensive quality control systems, we deliver exceptional knitwear at scale.
              </p>
              <div className="animate-fade-up-delay-3 mt-10">
                <Button size="lg" className="bg-primary hover:bg-accent transition-all duration-300 hover:shadow-lg" asChild>
                  <Link href="/contact">
                    Discuss Your Project
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
            <div className="animate-slide-in-right relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden relative shadow-2xl shadow-primary/10">
                <Image src="/images/manufacturing-hero.jpg" alt="Advanced WholeGarment seamless knitting machines" fill className="object-cover" priority />
                <div className="absolute inset-0 bg-gradient-to-tr from-accent/5 to-transparent" />
              </div>
              <div className="absolute -bottom-4 -right-4 h-24 w-24 bg-accent/8 rounded-2xl -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <p className="text-sm font-semibold text-accent tracking-wider uppercase mb-4">Our Equipment</p>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">Our Technology</h2>
            <p className="mt-5 text-lg text-muted-foreground leading-relaxed">We invest continuously in the latest knitting technology and digital systems to deliver superior quality.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {technologies.map((tech) => (
              <div key={tech.title} className="group text-center p-6 rounded-xl bg-card border border-border/60 hover:border-accent/30 hover:shadow-lg hover:-translate-y-1 transition-all duration-500">
                <div className="mx-auto h-14 w-14 rounded-xl bg-accent/10 flex items-center justify-center mb-5 group-hover:bg-accent/20 transition-colors duration-300">
                  <tech.icon className="h-7 w-7 text-accent" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-3">{tech.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{tech.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WholeGarment Deep Dive */}
      <section className="py-24 lg:py-32 bg-secondary">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-sm font-semibold text-accent tracking-wider uppercase mb-4">Seamless Technology</p>
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl leading-tight">WholeGarment Manufacturing</h2>
              <p className="mt-5 text-lg text-muted-foreground leading-relaxed">WholeGarment technology represents the pinnacle of knitwear manufacturing, creating complete garments in a single process.</p>
              <div className="mt-8 grid sm:grid-cols-2 gap-6">
                <div className="p-5 rounded-xl bg-card border border-border/60">
                  <h3 className="font-bold text-foreground mb-3">Benefits</h3>
                  <ul className="space-y-2">
                    {["No side seams for comfort", "Reduced material waste", "Faster production time", "Complex 3D shapes possible"].map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground"><CheckCircle className="h-4 w-4 text-accent shrink-0 mt-0.5" />{item}</li>
                    ))}
                  </ul>
                </div>
                <div className="p-5 rounded-xl bg-card border border-border/60">
                  <h3 className="font-bold text-foreground mb-3">Capacity</h3>
                  <ul className="space-y-2">
                    {["200+ machines", "100,000 pcs/month", "3GG to 14GG gauge", "24/7 operation"].map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground"><CheckCircle className="h-4 w-4 text-accent shrink-0 mt-0.5" />{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-2xl overflow-hidden relative shadow-xl">
                <Image src="/images/wholegarment.jpg" alt="WholeGarment seamless knitting" fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-tr from-accent/5 to-transparent" />
              </div>
              <div className="absolute -top-4 -left-4 h-20 w-20 bg-primary/5 rounded-full -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* Materials Section */}
      <section className="py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <p className="text-sm font-semibold text-accent tracking-wider uppercase mb-4">Premium Fibers</p>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">Materials & Yarns</h2>
            <p className="mt-5 text-lg text-muted-foreground leading-relaxed">We source premium yarns from trusted suppliers worldwide.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {materials.map((material) => (
              <Card key={material.name} className="bg-card border-border/60 hover:border-accent/30 hover:shadow-lg hover:-translate-y-1 transition-all duration-500">
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg text-foreground">{material.name}</h3>
                  <p className="mt-2 text-muted-foreground text-sm leading-relaxed">{material.description}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {material.properties.map((prop) => (
                      <span key={prop} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent/10 text-accent">{prop}</span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Techniques Section */}
      <section className="py-24 lg:py-32 bg-secondary">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <p className="text-sm font-semibold text-accent tracking-wider uppercase mb-4">Artisan Skills</p>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">Techniques & Craftsmanship</h2>
            <p className="mt-5 text-lg text-muted-foreground leading-relaxed">Beyond advanced technology, our skilled craftspeople bring traditional techniques that elevate every garment.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {techniques.map((technique) => (
              <div key={technique.name} className="bg-card rounded-xl p-6 border border-border/60 hover:border-accent/30 hover:shadow-lg hover:-translate-y-1 transition-all duration-500">
                <h3 className="font-bold text-lg text-foreground">{technique.name}</h3>
                <p className="mt-2 text-muted-foreground text-sm leading-relaxed">{technique.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quality Control Section */}
      <section className="py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <p className="text-sm font-semibold text-accent tracking-wider uppercase mb-4">Quality Assurance</p>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">Quality Control Process</h2>
            <p className="mt-5 text-lg text-muted-foreground leading-relaxed">Our comprehensive quality management system ensures consistent excellence.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {qcSteps.map((step, index) => (
              <div key={step.step} className="relative text-center group">
                <div className="mx-auto h-14 w-14 rounded-full bg-primary flex items-center justify-center mb-4 group-hover:bg-accent transition-colors duration-300">
                  <span className="text-lg font-bold text-primary-foreground">{step.step}</span>
                </div>
                <h3 className="font-bold text-foreground mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-sm">{step.description}</p>
                {index < qcSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-7 left-[calc(50%+2rem)] w-[calc(100%-4rem)] h-0.5 bg-border" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 lg:py-32 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
        <div className="relative mx-auto max-w-4xl px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">Partner With Us</h2>
          <p className="mt-5 text-lg text-primary-foreground/75 leading-relaxed">Whether you are developing a new collection or scaling existing production, our manufacturing capabilities are ready to support your brand.</p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Button size="lg" variant="secondary" className="hover:bg-accent hover:text-accent-foreground transition-all duration-300" asChild>
              <Link href="/contact">Start a Conversation<ArrowRight className="ml-2 h-5 w-5" /></Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:border-accent/50 transition-all duration-300" asChild>
              <Link href="/factory-tour">Tour Our Factory</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
