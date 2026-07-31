import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { Link } from "@/i18n/routing"
import { urlFor } from "@/sanity/lib/image"
import { getCategoryDisplayTitle } from "@/lib/category-locale"
import { contentImageUrl } from "@/lib/unified-content"

export type ProductCategory = {
  _id: string
  id?: string | null
  number?: string | null
  order?: number | null
  title: string
  titleZh?: string | null
  titleFr?: string | null
  image?: unknown
}

export function CategorySection({
  locale,
  categories,
}: {
  locale: string
  categories: ProductCategory[]
}) {
  const items = categories.slice(0, 12)

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-5">
      {items.map((cat, idx) => {
        const href = cat.id ? `/products/category/${encodeURIComponent(cat.id)}` : "/products"
        const title = getCategoryDisplayTitle(cat, locale)
        const imageUrl = contentImageUrl(cat.image) ?? (cat.image ? urlFor(cat.image).width(900).height(1125).url() : null)

        return (
          <Link
            key={cat._id}
            href={href}
            className={[
              "group relative overflow-hidden rounded-2xl border border-border/40 bg-card shadow-sm",
              "hover:shadow-xl hover:shadow-foreground/[0.04] hover:-translate-y-0.5 transition-all duration-500 ease-out",
            ].join(" ")}
          >
            <div className="relative aspect-[4/5]">
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={title}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
              ) : (
                <div className="absolute inset-0 bg-warm/30" />
              )}

              {/* subtle overlay */}
              <div className="absolute inset-0 bg-black/20 transition-colors duration-500 group-hover:bg-black/35" />

              {/* bottom contrast gradient for text readability */}
              <div
                className="absolute inset-x-0 bottom-0 h-1/2 pointer-events-none"
                style={{
                  backgroundImage:
                    "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 50%)",
                }}
              />

              {/* premium title */}
              <div className="absolute inset-x-0 bottom-0 p-4 lg:p-5">
                <div className="max-w-[90%]">
                  <p className="text-white/90 text-[11px] tracking-[0.22em] uppercase font-semibold">
                    {cat.number ? `${cat.number}` : String(idx + 1).padStart(2, "0")}
                  </p>
                  <h3
                    className={[
                      "mt-1 text-white font-semibold tracking-tight leading-[1.05] transition-transform duration-500 ease-out group-hover:-translate-y-0.5",
                      "text-lg sm:text-xl",
                    ].join(" ")}
                  >
                    {title}
                  </h3>
                </div>
              </div>

              {/* hover CTA */}
              <div className="absolute right-4 bottom-4 lg:right-5 lg:bottom-5 opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-md text-white ring-1 ring-white/15">
                  <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </div>
          </Link>
        )
      })}
    </div>
  )
}

