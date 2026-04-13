'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'

const BG     = '#0d1117'
const CARD   = '#161b22'
const BORDER = '#21262d'
const TEXT   = '#e6edf3'
const MUTED  = '#7d8590'
const GOLD   = '#c49a3a'
const RED    = '#f85149'

type Tab = 'login' | 'signup'

async function apiSignUp(email: string, password: string, name: string) {
  const res = await fetch('/api/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, name }),
  })
  return res.ok ? null : (await res.json()).error as string
}

async function apiSignIn(email: string, password: string) {
  const { signIn } = await import('next-auth/react')
  const result = await signIn('credentials', {
    email,
    password,
    redirect: false,
  })
  if (result?.error) return 'Invalid email or password.'
  return null
}

export default function LoginPage() {
  const router = useRouter()
  const [tab, setTab] = useState<Tab>('login')
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()

  function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const email    = fd.get('email') as string
    const password = fd.get('password') as string
    setError('')
    startTransition(async () => {
      const err = await apiSignIn(email, password)
      if (err) { setError(err); return }
      router.push('/world')
    })
  }

  function handleSignUp(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const email    = fd.get('email') as string
    const password = fd.get('password') as string
    const confirm  = fd.get('confirm') as string
    const name     = (fd.get('name') as string).trim()

    if (password !== confirm) { setError('Passwords do not match.'); return }
    if (password.length < 8)  { setError('Password must be at least 8 characters.'); return }
    setError('')

    startTransition(async () => {
      const err = await apiSignUp(email, password, name)
      if (err) { setError(err); return }
      // Sign in immediately after signup
      const signInErr = await apiSignIn(email, password)
      if (signInErr) { setError(signInErr); return }
      router.push('/world')
    })
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    boxSizing: 'border-box',
    background: BG,
    border: `1px solid ${BORDER}`,
    borderRadius: 4,
    padding: '0.7rem 0.9rem',
    fontSize: '0.88rem',
    color: TEXT,
    fontFamily: 'var(--font-mono, monospace)',
    outline: 'none',
  }

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '0.6rem',
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    color: MUTED,
    marginBottom: 5,
  }

  return (
    <main style={{
      minHeight: '100vh',
      background: BG,
      backgroundImage: 'radial-gradient(ellipse at 50% 0%, rgba(196,154,58,0.07) 0%, transparent 60%)',
      display: 'grid',
      placeItems: 'center',
      padding: '2rem 1.25rem',
      fontFamily: 'var(--font-mono, monospace)',
      color: TEXT,
    }}>
      <div style={{ width: 'min(400px, 100%)', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center' }}>
          <div style={{
            fontFamily: 'var(--font-display, monospace)',
            fontSize: '2.4rem',
            color: GOLD,
            letterSpacing: '0.1em',
            lineHeight: 1,
          }}>
            Keycroft
          </div>
          <div style={{ fontSize: '0.58rem', color: MUTED, letterSpacing: '0.2em', textTransform: 'uppercase', marginTop: 4 }}>
            Save your village
          </div>
        </div>

        {/* Card */}
        <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 8, overflow: 'hidden' }}>

          {/* Tabs */}
          <div style={{ display: 'flex', borderBottom: `1px solid ${BORDER}` }}>
            {(['login', 'signup'] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => { setTab(t); setError('') }}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  background: tab === t ? 'rgba(196,154,58,0.07)' : 'none',
                  border: 'none',
                  borderBottom: `2px solid ${tab === t ? GOLD : 'transparent'}`,
                  color: tab === t ? TEXT : MUTED,
                  fontSize: '0.7rem',
                  fontWeight: tab === t ? 700 : 400,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-mono, monospace)',
                  transition: 'all 120ms ease',
                }}
              >
                {t === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>

          <div style={{ padding: '1.75rem' }}>

            {/* Error */}
            {error && (
              <div style={{
                marginBottom: '1rem',
                padding: '0.6rem 0.9rem',
                background: 'rgba(248,81,73,0.08)',
                border: `1px solid rgba(248,81,73,0.25)`,
                borderRadius: 4,
                fontSize: '0.72rem',
                color: RED,
              }}>
                {error}
              </div>
            )}

            {/* LOGIN */}
            {tab === 'login' && (
              <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label htmlFor="login-email" style={labelStyle}>Email</label>
                  <input id="login-email" name="email" type="email" required autoFocus style={inputStyle} placeholder="you@example.com" />
                </div>
                <div>
                  <label htmlFor="login-password" style={labelStyle}>Password</label>
                  <input id="login-password" name="password" type="password" required style={inputStyle} placeholder="••••••••" />
                </div>
                <button
                  type="submit"
                  disabled={isPending}
                  style={{
                    width: '100%',
                    marginTop: '0.25rem',
                    padding: '0.75rem',
                    background: isPending ? 'rgba(196,154,58,0.5)' : GOLD,
                    border: 'none',
                    borderRadius: 4,
                    color: BG,
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                    cursor: isPending ? 'not-allowed' : 'pointer',
                    fontFamily: 'var(--font-mono, monospace)',
                    transition: 'opacity 120ms',
                  }}
                >
                  {isPending ? 'Signing in…' : 'Sign In →'}
                </button>
                <p style={{ textAlign: 'center', margin: 0, fontSize: '0.65rem', color: MUTED }}>
                  No account?{' '}
                  <button
                    type="button"
                    onClick={() => { setTab('signup'); setError('') }}
                    style={{ background: 'none', border: 'none', color: TEXT, cursor: 'pointer', fontSize: '0.65rem', fontFamily: 'var(--font-mono,monospace)', textDecoration: 'underline' }}
                  >
                    Create one
                  </button>
                </p>
              </form>
            )}

            {/* SIGN UP */}
            {tab === 'signup' && (
              <form onSubmit={handleSignUp} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label htmlFor="signup-name" style={labelStyle}>Username</label>
                  <input id="signup-name" name="name" type="text" required autoFocus style={inputStyle} placeholder="villager42" maxLength={32} />
                </div>
                <div>
                  <label htmlFor="signup-email" style={labelStyle}>Email</label>
                  <input id="signup-email" name="email" type="email" required style={inputStyle} placeholder="you@example.com" />
                </div>
                <div>
                  <label htmlFor="signup-password" style={labelStyle}>Password</label>
                  <input id="signup-password" name="password" type="password" required style={inputStyle} placeholder="Min. 8 characters" />
                </div>
                <div>
                  <label htmlFor="signup-confirm" style={labelStyle}>Confirm Password</label>
                  <input id="signup-confirm" name="confirm" type="password" required style={inputStyle} placeholder="••••••••" />
                </div>
                <button
                  type="submit"
                  disabled={isPending}
                  style={{
                    width: '100%',
                    marginTop: '0.25rem',
                    padding: '0.75rem',
                    background: isPending ? 'rgba(196,154,58,0.5)' : GOLD,
                    border: 'none',
                    borderRadius: 4,
                    color: BG,
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                    cursor: isPending ? 'not-allowed' : 'pointer',
                    fontFamily: 'var(--font-mono, monospace)',
                    transition: 'opacity 120ms',
                  }}
                >
                  {isPending ? 'Creating account…' : 'Create Account →'}
                </button>
                <p style={{ textAlign: 'center', margin: 0, fontSize: '0.65rem', color: MUTED }}>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => { setTab('login'); setError('') }}
                    style={{ background: 'none', border: 'none', color: TEXT, cursor: 'pointer', fontSize: '0.65rem', fontFamily: 'var(--font-mono,monospace)', textDecoration: 'underline' }}
                  >
                    Sign in
                  </button>
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
