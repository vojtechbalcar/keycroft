import React from 'react'
import Link from 'next/link'

const stats = [
  { label: 'Community Story', value: '42,901', desc: 'Harvests Completed' },
  { label: 'Village Tier', value: '104', desc: 'Avg Words Per Minute' },
  { label: 'Total Scribes', value: '1,284', desc: 'Online Scribes' },
]

const tools = [
  {
    letter: 'A',
    title: 'Type to Build',
    desc: 'Your keystrokes forge new dwellings, structures, and the quality of materials, from simple thatch to custom craftwork.',
  },
  {
    letter: 'B',
    title: 'Milestone Rewards',
    desc: 'Unlock rare artifacts and unique building tools as you level up your typing proficiency. Customize your corner of Keycroft.',
  },
  {
    letter: 'C',
    title: 'Artisan Tools',
    desc: 'Upgrade your skills for speed. Master over the art of code. Earn gold from daily challenges to improve your domain.',
  },
]

const communityFeatures = [
  {
    icon: '📊',
    title: 'Mutual Leaderboards',
    desc: 'Rise through the ranks. View the top scribes in the community and see how you stack up.',
  },
  {
    icon: '📜',
    title: 'Village Blueprints',
    desc: 'Discover new craft combinations for the most impressive of structure designs.',
  },
  {
    icon: '⚔️',
    title: 'Clan Guilds',
    desc: 'Form a guild with friends to share resources and collaborate on building.',
  },
  {
    icon: '📖',
    title: 'Epic Sagas',
    desc: 'Collaborative writing quests that push your speed and imagination to the limit.',
  },
]

