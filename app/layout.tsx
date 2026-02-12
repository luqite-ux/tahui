import React from "react"
import type { Metadata } from 'next'
import { DM_Sans, Playfair_Display } from 'next/font/google'

import './globals.css'

const dmSans = DM_Sans({ 
  subsets: ['latin'],
  variable: '--font-dm-sans'
})
const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair'
})

export const metadata: Metadata = {
  title: 'Tahui Sweater Factory | Seamless Knitwear Manufacturer in China',
  description: 'Leading seamless knitwear manufacturer in Shanghai, China. 20+ years OEM & ODM experience, 100,000 pcs monthly capacity, ISO certified. WholeGarment technology specialist.',
  keywords: 'seamless knitwear manufacturer, sweater factory in China, OEM ODM knitwear supplier, wholegarment sweater manufacturer, knitwear factory Shanghai',
  generator: 'v0.app',
  icons: {
    icon: '/icon.png',
    apple: '/icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} ${playfair.variable} font-sans antialiased`}>{children}</body>
    </html>
  )
}
