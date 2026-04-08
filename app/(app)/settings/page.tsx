import { authFeatures, signIn, signOut } from '@/auth'
import { getSessionUser } from '@/lib/auth/get-session-user'

async function sendMagicLink(formData: FormData) {
  'use server'

  const email = String(formData.get('email') ?? '').trim()

  if (!email) {
    return
  }

  await signIn('nodemailer', {
    email,
    redirectTo: '/settings',
  })
}

async function signInTestAccount(formData: FormData) {
  'use server'

  await signIn('credentials', formData)
}

async function handleSignOut() {
  'use server'

  await signOut({
    redirectTo: '/settings',
  })
}

export default async function SettingsPage() {
  const sessionUser = await getSessionUser()

  return (
    <section className="px-6 py-8">
      <div className="mx-auto max-w-4xl">
        <p
          className="text-[10px] uppercase tracking-[0.2em]"
          style={{ color: 'var(--kc-on-surface-muted)' }}
        >
          Account and Sync
        </p>
        <h1 className="mt-2 text-3xl font-semibold" style={{ color: 'var(--kc-on-surface)' }}>
          Keep your village across devices.
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6" style={{ color: 'var(--kc-on-surface-muted)' }}>
          Guest mode still works, but once you sign in the app will merge your local progress into
          the server-backed account and reuse it the next time you open Keycroft.
        </p>

        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <section
            className="rounded-[var(--kc-radius-card)] border p-6"
            style={{ borderColor: 'var(--kc-line-light)', background: 'var(--kc-surface)' }}
          >
            <p
              className="text-[10px] uppercase tracking-[0.18em]"
              style={{ color: 'var(--kc-on-surface-muted)' }}
            >
              Current mode
            </p>
            <h2 className="mt-2 text-xl font-semibold" style={{ color: 'var(--kc-on-surface)' }}>
              {sessionUser ? 'Account connected' : 'Guest mode active'}
            </h2>
            <p className="mt-2 text-sm leading-6" style={{ color: 'var(--kc-on-surface-muted)' }}>
              {sessionUser
                ? `Signed in as ${sessionUser.email ?? sessionUser.name ?? 'your account'}. Local progress will sync into the server-backed record automatically.`
                : 'Your progress currently lives in local storage on this browser. Sign in to keep it across browsers and devices.'}
            </p>

            {sessionUser ? (
              <form action={handleSignOut} className="mt-6">
                <button
                  type="submit"
                  className="rounded-full px-4 py-2 text-sm font-medium text-white"
                  style={{ background: 'var(--kc-accent)' }}
                >
                  Sign out
                </button>
              </form>
            ) : null}
          </section>

          <section
            className="rounded-[var(--kc-radius-card)] border p-6"
            style={{ borderColor: 'var(--kc-line-light)', background: 'rgba(255,255,255,0.7)' }}
          >
            <p
              className="text-[10px] uppercase tracking-[0.18em]"
              style={{ color: 'var(--kc-on-surface-muted)' }}
            >
              Upgrade path
            </p>

            {authFeatures.hasMagicLinkProvider ? (
              <form action={sendMagicLink} className="mt-4 flex flex-col gap-3">
                <label className="text-sm font-medium" htmlFor="magic-link-email">
                  Email magic link
                </label>
                <input
                  id="magic-link-email"
                  name="email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  className="rounded-2xl border px-4 py-3"
                  style={{ borderColor: 'var(--kc-line-light)', background: 'var(--kc-surface)' }}
                />
                <button
                  type="submit"
                  className="rounded-full px-4 py-2 text-sm font-medium text-white"
                  style={{ background: 'var(--kc-accent)' }}
                >
                  Email me a sign-in link
                </button>
              </form>
            ) : (
              <p className="mt-4 text-sm leading-6" style={{ color: 'var(--kc-on-surface-muted)' }}>
                Magic-link email is not configured in this environment yet. Add the email server
                environment variables to turn it on.
              </p>
            )}

            {authFeatures.hasTestCredentialsProvider ? (
              <form action={signInTestAccount} className="mt-6 flex flex-col gap-3">
                <label className="text-sm font-medium" htmlFor="test-account-email">
                  Local test account
                </label>
                <input
                  id="test-account-email"
                  name="email"
                  type="email"
                  required
                  defaultValue="builder@keycroft.local"
                  className="rounded-2xl border px-4 py-3"
                  style={{ borderColor: 'var(--kc-line-light)', background: 'var(--kc-surface)' }}
                />
                <button
                  type="submit"
                  className="rounded-full border px-4 py-2 text-sm font-medium"
                  style={{ borderColor: 'var(--kc-line-light)', color: 'var(--kc-on-surface)' }}
                >
                  Sign in with test account
                </button>
              </form>
            ) : null}
          </section>
        </div>
      </div>
    </section>
  )
}
