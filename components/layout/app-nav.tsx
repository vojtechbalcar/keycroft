'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { label: 'Village', href: '/home' },
  { label: 'Practice', href: '/play' },
  { label: 'Progress', href: '/progress' },
]

export function AppNav() {
  const pathname = usePathname()

  return (
    <nav className="mt-8 flex flex-col gap-1">
      {navItems.map(({ label, href }) => {
        const active = pathname === href
        return (
          <Link
            key={href}
            href={href}
            className={`rounded-[14px] px-4 py-2.5 text-sm transition-colors ${
              active
                ? 'bg-[rgba(122,143,98,0.14)] font-medium text-[var(--kc-text)]'
                : 'text-[var(--kc-muted)] hover:bg-[rgba(122,143,98,0.08)] hover:text-[var(--kc-text)]'
            }`}
          >
            {label}
          </Link>
        )
      })}
    </nav>
  )
}
