import type { Metadata } from "next"
import Image from "next/image"
import { Link } from "@/i18n/routing"
import { SITE_URL } from "@/lib/seo"
import { ArrowRight, Building2, Cpu, Users, Package, BarChart3, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductionFloorGallery } from "@/components/production-floor-gallery"

export const metadata: Metadata = {
  title: "Factory Tour - See Our Production Facility",
  description: "Take a virtual tour of our modern knitwear manufacturing facility in Shanghai. 200+ machines, quality control, finishing and logistics.",
  alternates: { canonical: `${SITE_URL}/factory-tour` },
}

const factoryStats = [
  { icon: Building2, value: "15,000 m\u00B2", label: "Factory Area" },
  { icon: Cpu, value: "200+", label: "Knitting Machines" },
  { icon: Users, value: "500+", label: "Skilled Workers" },
  { icon: Package, value: "100K", label: "Monthly Capacity" },
  { icon: Clock, value: "24/7", label: "Production Operation" },
  { icon: BarChart3, value: "$8.3M+", label: "Annual Export" },
]

const facilities = [
  { title: "Production Floor", description: "Our main production hall houses over 200 state-of-the-art seamless knitting machines, organized in efficient production lines with optimized workflow.", image: "/images/seamless-machine-1.png", features: ["200+ WholeGarment machines", "Climate-controlled environment", "Optimized production layout", "Real-time monitoring systems"] },
  { title: "Sample Development Center", description: "Our dedicated sample development team works in a specialized facility equipped with prototype machines, yarn libraries, and design software.", image: "/images/sorting-workshop.jpg", features: ["Rapid sample development", "Extensive yarn library", "CAD design systems", "Color matching lab"] },
  { title: "Quality Control Lab", description: "Our quality control laboratory features advanced testing equipment for yarn analysis, color fastness testing, and garment inspection.", image: "/images/finishing-workshop.jpg", features: ["Yarn testing equipment", "Color fastness testing", "Dimensional stability checks", "AQL inspection stations"] },
  { title: "Finishing Department", description: "After knitting, garments move to our finishing department for washing, blocking, pressing, and final touches.", image: "/images/steaming-workshop-1.jpg", features: ["Professional washing machines", "Steam pressing equipment", "Hand finishing stations", "Specialty treatments"] },
  { title: "Warehouse & Logistics", description: "Our modern warehouse facility ensures efficient inventory management and timely order fulfillment.", image: "/images/warehouse.jpg", features: ["Climate-controlled storage", "Inventory management system", "Export documentation", "Global shipping partners"] },
]

const digitalFeatures = [
  { title: "Production Tracking", description: "Real-time tracking of every order through production stages." },
  { title: "Quality Dashboard", description: "Live quality metrics and inspection data for management." },
  { title: "Inventory Management", description: "Automated yarn and finished goods inventory tracking." },
  { title: "Order Management", description: "Comprehensive order tracking with milestone updates." },
]

export default function FactoryTourPage() {
  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-28 pb-20 lg:pt-36 lg:pb-24 bg-gradient-to-br from-secondary via-background to-warm/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="animate-fade-up text-sm font-semibold text-accent tracking-wider uppercase mb-5">Virtual Factory Tour</p>
            <h1 className="animate-fade-up-delay-1 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl text-balance leading-[1.1]">Inside Our Manufacturing Facility</h1>
            <p className="animate-fade-up-delay-2 mt-7 text-lg leading-relaxed text-muted-foreground">Welcome to Tahui Sweater Factory. Our modern 15,000 square meter facility in Shanghai combines cutting-edge technology with skilled craftsmanship to produce premium knitwear for brands worldwide.</p>
            <div className="animate-fade-up-delay-3 mt-10">
              <Button size="lg" className="bg-primary hover:bg-accent transition-all duration-300 hover:shadow-lg" asChild>
                <Link href="/contact">Schedule a Live Tour<ArrowRight className="ml-2 h-5 w-5" /></Link>
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
            {factoryStats.map((stat) => (
              <div key={stat.label} className="text-center group">
                <div className="mx-auto h-12 w-12 rounded-full bg-primary-foreground/10 flex items-center justify-center mb-3 group-hover:bg-accent/20 transition-colors duration-300">
                  <stat.icon className="h-6 w-6" />
                </div>
                <p className="text-3xl font-bold">{stat.value}</p>
                <p className="text-sm opacity-75">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Facility Areas */}
      <section className="py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <p className="text-sm font-semibold text-accent tracking-wider uppercase mb-4">Our Facilities</p>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">Explore Our Facilities</h2>
            <p className="mt-5 text-lg text-muted-foreground leading-relaxed">From raw materials to finished products, tour the key areas of our integrated manufacturing facility.</p>
          </div>
          <div className="space-y-24">
            {facilities.map((facility, index) => (
              <div key={facility.title} className="grid lg:grid-cols-2 gap-16 items-center">
                <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                  {index === 0 ? (
                    <ProductionFloorGallery />
                  ) : (
                    <div className="relative">
                      <div className="aspect-[4/3] rounded-2xl overflow-hidden relative shadow-lg">
                        <Image src={facility.image || "/placeholder.svg"} alt={facility.title} fill className="object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-tr from-accent/5 to-transparent" />
                      </div>
                      <div className={`absolute -bottom-4 ${index % 2 === 0 ? '-right-4' : '-left-4'} h-24 w-24 bg-accent/8 rounded-2xl -z-10`} />
                    </div>
                  )}
                </div>
                <div className={index % 2 === 1 ? "lg:order-1" : ""}>
                  <h3 className="text-2xl font-bold tracking-tight text-foreground lg:text-3xl">{facility.title}</h3>
                  <p className="mt-5 text-muted-foreground leading-relaxed">{facility.description}</p>
                  <div className="mt-6 grid sm:grid-cols-2 gap-3">
                    {facility.features.map((feature) => (
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
              <p className="text-sm font-semibold text-accent tracking-wider uppercase mb-4">Digital Factory</p>
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl leading-tight">Digitalized Production Management</h2>
              <p className="mt-5 text-lg text-muted-foreground leading-relaxed">Our factory operates on a fully integrated digital management system that provides real-time visibility into every aspect of production.</p>
              <div className="mt-8 grid sm:grid-cols-2 gap-6">
                {digitalFeatures.map((feature) => (
                  <div key={feature.title} className="p-4 rounded-xl bg-card border border-border/60">
                    <h3 className="font-bold text-foreground">{feature.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden relative shadow-xl">
                <Image src="/images/factory-gate.jpg" alt="Shanghai Tahui Knitting Factory entrance" fill className="object-cover" />
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
          <p className="text-sm font-semibold text-accent tracking-wider uppercase mb-4">Visit Us</p>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">Want to See More?</h2>
          <p className="mt-5 text-lg text-muted-foreground leading-relaxed">Schedule a live video tour with our team to see our factory in action.</p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Button size="lg" className="bg-primary hover:bg-accent transition-all duration-300 hover:shadow-lg" asChild>
              <Link href="/contact">Schedule a Live Tour<ArrowRight className="ml-2 h-5 w-5" /></Link>
            </Button>
            <Button size="lg" variant="outline" className="border-accent/30 hover:bg-accent/10 hover:border-accent/50 transition-all duration-300 bg-transparent" asChild>
              <Link href="/manufacturing">View Capabilities</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
