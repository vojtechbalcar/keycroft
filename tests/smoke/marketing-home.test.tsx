import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import MarketingHomePage from '@/app/(marketing)/page'

describe('MarketingHomePage', () => {
  it('renders the hero headline', () => {
    render(<MarketingHomePage />)

    expect(
      screen.getByRole('heading', {
        name: /the digital homestead/i,
      }),
    ).toBeInTheDocument()
  })
})
