'use client'

import Image from 'next/image'
import { FileDown } from 'lucide-react'
import { urlFor } from '@/sanity/lib/image'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'

type Orientation = 'portrait' | 'tall' | 'landscape' | 'square'

const ASPECT_MAP: Record<Orientation, string> = {
  portrait: 'aspect-[3/4]',
  tall: 'aspect-[2/3]',
  landscape: 'aspect-[4/3]',
  square: 'aspect-square',
}

interface HonorCardProps {
  _id: string
  displayTitle: string
  description?: string | null
  image?: { asset?: { _ref?: string }; alt?: string | null } | null
  pdfUrl?: string | null
  orientation?: string | null
}

export function HonorCard({
  _id,
  displayTitle,
  description,
  image,
  pdfUrl,
  orientation = 'portrait',
}: HonorCardProps) {
  const hasImage = !!image?.asset
  const hasPdf = !!pdfUrl
  const aspectClass = ASPECT_MAP[(orientation as Orientation) ?? 'portrait'] ?? ASPECT_MAP.portrait

  return (
    <div className="group bg-card rounded-2xl overflow-hidden border border-border/60 hover:border-accent/40 hover:shadow-xl transition-all duration-300 flex flex-col">
      <div
        className={`${aspectClass} bg-muted/50 relative flex items-center justify-center overflow-hidden min-h-[180px]`}
      >
        {hasImage ? (
          <Image
            src={
              orientation === 'landscape'
                ? urlFor(image as SanityImageSource).width(1600).height(1200).url()
                : orientation === 'square'
                  ? urlFor(image as SanityImageSource).width(1200).height(1200).url()
                  : orientation === 'tall'
                    ? urlFor(image as SanityImageSource).width(900).height(1350).url()
                    : urlFor(image as SanityImageSource).width(1200).height(1600).url()
            }
            alt={image?.alt ?? displayTitle}
            fill
            className="object-contain p-3 group-hover:scale-[1.02] transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : hasPdf ? (
          <a
            href={pdfUrl!}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute inset-0 flex flex-col bg-muted/50 group-hover:bg-muted/70 transition-colors overflow-hidden"
          >
            <iframe
              src={`https://docs.google.com/viewer?url=${encodeURIComponent(pdfUrl)}&embedded=true`}
              title={`PDF: ${displayTitle}`}
              className="flex-1 w-full min-h-0 border-0"
            />
            <div className="shrink-0 px-3 py-2 bg-background/90 border-t border-border/40 flex items-center justify-between gap-2">
              <span className="text-sm font-medium text-foreground truncate">{displayTitle}</span>
              <FileDown className="h-4 w-4 text-accent shrink-0" />
            </div>
          </a>
        ) : null}
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <h4 className="font-bold text-foreground">{displayTitle}</h4>
        {description && <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{description}</p>}
        {hasPdf && hasImage && (
          <a
            href={pdfUrl!}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-2 text-sm text-accent hover:underline w-fit"
          >
            <FileDown className="h-4 w-4 shrink-0" /> Download PDF
          </a>
        )}
      </div>
    </div>
  )
}
