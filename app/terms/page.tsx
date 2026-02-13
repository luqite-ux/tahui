import type { Metadata } from "next"
import Link from "next/link"
import { SITE_URL } from "@/lib/seo"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "Terms of Service - TAHUI Sweater Factory",
  description:
    "Terms of Service for using the Tahui Sweater Factory website and our manufacturing services.",
  alternates: { canonical: `${SITE_URL}/terms` },
}

export default function TermsPage() {
  return (
    <div className="min-h-screen">
      <Header />

      <article className="pt-24 pb-16 lg:pt-28 lg:pb-24">
        <div className="mx-auto max-w-3xl px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Terms of Service
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </p>

          <div className="mt-10 prose prose-neutral dark:prose-invert max-w-none">
            <p className="text-muted-foreground leading-relaxed">
              Welcome to the Tahui Sweater Factory website. By accessing or using this site, you agree to be bound by these Terms of Service. If you do not agree, please do not use our website.
            </p>

            <h2 className="mt-8 text-xl font-semibold text-foreground">Use of Website</h2>
            <p className="mt-2 text-muted-foreground leading-relaxed">
              This website is provided for informational and business inquiry purposes. You may use it to learn about our knitwear manufacturing services, view our products, and contact us for quotes or partnership inquiries. You agree not to use the site for any unlawful purpose or in any way that could damage or impair the site or our operations.
            </p>

            <h2 className="mt-8 text-xl font-semibold text-foreground">Content and Intellectual Property</h2>
            <p className="mt-2 text-muted-foreground leading-relaxed">
              All content on this website, including text, images, logos, and design, is owned by Tahui Sweater Factory or its licensors and is protected by intellectual property laws. You may not copy, reproduce, or distribute our content without prior written permission.
            </p>

            <h2 className="mt-8 text-xl font-semibold text-foreground">Business Inquiries and Orders</h2>
            <p className="mt-2 text-muted-foreground leading-relaxed">
              Inquiries submitted through our contact form or by email do not constitute a binding contract. All OEM/ODM orders, pricing, and terms are subject to separate written agreements. We reserve the right to decline or cancel any request at our discretion.
            </p>

            <h2 className="mt-8 text-xl font-semibold text-foreground">Disclaimer</h2>
            <p className="mt-2 text-muted-foreground leading-relaxed">
              We strive to keep the information on this website accurate and up to date; however, we do not warrant that all content is error-free or complete. Product images and descriptions are for reference and may vary. We are not liable for any reliance on website content for business decisions.
            </p>

            <h2 className="mt-8 text-xl font-semibold text-foreground">Limitation of Liability</h2>
            <p className="mt-2 text-muted-foreground leading-relaxed">
              To the fullest extent permitted by law, Tahui Sweater Factory shall not be liable for any indirect, incidental, or consequential damages arising from your use of this website or any business dealings with us, except as otherwise agreed in a separate written contract.
            </p>

            <h2 className="mt-8 text-xl font-semibold text-foreground">Changes and Contact</h2>
            <p className="mt-2 text-muted-foreground leading-relaxed">
              We may update these Terms of Service from time to time. The &quot;Last updated&quot; date above will reflect changes. Continued use of the site after changes constitutes acceptance. For questions about these terms, contact us at{" "}
              <a href="mailto:info@tahui-factory.cn" className="text-accent hover:underline">
                info@tahui-factory.cn
              </a>
              .
            </p>
          </div>

          <p className="mt-12">
            <Link href="/contact" className="text-sm font-medium text-accent hover:underline">
              Contact Us
            </Link>
          </p>
        </div>
      </article>

      <Footer />
    </div>
  )
}
