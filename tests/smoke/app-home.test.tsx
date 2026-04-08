import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import AppHomePage from '@/app/(hub)/home/page'

describe('AppHomePage', () => {
  it('renders the loading state before progress is fetched', () => {
    render(<AppHomePage />)

    expect(
      screen.getByText(/loading your village/i),
    ).toBeInTheDocument()
  })
})
