import Link from 'next/link'

export const metadata = {
  title: 'Privacy Policy — Keycroft',
  description: 'How Keycroft collects, uses, and protects your data.',
}

export default function PrivacyPage() {
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
          href="/play"
          className="rounded-full px-5 py-2 text-sm font-semibold transition hover:opacity-90"
          style={{ background: '#4a8c3a', color: '#fff' }}
        >
          Start Typing
        </Link>
      </nav>

      {/* Content */}
      <main className="mx-auto max-w-2xl px-6 py-20">
        <p className="mb-2 text-[10px] uppercase tracking-[0.3em]" style={{ color: '#8a7a5a' }}>
          Legal
        </p>
        <h1 className="mb-2 text-3xl font-bold" style={{ color: '#1c2e1e' }}>
          Privacy Policy
        </h1>
        <p className="mb-10 text-xs" style={{ color: '#8a7a5a' }}>
          Last updated: April 2026
        </p>

        <div className="space-y-10 text-sm leading-7" style={{ color: '#3a4e3c' }}>
          <section>
            <h2 className="mb-3 text-base font-semibold" style={{ color: '#1c2e1e' }}>
              Overview
            </h2>
            <p>
              Keycroft is a small, solo-built product. This policy explains what data we collect,
              why we collect it, and how we protect it. We collect only what is necessary to run
              the product and improve it.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-base font-semibold" style={{ color: '#1c2e1e' }}>
              What we collect
            </h2>
            <ul className="ml-4 list-disc space-y-2">
              <li>
                <strong>Guest progress:</strong> Stored entirely in your browser&apos;s local
                storage. We never see it unless you create an account.
              </li>
              <li>
                <strong>Account data:</strong> If you create an account, we store your email
                address and typing progress (WPM, accuracy, completed chapters) on our servers.
              </li>
              <li>
                <strong>Usage analytics:</strong> Aggregate, anonymous data about which features
                are used. No individual keystroke tracking.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-base font-semibold" style={{ color: '#1c2e1e' }}>
              What we do not collect
            </h2>
            <ul className="ml-4 list-disc space-y-2">
              <li>We do not record the text you type during practice sessions.</li>
              <li>We do not sell your data to any third party.</li>
              <li>We do not use your data to train AI models.</li>
              <li>We do not run behavioural advertising.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-base font-semibold" style={{ color: '#1c2e1e' }}>
              Cookies
            </h2>
            <p>
              We use a single session cookie for authentication when you are signed in. We do
              not use tracking or advertising cookies.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-base font-semibold" style={{ color: '#1c2e1e' }}>
              Data retention and deletion
            </h2>
            <p>
              You can delete your account at any time from the Settings page. All associated
              progress data is removed within 30 days. Guest progress in local storage can be
              cleared from the Settings page or directly through your browser.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-base font-semibold" style={{ color: '#1c2e1e' }}>
              Third-party services
            </h2>
            <p>
              Keycroft uses a managed PostgreSQL database for account persistence. Authentication
              is handled with Auth.js and magic links sent via email. No other third-party data
              processors are involved in the core product.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-base font-semibold" style={{ color: '#1c2e1e' }}>
              Contact
            </h2>
            <p>
              Questions about privacy?{' '}
              <a
                href="mailto:privacy@keycroft.com"
                className="underline transition hover:opacity-70"
                style={{ color: '#4a8c3a' }}
              >
                privacy@keycroft.com
              </a>
            </p>
          </section>
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
              { label: 'FAQ', href: '/faq' },
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
