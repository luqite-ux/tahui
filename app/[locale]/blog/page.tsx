import type { Metadata } from "next"
import Image from "next/image"
import { getTranslations } from "next-intl/server"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Link } from "@/i18n/routing"
import { client } from "@/sanity/lib/client"
import { BLOG_POSTS_QUERY } from "@/sanity/lib/queries"
import { urlFor } from "@/sanity/lib/image"
import { getBlogDisplayExcerpt, getBlogDisplayTitle } from "@/lib/blog-locale"
import { SITE_URL, canonicalPath } from "@/lib/seo"

export const revalidate = 60

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const title = locale === "zh" ? "博客" : locale === "fr" ? "Blog" : "Blog"
  const description =
    locale === "zh"
      ? "阅读塔汇针织厂的最新动态、工艺与制造洞察。"
      : locale === "fr"
        ? "Découvrez les actualités et insights de Tahui Sweater Factory."
        : "Read the latest updates and insights from Tahui Sweater Factory."
  const path = canonicalPath("/blog", locale)
  return {
    title: `${title} - TAHUI Sweater Factory`,
    description,
    alternates: { canonical: `${SITE_URL}${path}` },
  }
}

export default async function BlogIndexPage({ params }: Props) {
  const { locale } = await params
  const tCommon = await getTranslations({ locale, namespace: "common" })
  const tNav = await getTranslations({ locale, namespace: "nav" })

  const posts = await client.fetch<
    Array<{
      _id: string
      slug: string
      title: string
      titleZh?: string | null
      titleFr?: string | null
      excerpt?: string | null
      excerptZh?: string | null
      excerptFr?: string | null
      publishedAt?: string | null
      coverImage?: { asset?: { _ref?: string }; alt?: string | null } | null
    }>
  >(BLOG_POSTS_QUERY)

  const pageTitle = locale === "zh" ? "博客" : locale === "fr" ? "Blog" : "Blog"
  const pageSubtitle =
    locale === "zh"
      ? "制造、工艺与合作洞察"
      : locale === "fr"
        ? "Insights sur la fabrication et le savoir-faire"
        : "Manufacturing, craftsmanship, and partnership insights"

  return (
    <div className="min-h-screen">
      <Header />

      <main className="pt-24 pb-16 lg:pt-28 lg:pb-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-10">
            <p className="text-sm font-semibold text-accent tracking-[0.2em] uppercase">
              {tNav("home")}
            </p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              {pageTitle}
            </h1>
            <p className="mt-4 text-muted-foreground max-w-2xl">
              {pageSubtitle}
            </p>
          </div>

          {posts.length === 0 ? (
            <div className="rounded-2xl border border-border bg-card p-10 text-center text-muted-foreground">
              {locale === "zh"
                ? "暂无博客文章。"
                : locale === "fr"
                  ? "Aucun article pour le moment."
                  : "No blog posts yet."}
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => {
                const title = getBlogDisplayTitle(post, locale)
                const excerpt = getBlogDisplayExcerpt(post, locale)
                const dateText = post.publishedAt
                  ? new Date(post.publishedAt).toLocaleDateString(locale === "zh" ? "zh-CN" : locale === "fr" ? "fr-FR" : "en-US", {
                      year: "numeric",
                      month: "short",
                      day: "2-digit",
                    })
                  : null
                const href = `/blog/${encodeURIComponent(post.slug)}`
                return (
                  <Link
                    key={post._id}
                    href={href}
                    className="group rounded-2xl border border-border bg-card overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="relative aspect-[16/10] bg-warm/30">
                      {post.coverImage?.asset ? (
                        <Image
                          src={urlFor(post.coverImage).width(1200).height(750).url()}
                          alt={post.coverImage?.alt ?? title}
                          fill
                          className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
                          sizes="(max-width: 1024px) 100vw, 33vw"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-sm">
                          {tCommon("noImage")}
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      {dateText && (
                        <p className="text-xs font-medium text-muted-foreground">
                          {dateText}
                        </p>
                      )}
                      <h2 className="mt-2 text-lg font-semibold text-foreground group-hover:text-accent transition-colors line-clamp-2">
                        {title}
                      </h2>
                      {excerpt && (
                        <p className="mt-3 text-sm text-muted-foreground line-clamp-3">
                          {excerpt}
                        </p>
                      )}
                      <div className="mt-5 text-sm font-medium text-accent">
                        {locale === "zh" ? "阅读更多" : locale === "fr" ? "Lire la suite" : "Read more"}
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}

          <div className="mt-12 text-center text-sm text-muted-foreground">
            <span className="opacity-70">
              {locale === "zh"
                ? "想了解更多合作信息？"
                : locale === "fr"
                  ? "Vous souhaitez en savoir plus sur la collaboration ?"
                  : "Want to discuss a project?"}
            </span>{" "}
            <Link href="/contact" className="text-accent hover:underline">
              {locale === "zh" ? "联系我们" : locale === "fr" ? "Contactez-nous" : "Contact us"}
            </Link>
            .
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

