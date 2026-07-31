import type { Metadata } from "next"
import Image from "next/image"
import { notFound } from "next/navigation"
import { getTranslations } from "next-intl/server"
import { PortableText } from "next-sanity"
import { ArrowLeft } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Link } from "@/i18n/routing"
import { client } from "@/sanity/lib/client"
import { urlFor } from "@/sanity/lib/image"
import { getBlogDisplayBody, getBlogDisplayExcerpt, getBlogDisplayTitle } from "@/lib/blog-locale"
import { SITE_URL, canonicalPath } from "@/lib/seo"
import { contentImageUrl, getUnifiedArticle, type UnifiedArticle } from "@/lib/unified-content"

export const revalidate = 60
export const dynamicParams = true

type Props = { params: Promise<{ locale: string; slug: string }> }

const BLOG_FIELDS = `_id,
  title, titleZh, titleFr,
  excerpt, excerptZh, excerptFr,
  "slug": slug.current,
  publishedAt,
  coverImage{..., alt},
  body,
  bodyZh,
  bodyFr`

const BLOG_BY_SLUG_QUERY = `*[_type == "blogPost" && slug.current == $slug][0]{ ${BLOG_FIELDS} }`

const META_FIELDS = `title, titleZh, titleFr, excerpt, excerptZh, excerptFr`
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  const tCommon = await getTranslations({ locale, namespace: "common" })
  let post: any = await getUnifiedArticle(slug)
  if (post === undefined || !post) post = await client.fetch<{
    title?: string
    titleZh?: string | null
    titleFr?: string | null
    excerpt?: string | null
    excerptZh?: string | null
    excerptFr?: string | null
  } | null>(`*[_type == "blogPost" && slug.current == $slug][0]{ ${META_FIELDS} }`, { slug })

  if (!post?.title) return { title: tCommon("more") }

  const displayTitle = getBlogDisplayTitle(post as any, locale)
  const displayExcerpt = getBlogDisplayExcerpt(post as any, locale)
  const path = canonicalPath(`/blog/${slug}`, locale)
  return {
    title: `${displayTitle} - TAHUI Blog`,
    description: displayExcerpt ?? undefined,
    alternates: { canonical: `${SITE_URL}${path}` },
  }
}

export default async function BlogDetailPage({ params }: Props) {
  const { locale, slug } = await params
  const tCommon = await getTranslations({ locale, namespace: "common" })

  let post: any = await getUnifiedArticle(slug)
  if (post === undefined || !post) post = await client.fetch<{
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
    body?: any[] | null
    bodyZh?: any[] | null
    bodyFr?: any[] | null
  } | null>(BLOG_BY_SLUG_QUERY, { slug })

  if (!post) notFound()

  const title = getBlogDisplayTitle(post as any, locale)
  const excerpt = getBlogDisplayExcerpt(post as any, locale)
  const body = getBlogDisplayBody(post as any, locale)
  const htmlBody = locale === "zh"
    ? post.contentHtmlZh ?? post.contentHtml
    : locale === "fr"
      ? post.contentHtmlFr ?? post.contentHtml
      : post.contentHtml
  const dateText = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString(locale === "zh" ? "zh-CN" : locale === "fr" ? "fr-FR" : "en-US", {
        year: "numeric",
        month: "long",
        day: "2-digit",
      })
    : null

  return (
    <div className="min-h-screen">
      <Header />

      <article className="pt-24 pb-16 lg:pt-28 lg:pb-24">
        <div className="mx-auto max-w-3xl px-6 lg:px-8">
          <nav className="mb-8">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              {locale === "zh" ? "返回博客" : locale === "fr" ? "Retour au blog" : "Back to blog"}
            </Link>
          </nav>

          <header>
            {dateText && (
              <p className="text-sm text-muted-foreground">
                {dateText}
              </p>
            )}
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl leading-tight">
              {title}
            </h1>
            {excerpt && (
              <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
                {excerpt}
              </p>
            )}
          </header>

          <div className="mt-10">
            {post.coverImage?.asset || contentImageUrl(post.coverImage) ? (
              <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-warm/30 shadow-md ring-1 ring-border/20">
                <Image
                  src={contentImageUrl(post.coverImage) ?? urlFor(post.coverImage as any).width(1600).height(900).url()}
                  alt={post.coverImage?.alt ?? title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 768px"
                  priority
                />
              </div>
            ) : null}
          </div>

          <div className="mt-10 prose prose-neutral dark:prose-invert max-w-none">
            {htmlBody ? (
              <div dangerouslySetInnerHTML={{ __html: htmlBody }} />
            ) : body ? (
              <PortableText value={body} />
            ) : (
              <p className="text-muted-foreground">
                {locale === "zh"
                  ? "暂无正文内容。"
                  : locale === "fr"
                    ? "Aucun contenu."
                    : "No content."}
              </p>
            )}
          </div>

          <div className="mt-12 rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">
            <span className="opacity-80">
              {locale === "zh"
                ? "想快速推进项目？"
                : locale === "fr"
                  ? "Vous voulez avancer rapidement ?"
                  : "Want to move fast?"}
            </span>{" "}
            <Link href="/contact" className="text-accent hover:underline">
              {locale === "zh" ? "联系我们获取报价" : locale === "fr" ? "Contactez-nous" : "Contact us"}
            </Link>
            .
          </div>
        </div>
      </article>

      <Footer />
    </div>
  )
}

