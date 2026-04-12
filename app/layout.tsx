import React, { type ReactNode } from 'react'
import { VT323, Space_Mono } from 'next/font/google'

import { siteMetadata } from '@/lib/site/metadata'

import './globals.css'

const vt323 = VT323({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

const spaceMono = Space_Mono({
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata = siteMetadata

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="en" className={`${vt323.variable} ${spaceMono.variable}`}>
      <body>{children}</body>
    </html>
  )
}
