import Image from "next/image"
import { Mail, Phone, MapPin, Clock, MessageSquare } from "lucide-react"
import { getTranslations } from "next-intl/server"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ContactForm } from "@/components/contact-form"

export default async function ContactPage() {
  const t = await getTranslations("contact")

  const contactInfo = [
    { icon: Mail, titleKey: "email" as const, content: "info@tahui-factory.cn", descKey: "emailDesc" as const },
    { icon: Phone, titleKey: "phone" as const, content: "+86 166 2168 4217", descKey: "phoneDesc" as const },
    { icon: MapPin, titleKey: "address" as const, content: "No. 351 Tahui Road, Songjiang District, Shanghai", descKey: "addressDesc" as const },
    { icon: Clock, titleKey: "hours" as const, content: "Monday - Saturday", descKey: "hoursDesc" as const },
  ]

  const steps = [t("step1"), t("step2"), t("step3"), t("step4")]

  const faqItems = [
    { q: t("faq.moqQ"), a: t("faq.moqA") },
    { q: t("faq.leadTimeQ"), a: t("faq.leadTimeA") },
    { q: t("faq.oemQ"), a: t("faq.oemA") },
    { q: t("faq.paymentQ"), a: t("faq.paymentA") },
    { q: t("faq.shipQ"), a: t("faq.shipA") },
    { q: t("faq.visitQ"), a: t("faq.visitA") },
  ] as const

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-28 pb-20 lg:pt-36 lg:pb-24 bg-gradient-to-br from-secondary via-background to-warm/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <p className="animate-fade-up text-sm font-semibold text-accent tracking-wider uppercase mb-5">{t("heroTag")}</p>
            <h1 className="animate-fade-up-delay-1 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">{t("heroTitle")}</h1>
            <p className="animate-fade-up-delay-2 mt-7 text-lg leading-relaxed text-muted-foreground">{t("heroSubtitle")}</p>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-14">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info) => (
              <Card key={info.titleKey} className="border-border/60 hover:border-accent/30 hover:shadow-lg hover:-translate-y-1 transition-all duration-500">
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                    <info.icon className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="font-bold text-foreground">{t(info.titleKey)}</h3>
                  <p className="mt-1 text-accent font-semibold">{info.content}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{t(info.descKey)}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Map */}
      <section className="py-12 lg:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Form */}
            <div>
              <ContactForm />
            </div>

            {/* Map & Quick Contact */}
            <div className="space-y-8">
              <div className="relative">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden relative shadow-lg">
                  <Image src="/images/contact-map.jpg" alt="Tahui Sweater Factory location" fill className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-tr from-accent/5 to-transparent" />
                </div>
                <div className="absolute -bottom-3 -right-3 h-20 w-20 bg-accent/8 rounded-2xl -z-10" />
              </div>
              <Card className="border-accent/20 bg-accent/5">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-xl bg-accent/15 flex items-center justify-center shrink-0">
                      <MessageSquare className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground">{t("needFasterResponse")}</h3>
                      <p className="mt-1 text-muted-foreground text-sm">{t("needFasterDesc")}</p>
                      <Button className="mt-4 border-accent/30 hover:bg-accent/10 hover:border-accent/50 transition-all duration-300 bg-transparent" variant="outline" asChild>
                        <a href="https://wa.me/8616621684217" target="_blank" rel="noopener noreferrer">{t("chatWhatsApp")}</a>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <div className="bg-secondary rounded-xl p-6">
                <h3 className="font-bold text-foreground mb-4">{t("whatHappensNext")}</h3>
                <ol className="space-y-3">
                  {steps.map((step, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="h-6 w-6 rounded-full bg-accent text-accent-foreground text-sm flex items-center justify-center shrink-0 font-bold">{index + 1}</span>
                      <span className="text-muted-foreground text-sm">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-secondary">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <p className="text-sm font-semibold text-accent tracking-wider uppercase mb-4">{t("faqTag")}</p>
            <h2 className="text-2xl font-bold text-foreground lg:text-3xl">{t("faqTitle")}</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {faqItems.map((faq) => (
              <Card key={faq.q} className="border-border/60 bg-card hover:border-accent/30 hover:shadow-lg hover:-translate-y-1 transition-all duration-500">
                <CardContent className="p-6">
                  <h3 className="font-bold text-foreground">{faq.q}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
