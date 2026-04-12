import React from 'react'
import Link from 'next/link'
import { EnterKeyStart } from '@/components/marketing/EnterKeyStart'

/* ── design tokens ─────────────────────────────────────────────── */
const BG      = '#0d1117'
const BG_CARD = '#161b22'
const BORDER  = '#30363d'
const BORDER_S = '#21262d'
const TEXT    = '#e6edf3'
const MUTED   = '#7d8590'
const GOLD    = '#c49a3a'
const GREEN   = '#238636'
const GREEN_T = '#2ea043'

/* ── data ──────────────────────────────────────────────────────── */
const howItWorks = [
  {
    numeral: 'I',
    title: 'Learn',
    desc: 'Start in the first village with home row keys. Build muscle memory at your own pace.',
  },
  {
    numeral: 'II',
    title: 'Practice',
    desc: 'Each session earns mastery points. Track your accuracy and speed as they improve.',
  },
  {
    numeral: 'III',
    title: 'Explore',
    desc: 'Unlock new villages with harder challenges — punctuation, numbers, and full sentences.',
  },
]

const villages = [
  { name: 'The Hearth',       desc: 'Home row fundamentals',   open: true  },
  { name: 'Whispering Woods', desc: 'Common word patterns',    open: false, level: 2 },
  { name: 'Iron Bridge',      desc: 'Speed & precision',       open: false, level: 3 },
  { name: 'Stonepeak',        desc: 'Punctuation & symbols',   open: false, level: 4 },
  { name: 'The Citadel',      desc: 'Master-level typing',     open: false, level: 5 },
]

/* ── shared style helpers ──────────────────────────────────────── */
const section = (extra?: React.CSSProperties): React.CSSProperties => ({
  background: BG,
  padding: '5rem 1.5rem',
  ...extra,
})

const label: React.CSSProperties = {
  fontSize: '0.62rem',
  letterSpacing: '0.28em',
  textTransform: 'uppercase',
  color: MUTED,
  margin: 0,
  fontFamily: 'var(--font-mono, monospace)',
}

const displayHeading = (size = '2.4rem'): React.CSSProperties => ({
  fontFamily: 'var(--font-display, monospace)',
  fontSize: size,
  color: TEXT,
  margin: 0,
  lineHeight: 1,
})

