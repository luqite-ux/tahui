import type { Metadata } from "next"
import Link from "next/link"
import { SITE_URL } from "@/lib/seo"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "Privacy Policy - TAHUI Sweater Factory",
  description:
    "Privacy Policy for Tahui Sweater Factory. How we collect, use, and protect your information when you use our website or contact us.",
  alternates: { canonical: `${SITE_URL}/privacy` },
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen">
      <Header />

      <article className="pt-24 pb-16 lg:pt-28 lg:pb-24">
        <div className="mx-auto max-w-3xl px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Privacy Policy
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </p>

          <div className="mt-10 prose prose-neutral dark:prose-invert max-w-none">
            <p className="text-muted-foreground leading-relaxed">
              Tahui Sweater Factory (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or contact us for business inquiries.
            </p>

            <h2 className="mt-8 text-xl font-semibold text-foreground">Information We Collect</h2>
            <p className="mt-2 text-muted-foreground leading-relaxed">
              We may collect information you provide directly, such as your name, company name, email address, phone number, and message content when you use our contact form, request a quote, or communicate with us. We may also automatically collect certain technical information when you visit our site (e.g., IP address, browser type, pages visited) for analytics and site improvement.
            </p>

            <h2 className="mt-8 text-xl font-semibold text-foreground">How We Use Your Information</h2>
            <p className="mt-2 text-muted-foreground leading-relaxed">
              We use the information we collect to respond to your inquiries, process quote requests, provide OEM/ODM services, improve our website and services, and send relevant business communications. We do not sell your personal information to third parties.
            </p>

            <h2 className="mt-8 text-xl font-semibold text-foreground">Data Security and Retention</h2>
            <p className="mt-2 text-muted-foreground leading-relaxed">
              We implement appropriate technical and organizational measures to protect your data. We retain your information only as long as necessary to fulfill the purposes described in this policy or as required by law.
            </p>

            <h2 className="mt-8 text-xl font-semibold text-foreground">Cookies and Analytics</h2>
            <p className="mt-2 text-muted-foreground leading-relaxed">
              Our website may use cookies and similar technologies to enhance your experience and for analytics. You can adjust your browser settings to manage or disable cookies.
            </p>

            <h2 className="mt-8 text-xl font-semibold text-foreground">Your Rights and Contact</h2>
            <p className="mt-2 text-muted-foreground leading-relaxed">
              Depending on your jurisdiction, you may have rights to access, correct, or delete your personal data. To exercise these rights or ask questions about this policy, please contact us at{" "}
              <a href="mailto:info@tahui-factory.cn" className="text-accent hover:underline">
                info@tahui-factory.cn
              </a>
              . We may update this Privacy Policy from time to time; the &quot;Last updated&quot; date above will reflect any changes.
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
