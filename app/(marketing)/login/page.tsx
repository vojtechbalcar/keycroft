import Link from 'next/link'

import { authFeatures, signIn } from '@/auth'
import { getSessionUser } from '@/lib/auth/get-session-user'

async function sendMagicLink(formData: FormData) {
  'use server'

  const email = String(formData.get('email') ?? '')
    .trim()
    .toLowerCase()

  if (!email) {
    return
  }

  await signIn('nodemailer', {
    email,
    redirectTo: '/home',
  })
}

async function signInTestAccount(formData: FormData) {
  'use server'

  await signIn('credentials', formData)
}

export default async function LoginPage() {
  const sessionUser = await getSessionUser()

  return (
    <main
      style={{
        minHeight: '100vh',
        background:
          'radial-gradient(circle at top, rgba(124,162,103,0.16), transparent 34%), linear-gradient(180deg, #f6eddd 0%, #eadfc9 48%, #e3d4bc 100%)',
        color: 'var(--kc-on-surface)',
        display: 'grid',
        placeItems: 'center',
        padding: '2rem 1.25rem',
      }}
    >
      <div
        style={{
          width: 'min(1040px, 100%)',
          display: 'grid',
          gap: '1rem',
          gridTemplateColumns: 'minmax(0, 1.05fr) minmax(0, 0.95fr)',
        }}
      >
        <section
          style={{
            border: '1px solid rgba(107,94,72,0.14)',
            background: 'rgba(255,250,240,0.78)',
            borderRadius: '32px',
            padding: '2rem',
            boxShadow: '0 24px 60px rgba(58,45,30,0.08)',
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: '0.68rem',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'var(--kc-on-surface-muted)',
            }}
          >
            Account Access
          </p>
          <h1
            style={{
              margin: '0.6rem 0 0',
              fontSize: 'clamp(2.4rem, 5vw, 4rem)',
              lineHeight: 0.92,
              fontFamily: 'var(--font-display, monospace)',
            }}
          >
            Save your village.
          </h1>
          <p
            style={{
              margin: '1rem 0 0',
              maxWidth: 520,
              fontSize: '0.94rem',
              lineHeight: 1.8,
              color: 'var(--kc-on-surface-muted)',
            }}
          >
            Sign in once and Keycroft will keep your progress, lesson history,
            and village state across devices. No password to remember if you use
            a magic link.
          </p>

          <div
            style={{
              marginTop: '1.6rem',
              display: 'grid',
              gap: '0.9rem',
            }}
          >
            {[
              'Guest progress can be merged into your account.',
              'Your app session stays server-side through Auth.js.',
              'Database access remains private on the server.',
            ].map((line) => (
              <div
                key={line}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.7rem',
                  padding: '0.9rem 1rem',
                  borderRadius: '18px',
                  border: '1px solid rgba(107,94,72,0.12)',
                  background: 'rgba(250,245,235,0.9)',
                }}
              >
                <span
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    background: '#4a8c3a',
                    flexShrink: 0,
                  }}
                />
                <span style={{ fontSize: '0.88rem' }}>{line}</span>
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: '1.6rem',
              fontSize: '0.82rem',
              color: 'var(--kc-on-surface-muted)',
            }}
          >
            Already signed in:{' '}
            <strong style={{ color: 'var(--kc-on-surface)' }}>
              {sessionUser?.email ?? sessionUser?.name ?? 'not yet'}
            </strong>
          </div>
        </section>

        <section
          style={{
            border: '1px solid rgba(107,94,72,0.14)',
            background: 'rgba(255,248,238,0.92)',
            borderRadius: '32px',
            padding: '2rem',
            boxShadow: '0 24px 60px rgba(58,45,30,0.08)',
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: '0.68rem',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'var(--kc-on-surface-muted)',
            }}
          >
            Sign In or Sign Up
          </p>

          {authFeatures.hasMagicLinkProvider ? (
            <form action={sendMagicLink} style={{ marginTop: '1rem' }}>
              <label
                htmlFor="login-email"
                style={{
                  display: 'block',
                  fontSize: '0.86rem',
                  fontWeight: 700,
                  marginBottom: '0.55rem',
                }}
              >
                Email address
              </label>
              <input
                id="login-email"
                name="email"
                type="email"
                required
                placeholder="you@example.com"
                style={{
                  width: '100%',
                  borderRadius: '18px',
                  border: '1px solid rgba(107,94,72,0.16)',
                  background: 'rgba(255,255,255,0.92)',
                  padding: '0.95rem 1rem',
                  fontSize: '0.95rem',
                  color: 'var(--kc-on-surface)',
                }}
              />

              <button
                type="submit"
                style={{
                  width: '100%',
                  marginTop: '0.95rem',
                  borderRadius: '999px',
                  border: '1px solid rgba(74,140,58,0.24)',
                  background: '#4a8c3a',
                  color: '#fff',
                  padding: '0.95rem 1.1rem',
                  fontWeight: 700,
                  fontSize: '0.86rem',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                }}
              >
                Email me a sign-in link
              </button>

              <p
                style={{
                  margin: '0.85rem 0 0',
                  fontSize: '0.8rem',
                  lineHeight: 1.7,
                  color: 'var(--kc-on-surface-muted)',
                }}
              >
                No password to remember. We send you a secure login link and
                create the account automatically if it does not exist yet.
              </p>
            </form>
          ) : (
            <div
              style={{
                marginTop: '1rem',
                borderRadius: '20px',
                border: '1px solid rgba(107,94,72,0.14)',
                background: 'rgba(248,242,232,0.88)',
                padding: '1rem 1rem 1.1rem',
              }}
            >
              <p style={{ margin: 0, fontSize: '0.86rem', fontWeight: 700 }}>
                Email login is not configured yet.
              </p>
              <p
                style={{
                  margin: '0.55rem 0 0',
                  fontSize: '0.82rem',
                  lineHeight: 1.7,
                  color: 'var(--kc-on-surface-muted)',
                }}
              >
                Add the SMTP values from `.env.example`, then restart the app
                and this page will activate automatically.
              </p>
            </div>
          )}

          {authFeatures.hasTestCredentialsProvider ? (
            <form
              action={signInTestAccount}
              style={{
                marginTop: '1.4rem',
                paddingTop: '1.2rem',
                borderTop: '1px solid rgba(107,94,72,0.12)',
              }}
            >
              <label
                htmlFor="test-account-email"
                style={{
                  display: 'block',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  marginBottom: '0.55rem',
                }}
              >
                Local test account
              </label>
              <input
                id="test-account-email"
                name="email"
                type="email"
                defaultValue="builder@keycroft.local"
                style={{
                  width: '100%',
                  borderRadius: '18px',
                  border: '1px solid rgba(107,94,72,0.16)',
                  background: 'rgba(255,255,255,0.92)',
                  padding: '0.9rem 1rem',
                  fontSize: '0.92rem',
                }}
              />
              <button
                type="submit"
                style={{
                  width: '100%',
                  marginTop: '0.85rem',
                  borderRadius: '999px',
                  border: '1px solid rgba(107,94,72,0.18)',
                  background: 'transparent',
                  color: 'var(--kc-on-surface)',
                  padding: '0.9rem 1rem',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                }}
              >
                Sign in with test account
              </button>
            </form>
          ) : null}

          <div
            style={{
              marginTop: '1.3rem',
              fontSize: '0.8rem',
              color: 'var(--kc-on-surface-muted)',
            }}
          >
            Looking for account controls after sign-in?{' '}
            <Link href="/settings">Open settings</Link>
          </div>
        </section>
      </div>
    </main>
  )
}
