import type { Metadata } from "next"
import { Link } from "@/i18n/routing"
import { SITE_URL } from "@/lib/seo"
import { getTranslations } from "next-intl/server"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "privacy" })
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: { canonical: `${SITE_URL}/privacy` },
  }
}

const localeToDateLocale: Record<string, string> = { en: "en-US", zh: "zh-CN", fr: "fr-FR" }

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations("privacy")
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

            <h2 className="mt-8 text-xl font-semibold text-foreground">{t("sections.collect.title")}</h2>
            <p className="mt-2 text-muted-foreground leading-relaxed">
              {t("sections.collect.body")}
            </p>

            <h2 className="mt-8 text-xl font-semibold text-foreground">{t("sections.use.title")}</h2>
            <p className="mt-2 text-muted-foreground leading-relaxed">
              {t("sections.use.body")}
            </p>

            <h2 className="mt-8 text-xl font-semibold text-foreground">{t("sections.security.title")}</h2>
            <p className="mt-2 text-muted-foreground leading-relaxed">
              {t("sections.security.body")}
            </p>

            <h2 className="mt-8 text-xl font-semibold text-foreground">{t("sections.cookies.title")}</h2>
            <p className="mt-2 text-muted-foreground leading-relaxed">
              {t("sections.cookies.body")}
            </p>

            <h2 className="mt-8 text-xl font-semibold text-foreground">{t("sections.rights.title")}</h2>
            <p className="mt-2 text-muted-foreground leading-relaxed">
              {t("sections.rights.bodyBefore")}{" "}
              <a href="mailto:info@tahui-factory.cn" className="text-accent hover:underline">
                info@tahui-factory.cn
              </a>
              . {t("sections.rights.bodyAfter")}
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
