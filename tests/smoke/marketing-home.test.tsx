import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import MarketingHomePage from '@/app/(marketing)/page'

describe('MarketingHomePage', () => {
  it('renders the hero headline', () => {
    render(<MarketingHomePage />)

    expect(
      screen.getByRole('heading', {
        name: /keycroft/i,
      }),
    ).toBeInTheDocument()
  })

  it('routes the primary entry CTA into the world flow', () => {
    render(<MarketingHomePage />)

    expect(
      screen.getByRole('link', { name: /enter the village/i }),
    ).toHaveAttribute('href', '/world')
  })
})
