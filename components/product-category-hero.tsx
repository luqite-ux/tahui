import Image from "next/image"
import { Link } from "@/i18n/routing"
import { ArrowRight } from "lucide-react"
import type { ProductCategoryHeroLocaleCopy } from "@/lib/data/product-category-heroes"
import { pickHeroTitles } from "@/lib/data/product-category-heroes"

export type ProductCategoryHeroProps = {
  locale: string
  copy: ProductCategoryHeroLocaleCopy
  categoryNumberLabel: string
  imageUrl: string
  imageAlt: string
  linkHref: string
  buttonText: string
  /** 桌面端是否将图片置于左侧（图左文右） */
  reverse?: boolean
  imagePriority?: boolean
}

export function ProductCategoryHero({
  locale,
  copy,
  categoryNumberLabel,
  imageUrl,
  imageAlt,
  linkHref,
  buttonText,
  reverse = false,
  imagePriority = false,
}: ProductCategoryHeroProps) {
  const { primary, secondary } = pickHeroTitles(copy, locale)

  return (
    <div className="mb-12 rounded-[40px] border border-stone-200/80 bg-[#F3F0EB] p-8 sm:p-10 lg:p-12">
      <div
        className={[
          "flex flex-col gap-10 lg:flex-row lg:items-center lg:gap-12 xl:gap-16",
          reverse ? "lg:flex-row-reverse" : "",
        ].join(" ")}
      >
        {/* 文案区约 52%–55% */}
        <div className="w-full min-w-0 shrink-0 lg:w-[55%] lg:max-w-none">
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground sm:text-xs">
            {copy.eyebrow}
          </p>
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-accent">
            {categoryNumberLabel}
          </p>
          <h2 className="mt-5 text-4xl font-bold tracking-tight text-foreground sm:text-5xl sm:leading-[1.08]">
            {primary}
          </h2>
          <p className="mt-3 text-base font-light leading-relaxed text-muted-foreground sm:text-lg">
            {secondary}
          </p>
          {/* 一行三卖点，参考图2：短标签 + 斜杠分隔 */}
          <p className="mt-8 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-foreground/70">
            {copy.features.map((tag, i) => (
              <span key={tag} className="inline-flex items-center gap-x-2">
                {i > 0 ? <span className="text-stone-300 select-none">/</span> : null}
                <span>{tag}</span>
              </span>
            ))}
          </p>
          {copy.breadcrumb ? (
            <p className="mt-6 text-xs tracking-wide text-muted-foreground">{copy.breadcrumb}</p>
          ) : null}
          <div className="mt-9">
            <Link
              href={linkHref}
              className="inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent px-6 py-2.5 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent/92"
            >
              {buttonText}
              <ArrowRight className="h-4 w-4" strokeWidth={1.75} aria-hidden />
            </Link>
          </div>
        </div>

        {/* 图片区约 45%–48%，大图、大圆角 */}
        <Link
          href={linkHref}
          className="block w-full min-w-0 shrink-0 lg:w-[45%]"
          aria-label={buttonText}
        >
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl bg-stone-100">
            <Image
              src={imageUrl}
              alt={imageAlt}
              fill
              className="object-cover [object-position:50%_28%]"
              sizes="(max-width: 1024px) 100vw, 42vw"
              priority={imagePriority}
            />
          </div>
        </Link>
      </div>
    </div>
  )
}
