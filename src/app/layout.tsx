import type { Viewport } from 'next'
import type React from 'react'
import type { ReactNode } from 'react'
import './globals.css'

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#010104' },
    { media: '(prefers-color-scheme: dark)', color: '#010104' }
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5
}

export default function RootLayout({
  children
}: {
  children: ReactNode
}): React.ReactNode {
  return children
}
