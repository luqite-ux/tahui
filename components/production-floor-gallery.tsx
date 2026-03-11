"use client"

import Image from "next/image"
import { useState } from "react"

const SEAMLESS_IMAGES = [
  "/images/seamless-machine-1.png",
  "/images/seamless-machine-2.png",
  "/images/seamless-machine-5.png",
  "/images/seamless-machine-6.png",
  "/images/seamless-machine-7.png",
]

export function ProductionFloorGallery() {
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <div className="relative">
      <div className="aspect-[4/3] rounded-2xl overflow-hidden relative shadow-lg">
        <Image
          src={SEAMLESS_IMAGES[activeIndex]}
          alt={`WholeGarment seamless knitting machine ${activeIndex + 1}`}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-accent/5 to-transparent" />
      </div>
      <div className="absolute -bottom-4 -right-4 h-24 w-24 bg-accent/8 rounded-2xl -z-10" />
      {/* Thumbnails */}
      <div className="mt-4 flex flex-wrap gap-2">
        {SEAMLESS_IMAGES.map((src, i) => (
          <button
            key={src}
            type="button"
            onClick={() => setActiveIndex(i)}
            className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden shrink-0 border-2 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 ${
              activeIndex === i
                ? "border-accent shadow-md scale-[1.02]"
                : "border-transparent hover:border-accent/50 opacity-85 hover:opacity-100"
            }`}
            aria-label={`View seamless machine image ${i + 1}`}
          >
            <Image src={src} alt="" fill className="object-cover" sizes="80px" />
          </button>
        ))}
      </div>
    </div>
  )
}
