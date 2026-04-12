import Link from 'next/link'

export const metadata = {
  title: 'About — Keycroft',
  description: 'The story behind Keycroft, a calm typing world built for people who want to improve without the pressure.',
}

export default function AboutPage() {
  return (
    <div style={{ background: '#f4efe4', color: '#1c2e1e', minHeight: '100vh' }}>
      {/* Nav */}
      <nav
        className="flex items-center justify-between px-8 py-3"
        style={{ background: '#2d4a2e', borderBottom: '3px solid #d4a850' }}
      >
        <Link href="/" className="flex items-center gap-2">
          <span style={{ color: '#7aaa82' }}>🌿</span>
          <span className="text-sm font-bold uppercase tracking-[0.18em]" style={{ color: '#f4efe4' }}>
            Keycroft
          </span>
        </Link>
        <Link
          href="/world"
          className="rounded-full px-5 py-2 text-sm font-semibold transition hover:opacity-90"
          style={{ background: '#4a8c3a', color: '#fff' }}
        >
          Start Typing
        </Link>
      </nav>

      {/* Content */}
      <main className="mx-auto max-w-2xl px-6 py-20">
        <p className="mb-2 text-[10px] uppercase tracking-[0.3em]" style={{ color: '#8a7a5a' }}>
          The Founder&apos;s Note
        </p>
        <h1 className="mb-8 text-3xl font-bold" style={{ color: '#1c2e1e' }}>
          About Keycroft
        </h1>

        <div className="space-y-6 text-sm leading-7" style={{ color: '#3a4e3c' }}>
          <p>
            Keycroft started as a personal frustration. Every typing site I tried felt like a speed
            test at the DMV — cold rows of random words, a blinking timer, and a score that made me
            feel slow. Nothing about it made me want to come back.
          </p>
          <p>
            I wanted something different: a place that felt warm, that rewarded consistency over raw
            speed, and that made daily practice feel like tending something alive instead of grinding
            through a benchmark.
          </p>
          <p>
            So I built Keycroft. The village grows as you type. Your keystrokes build structures,
            unlock regions, and leave a visible record of how far you have come. Progress is always
            legible, even on a slow day.
          </p>
          <p>
            The app is built around short, focused sessions — ten to fifteen minutes, not hours. It
            meets you where you are with a placement flow, then adapts the chapter path to your
            current level. You do not have to grind the beginner lessons if you already know the
            home row.
          </p>
          <p>
            This is a solo project. One founder, no VC, no growth hacks. If Keycroft helps you
            build a real, lasting typing habit, that is the whole point.
          </p>
        </div>

        <div
          className="mt-12 rounded-xl p-6"
          style={{ background: '#faf7f0', border: '1px solid #d8cfbc' }}
        >
          <p className="mb-1 text-sm font-semibold" style={{ color: '#1c2e1e' }}>
            Ready to start?
          </p>
          <p className="mb-4 text-xs leading-6" style={{ color: '#6a7a5e' }}>
            Your first session takes about ten minutes. No account needed to begin.
          </p>
          <Link
            href="/world"
            className="inline-block rounded-lg px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition hover:opacity-90"
            style={{ background: '#4a8c3a' }}
          >
            Enter Keycroft
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer
        className="px-6 py-8"
        style={{ background: '#1a2e1c', borderTop: '2px solid #d4a850' }}
      >
        <div className="mx-auto flex max-w-2xl items-center justify-between">
          <span className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
            &copy; Keycroft
          </span>
          <div className="flex gap-6">
            {[
              { label: 'Home', href: '/' },
              { label: 'FAQ', href: '/faq' },
              { label: 'Privacy', href: '/privacy' },
            ].map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-xs transition hover:opacity-80"
                style={{ color: 'rgba(255,255,255,0.45)' }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}
