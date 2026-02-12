"use client"

import Image from "next/image"
import { useState, useEffect, useCallback } from "react"

const defaultSlides = [
  { src: "/images/hero-model.png", alt: "Model wearing cream open-knit cardigan with gold buttons" },
  { src: "/images/hero-model-2.png", alt: "Model wearing ivory ruffle-front V-neck knit sweater" },
  { src: "/images/hero-model-3.png", alt: "Model wearing brown and pink ombre textured knit sweater" },
  { src: "/images/hero-model-4.png", alt: "Model wearing blue lace-trimmed knit turtleneck" },
]

type HeroCarouselProps = {
  slides?: { src: string; alt: string }[]
}

export function HeroCarousel({ slides }: HeroCarouselProps) {
  const heroImages = slides?.length ? slides : defaultSlides
  const [current, setCurrent] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % heroImages.length)
  }, [heroImages.length])

  useEffect(() => {
    if (isPaused) return
    const timer = setInterval(next, 4500)
    return () => clearInterval(timer)
  }, [isPaused, next])

  return (
    <div
      className="absolute inset-0"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {heroImages.map((img, i) => (
        <div
          key={img.src}
          className="absolute inset-0"
          style={{
            opacity: i === current ? 1 : 0,
            transition: "opacity 1000ms cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          <Image
            src={img.src || "/placeholder.svg"}
            alt={img.alt}
            fill
            className="object-contain object-bottom"
            priority={i === 0}
            sizes="(max-width: 1024px) 100vw, 56vw"
          />
        </div>
      ))}
    </div>
  )
}
