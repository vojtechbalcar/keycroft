import React from 'react'
import Link from 'next/link'
import { HeroTypingDemo } from '@/components/marketing/HeroTypingDemo'

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
        className="relative flex min-h-[92vh] flex-col overflow-hidden"
        style={{
          backgroundImage: 'url(/village-bg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center 25%',
          backgroundColor: '#0e1f10',
        }}
      >
        {/* Overlay — lighter at top so village shows, darker toward bottom where text lives */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'linear-gradient(to bottom, rgba(10,20,10,0.25) 0%, rgba(10,20,10,0.45) 40%, rgba(8,16,8,0.82) 70%, rgba(8,16,8,0.96) 100%)',
          }}
        />

        {/* Gold sparkles */}
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          {[
            { top: '10%', left: '14%', size: 3 },
            { top: '6%',  left: '72%', size: 2.5 },
            { top: '20%', left: '84%', size: 2 },
            { top: '15%', left: '8%',  size: 2 },
            { top: '28%', left: '90%', size: 1.5 },
            { top: '5%',  left: '50%', size: 2 },
          ].map((s, i) => (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                top: s.top,
                left: s.left,
                width: s.size * 2,
                height: s.size * 2,
                background: 'radial-gradient(circle, rgba(212,168,80,0.9), transparent 70%)',
                boxShadow: `0 0 ${s.size * 5}px rgba(212,168,80,0.35)`,
              }}
            />
          ))}
        </div>

        {/* Content — pushed toward bottom half where it's darker */}
        <div className="relative z-10 mt-auto flex flex-col items-center gap-6 px-6 pb-0 pt-[46vh] text-center">

          {/* Season badge */}
          <div
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.22em]"
            style={{
              background: 'rgba(212,168,80,0.12)',
              border: '1px solid rgba(212,168,80,0.35)',
              color: '#d4a850',
            }}
          >
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: '#d4a850' }}
            />
            Season 01: The Sprouting
          </div>

          {/* Headline */}
          <h1
            className="max-w-3xl text-[clamp(3rem,7.5vw,6rem)] font-black uppercase leading-[0.95] tracking-[0.01em] text-white"
            style={{ textShadow: '0 2px 40px rgba(0,0,0,0.7)' }}
          >
            The Digital
            <br />
            Homestead
          </h1>

          {/* Subhead */}
          <p
            className="max-w-md text-sm leading-7"
            style={{ color: 'rgba(255,255,255,0.55)' }}
          >
            Every keystroke builds your village. Type to forge new
            structures, unlock rare crafts, and grow your legacy.
          </p>

          {/* Live typing demo */}
          <HeroTypingDemo />
        </div>

        {/* ── Stats bar ── pinned to bottom of hero */}
        <div
          className="relative z-10 mt-8 grid grid-cols-2 gap-px md:grid-cols-4"
          style={{ background: 'rgba(212,168,80,0.18)' }}
        >
          {[
            { value: '42,901', label: 'Harvests Today' },
            { value: '104 WPM', label: 'Global Average' },
            { value: '1.2M', label: 'Words Planted' },
            { value: '842', label: 'Active Villages' },
          ].map((s) => (
            <div
              key={s.label}
              className="flex flex-col items-center gap-0.5 px-6 py-4"
              style={{ background: 'rgba(8,18,8,0.88)' }}
            >
              <span
                className="text-xl font-black tabular-nums"
                style={{ color: '#d4a850' }}
              >
                {s.value}
              </span>
              <span
                className="text-[9px] uppercase tracking-[0.22em]"
                style={{ color: 'rgba(255,255,255,0.4)' }}
              >
                {s.label}
              </span>
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
