import React, { type ReactNode } from 'react'

/* Bare layout — no sidebar, full-screen for typing pad and world map */
export default function TypingLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
