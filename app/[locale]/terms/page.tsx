import type { Metadata } from "next"
import { Link } from "@/i18n/routing"
import { SITE_URL, canonicalPath } from "@/lib/seo"
import { getTranslations } from "next-intl/server"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "terms" })
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: { canonical: `${SITE_URL}${canonicalPath("/terms", locale)}` },
  }
}

const localeToDateLocale: Record<string, string> = { en: "en-US", zh: "zh-CN", fr: "fr-FR" }

export default async function TermsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations("terms")
  const dateLocale = localeToDateLocale[locale] ?? "en-US"

  return (
    <div className="min-h-screen">
      <Header />

      <article className="pt-24 pb-16 lg:pt-28 lg:pb-24">
        <div className="mx-auto max-w-3xl px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {t("title")}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {t("lastUpdated")}: {new Date().toLocaleDateString(dateLocale, { year: "numeric", month: "long", day: "numeric" })}
          </p>

          <div className="mt-10 prose prose-neutral dark:prose-invert max-w-none">
            <p className="text-muted-foreground leading-relaxed">
              {t("intro")}
            </p>

            <h2 className="mt-8 text-xl font-semibold text-foreground">{t("sections.useWebsite.title")}</h2>
            <p className="mt-2 text-muted-foreground leading-relaxed">
              {t("sections.useWebsite.body")}
            </p>

            <h2 className="mt-8 text-xl font-semibold text-foreground">{t("sections.ip.title")}</h2>
            <p className="mt-2 text-muted-foreground leading-relaxed">
              {t("sections.ip.body")}
            </p>

            <h2 className="mt-8 text-xl font-semibold text-foreground">{t("sections.business.title")}</h2>
            <p className="mt-2 text-muted-foreground leading-relaxed">
              {t("sections.business.body")}
            </p>

            <h2 className="mt-8 text-xl font-semibold text-foreground">{t("sections.disclaimer.title")}</h2>
            <p className="mt-2 text-muted-foreground leading-relaxed">
              {t("sections.disclaimer.body")}
            </p>

            <h2 className="mt-8 text-xl font-semibold text-foreground">{t("sections.liability.title")}</h2>
            <p className="mt-2 text-muted-foreground leading-relaxed">
              {t("sections.liability.body")}
            </p>

            <h2 className="mt-8 text-xl font-semibold text-foreground">{t("sections.changes.title")}</h2>
            <p className="mt-2 text-muted-foreground leading-relaxed">
              {t("sections.changes.bodyBefore")}{" "}
              <a href="mailto:info@tahui-factory.cn" className="text-accent hover:underline">
                info@tahui-factory.cn
              </a>
              .
            </p>
          </div>

          <p className="mt-12">
            <Link href="/contact" className="text-sm font-medium text-accent hover:underline">
              {t("contactUs")}
            </Link>
          </p>
        </div>
      </article>

      <Footer />
    </div>
  )
}
