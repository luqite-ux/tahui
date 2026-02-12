"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { Menu, X, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"

const navigation = [
  { name: "Home", href: "/" },
  { name: "Products", href: "/products" },
  { name: "Manufacturing", href: "/manufacturing" },
  { name: "Factory Tour", href: "/factory-tour" },
  { name: "Quality", href: "/quality" },
  { name: "About Us", href: "/about" },
  { name: "Contact", href: "/contact" },
]

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-lg border-b border-border/40 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5 lg:px-8">
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5 flex items-center gap-3 group">
            <Image
              src="/logo.png"
              alt="Tahui Sweater Factory"
              width={120}
              height={40}
              className="h-10 w-auto transition-transform duration-300 group-hover:scale-105"
              style={{ width: "auto" }}
              priority
            />
            <div>
              <span className="text-xl font-bold text-primary tracking-tight">
                TAHUI
              </span>
              <span className="block text-[10px] text-muted-foreground tracking-[0.2em] uppercase">
                Sweater Factory
              </span>
            </div>
          </Link>
        </div>
        
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-foreground"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        
        <div className="hidden lg:flex lg:gap-x-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors duration-300 relative after:absolute after:bottom-[-6px] after:left-1/2 after:-translate-x-1/2 after:h-[1.5px] after:w-0 after:bg-accent after:rounded-full after:transition-all after:duration-300 after:ease-out hover:after:w-full"
            >
              {item.name}
            </Link>
          ))}
        </div>
        
        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-4">
          <Button className="bg-primary hover:bg-primary/90 hover:scale-[1.03] hover:shadow-md active:scale-[0.98] transition-all duration-300 ease-out" asChild>
            <Link href="/contact">
              <Phone className="mr-2 h-4 w-4" />
              Get a Quote
            </Link>
          </Button>
        </div>
      </nav>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="fixed inset-0 bg-foreground/30 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-background px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-border/50 shadow-2xl">
            <div className="flex items-center justify-between">
              <Link href="/" className="-m-1.5 p-1.5 flex items-center gap-3" onClick={() => setMobileMenuOpen(false)}>
                <Image
                  src="/logo.png"
                  alt="Tahui Sweater Factory"
                  width={108}
                  height={36}
                  className="h-9 w-auto"
                  style={{ width: "auto" }}
                />
                <span className="text-xl font-bold text-primary tracking-tight">
                  TAHUI
                </span>
              </Link>
              <button
                type="button"
                className="-m-2.5 rounded-md p-2.5 text-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <X className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-8 flow-root">
              <div className="-my-6 divide-y divide-border/50">
                <div className="space-y-1 py-6">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="-mx-3 block rounded-lg px-3 py-3 text-base font-medium text-foreground/80 hover:text-primary hover:bg-warm transition-all duration-200"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
                <div className="py-6">
                  <Button asChild className="w-full bg-primary hover:bg-primary/90 hover:shadow-md active:scale-[0.98] transition-all duration-300 ease-out">
                    <Link href="/contact" onClick={() => setMobileMenuOpen(false)}>
                      Get a Quote
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