/* ════════════════════════════════════════════════════════════════ */
export default function MarketingHomePage() {
  return (
    <div style={{ background: BG, color: TEXT, fontFamily: 'var(--font-mono, monospace)' }}>

      {/* ── Nav ─────────────────────────────────────────────────── */}
      <nav style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.9rem 1.5rem',
        background: 'rgba(13,17,23,0.94)',
        borderBottom: `1px solid ${BORDER_S}`,
        backdropFilter: 'blur(8px)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 26, height: 26,
            border: `1px solid ${BORDER}`,
            borderRadius: 4,
            background: BG_CARD,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 13,
          }}>⌨</div>
          <span style={{
            fontFamily: 'var(--font-display, monospace)',
            fontSize: '1.25rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: TEXT,
          }}>Keycroft</span>
        </div>

        {/* Links */}
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <Link href="/home" style={{ color: MUTED, fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', textDecoration: 'none' }}>
            About
          </Link>
          <Link href="/world" style={{ color: MUTED, fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', textDecoration: 'none' }}>
            Villages
          </Link>
        </div>
      </nav>

      {/* ── Hero ────────────────────────────────────────────────── */}
      <section style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        backgroundImage: 'url(/images/hero-background-image.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center 30%',
        backgroundColor: '#080e0a',
      }}>
        {/* Gradient overlay — sparse at top so village shows */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(8,14,10,0.45) 0%, rgba(8,14,10,0.7) 45%, rgba(8,14,10,0.92) 75%, #0d1117 100%)',
        }} />

        {/* Subtle stars */}
        {[
          { t: '8%',  l: '12%', s: 3 },
          { t: '5%',  l: '68%', s: 2 },
          { t: '14%', l: '82%', s: 2.5 },
          { t: '18%', l: '28%', s: 1.5 },
          { t: '22%', l: '91%', s: 2 },
          { t: '6%',  l: '48%', s: 1.5 },
          { t: '30%', l: '6%',  s: 2 },
        ].map((star, i) => (
          <div key={i} style={{
            position: 'absolute',
            top: star.t, left: star.l,
            width: star.s, height: star.s,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.7)',
            pointerEvents: 'none',
          }} />
        ))}

        {/* Content */}
        <div style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.1rem',
          padding: '0 1.5rem',
        }}>
          <p style={{ ...label, color: GOLD }}>A Typing Adventure</p>

          <h1 style={{
            fontFamily: 'var(--font-display, monospace)',
            fontSize: 'clamp(4rem, 9vw, 7rem)',
            lineHeight: 1,
            color: TEXT,
            margin: 0,
            letterSpacing: '0.04em',
            textShadow: '0 4px 32px rgba(0,0,0,0.8)',
          }}>
            Keycroft
          </h1>

          <p style={{
            maxWidth: 400,
            fontSize: '0.78rem',
            lineHeight: 1.9,
            color: 'rgba(230,237,243,0.6)',
            margin: 0,
          }}>
            Master your keyboard one village at a time. Start
            from the basics, grow your skills, and unlock new
            worlds as you progress.
          </p>

          <Link href="/world" style={{
            marginTop: '0.4rem',
            display: 'inline-block',
            padding: '0.9rem 2.8rem',
            background: GREEN,
            color: '#fff',
            fontSize: '0.78rem',
            fontWeight: 700,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            textDecoration: 'none',
            border: `1px solid ${GREEN_T}`,
            borderRadius: 4,
          }}>
            Begin Journey
          </Link>

          <EnterKeyStart href="/world" />

          {/* Scroll cue into next section */}
          <div style={{ marginTop: '4rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
            <p style={label}>The Path</p>
            <p style={{ ...displayHeading('1.9rem'), color: 'rgba(230,237,243,0.8)' }}>How It Works</p>
          </div>
        </div>
      </section>

      {/* ── How It Works ────────────────────────────────────────── */}
      <section style={section({ paddingTop: '4rem' })}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '1rem' }}>
            {howItWorks.map((item) => (
              <div key={item.numeral} style={{
                background: BG_CARD,
                border: `1px solid ${BORDER}`,
                borderRadius: 6,
                padding: '1.75rem 1.5rem',
              }}>
                {/* Roman numeral badge */}
                <div style={{
                  width: 36, height: 36,
                  border: `1px solid ${GOLD}`,
                  borderRadius: 4,
                  background: 'rgba(196,154,58,0.08)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--font-display, monospace)',
                  fontSize: '1.1rem',
                  color: GOLD,
                  marginBottom: '1rem',
                }}>
                  {item.numeral}
                </div>
                <p style={{ ...displayHeading('1.5rem'), marginBottom: '0.6rem' }}>{item.title}</p>
                <p style={{ fontSize: '0.74rem', lineHeight: 1.85, color: MUTED, margin: 0 }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── The Villages ────────────────────────────────────────── */}
      <section style={section({ paddingTop: 0, borderTop: `1px solid ${BORDER_S}` })}>
        <div style={{ maxWidth: 660, margin: '0 auto' }}>

          {/* Section header */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <p style={{ ...label, marginBottom: '0.4rem' }}>Progression</p>
            <h2 style={{ ...displayHeading('2.2rem'), marginBottom: '0.875rem' }}>The Villages</h2>
            <p style={{ fontSize: '0.74rem', lineHeight: 1.85, color: MUTED, maxWidth: 380, margin: '0 auto' }}>
              Each village introduces new challenges. Earn enough mastery to unlock the next.
            </p>
          </div>

          {/* Village list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {villages.map((v) => (
              <div key={v.name} style={{
                background: BG_CARD,
                border: `1px solid ${v.open ? GREEN : BORDER}`,
                borderRadius: 6,
                padding: '0.9rem 1.1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.875rem',
              }}>
                {/* Icon */}
                <div style={{
                  width: 32, height: 32,
                  border: `1px solid ${BORDER}`,
                  borderRadius: 4,
                  background: BG,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.85rem',
                  flexShrink: 0,
                  color: v.open ? GOLD : MUTED,
                }}>
                  {v.open ? '⌂' : '⚔'}
                </div>

                {/* Text */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: 0, fontSize: '0.82rem', fontWeight: 700, color: v.open ? TEXT : MUTED }}>
                    {v.name}
                  </p>
                  <p style={{ margin: '2px 0 0', fontSize: '0.68rem', color: MUTED }}>
                    {v.desc}
                  </p>
                </div>

                {/* Status */}
                {v.open ? (
                  <Link href="/world" style={{
                    fontSize: '0.65rem',
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: GREEN_T,
                    textDecoration: 'none',
                    fontWeight: 700,
                    flexShrink: 0,
                  }}>
                    Open
                  </Link>
                ) : (
                  <span style={{ fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: BORDER, flexShrink: 0 }}>
                    Lv.{v.level}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Keyboard icon */}
          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <div style={{
              display: 'inline-flex',
              width: 48, height: 48,
              alignItems: 'center', justifyContent: 'center',
              border: `1px solid ${BORDER}`,
              borderRadius: 6,
              background: BG_CARD,
              fontSize: '1.3rem',
              color: MUTED,
            }}>⌨</div>
          </div>
        </div>
      </section>

      {/* ── Ready to Begin ──────────────────────────────────────── */}
      <section style={section({ borderTop: `1px solid ${BORDER_S}` })}>
        <div style={{
          maxWidth: 600,
          margin: '0 auto',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.25rem',
        }}>
          {/* Keyboard icon */}
          <div style={{
            width: 56, height: 56,
            border: `1px solid ${GOLD}`,
            borderRadius: 6,
            background: 'rgba(196,154,58,0.08)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.5rem',
            color: GOLD,
          }}>⌨</div>

          <h2 style={displayHeading('3rem')}>Ready to Begin?</h2>

          <p style={{ fontSize: '0.76rem', lineHeight: 1.9, color: MUTED, maxWidth: 400, margin: 0 }}>
            No rush. No pressure. Just you, your keyboard, and a world
            waiting to be explored.
          </p>

          <Link href="/world" style={{
            display: 'inline-block',
            marginTop: '0.25rem',
            padding: '1rem 3.5rem',
            background: GOLD,
            color: BG,
            fontSize: '0.78rem',
            fontWeight: 700,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            textDecoration: 'none',
            borderRadius: 4,
          }}>
            Enter the Village
          </Link>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────── */}
      <footer style={{
        background: BG,
        borderTop: `1px solid ${BORDER_S}`,
        padding: '1.25rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <div style={{
            width: 20, height: 20,
            border: `1px solid ${BORDER}`,
            borderRadius: 3,
            background: BG_CARD,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 10,
          }}>⌨</div>
          <span style={{
            fontFamily: 'var(--font-display, monospace)',
            fontSize: '1rem',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: MUTED,
          }}>Keycroft</span>
        </div>
        <p style={{ fontSize: '0.68rem', color: MUTED, margin: 0 }}>
          Built for typists who enjoy the journey
        </p>
      </footer>

    </div>
  )
}
