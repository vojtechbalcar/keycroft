import Link from 'next/link'

import { VillageScene } from '@/components/village/village-scene'

const tools = [
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

export default function HubHomePage() {
  return (
    <div className="min-h-screen" style={{ background: '#0e1a0e', color: '#fff' }}>

      {/* ── Hero ── */}
      <section className="relative flex min-h-[92vh] flex-col items-center justify-center overflow-hidden px-6 text-center">

        {/* Background map */}
        <div className="absolute inset-0 opacity-60">
          <VillageScene />
        </div>

        {/* Gradient overlay */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 70% 65% at 50% 48%, rgba(14,26,14,0.15) 0%, rgba(10,18,10,0.82) 70%, #0e1a0e 100%)',
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center gap-6">
          {/* Seal badge */}
          <div
            className="flex h-14 w-14 items-center justify-center rounded-full text-2xl"
            style={{
              border: '2px solid rgba(212,168,80,0.55)',
              background: 'rgba(8,14,8,0.7)',
              color: 'var(--kc-warm)',
            }}
          >
            ⌂
          </div>

          <h1
            className="max-w-2xl text-[clamp(2.4rem,6vw,4.5rem)] font-bold uppercase leading-[1.05] tracking-[0.04em]"
            style={{ textShadow: '0 4px 40px rgba(0,0,0,0.6)' }}
          >
            The Hamlet
          </h1>

          <p
            className="max-w-sm text-base leading-7"
            style={{ color: 'rgba(255,255,255,0.62)' }}
          >
            The village grows stronger with every stroke of the keys.
            Type to build, harvest to grow, and claim your legend.
          </p>

          <div className="mt-2 flex items-center gap-3">
            <Link
              href="/play"
              className="rounded-full px-7 py-3 text-sm font-semibold text-white transition hover:opacity-90"
              style={{ background: 'var(--kc-accent)', boxShadow: '0 4px 24px rgba(74,140,58,0.45)' }}
            >
              Start Your Harvest
            </Link>
            <Link
              href="/home/map"
              className="rounded-full border px-7 py-3 text-sm font-semibold transition hover:bg-white/10"
              style={{ borderColor: 'rgba(255,255,255,0.25)', color: 'rgba(255,255,255,0.8)' }}
            >
              View The Map
            </Link>
          </div>
        </div>

        {/* Bottom fade */}
        <div
          className="pointer-events-none absolute bottom-0 left-0 right-0 h-32"
          style={{ background: 'linear-gradient(to bottom, transparent, #0e1a0e)' }}
        />
      </section>

      {/* ── Tools of the Trade ── */}
      <section className="px-8 pb-16 pt-4">
        <div className="mx-auto max-w-4xl">
          <p
            className="mb-1 text-center text-[10px] uppercase tracking-[0.28em]"
            style={{ color: 'var(--kc-warm)' }}
          >
            How it works
          </p>
          <h2 className="mb-8 text-center text-2xl font-bold uppercase tracking-[0.06em]">
            Tools of the Trade
          </h2>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {tools.map(({ icon, title, desc }) => (
              <div
                key={title}
                className="flex flex-col gap-3 rounded-2xl p-5"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                <span
                  className="flex h-10 w-10 items-center justify-center rounded-xl text-lg"
                  style={{ background: 'var(--kc-sidebar-active)', color: 'var(--kc-warm)' }}
                >
                  {icon}
                </span>
                <p className="text-sm font-semibold">{title}</p>
                <p className="text-xs leading-5" style={{ color: 'rgba(255,255,255,0.48)' }}>
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <div
        className="flex items-center justify-center gap-12 border-t py-6 text-center"
        style={{ borderColor: 'rgba(255,255,255,0.07)' }}
      >
        {([
          { label: 'Words typed', value: '0' },
          { label: 'Best WPM', value: '—' },
          { label: 'Sessions', value: '0' },
          { label: 'Accuracy', value: '—' },
        ] as const).map(({ label, value }) => (
          <div key={label}>
            <p className="text-xl font-bold" style={{ color: 'var(--kc-warm)' }}>{value}</p>
            <p className="mt-0.5 text-[11px] uppercase tracking-[0.16em]" style={{ color: 'rgba(255,255,255,0.38)' }}>
              {label}
            </p>
          </div>
        ))}
      </div>

    </div>
  )
}
