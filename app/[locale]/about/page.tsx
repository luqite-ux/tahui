import type { Metadata } from "next"
import Image from "next/image"
import { Link } from "@/i18n/routing"
import { SITE_URL } from "@/lib/seo"
import { ArrowRight, Target, Heart, Handshake, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "About Us - 20+ Years of Knitwear Excellence",
  description: "Learn about Tahui Sweater Factory's 20+ year history in knitwear manufacturing. Shanghai-based, ISO certified, global export.",
  alternates: { canonical: `${SITE_URL}/about` },
}

const timeline = [
  { year: "2003", title: "Foundation", description: "Tahui Sweater Factory was established in Shanghai with a vision to become a leading knitwear manufacturer." },
  { year: "2008", title: "First Export Milestone", description: "Achieved our first major export milestone, establishing partnerships with European fashion brands." },
  { year: "2012", title: "WholeGarment Investment", description: "Made significant investment in WholeGarment seamless knitting technology." },
  { year: "2016", title: "Triple ISO Certification", description: "Achieved ISO 9001, ISO 14001, and ISO 45001 certifications." },
  { year: "2020", title: "Digital Transformation", description: "Implemented comprehensive digital management systems for production tracking." },
  { year: "2024", title: "Continued Growth", description: "Expanded to over 200 seamless knitting machines and $8.3M+ annual export volume." },
]

const values = [
  { icon: Target, title: "Quality Excellence", description: "We pursue excellence in every stitch, every garment, and every order." },
  { icon: Handshake, title: "Partnership Mindset", description: "We view every client relationship as a long-term partnership." },
  { icon: TrendingUp, title: "Continuous Innovation", description: "We continuously invest in new technologies and processes." },
  { icon: Heart, title: "Responsible Manufacturing", description: "We are committed to ethical practices and environmental responsibility." },
]

