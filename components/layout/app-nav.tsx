'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { label: 'The Village', href: '/world', icon: '🏘' },
  { label: 'Production', href: '/play', icon: '⚒' },
  { label: 'Stockpile', href: '/progress', icon: '📦' },
  { label: 'Settings', href: '/settings', icon: '⚙' },
]

export function AppNav() {
  const pathname = usePathname()

  return (
    <nav className="mt-3 flex flex-col gap-0.5 px-3">
      {navItems.map(({ label, href, icon }) => {
        const active =
          pathname === href ||
          (href !== '/world' && pathname.startsWith(href))
        return (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors"
            style={{
              background: active ? 'var(--kc-sidebar-active)' : 'transparent',
              color: active ? '#fff' : 'var(--kc-muted)',
              fontWeight: active ? 600 : 400,
            }}
            onMouseEnter={(e) => {
              if (!active)
                (e.currentTarget as HTMLElement).style.background =
                  'var(--kc-sidebar-hover)'
            }}
            onMouseLeave={(e) => {
              if (!active)
                (e.currentTarget as HTMLElement).style.background = 'transparent'
            }}
          >
            <span className="w-5 text-center text-base leading-none">
              {icon}
            </span>
            <span>{label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
