"use client"

import React from "react"
import { useState, useActionState } from "react"
import Image from "next/image"
import { Mail, Phone, MapPin, Clock, MessageSquare, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { submitInquiry } from "@/app/actions/submitInquiry"

const contactInfo = [
  { icon: Mail, title: "Email", content: "info@tahui-factory.cn", description: "Send us an inquiry anytime" },
  { icon: Phone, title: "Phone / WhatsApp", content: "+86 166 2168 4217", description: "Mon-Sat, 9AM-6PM (GMT+8)" },
  { icon: MapPin, title: "Factory Address", content: "No. 351 Tahui Road, Songjiang District, Shanghai", description: "Visits by appointment" },
  { icon: Clock, title: "Business Hours", content: "Monday - Saturday", description: "9:00 AM - 6:00 PM (GMT+8)" },
]

const productTypes = ["Sweaters & Pullovers", "Cardigans", "Hoodies & Sweatshirts", "Dresses & Skirts", "Scarves & Accessories", "Other Knitwear"]
const inquiryTypes = ["OEM Production Inquiry", "ODM Development Inquiry", "Sample Request", "Factory Visit Request", "General Inquiry"]

export default function ContactPage() {
  const [formData, setFormData] = useState({
    company: "", name: "", email: "", phone: "", inquiryType: "", productType: "", quantity: "", message: "",
  })
  const [state, formAction] = useActionState(submitInquiry, { ok: false, message: "" })
  const showMessage = state.message && (state.ok || !state.ok)
  const isSuccess = state.ok

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-28 pb-20 lg:pt-36 lg:pb-24 bg-gradient-to-br from-secondary via-background to-warm/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <p className="animate-fade-up text-sm font-semibold text-accent tracking-wider uppercase mb-5">Contact Us</p>
            <h1 className="animate-fade-up-delay-1 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">Get In Touch</h1>
            <p className="animate-fade-up-delay-2 mt-7 text-lg leading-relaxed text-muted-foreground">Ready to start your knitwear project? Contact our team for a free consultation and quote. We typically respond within 24 hours.</p>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-14">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info) => (
              <Card key={info.title} className="border-border/60 hover:border-accent/30 hover:shadow-lg hover:-translate-y-1 transition-all duration-500">
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                    <info.icon className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="font-bold text-foreground">{info.title}</h3>
                  <p className="mt-1 text-accent font-semibold">{info.content}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{info.description}</p>
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
              <div className="mb-8">
                <p className="text-sm font-semibold text-accent tracking-wider uppercase mb-3">Inquiry Form</p>
                <h2 className="text-2xl font-bold text-foreground lg:text-3xl">Send Us an Inquiry</h2>
                <p className="mt-3 text-muted-foreground leading-relaxed">Fill out the form below and our sales team will get back to you within 24 hours.</p>
              </div>
              <form action={formAction} className="space-y-6">
                {showMessage && (
                  <div className={`rounded-lg border p-4 ${isSuccess ? "border-green-500/50 bg-green-500/10 text-green-800 dark:text-green-200" : "border-destructive/50 bg-destructive/10 text-destructive"}`}>
                    {state.message}
                  </div>
                )}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="company">Company Name *</Label>
                    <Input id="company" name="company" required placeholder="Your company name" value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} className="border-border/60 focus:border-accent" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="name">Contact Name *</Label>
                    <Input id="name" name="name" required placeholder="Your name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="border-border/60 focus:border-accent" />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input id="email" name="email" type="email" required placeholder="your@email.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="border-border/60 focus:border-accent" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone / WhatsApp</Label>
                    <Input id="phone" name="phone" placeholder="+1 234 567 8900" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="border-border/60 focus:border-accent" />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Inquiry Type *</Label>
                    <Select required value={formData.inquiryType} onValueChange={(value) => setFormData({ ...formData, inquiryType: value })}>
                      <SelectTrigger className="border-border/60"><SelectValue placeholder="Select inquiry type" /></SelectTrigger>
                      <SelectContent>{inquiryTypes.map((type) => (<SelectItem key={type} value={type}>{type}</SelectItem>))}</SelectContent>
                    </Select>
                    <input type="hidden" name="inquiryType" value={formData.inquiryType} />
                  </div>
                  <div className="space-y-2">
                    <Label>Product Category</Label>
                    <Select value={formData.productType} onValueChange={(value) => setFormData({ ...formData, productType: value })}>
                      <SelectTrigger className="border-border/60"><SelectValue placeholder="Select product type" /></SelectTrigger>
                      <SelectContent>{productTypes.map((type) => (<SelectItem key={type} value={type}>{type}</SelectItem>))}</SelectContent>
                    </Select>
                    <input type="hidden" name="productType" value={formData.productType} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quantity">Estimated Order Quantity</Label>
                  <Input id="quantity" name="quantity" placeholder="e.g., 500-1000 pieces per style" value={formData.quantity} onChange={(e) => setFormData({ ...formData, quantity: e.target.value })} className="border-border/60 focus:border-accent" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message / Project Details *</Label>
                  <Textarea id="message" name="message" required rows={5} placeholder="Please describe your project requirements..." value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} className="border-border/60 focus:border-accent" />
                </div>
                <Button type="submit" size="lg" className="w-full sm:w-auto bg-primary hover:bg-accent transition-all duration-300 hover:shadow-lg">
                  <Send className="mr-2 h-4 w-4" />
                  Send Inquiry
                </Button>
              </form>
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
                      <h3 className="font-bold text-foreground">Need Faster Response?</h3>
                      <p className="mt-1 text-muted-foreground text-sm">For urgent inquiries, reach us directly via WhatsApp.</p>
                      <Button className="mt-4 border-accent/30 hover:bg-accent/10 hover:border-accent/50 transition-all duration-300 bg-transparent" variant="outline" asChild>
                        <a href="https://wa.me/8616621684217" target="_blank" rel="noopener noreferrer">Chat on WhatsApp</a>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <div className="bg-secondary rounded-xl p-6">
                <h3 className="font-bold text-foreground mb-4">What Happens Next?</h3>
                <ol className="space-y-3">
                  {["Our sales team reviews your inquiry within 24 hours", "We contact you to discuss requirements in detail", "You receive a detailed quotation and timeline", "Sample development begins upon confirmation"].map((step, index) => (
                    <li key={step} className="flex items-start gap-3">
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
            <p className="text-sm font-semibold text-accent tracking-wider uppercase mb-4">FAQ</p>
            <h2 className="text-2xl font-bold text-foreground lg:text-3xl">Frequently Asked Questions</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { q: "What is your MOQ?", a: "Our minimum order quantity is typically 300-500 pieces per style/color, depending on complexity." },
              { q: "What is your lead time?", a: "Sample development takes 7-14 days. Production lead time is 30-45 days depending on order size." },
              { q: "Do you accept OEM orders?", a: "Yes, we provide both OEM (your designs) and ODM (our designs) services for all knitwear products." },
              { q: "What payment terms do you accept?", a: "We typically accept T/T (30% deposit, 70% before shipment) and L/C for larger orders." },
              { q: "Can you ship worldwide?", a: "Yes, we export to over 30 countries. We work with reliable logistics partners for global delivery." },
              { q: "Do you offer factory visits?", a: "Absolutely! We welcome factory visits by appointment. Contact us to schedule a tour." },
            ].map((faq) => (
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
