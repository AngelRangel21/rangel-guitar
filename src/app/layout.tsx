import type { Viewport } from 'next'
import type React from 'react'
import type { ReactNode } from 'react'
import './globals.css'

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'hsl(210, 22%, 31%)' },
    { media: '(prefers-color-scheme: dark)', color: 'hsl(210, 22%, 11%)' }
  ]
}

export default function RootLayout({
  children
}: {
  children: ReactNode
}): React.ReactNode {
  return children
}