const stats = [
  { value: "20+", label: "Years in Business" },
  { value: "500+", label: "Team Members" },
  { value: "50+", label: "Brand Partners" },
  { value: "30+", label: "Countries Served" },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-28 pb-20 lg:pt-36 lg:pb-24 bg-gradient-to-br from-secondary via-background to-warm/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="animate-fade-up text-sm font-semibold text-accent tracking-wider uppercase mb-5">About Us</p>
              <h1 className="animate-fade-up-delay-1 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl text-balance leading-[1.1]">Two Decades of Knitwear Excellence</h1>
              <p className="animate-fade-up-delay-2 mt-7 text-lg leading-relaxed text-muted-foreground">For over 20 years, Tahui Sweater Factory has been a trusted partner to fashion brands worldwide. From our roots as a small knitwear workshop in Shanghai, we have grown into a modern manufacturing facility.</p>
              <p className="animate-fade-up-delay-3 mt-4 text-lg leading-relaxed text-muted-foreground">Today, we combine traditional knitwear expertise with advanced seamless technology to deliver exceptional products for brands across Europe, North America, and Asia.</p>
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
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-5xl font-bold tracking-tight">{stat.value}</p>
                <p className="mt-2 text-sm opacity-75">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story Timeline */}
      <section className="py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <p className="text-sm font-semibold text-accent tracking-wider uppercase mb-4">History</p>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">Our Journey</h2>
            <p className="mt-5 text-lg text-muted-foreground leading-relaxed">From humble beginnings to industry leadership.</p>
          </div>
          <div className="relative">
            <div className="absolute left-4 lg:left-1/2 top-0 bottom-0 w-0.5 bg-border lg:-translate-x-0.5" />
            <div className="space-y-12">
              {timeline.map((item, index) => (
                <div key={item.year} className={`relative flex items-start gap-8 ${index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"}`}>
                  <div className={`hidden lg:block flex-1 ${index % 2 === 0 ? "text-right" : "text-left"}`}>
                    <div className="inline-block">
                      <p className="text-3xl font-bold text-accent">{item.year}</p>
                      <h3 className="mt-1 text-xl font-bold text-foreground">{item.title}</h3>
                      <p className="mt-2 text-muted-foreground max-w-md">{item.description}</p>
                    </div>
                  </div>
                  <div className="absolute left-4 lg:left-1/2 h-4 w-4 rounded-full bg-accent border-4 border-background -translate-x-1/2 mt-1" />
                  <div className="flex-1 pl-12 lg:pl-0">
                    <div className="lg:hidden">
                      <p className="text-3xl font-bold text-accent">{item.year}</p>
                      <h3 className="mt-1 text-xl font-bold text-foreground">{item.title}</h3>
                      <p className="mt-2 text-muted-foreground">{item.description}</p>
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
              <p className="text-sm font-semibold text-accent tracking-wider uppercase mb-4">Our Mission</p>
              <h2 className="text-2xl font-bold tracking-tight text-foreground lg:text-3xl">Empowering Brands Through Excellence</h2>
              <p className="mt-5 text-muted-foreground leading-relaxed">Our mission is to be the trusted manufacturing partner that empowers fashion brands to bring their knitwear vision to life. We achieve this through commitment to quality, investment in technology, and genuine care for our partnerships.</p>
            </div>
            <div className="p-8 lg:p-10 rounded-2xl bg-card border border-border/60">
              <p className="text-sm font-semibold text-accent tracking-wider uppercase mb-4">Our Vision</p>
              <h2 className="text-2xl font-bold tracking-tight text-foreground lg:text-3xl">Leading the Future of Knitwear</h2>
              <p className="mt-5 text-muted-foreground leading-relaxed">We envision Tahui as the global benchmark for knitwear manufacturing excellence. A facility where cutting-edge technology meets timeless craftsmanship, where sustainability is embedded in every process.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <p className="text-sm font-semibold text-accent tracking-wider uppercase mb-4">Principles</p>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">Our Values</h2>
            <p className="mt-5 text-lg text-muted-foreground leading-relaxed">The principles that guide our decisions and shape our culture.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value) => (
              <div key={value.title} className="group text-center p-6 rounded-xl bg-card border border-border/60 hover:border-accent/30 hover:shadow-lg hover:-translate-y-1 transition-all duration-500">
                <div className="mx-auto h-14 w-14 rounded-xl bg-accent/10 flex items-center justify-center mb-5 group-hover:bg-accent/20 transition-colors duration-300">
                  <value.icon className="h-7 w-7 text-accent" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-3">{value.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{value.description}</p>
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
              <p className="text-sm font-semibold text-accent tracking-wider uppercase mb-4">Our Team</p>
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl leading-tight">The People Behind Our Products</h2>
              <p className="mt-5 text-lg text-muted-foreground leading-relaxed">Behind every garment is a team of dedicated professionals who take pride in their craft.</p>
              <p className="mt-4 text-muted-foreground leading-relaxed">We invest in our team through continuous training, safe working conditions, and opportunities for growth. Many of our team members have been with us for over a decade.</p>
              <div className="mt-10">
                <Button className="bg-primary hover:bg-accent transition-all duration-300" asChild>
                  <Link href="/factory-tour">Meet Our Team<ArrowRight className="ml-2 h-4 w-4" /></Link>
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
            <p className="text-sm font-semibold text-accent tracking-wider uppercase mb-4">Long-Term Partnerships</p>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">Building Relationships That Last</h2>
            <p className="mt-5 text-lg text-muted-foreground leading-relaxed">We do not just manufacture products - we build partnerships. Many of our clients have worked with us for 10+ years, growing together through changing markets and evolving collections.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 lg:py-32 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
        <div className="relative mx-auto max-w-4xl px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">Ready to Partner With Us?</h2>
          <p className="mt-5 text-lg text-primary-foreground/75 leading-relaxed">Join the brands that trust Tahui Sweater Factory for their knitwear manufacturing.</p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Button size="lg" variant="secondary" className="hover:bg-accent hover:text-accent-foreground transition-all duration-300" asChild>
              <Link href="/contact">Get in Touch<ArrowRight className="ml-2 h-5 w-5" /></Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:border-accent/50 transition-all duration-300" asChild>
              <Link href="/products">View Our Products</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
