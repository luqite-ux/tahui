import Image from "next/image";
import { Mail, Phone, MapPin } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { client } from "@/sanity/lib/client";
import { PRODUCT_CATEGORIES_QUERY } from "@/sanity/lib/queries";
import { getCategoryDisplayTitle } from "@/lib/category-locale";

const footerNav = {
  company: [
    { key: "aboutUs", href: "/about" },
    { key: "manufacturing", href: "/manufacturing" },
    { key: "factoryTour", href: "/factory-tour" },
    { key: "qualityCertifications", href: "/quality" },
  ],
  services: [
    { key: "oemServices", href: "/manufacturing#oem" },
    { key: "odmServices", href: "/manufacturing#odm" },
    { key: "customDesign", href: "/manufacturing#custom" },
    { key: "sampleDevelopment", href: "/contact" },
  ],
} as const;

export async function Footer() {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "footer" });
  const productCategories = await client.fetch<
    Array<{
      _id: string;
      id?: string | null;
      title: string;
      titleZh?: string | null;
      titleFr?: string | null;
      order?: number | null;
      number?: string | null;
    }>
  >(PRODUCT_CATEGORIES_QUERY);
  const footerCategories = productCategories.filter((c) => !!c?.id).slice(0, 12);

  return (
    <footer className="bg-primary text-primary-foreground relative overflow-hidden">
      <div className="absolute top-0 right-0 w-80 h-80 bg-accent/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-1/4 w-48 h-48 bg-accent/5 rounded-full blur-2xl translate-y-1/3" />

      <div className="relative mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="h-12 w-12 bg-white rounded-lg p-1.5 flex items-center justify-center group-hover:shadow-lg transition-shadow duration-300">
                <Image
                  src="/logo.png"
                  alt="Tahui Sweater Factory"
                  width={40}
                  height={40}
                  className="object-contain"
                  style={{ width: "auto", height: "auto" }}
                />
              </div>
              <div>
                <span className="text-2xl font-bold tracking-tight">
                  TAHUI
                </span>
                <span className="block text-[10px] tracking-[0.2em] uppercase opacity-70">
                  Sweater Factory
                </span>
              </div>
            </Link>
            <p className="mt-5 text-sm leading-relaxed opacity-75">
              {t("tagline")}
            </p>
            <div className="mt-7 space-y-3">
              <div className="flex items-start gap-3 text-sm">
                <MapPin className="h-4 w-4 shrink-0 mt-0.5 text-accent" />
                <span className="opacity-75">
                  {t("address")}
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 shrink-0 text-accent" />
                <a
                  href="mailto:info@tahui-factory.cn"
                  className="opacity-75 hover:opacity-100 hover:text-accent transition-all duration-300"
                >
                  info@tahui-factory.cn
                </a>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="h-4 w-4 shrink-0 text-accent" />
                <a
                  href="tel:+8616621684217"
                  className="opacity-75 hover:opacity-100 hover:text-accent transition-all duration-300"
                >
                  +86 166 2168 4217
                </a>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold tracking-wider uppercase text-accent">
              {t("products")}
            </h3>
            <div className="mt-5">
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/products"
                    className="text-sm opacity-70 hover:opacity-100 hover:text-accent transition-all duration-300"
                  >
                    {t("allProducts")}
                  </Link>
                </li>
              </ul>
              {footerCategories.length > 0 && (
                <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3">
                  {footerCategories.map((cat) => (
                    <li key={cat._id}>
                      <Link
                        href={`/products/category/${encodeURIComponent(cat.id as string)}`}
                        className="text-sm opacity-70 hover:opacity-100 hover:text-accent transition-all duration-300"
                      >
                        {getCategoryDisplayTitle(cat, locale)}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold tracking-wider uppercase text-accent">
              {t("company")}
            </h3>
            <ul className="mt-5 space-y-3">
              {footerNav.company.map((item) => (
                <li key={item.key}>
                  <Link
                    href={item.href}
                    className="text-sm opacity-70 hover:opacity-100 hover:text-accent transition-all duration-300"
                  >
                    {t(item.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold tracking-wider uppercase text-accent">
              {t("services")}
            </h3>
            <ul className="mt-5 space-y-3">
              {footerNav.services.map((item) => (
                <li key={item.key}>
                  <Link
                    href={item.href}
                    className="text-sm opacity-70 hover:opacity-100 hover:text-accent transition-all duration-300"
                  >
                    {t(item.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 border-t border-primary-foreground/15 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm opacity-50">
              &copy; {new Date().getFullYear()} {t("rightsReserved")}
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <Link
                href="/quality"
                className="text-sm opacity-50 hover:opacity-100 hover:text-accent transition-all duration-300"
              >
                {t("certifications")}
              </Link>
              <Link
                href="/contact"
                className="text-sm opacity-50 hover:opacity-100 hover:text-accent transition-all duration-300"
              >
                {t("contactUs")}
              </Link>
              <Link
                href="/privacy"
                className="text-sm opacity-50 hover:opacity-100 hover:text-accent transition-all duration-300"
              >
                {t("privacyPolicy")}
              </Link>
              <Link
                href="/terms"
                className="text-sm opacity-50 hover:opacity-100 hover:text-accent transition-all duration-300"
              >
                {t("termsOfService")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
