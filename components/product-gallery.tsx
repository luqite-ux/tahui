"use client"

import Image from "next/image"
import { useState } from "react"
import { ZoomIn } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

type GalleryImage = {
  src: string
  alt: string
}

type ProductGalleryProps = {
  images: GalleryImage[]
  productName: string
  locale: string
}

const labels = {
  zh: {
    gallery: "产品图片",
    open: "放大查看产品图片",
    select: (index: number) => `查看第 ${index} 张产品图片`,
  },
  fr: {
    gallery: "Images du produit",
    open: "Agrandir l’image du produit",
    select: (index: number) => `Voir l’image produit ${index}`,
  },
  en: {
    gallery: "Product images",
    open: "Enlarge product image",
    select: (index: number) => `View product image ${index}`,
  },
} as const

export function ProductGallery({ images, productName, locale }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const copy = labels[locale as keyof typeof labels] ?? labels.en
  const selectedImage = images[selectedIndex] ?? images[0]

  if (!selectedImage) return null

  return (
    <div className="space-y-4" aria-label={copy.gallery}>
      <Dialog>
        <DialogTrigger asChild>
          <button
            type="button"
            aria-label={copy.open}
            className="group relative block aspect-[4/3] w-full cursor-zoom-in overflow-hidden rounded-2xl bg-[#F5F3EF] shadow-md ring-1 ring-border/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
          >
            <Image
              src={selectedImage.src}
              alt={selectedImage.alt}
              fill
              className="object-contain"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
            <span className="absolute bottom-4 right-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-foreground opacity-0 shadow-sm transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
              <ZoomIn className="h-5 w-5" aria-hidden="true" />
            </span>
          </button>
        </DialogTrigger>
        <DialogContent className="h-[min(90vh,900px)] w-[min(94vw,1200px)] max-w-none border-0 bg-[#F5F3EF] p-4 sm:p-6">
          <DialogTitle className="sr-only">{productName}</DialogTitle>
          <DialogDescription className="sr-only">{copy.open}</DialogDescription>
          <div className="relative h-full w-full">
            <Image
              src={selectedImage.src}
              alt={selectedImage.alt}
              fill
              className="object-contain"
              sizes="94vw"
            />
          </div>
        </DialogContent>
      </Dialog>

      {images.length > 1 && (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4" role="list" aria-label={copy.gallery}>
          {images.map((image, index) => (
            <div key={`${image.src}-${index}`} role="listitem">
              <button
                type="button"
                onClick={() => setSelectedIndex(index)}
                aria-label={copy.select(index + 1)}
                aria-pressed={selectedIndex === index}
                className="relative block aspect-square w-full overflow-hidden rounded-xl bg-[#F5F3EF] ring-1 ring-border/20 transition hover:ring-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 aria-pressed:ring-2 aria-pressed:ring-accent"
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-contain"
                  sizes="(max-width: 640px) 33vw, 12vw"
                />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
