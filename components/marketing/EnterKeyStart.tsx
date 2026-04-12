'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export function EnterKeyStart({ href }: { href: string }) {
  const router = useRouter()

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Enter') router.push(href)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [href, router])

  return (
    <p style={{
      fontSize: '0.72rem',
      color: 'rgba(230,237,243,0.35)',
      letterSpacing: '0.06em',
      margin: 0,
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      fontFamily: 'var(--font-mono, monospace)',
    }}>
      press{' '}
      <kbd style={{
        fontFamily: 'var(--font-mono, monospace)',
        fontSize: '0.65rem',
        background: '#1c2128',
        border: '1px solid #444c56',
        borderRadius: 3,
        padding: '1px 7px',
        color: '#e6edf3',
        boxShadow: '0 2px 0 #30363d',
      }}>
        ENTER
      </kbd>
      {' '}to start{' '}
      <span style={{
        display: 'inline-block',
        width: 2,
        height: '0.85em',
        background: '#c49a3a',
        verticalAlign: 'text-bottom',
        marginLeft: 1,
        animation: 'kc-blink 1s step-end infinite',
      }} />
    </p>
  )
}
