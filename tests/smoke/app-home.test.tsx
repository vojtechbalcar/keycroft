import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import AppHomePage from '@/app/(app)/home/page'

describe('AppHomePage', () => {
  it('renders the village hub with chapter CTA', () => {
    render(<AppHomePage />)

    expect(
      screen.getByRole('heading', {
        name: /chapter 1/i,
      }),
    ).toBeInTheDocument()
  })
})
