import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin } from "lucide-react";

const navigation = {
  products: [
    { name: "All Products", href: "/products" },
    { name: "Seamless Knitwear", href: "/products/category/seamless" },
    { name: "Multi-Material Collection", href: "/products/category/multi-material" },
    { name: "Advanced Craftsmanship", href: "/products/category/craftsmanship" },
  ],
  company: [
    { name: "About Us", href: "/about" },
    { name: "Manufacturing", href: "/manufacturing" },
    { name: "Factory Tour", href: "/factory-tour" },
    { name: "Quality & Certifications", href: "/quality" },
  ],
  services: [
    { name: "OEM Services", href: "/manufacturing#oem" },
    { name: "ODM Services", href: "/manufacturing#odm" },
    { name: "Custom Design", href: "/manufacturing#custom" },
    { name: "Sample Development", href: "/contact" },
  ],
};

export function Footer() {
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
              Leading seamless knitwear manufacturer in Shanghai, China. Over 20
              years of excellence in OEM &amp; ODM services for global brands.
            </p>
            <div className="mt-7 space-y-3">
              <div className="flex items-start gap-3 text-sm">
                <MapPin className="h-4 w-4 shrink-0 mt-0.5 text-accent" />
                <span className="opacity-75">
                  No. 351 Tahui Road, Songjiang District, Shanghai
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
              Products
            </h3>
            <ul className="mt-5 space-y-3">
              {navigation.products.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm opacity-70 hover:opacity-100 hover:text-accent transition-all duration-300"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold tracking-wider uppercase text-accent">
              Company
            </h3>
            <ul className="mt-5 space-y-3">
              {navigation.company.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm opacity-70 hover:opacity-100 hover:text-accent transition-all duration-300"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold tracking-wider uppercase text-accent">
              Services
            </h3>
            <ul className="mt-5 space-y-3">
              {navigation.services.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm opacity-70 hover:opacity-100 hover:text-accent transition-all duration-300"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 border-t border-primary-foreground/15 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm opacity-50">
              &copy; {new Date().getFullYear()} Tahui Sweater Factory. All
              rights reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <Link
                href="/quality"
                className="text-sm opacity-50 hover:opacity-100 hover:text-accent transition-all duration-300"
              >
                Certifications
              </Link>
              <Link
                href="/contact"
                className="text-sm opacity-50 hover:opacity-100 hover:text-accent transition-all duration-300"
              >
                Contact Us
              </Link>
              <Link
                href="/privacy"
                className="text-sm opacity-50 hover:opacity-100 hover:text-accent transition-all duration-300"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-sm opacity-50 hover:opacity-100 hover:text-accent transition-all duration-300"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
