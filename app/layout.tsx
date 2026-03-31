import React, { type ReactNode } from 'react'

import { siteMetadata } from '@/lib/site/metadata'

import './globals.css'

export const metadata = siteMetadata

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
