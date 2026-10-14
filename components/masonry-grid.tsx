"use client"

import { Children, type ReactNode, useEffect, useLayoutEffect, useRef, useState } from "react"
import { resolveMasonrySpan } from "@/lib/masonry-layout"

const ROW_HEIGHT = 4
const ITEM_GAP = 24

function MasonryItem({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const [span, setSpan] = useState(1)

  useLayoutEffect(() => {
    const element = ref.current
    if (!element) return

    const measure = () => {
      setSpan(resolveMasonrySpan(element.getBoundingClientRect().height, ROW_HEIGHT, ITEM_GAP))
    }

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return (
    <div className="min-w-0" style={{ gridRowEnd: `span ${span}`, paddingBottom: ITEM_GAP }}>
      <div ref={ref}>{children}</div>
    </div>
  )
}

export function MasonryGrid({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  return (
    <div
      className="grid w-full grid-flow-row-dense grid-cols-1 gap-x-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-6"
      style={{ gridAutoRows: mounted ? `${ROW_HEIGHT}px` : "auto" }}
    >
      {Children.map(children, (child) => <MasonryItem>{child}</MasonryItem>)}
    </div>
  )
}
