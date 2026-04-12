import Link from 'next/link'

export const metadata = {
  title: 'FAQ — Keycroft',
  description: 'Frequently asked questions about Keycroft, the calm village typing app.',
}

const faqs: Array<{ q: string; a: string }> = [
  {
    q: 'Do I need an account to use Keycroft?',
    a: 'No. You can start typing immediately as a guest. Your progress is saved locally in your browser. Create an account whenever you want to keep your progress across devices.',
  },
  {
    q: 'What is the placement test?',
    a: 'When you first arrive, Keycroft asks you to type a short passage and optionally rate your own comfort level. This places you into a named phase — Lantern Room, Workshop Lane, or higher — so you start at the right point rather than working through lessons you do not need.',
  },
  {
    q: 'How does the village grow?',
    a: 'The village is a deterministic projection of your real typing progress. Completing chapters, reaching accuracy targets, and sustaining practice over multiple days all advance the village state. There is no separate game economy to manage.',
  },
  {
    q: 'How long is a typical session?',
    a: 'Most chapters are designed for ten to fifteen minutes. Keycroft does not require long daily sessions to make progress. Consistency over multiple days matters more than any single long run.',
  },
  {
    q: 'Does Keycroft teach all ten fingers?',
    a: 'Yes. The chapter path is built around proper touch-typing technique with all ten fingers. The early chapters focus on home-row muscle memory, and later chapters introduce reach keys and shift combinations.',
  },
  {
    q: 'Is Keycroft free?',
    a: 'The core typing loop, placement, and chapter path are free. Future premium features may include advanced analytics, social challenges, and additional village content. The free version will always be fully usable.',
  },
  {
    q: 'What browsers and devices does Keycroft support?',
    a: 'Keycroft is a desktop-first app. It works in any modern browser on a computer with a physical keyboard. It is not designed for mobile typing.',
  },
  {
    q: 'How do I reset my progress?',
    a: 'In the Settings page you can clear your local guest progress. If you have an account, contact support and we will help you reset your history.',
  },
]

export default function FaqPage() {
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
          Common Questions
        </p>
        <h1 className="mb-10 text-3xl font-bold" style={{ color: '#1c2e1e' }}>
          Frequently Asked Questions
        </h1>

        <dl className="space-y-8">
          {faqs.map((faq) => (
            <div
              key={faq.q}
              className="rounded-xl p-6"
              style={{ background: '#faf7f0', border: '1px solid #d8cfbc' }}
            >
              <dt className="mb-2 font-semibold" style={{ color: '#1c2e1e' }}>
                {faq.q}
              </dt>
              <dd className="text-sm leading-6" style={{ color: '#4a5e4c' }}>
                {faq.a}
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-12 text-center">
          <p className="mb-4 text-sm" style={{ color: '#6a7a5e' }}>
            Still have a question? Reach out at{' '}
            <a
              href="mailto:hello@keycroft.com"
              className="underline transition hover:opacity-70"
              style={{ color: '#4a8c3a' }}
            >
              hello@keycroft.com
            </a>
          </p>
          <Link
            href="/world"
            className="inline-block rounded-full px-7 py-3 text-sm font-semibold text-white transition hover:opacity-90"
            style={{ background: '#4a8c3a' }}
          >
            Start Your Harvest
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
              { label: 'About', href: '/about' },
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
