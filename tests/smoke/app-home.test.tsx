import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import AppHomePage from '@/app/(app)/home/page'

describe('AppHomePage', () => {
  it('renders the stage one placeholder', () => {
    render(<AppHomePage />)

    expect(
      screen.getByRole('heading', {
        name: /keycroft home/i,
      }),
    ).toBeInTheDocument()
  })
})
