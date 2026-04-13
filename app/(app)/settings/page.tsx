import { signOut } from '@/auth'
import { getSessionUser } from '@/lib/auth/get-session-user'
import Link from 'next/link'

async function handleSignOut() {
  'use server'
  await signOut({ redirectTo: '/' })
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
          Sign in to sync your progress across browsers and devices.
        </p>

        <div className="mt-8 max-w-md">
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
                ? `Signed in as ${sessionUser.email ?? sessionUser.name ?? 'your account'}.`
                : 'Your progress lives in local storage on this browser.'}
            </p>

            <div className="mt-6">
              {sessionUser ? (
                <form action={handleSignOut}>
                  <button
                    type="submit"
                    className="rounded-full px-4 py-2 text-sm font-medium text-white"
                    style={{ background: 'var(--kc-accent)' }}
                  >
                    Sign out
                  </button>
                </form>
              ) : (
                <Link
                  href="/login"
                  className="rounded-full px-4 py-2 text-sm font-medium text-white"
                  style={{ background: 'var(--kc-accent)' }}
                >
                  Sign in
                </Link>
              )}
            </div>
          </section>
        </div>
      </div>
    </section>
  )
}
