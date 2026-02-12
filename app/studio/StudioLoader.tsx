'use client'

import dynamic from 'next/dynamic'

const Studio = dynamic(
  () => import('@/app/studio/Studio').then((mod) => mod.Studio),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-screen items-center justify-center text-muted-foreground">
        Loading Studio…
      </div>
    ),
  }
)

export function StudioLoader() {
  return <Studio />
}
