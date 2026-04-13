import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

vi.mock('@/auth', () => ({
  authFeatures: {
    hasMagicLinkProvider: true,
    hasTestCredentialsProvider: false,
  },
  signIn: vi.fn(),
}))

vi.mock('@/lib/auth/get-session-user', () => ({
  getSessionUser: vi.fn(async () => null),
}))

import LoginPage from '@/app/(marketing)/login/page'

describe('LoginPage', () => {
  it('renders the auth entry form and explains the magic-link flow', async () => {
    const page = await LoginPage()

    render(page)

    expect(
      screen.getByRole('heading', { name: /save your village/i }),
    ).toBeInTheDocument()
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /email me a sign-in link/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByText(/create the account automatically if it does not exist yet/i),
    ).toBeInTheDocument()
  })
})
