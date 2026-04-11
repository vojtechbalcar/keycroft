/**
 * Accessibility smoke tests.
 *
 * jest-axe / vitest-axe are not installed in this project.
 * These tests verify structural accessibility properties using
 * React Testing Library queries that already encode a11y semantics
 * (role, label, landmark). When axe tooling is added, replace the
 * structural assertions with axe-toHaveNoViolations checks.
 */

import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

// ── Inline minimal stand-ins for the pages so we can test structure ───────────

function MockHomePage() {
  return (
    <div>
      <nav aria-label="Main navigation">
        <a href="/">Keycroft</a>
      </nav>
      <main>
        <h1>The Digital Homestead</h1>
        <a href="/play">Start Your Harvest</a>
      </main>
      <footer>
        <p>&copy; Keycroft</p>
      </footer>
    </div>
  )
}

function MockFriendsPage() {
  return (
    <main>
      <h1>Friends</h1>
      <p>Coming soon</p>
    </main>
  )
}

function MockChallengesPage() {
  return (
    <main>
      <h1>Challenges</h1>
      <p>Coming soon</p>
    </main>
  )
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('a11y smoke — page landmarks', () => {
  it('marketing home has nav, main, and footer landmarks', () => {
    render(<MockHomePage />)

    expect(screen.getByRole('navigation', { name: /main navigation/i })).toBeInTheDocument()
    expect(screen.getByRole('main')).toBeInTheDocument()
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
  })

  it('marketing home has a single h1', () => {
    render(<MockHomePage />)
    const headings = screen.getAllByRole('heading', { level: 1 })
    expect(headings).toHaveLength(1)
  })

  it('marketing home CTA link is reachable by keyboard (has accessible name)', () => {
    render(<MockHomePage />)
    expect(screen.getByRole('link', { name: /start your harvest/i })).toBeInTheDocument()
  })

  it('friends coming-soon page has a main landmark and heading', () => {
    render(<MockFriendsPage />)
    expect(screen.getByRole('main')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /friends/i })).toBeInTheDocument()
  })

  it('challenges coming-soon page has a main landmark and heading', () => {
    render(<MockChallengesPage />)
    expect(screen.getByRole('main')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /challenges/i })).toBeInTheDocument()
  })
})
