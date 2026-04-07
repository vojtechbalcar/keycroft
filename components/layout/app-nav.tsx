'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { label: 'The Village', href: '/home', icon: '⌂' },
  { label: 'Practice', href: '/play', icon: '✦' },
  { label: 'Progress', href: '/progress', icon: '◈' },
  { label: 'Settings', href: '/settings', icon: '⚙' },
]

export function AppNav() {
  const pathname = usePathname()

  return (
    <nav className="mt-4 flex flex-col gap-0.5 px-3">
      {navItems.map(({ label, href, icon }) => {
        const active = pathname === href || (href !== '/home' && pathname.startsWith(href))
        return (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-3 rounded-[10px] px-3 py-2.5 text-sm transition-colors"
            style={{
              background: active ? 'var(--kc-sidebar-active)' : 'transparent',
              color: active ? '#fff' : 'var(--kc-muted)',
            }}
            onMouseEnter={e => {
              if (!active) (e.currentTarget as HTMLElement).style.background = 'var(--kc-sidebar-hover)'
            }}
            onMouseLeave={e => {
              if (!active) (e.currentTarget as HTMLElement).style.background = 'transparent'
            }}
          >
            <span className="w-4 text-center text-base leading-none opacity-75">{icon}</span>
            <span>{label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
