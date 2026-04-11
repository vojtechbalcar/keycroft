import { describe, expect, it, vi } from 'vitest'

// app/(hub)/home/page.tsx now just redirects to /world.
// The redirect() call from next/navigation throws a special NEXT_REDIRECT
// error that Next.js catches at the framework level — it cannot be rendered
// as a component in a unit-test environment. We therefore only verify that
// the module re-exports a default export (the page component) and that the
// next/navigation redirect is invoked when the component is called.

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}))

import { redirect } from 'next/navigation'
import HubHomePage from '@/app/(hub)/home/page'

describe('HubHomePage (redirect page)', () => {
  it('calls redirect("/world") when rendered', () => {
    try {
      HubHomePage()
    } catch {
      // redirect() may throw in test environments — that is expected
    }
    expect(redirect).toHaveBeenCalledWith('/world')
  })
})
