import React from 'react'
import Link from 'next/link'

const features = [
  {
    icon: '⌨',
    title: 'Typing Sessions',
    desc: 'Each line you complete builds your village and sharpens your skill.',
  },
  {
    icon: '⌂',
    title: 'Your Village',
    desc: 'Watch new structures appear as your words-per-minute grows.',
  },
  {
    icon: '◈',
    title: 'Milestones',
    desc: 'Unlock new zones, buildings, and lore as you level up.',
  },
  {
    icon: '↑',
    title: 'Progress',
    desc: 'Track WPM, accuracy, and streaks across every session.',
  },
]

const encounters = [
  { title: 'The Cottage', desc: 'Your first structure. Every word strengthens its walls.' },
  { title: 'The Well', desc: 'Unlocks at 30 WPM. A source of life for your hamlet.' },
  { title: 'The Market', desc: 'Trade your accuracy for rare blueprints.' },
  { title: 'The Tower', desc: 'A symbol of mastery. Claimed by the fastest typists.' },
]

export default function MarketingHomePage() {
  return (
    <div style={{ background: '#0e1a0e', color: '#fff', minHeight: '100vh' }}>

      {/* ── Nav ── */}
      <nav
        className="flex items-center justify-between px-8 py-5"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
      >
        <span className="text-sm font-semibold uppercase tracking-[0.22em]" style={{ color: 'var(--kc-warm)' }}>
          Keycroft
        </span>
        <div className="flex items-center gap-6">
          <Link href="/home" className="text-sm transition" style={{ color: 'rgba(255,255,255,0.55)' }}>
            The Village
          </Link>
          <Link
            href="/play"
            className="rounded-full px-5 py-2 text-sm font-semibold text-white transition hover:opacity-90"
            style={{ background: 'var(--kc-accent)' }}
          >
            Play Free
          </Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section
        className="relative flex min-h-[88vh] flex-col items-center justify-center overflow-hidden px-6 text-center"
        style={{
          background: 'radial-gradient(ellipse 90% 70% at 50% 30%, #1e3d22 0%, #0e1a0e 65%)',
        }}
      >
        {/* Background texture dots */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />

        {/* Glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[700px] -translate-x-1/2 -translate-y-1/4 rounded-full opacity-20 blur-[120px]"
          style={{ background: 'var(--kc-accent)' }}
        />

        <div className="relative z-10 flex flex-col items-center gap-7">
          {/* Seal */}
          <div
            className="flex h-16 w-16 items-center justify-center rounded-full text-2xl"
            style={{
              border: '2px solid rgba(212,168,80,0.5)',
              background: 'rgba(8,14,8,0.8)',
              color: 'var(--kc-warm)',
              boxShadow: '0 0 32px rgba(212,168,80,0.15)',
            }}
          >
            ⌂
          </div>

          <p className="text-[11px] uppercase tracking-[0.3em]" style={{ color: 'var(--kc-warm)' }}>
            A cozy typing world
          </p>

          <h1
            className="max-w-3xl text-[clamp(2.8rem,7vw,5.5rem)] font-bold uppercase leading-[1.0] tracking-[0.04em]"
            style={{ textShadow: '0 4px 48px rgba(0,0,0,0.5)' }}
          >
            The Digital<br />Homestead
          </h1>

          <p
            className="max-w-md text-base leading-7"
            style={{ color: 'rgba(255,255,255,0.58)' }}
          >
            The village grows stronger with every stroke of the keys.
            Type to build, harvest to grow, and claim your legend.
          </p>

          <div className="mt-1 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/play"
              className="rounded-full px-8 py-3.5 text-sm font-semibold text-white transition hover:opacity-90"
              style={{ background: 'var(--kc-accent)', boxShadow: '0 4px 28px rgba(74,140,58,0.45)' }}
            >
              Start Your Harvest
            </Link>
            <Link
              href="/home"
              className="rounded-full border px-8 py-3.5 text-sm font-semibold transition hover:bg-white/10"
              style={{ borderColor: 'rgba(255,255,255,0.22)', color: 'rgba(255,255,255,0.75)' }}
            >
              View The Map
            </Link>
          </div>
        </div>

        {/* Bottom fade */}
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-0 left-0 right-0 h-40"
          style={{ background: 'linear-gradient(to bottom, transparent, #0e1a0e)' }}
        />
      </section>

      {/* ── Tools of the Trade ── */}
      <section className="px-8 pb-20 pt-16">
        <div className="mx-auto max-w-5xl">
          <p
            className="mb-1 text-center text-[10px] uppercase tracking-[0.28em]"
            style={{ color: 'var(--kc-warm)' }}
          >
            How it works
          </p>
          <h2 className="mb-10 text-center text-2xl font-bold uppercase tracking-[0.06em]">
            Tools of the Trade
          </h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {features.map(({ icon, title, desc }) => (
              <div
                key={title}
                className="flex flex-col gap-3 rounded-2xl p-5"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.07)',
                }}
              >
                <span
                  className="flex h-10 w-10 items-center justify-center rounded-xl text-lg"
                  style={{ background: '#2e5438', color: 'var(--kc-warm)' }}
                >
                  {icon}
                </span>
                <p className="text-sm font-semibold">{title}</p>
                <p className="text-xs leading-5" style={{ color: 'rgba(255,255,255,0.44)' }}>
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── World Encounters ── */}
      <section
        className="px-8 py-16"
        style={{ background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="mx-auto max-w-5xl">
          <p
            className="mb-1 text-center text-[10px] uppercase tracking-[0.28em]"
            style={{ color: 'var(--kc-warm)' }}
          >
            Discover
          </p>
          <h2 className="mb-10 text-center text-2xl font-bold uppercase tracking-[0.06em]">
            World Encounters
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {encounters.map(({ title, desc }) => (
              <div
                key={title}
                className="flex items-start gap-4 rounded-2xl p-5"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.07)',
                }}
              >
                <span
                  className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm"
                  style={{ background: '#2e5438', color: 'var(--kc-warm)' }}
                >
                  ◈
                </span>
                <div>
                  <p className="text-sm font-semibold">{title}</p>
                  <p className="mt-1 text-xs leading-5" style={{ color: 'rgba(255,255,255,0.44)' }}>
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <div className="flex flex-wrap items-center justify-center gap-12 px-8 py-10 text-center">
        {([
          { label: 'Words typed', value: '43,951' },
          { label: 'Peak WPM', value: '554' },
          { label: 'Builders', value: '1.2K' },
          { label: 'Sessions', value: '892' },
        ] as const).map(({ label, value }) => (
          <div key={label}>
            <p className="text-2xl font-bold" style={{ color: 'var(--kc-warm)' }}>{value}</p>
            <p className="mt-1 text-[11px] uppercase tracking-[0.16em]" style={{ color: 'rgba(255,255,255,0.35)' }}>
              {label}
            </p>
          </div>
        ))}
      </div>

      {/* ── CTA footer ── */}
      <div
        className="flex flex-col items-center gap-5 px-8 py-16 text-center"
        style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
      >
        <h2 className="text-3xl font-bold uppercase tracking-[0.04em]">
          Ready to start your harvest?
        </h2>
        <p className="max-w-sm text-sm leading-7" style={{ color: 'rgba(255,255,255,0.5)' }}>
          No account needed. Takes two minutes. Your village is waiting.
        </p>
        <Link
          href="/play"
          className="mt-2 rounded-full px-9 py-4 text-sm font-semibold text-white transition hover:opacity-90"
          style={{ background: 'var(--kc-accent)', boxShadow: '0 4px 28px rgba(74,140,58,0.4)' }}
        >
          Start Your Harvest
        </Link>
      </div>

    </div>
  )
}
