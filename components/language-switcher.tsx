"use client"

import { useLocale } from "next-intl"
import { usePathname, useRouter } from "@/i18n/routing"

const LOCALES = [
  { code: "en", label: "EN" },
  { code: "zh", label: "中文" },
  { code: "fr", label: "FR" },
] as const

export function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  return (
    <div className="flex shrink-0 items-center gap-1 whitespace-nowrap rounded-lg border border-border/60 bg-card/60 p-0.5">
      {LOCALES.map(({ code, label }) => (
        <button
          key={code}
          type="button"
          onClick={() => router.replace(pathname, { locale: code })}
          className={`min-w-10 shrink-0 whitespace-nowrap rounded-md px-2.5 py-1 text-xs font-medium leading-5 transition-colors ${
            locale === code
              ? "bg-accent text-accent-foreground"
              : "text-muted-foreground hover:text-foreground hover:bg-warm"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