export default function MarketingHomePage() {
  return (
    <div style={{ background: '#f4efe4', color: '#1c2e1e' }}>

      {/* ── Nav ── */}
      <nav
        className="flex items-center justify-between px-8 py-3"
        style={{
          background: '#2d4a2e',
          borderBottom: '3px solid #d4a850',
        }}
      >
        <div className="flex items-center gap-2">
          <span className="text-lg" style={{ color: '#7aaa82' }}>🌿</span>
          <span
            className="text-sm font-bold uppercase tracking-[0.18em]"
            style={{ color: '#f4efe4' }}
          >
            Keycroft
          </span>
        </div>

        <div className="hidden items-center gap-8 md:flex">
          {['The Village', 'Mechanics', 'Daily Harvest', 'Leaderboard'].map((item) => (
            <Link
              key={item}
              href={item === 'The Village' ? '/home' : '#'}
              className="text-sm transition hover:opacity-100"
              style={{ color: 'rgba(244,239,228,0.7)' }}
            >
              {item}
            </Link>
          ))}
        </div>

        <Link
          href="/play"
          className="rounded-full px-5 py-2 text-sm font-semibold transition hover:opacity-90"
          style={{ background: '#4a8c3a', color: '#fff' }}
        >
          Start Your Harvest
        </Link>
      </nav>

      {/* ── Hero ── */}
      <section
        className="relative flex min-h-[85vh] flex-col items-center justify-center overflow-hidden text-center"
        style={{
          backgroundImage: 'url(/village-bg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center 30%',
          backgroundColor: '#1e3d22',
        }}
      >
        {/* Dark overlay */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'linear-gradient(to bottom, rgba(20,38,20,0.55) 0%, rgba(14,26,14,0.68) 50%, rgba(14,26,14,0.88) 85%, #f4efe4 100%)',
          }}
        />

        {/* Sparkle decorations */}
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          {[
            { top: '12%', left: '18%', size: 3 },
            { top: '8%', left: '75%', size: 2.5 },
            { top: '22%', left: '82%', size: 2 },
            { top: '18%', left: '12%', size: 2 },
            { top: '30%', left: '88%', size: 1.5 },
            { top: '6%', left: '45%', size: 2 },
            { top: '35%', left: '8%', size: 1.5 },
          ].map((s, i) => (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                top: s.top,
                left: s.left,
                width: s.size * 2,
                height: s.size * 2,
                background: 'radial-gradient(circle, rgba(212,168,80,0.8), transparent 70%)',
                boxShadow: `0 0 ${s.size * 4}px rgba(212,168,80,0.4)`,
              }}
            />
          ))}
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center gap-5 px-6">
          <h1
            className="max-w-3xl text-[clamp(2.4rem,6vw,4.8rem)] font-bold uppercase leading-[1.05] tracking-[0.03em] text-white"
            style={{ textShadow: '0 4px 40px rgba(0,0,0,0.5)' }}
          >
            The Digital
            <br />
            Homestead
          </h1>

          <p
            className="max-w-lg text-base leading-7"
            style={{ color: 'rgba(255,255,255,0.72)' }}
          >
            Cultivate your typing skills to expand your artisanal
            village. Every word is a brick, every sentence a harvest.
          </p>

          <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/play"
              className="rounded-full px-7 py-3 text-sm font-semibold text-white transition hover:opacity-90"
              style={{
                background: '#4a8c3a',
                boxShadow: '0 4px 24px rgba(74,140,58,0.4)',
              }}
            >
              Start Your Harvest
            </Link>
            <Link
              href="/home"
              className="rounded-full border px-7 py-3 text-sm font-semibold transition hover:bg-white/10"
              style={{
                borderColor: 'rgba(255,255,255,0.3)',
                color: 'rgba(255,255,255,0.8)',
              }}
            >
              View the Map
            </Link>
          </div>

          {/* Play / video button */}
          <button
            className="mt-4 flex items-center gap-2 transition hover:opacity-80"
            style={{ color: 'rgba(255,255,255,0.45)' }}
          >
            <span
              className="flex h-8 w-8 items-center justify-center rounded-full text-xs"
              style={{ border: '1px solid rgba(255,255,255,0.3)' }}
            >
              ▶
            </span>
            <span className="text-xs uppercase tracking-widest">
              Season video harvest
            </span>
          </button>
        </div>
      </section>

      {/* ── Stats ── */}
      <section style={{ background: '#f4efe4' }} className="px-6 py-12 md:px-8">
        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-5 md:grid-cols-3">
          {stats.map((s) => (
            <div
              key={s.label}
              className="rounded-xl p-6 text-center"
              style={{
                border: '1px solid #c8b890',
                background: '#faf7f0',
              }}
            >
              <p
                className="text-[10px] uppercase tracking-[0.25em]"
                style={{ color: '#8a7a5a' }}
              >
                {s.label}
              </p>
              <p
                className="mt-2 text-3xl font-bold"
                style={{ color: '#1c2e1e' }}
              >
                {s.value}
              </p>
              <p className="mt-1 text-xs" style={{ color: '#6a7a5a' }}>
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Tools of the Trade ── */}
      <section style={{ background: '#f4efe4' }} className="px-6 pb-16 pt-8 md:px-8">
        <div className="mx-auto max-w-4xl">
          <p
            className="mb-1 text-center text-[10px] uppercase tracking-[0.3em]"
            style={{ color: '#8a7a5a' }}
          >
            Mastery &amp; Growth
          </p>
          {/* Heading with decorative line */}
          <div className="mb-10 flex items-center justify-center gap-4">
            <span
              className="hidden h-px w-16 md:block"
              style={{ background: '#c8b890' }}
            />
            <h2
              className="text-center text-2xl font-bold"
              style={{ color: '#1c2e1e' }}
            >
              Tools of the Trade
            </h2>
            <span
              className="hidden h-px w-16 md:block"
              style={{ background: '#c8b890' }}
            />
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {tools.map((t) => (
              <div
                key={t.letter}
                className="rounded-xl p-6"
                style={{
                  border: '1px solid #d8cfbc',
                  background: '#faf7f0',
                }}
              >
                <div
                  className="mb-4 flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold"
                  style={{
                    border: '2px solid #4a8c3a',
                    color: '#4a8c3a',
                    background: '#e8f0e4',
                  }}
                >
                  {t.letter}
                </div>
                <p
                  className="mb-2 font-semibold"
                  style={{ color: '#1c2e1e' }}
                >
                  {t.title}
                </p>
                <p
                  className="text-sm leading-6"
                  style={{ color: '#5a6a5e' }}
                >
                  {t.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── The Village Square ── */}
      <section
        style={{
          background: '#f4efe4',
          borderTop: '1px solid #d8cfbc',
        }}
        className="px-6 py-16 md:px-8"
      >
        <div className="mx-auto flex max-w-5xl flex-col gap-10 md:flex-row">
          {/* Left column */}
          <div className="flex-1">
            <p
              className="mb-1 text-[10px] uppercase tracking-[0.3em]"
              style={{ color: '#8a7a5a' }}
            >
              Community Hearth
            </p>
            <h2
              className="mb-4 text-2xl font-bold"
              style={{ color: '#1c2e1e' }}
            >
              The Village Square
            </h2>
            <p
              className="mb-8 max-w-md text-sm leading-6"
              style={{ color: '#5a6a5e' }}
            >
              Join a thriving community of digital homesteaders. Whether you&apos;re
              a lone scribe or part of a bustling clan, there&apos;s always a seat by the
              hearth.
            </p>

            <div className="grid grid-cols-2 gap-5">
              {communityFeatures.map((f) => (
                <div key={f.title}>
                  <span
                    className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg text-base"
                    style={{ background: '#e8f0e4' }}
                  >
                    {f.icon}
                  </span>
                  <p
                    className="mb-1 text-sm font-semibold"
                    style={{ color: '#1c2e1e' }}
                  >
                    {f.title}
                  </p>
                  <p
                    className="text-xs leading-5"
                    style={{ color: '#6a7a5e' }}
                  >
                    {f.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right column */}
          <div className="flex w-full flex-col gap-4 md:w-[320px]">
            {/* Image placeholder */}
            <div
              className="relative flex h-48 items-end justify-end overflow-hidden rounded-xl p-3"
              style={{
                background: '#e0dbd0',
                border: '1px solid #d8cfbc',
              }}
            >
              <span
                className="rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-wider"
                style={{
                  background: '#d4a850',
                  color: '#fff',
                }}
              >
                Nearly Level Cap
              </span>
            </div>

            {/* Become a Citizen card */}
            <div
              className="rounded-xl p-5"
              style={{
                border: '1px solid #d8cfbc',
                background: '#faf7f0',
              }}
            >
              <h3
                className="mb-2 text-lg font-bold"
                style={{ color: '#1c2e1e' }}
              >
                Become a Citizen
              </h3>
              <p
                className="mb-4 text-xs leading-5"
                style={{ color: '#6a7a5e' }}
              >
                Your reputation begins in a day. Set forth to claim
                a village estate. Join ranks in homesteading mastery.
              </p>
              <Link
                href="/play"
                className="inline-block rounded-lg px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition hover:opacity-90"
                style={{ background: '#4a8c3a' }}
              >
                Join the Guild
              </Link>
            </div>
            {/* Decorative scroll icon */}
            <div className="flex justify-end pr-2">
              <span style={{ color: '#c8b890', fontSize: '24px' }}>🌿</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonial ── */}
      <section
        style={{
          background: '#f4efe4',
          borderTop: '1px solid #d8cfbc',
        }}
        className="px-6 py-16 md:px-8"
      >
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          {/* Decorative quote mark */}
          <div
            className="mb-6 flex h-14 w-14 items-center justify-center rounded-full text-2xl"
            style={{
              border: '2px solid #c8b890',
              color: '#d4a850',
              background: '#faf7f0',
            }}
          >
            &ldquo;
          </div>
          <blockquote
            className="mb-6 max-w-xl text-lg italic leading-8"
            style={{ color: '#2a3e2c' }}
          >
            &ldquo;Keycroft transformed my daily typing grind into a
            meditative building experience. I&apos;ve watched my
            small cabin grow into a grand manor, all through
            the power of 120 words per minute.&rdquo;
          </blockquote>

          {/* Avatar + attribution */}
          <div className="flex flex-col items-center gap-1">
            <div
              className="mb-2 flex h-12 w-12 items-center justify-center rounded-full text-xl"
              style={{
                background: '#e8f0e4',
                border: '2px solid #c8b890',
              }}
            >
              🧙
            </div>
            <p className="text-sm font-bold" style={{ color: '#1c2e1e' }}>
              Master Scribe Julian
            </p>
            <p className="text-xs" style={{ color: '#8a7a5a' }}>
              Order of the Typing Guild
            </p>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section
        className="px-6 py-20 text-center md:px-8"
        style={{ background: '#2d4a2e' }}
      >
        <div className="mx-auto max-w-2xl">
          <h2 className="mb-4 text-3xl font-bold text-white">
            Ready to start your first harvest?
          </h2>
          <p
            className="mx-auto mb-8 max-w-md text-sm leading-7"
            style={{ color: 'rgba(255,255,255,0.6)' }}
          >
            Join thousands of scribes mastering the ultimate digital
            framework. Your legacy begins with the first word.
          </p>
          <Link
            href="/play"
            className="inline-block rounded-full px-8 py-3.5 text-sm font-bold uppercase tracking-wider transition hover:opacity-90"
            style={{
              background: '#4a8c3a',
              color: '#fff',
              boxShadow: '0 4px 24px rgba(74,140,58,0.4)',
            }}
          >
            Enter Keycroft Now
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer
        className="px-6 py-8 md:px-8"
        style={{
          background: '#1a2e1c',
          borderTop: '2px solid #d4a850',
        }}
      >
        <div className="mx-auto flex max-w-5xl flex-col gap-6">
          {/* Top row */}
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2">
              <span style={{ color: '#7aaa82' }}>🌿</span>
              <span
                className="text-sm font-bold uppercase tracking-[0.18em]"
                style={{ color: '#f4efe4' }}
              >
                Keycroft
              </span>
            </div>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
              &copy; Keycroft &middot; All rights reserved.
            </p>
          </div>

          {/* Footer links */}
          <div
            className="flex flex-wrap items-center justify-center gap-6 border-t pt-5"
            style={{ borderColor: 'rgba(255,255,255,0.1)' }}
          >
            {[
              'The Village',
              'Workshops',
              'Data & Privacy',
              'Privacy',
              'Terms',
            ].map((link) => (
              <Link
                key={link}
                href="#"
                className="text-xs transition hover:opacity-80"
                style={{ color: 'rgba(255,255,255,0.45)' }}
              >
                {link}
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}
