import Link from "next/link"
import Image from "next/image"
import { ArrowRight, CheckCircle, Factory, Award, Globe, Layers, Settings, Shield, Calendar, TrendingUp, Gauge, Cpu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { HeroCarousel } from "@/components/hero-carousel"
import { client } from "@/sanity/lib/client"
import { urlFor } from "@/sanity/lib/image"

const stats = [
  { value: "20+", label: "Years Experience", icon: Calendar },
  { value: "8.3M+", label: "Annual Export (USD)", icon: TrendingUp },
  { value: "100K", label: "Monthly Capacity", icon: Gauge },
  { value: "200+", label: "Knitting Machines", icon: Cpu },
]

const categories = [
  {
    title: "Seamless Knitwear",
    description: "Featuring innovative seamless sweaters and base layers produced using advanced fully automatic seamless knitting technology for ultimate comfort and fit.",
    image: "/images/category-seamless.jpg",
  },
  {
    title: "Multi-Material Collection",
    description: "A wide range of premium knitwear and blankets crafted from diverse materials including wool, silk, cotton, linen, and specialized fancy yarns.",
    image: "/images/category-materials.jpg",
  },
  {
    title: "Advanced Craftsmanship",
    description: "Showcasing our diverse processing capabilities, from jacquard and hand-knitting to embroidery, beading, and custom dyeing techniques like tie-dye and gradient.",
    image: "/images/category-craftsmanship.jpg",
  },
]

const advantages = [
  {
    icon: Layers,
    title: "WholeGarment Technology",
    description: "Advanced seamless knitting with 200+ machines for superior comfort and minimal waste.",
  },
  {
    icon: Settings,
    title: "OEM & ODM Services",
    description: "Flexible manufacturing solutions from your designs or complete product development.",
  },
  {
    icon: Globe,
    title: "Global Export Experience",
    description: "Two decades serving international brands with reliable supply chain management.",
  },
  {
    icon: Shield,
    title: "ISO Certified Quality",
    description: "ISO 9001, ISO 14001, and ISO 45001 certified for consistent quality assurance.",
  },
]

const certifications = [
  { name: "ISO 9001", description: "Quality Management" },
  { name: "ISO 14001", description: "Environmental Management" },
  { name: "ISO 45001", description: "Occupational Health & Safety" },
]

const HERO_FALLBACK = [
  { src: "/images/hero-model.png", alt: "Model wearing cream open-knit cardigan with gold buttons" },
  { src: "/images/hero-model-2.png", alt: "Model wearing ivory ruffle-front V-neck knit sweater" },
  { src: "/images/hero-model-3.png", alt: "Model wearing brown and pink ombre textured knit sweater" },
  { src: "/images/hero-model-4.png", alt: "Model wearing blue lace-trimmed knit turtleneck" },
]

export default async function HomePage() {
  let heroSlides: { src: string; alt: string }[] = HERO_FALLBACK
  try {
    const homepage = await client.fetch<{
      heroSlides?: Array<{ image?: unknown; alt?: string | null } | null>
    } | null>(
      `*[_type == "homepage"][0]{ heroSlides[] { image, alt } }`
    )
    if (homepage?.heroSlides?.length) {
      heroSlides = homepage.heroSlides
        .filter((s): s is { image: unknown; alt?: string | null } => s != null && s.image != null)
        .map((s) => ({
          src: urlFor(s.image).width(1200).url(),
          alt: s.alt ?? "",
        }))
    }
  } catch {
    // 无 Sanity 或未配置时用静态图
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 lg:pt-28 lg:pb-20 overflow-hidden">
        {/* Unified left-to-right gradient background - no circles for seamless blend */}
        <div className="absolute inset-0 bg-gradient-to-r from-secondary via-secondary to-warm/40" />
        
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid lg:grid-cols-[44%_56%] gap-8 lg:gap-0 items-center">
            {/* Left column - text content, z-index above model overlap */}
            <div className="relative z-10 flex flex-col justify-center">
              {/* Warm vertical accent bar */}
              <div className="absolute -left-6 lg:-left-8 top-0 w-[3px] h-24 bg-gradient-to-b from-accent via-accent/60 to-transparent rounded-full animate-fade-up" />
              
              <p className="animate-fade-up text-xs font-semibold text-accent tracking-[0.2em] uppercase mb-4 flex items-center gap-2">
                <span className="inline-block w-5 h-px bg-accent" />
                Premium Knitwear Manufacturer
              </p>
              <h1 className="animate-fade-up-delay-1 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-[3.25rem] text-balance leading-[1.08]">
                Your Trusted{" "}
                <span className="text-primary relative">
                  Seamless Knitwear
                  <span className="absolute -bottom-0.5 left-0 w-full h-[2px] bg-accent/30 rounded-full" />
                </span>{" "}
                Partner in China
              </h1>
              <p className="animate-fade-up-delay-2 mt-5 text-base leading-relaxed text-muted-foreground max-w-md">
                With over 20 years of export manufacturing excellence, Tahui delivers premium seamless 
                knitwear, multi-material collections, and advanced craftsmanship — from OEM production 
                to full ODM development, with precision and quality.
              </p>
              {/* CTA Buttons */}
              <div className="animate-fade-up-delay-3 mt-8 flex flex-wrap gap-3">
                <Button size="default" className="bg-primary text-primary-foreground hover:bg-primary/85 hover:shadow-xl hover:shadow-primary/15 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 ease-out" asChild>
                  <Link href="/contact">
                    Get a Quote
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </Link>
                </Button>
                <Button size="default" variant="outline" className="border-border text-foreground/80 bg-transparent hover:bg-warm hover:border-accent/40 hover:text-foreground transition-all duration-300 ease-out" asChild>
                  <Link href="/factory-tour">
                    Explore Our Factory
                  </Link>
                </Button>
              </div>
            </div>

            {/* Right column - Model image, no card frame for seamless blend with left */}
            <div className="relative lg:-ml-12 animate-slide-in-right">
              <div className="animate-float-slow relative min-h-[520px] sm:min-h-[600px] lg:min-h-[640px]">
                <HeroCarousel slides={heroSlides} />
              </div>

              {/* Capacity badge - bottom-right corner of the card */}
              <div className="absolute bottom-8 right-6 lg:bottom-10 lg:right-8 bg-card/90 backdrop-blur-md rounded-2xl px-4 py-3 shadow-lg shadow-foreground/[0.04] z-10">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-xl bg-accent/10 flex items-center justify-center">
                    <Factory className="h-4 w-4 text-accent/70" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground/80 text-xs leading-tight">100,000+ pcs</p>
                    <p className="text-[10px] text-muted-foreground/70">Monthly Capacity</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats bar - below the fold with icons and hover */}
          <div className="animate-fade-up-delay-3 mt-16 lg:mt-20 pt-10 border-t border-border/50">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 lg:gap-10">
              {stats.map((stat) => (
                <div key={stat.label} className="group flex items-start gap-4 p-4 rounded-xl hover:bg-warm/60 transition-all duration-300 cursor-default">
                  <div className="h-10 w-10 rounded-lg bg-primary/[0.07] group-hover:bg-accent/15 flex items-center justify-center shrink-0 transition-colors duration-300">
                    <stat.icon className="h-5 w-5 text-primary/70 group-hover:text-accent transition-colors duration-300" />
                  </div>
                  <div>
                    <p className="text-3xl lg:text-4xl font-bold text-primary tracking-tight group-hover:text-accent transition-colors duration-300">{stat.value}</p>
                    <p className="mt-0.5 text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Product Categories */}
      <section className="py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <p className="text-sm font-semibold text-accent tracking-wider uppercase mb-4">Our Collections</p>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              Our Product Categories
            </h2>
            <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
              From classic sweaters to innovative seamless garments, we manufacture a complete range 
              of knitwear products for global fashion brands.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 lg:gap-10">
            {categories.map((category) => (
              <Link key={category.title} href="/products" className="group">
                <Card className="overflow-hidden rounded-2xl border-border/50 bg-card shadow-sm hover:shadow-2xl hover:shadow-accent/8 hover:-translate-y-2 transition-all duration-500 ease-out relative">
                  {/* Warm accent left border */}
                  <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-accent via-accent/40 to-transparent rounded-l-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  {/* Image area */}
                  <div className="aspect-[4/3] bg-warm/50 relative overflow-hidden">
                    <Image
                      src={category.image || "/placeholder.svg"}
                      alt={category.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    {/* Warm gradient overlay for cohesion */}
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 via-transparent to-accent/[0.04]" />
                    {/* Hover deepened overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/25 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                  {/* Content area */}
                  <CardContent className="p-6 lg:p-7">
                    <h3 className="text-xl font-bold text-foreground group-hover:text-accent transition-colors duration-300">
                      {category.title}
                    </h3>
                    <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                      {category.description}
                    </p>
                    {/* Explore hint */}
                    <span className="inline-flex items-center gap-1 mt-4 text-xs font-medium text-accent/0 group-hover:text-accent transition-all duration-300">
                      Explore
                      <ArrowRight className="h-3 w-3 -translate-x-1 group-hover:translate-x-0 transition-transform duration-300" />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          <div className="mt-14 text-center">
            <Button variant="outline" className="border-accent/30 hover:bg-accent/10 hover:border-accent/50 transition-all duration-300 bg-transparent" asChild>
              <Link href="/products">
                View All Products
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 lg:py-32 bg-secondary">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <p className="text-sm font-semibold text-accent tracking-wider uppercase mb-4">Our Strengths</p>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              Why Choose Tahui
            </h2>
            <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
              We combine advanced technology, skilled craftsmanship, and decades of export experience 
              to deliver exceptional knitwear for your brand.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {advantages.map((advantage) => (
              <div key={advantage.title} className="group relative text-center p-7 rounded-2xl bg-card border border-border/50 shadow-sm hover:shadow-xl hover:shadow-accent/8 hover:-translate-y-2 transition-all duration-500 ease-out overflow-hidden">
                {/* Top accent highlight bar */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[3px] w-0 group-hover:w-3/5 bg-gradient-to-r from-transparent via-accent to-transparent rounded-b-full transition-all duration-500" />
                <div className="mx-auto h-14 w-14 rounded-xl bg-primary/[0.06] flex items-center justify-center mb-5 group-hover:bg-accent/15 group-hover:scale-110 transition-all duration-400">
                  <advantage.icon className="h-6 w-6 text-primary/70 group-hover:text-accent transition-colors duration-300" strokeWidth={1.5} />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
                  {advantage.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {advantage.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Manufacturing Capability */}
      <section className="py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <p className="text-sm font-semibold text-accent tracking-wider uppercase mb-4">
                Manufacturing Excellence
              </p>
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl leading-tight">
                Advanced Seamless Knitting Technology
              </h2>
              <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
                Our state-of-the-art facility houses over 200 WholeGarment seamless knitting machines, 
                enabling us to produce premium knitwear with superior comfort, minimal seams, and 
                reduced material waste.
              </p>
              <ul className="mt-8 space-y-4">
                {[
                  "WholeGarment / Seamless knitting technology",
                  "Premium materials: wool, cotton, silk, cashmere, blends",
                  "Advanced techniques: jacquard, embroidery, hand crochet",
                  "Full digitalized production management",
                  "Strict quality control at every stage",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                    <span className="text-muted-foreground leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-10">
                <Button className="bg-primary hover:bg-primary/90 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20" asChild>
                  <Link href="/manufacturing">
                    Learn More About Our Capabilities
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="relative">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden relative shadow-xl">
                  <Image
                    src="/images/manufacturing.jpg"
                    alt="Advanced seamless knitting machines at Tahui factory"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-accent/5 to-transparent" />
                </div>
                {/* Warm decorative element */}
                <div className="absolute -bottom-6 -right-6 h-32 w-32 bg-accent/8 rounded-2xl -z-10" />
                <div className="absolute -top-4 -left-4 h-20 w-20 bg-primary/5 rounded-full -z-10" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-24 lg:py-32 bg-primary relative overflow-hidden">
        {/* Warm accent glow overlays */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent/[0.07] rounded-full blur-[80px] translate-y-1/3 -translate-x-1/4" />
        {/* Subtle warm top edge line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
        
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p className="text-sm font-semibold tracking-[0.2em] uppercase mb-4 flex items-center justify-center gap-3">
              <span className="inline-block w-8 h-px bg-accent/60" />
              <span className="text-accent">Trust & Compliance</span>
              <span className="inline-block w-8 h-px bg-accent/60" />
            </p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              <span className="text-primary-foreground">Certified Quality</span>
              <span className="text-accent"> & </span>
              <span className="text-primary-foreground">Compliance</span>
            </h2>
            <p className="mt-5 text-lg text-primary-foreground/70 leading-relaxed">
              Our commitment to quality, environmental responsibility, and workplace safety is 
              validated by internationally recognized certifications.
            </p>
          </div>
          <div className="grid sm:grid-cols-3 gap-6 lg:gap-8">
            {certifications.map((cert) => (
              <div key={cert.name} className="group relative text-center p-8 lg:p-10 rounded-2xl bg-primary-foreground/[0.04] border border-primary-foreground/[0.08] hover:bg-primary-foreground/[0.08] hover:border-accent/30 transition-all duration-500 ease-out hover:-translate-y-2 overflow-hidden">
                {/* Bottom accent bar on hover */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] w-0 group-hover:w-4/5 bg-gradient-to-r from-transparent via-accent to-transparent rounded-t-full transition-all duration-500" />
                <div className="mx-auto h-16 w-16 rounded-2xl bg-accent/15 flex items-center justify-center mb-6 group-hover:bg-accent/25 group-hover:scale-110 transition-all duration-400">
                  <Award className="h-7 w-7 text-accent" strokeWidth={1.5} />
                </div>
                <h3 className="text-2xl font-bold text-primary-foreground group-hover:text-accent transition-colors duration-300">{cert.name}</h3>
                <p className="mt-2 text-primary-foreground/60 group-hover:text-primary-foreground/80 transition-colors duration-300">{cert.description}</p>
              </div>
            ))}
          </div>
          <div className="mt-14 text-center">
            <Button variant="secondary" className="hover:bg-accent hover:text-accent-foreground hover:scale-[1.02] hover:shadow-lg transition-all duration-300 ease-out" asChild>
              <Link href="/quality">
                View Our Certifications
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Factory Overview */}
      <section className="py-24 lg:py-32 bg-secondary">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {/* Title block - matches "Our Collections" / "Our Strengths" pattern */}
          <div className="text-center max-w-3xl mx-auto mb-20">
            <p className="text-sm font-semibold text-accent tracking-wider uppercase mb-4">Behind the Scenes</p>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              Inside Our Factory
            </h2>
            <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
              Take a glimpse into our modern production facility where craftsmanship meets technology.
            </p>
          </div>

          {/* 5 factory process cards: 2 top + 3 bottom, matching product card style */}
          <div className="flex flex-col gap-8 lg:gap-10">
            {/* Row 1: 2 cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 lg:gap-10">
              {[
                { src: "/images/factory-linking.jpg", alt: "Linking workshop - skilled artisans at linking machines", title: "Linking Workshop", step: "Step 1", desc: "Core assembly floor where skilled artisans piece together knitwear components with precision stitching." },
                { src: "/images/factory-finishing.jpg", alt: "Hand finishing - workers inspecting and trimming garments", title: "Hand Finishing", step: "Step 2", desc: "Detailed inspection and hand-trimming to ensure every garment meets our exacting quality standards." },
              ].map((item) => (
                <div key={item.src} className="group">
                  <Card className="overflow-hidden rounded-2xl border-border/50 bg-card shadow-sm hover:shadow-2xl hover:shadow-accent/8 hover:-translate-y-2 transition-all duration-500 ease-out relative">
                    <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-accent via-accent/40 to-transparent rounded-l-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="aspect-[4/3] bg-warm/50 relative overflow-hidden">
                      <Image src={item.src || "/placeholder.svg"} alt={item.alt} fill className="object-cover saturate-[0.88] group-hover:saturate-100 group-hover:scale-105 transition-all duration-700 ease-out" />
                      <div className="absolute inset-0 bg-[#b8a48a]/[0.10] mix-blend-multiply" />
                      <div className="absolute inset-0 bg-gradient-to-t from-foreground/15 via-transparent to-accent/[0.03]" />
                      <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                    <CardContent className="p-6 lg:p-7">
                      <p className="text-[11px] font-semibold text-accent tracking-wider uppercase mb-2">{item.step}</p>
                      <h3 className="text-lg font-bold text-foreground group-hover:text-accent transition-colors duration-300">{item.title}</h3>
                      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>

            {/* Row 2: 3 cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 lg:gap-10">
              {[
                { src: "/images/factory-sorting.jpg", alt: "Quality sorting - stacked knitwear undergoing inspection", title: "Quality Sorting", step: "Step 3", desc: "Careful piece-by-piece review and grading before garments move to finishing." },
                { src: "/images/factory-pressing.jpg", alt: "Steam pressing - garments pressed with professional equipment", title: "Steam Pressing", step: "Step 4", desc: "Professional steam shaping to give each garment its final silhouette and drape." },
                { src: "/images/factory-packaging.jpg", alt: "Packaging area - finished goods boxed for export", title: "Packaging", step: "Step 5", desc: "Carefully boxed and labeled, ready for worldwide export to our brand partners." },
              ].map((item) => (
                <div key={item.src} className="group">
                  <Card className="overflow-hidden rounded-2xl border-border/50 bg-card shadow-sm hover:shadow-2xl hover:shadow-accent/8 hover:-translate-y-2 transition-all duration-500 ease-out relative">
                    <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-accent via-accent/40 to-transparent rounded-l-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="aspect-[4/3] bg-warm/50 relative overflow-hidden">
                      <Image src={item.src || "/placeholder.svg"} alt={item.alt} fill className="object-cover saturate-[0.88] group-hover:saturate-100 group-hover:scale-105 transition-all duration-700 ease-out" />
                      <div className="absolute inset-0 bg-[#b8a48a]/[0.10] mix-blend-multiply" />
                      <div className="absolute inset-0 bg-gradient-to-t from-foreground/15 via-transparent to-accent/[0.03]" />
                      <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                    <CardContent className="p-6 lg:p-7">
                      <p className="text-[11px] font-semibold text-accent tracking-wider uppercase mb-2">{item.step}</p>
                      <h3 className="text-lg font-bold text-foreground group-hover:text-accent transition-colors duration-300">{item.title}</h3>
                      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          {/* CTA button - matches site pattern */}
          <div className="mt-14 text-center">
            <Button variant="outline" className="border-accent/30 hover:bg-accent/10 hover:border-accent/50 transition-all duration-300 bg-transparent" asChild>
              <Link href="/factory-tour">
                Take a Virtual Factory Tour
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 lg:py-32 bg-gradient-to-br from-secondary via-warm/30 to-secondary relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-1/2 left-0 w-64 h-64 bg-accent/8 rounded-full blur-3xl -translate-y-1/2" />
        <div className="absolute top-1/2 right-0 w-48 h-48 bg-primary/5 rounded-full blur-2xl -translate-y-1/2" />
        
        <div className="relative mx-auto max-w-4xl px-6 lg:px-8 text-center">
          <p className="text-sm font-semibold text-accent tracking-wider uppercase mb-4">Start Today</p>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Ready to Start Your Project?
          </h2>
          <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
            Whether you need OEM production, ODM development, or custom knitwear solutions, 
            our team is ready to bring your vision to life. Get in touch for a free consultation 
            and quote.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Button size="lg" className="bg-primary hover:bg-primary/90 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20" asChild>
              <Link href="/contact">
                Request a Quote
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-accent/30 hover:bg-accent/10 hover:border-accent/50 transition-all duration-300 bg-transparent" asChild>
              <Link href="mailto:info@tahui-factory.cn">
                Email Us Directly
              </Link>
            </Button>
          </div>
          <p className="mt-8 text-sm text-muted-foreground">
            Or reach us via WhatsApp: +86 166 2168 4217
          </p>
        </div>
      </section>

      <Footer />
    </div>
  )
}
