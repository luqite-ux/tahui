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
    <div className="flex items-center gap-1 rounded-lg border border-border/60 bg-card/60 p-0.5">
      {LOCALES.map(({ code, label }) => (
        <button
          key={code}
          type="button"
          onClick={() => router.replace(pathname, { locale: code })}
          className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
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
