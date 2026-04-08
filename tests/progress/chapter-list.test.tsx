import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { ChapterList } from '@/components/progress/chapter-list'
import { listChapters } from '@/lib/content/list-chapters'

describe('ChapterList', () => {
  it('shows completed, recommended, and locked chapter states', () => {
    render(
      <ChapterList
        chapters={listChapters()}
        completedChapterIds={['ch01-arrival']}
        currentPhaseId="lantern"
        recommendedChapterId="ch02-home-row"
      />,
    )

    expect(screen.getByText('Arrival')).toBeInTheDocument()
    expect(screen.getByText('Completed')).toBeInTheDocument()
    expect(screen.getByText('Recommended')).toBeInTheDocument()
    expect(screen.getByText('Locked')).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: /home row stability/i }),
    ).toHaveAttribute('href', '/chapters/ch02-home-row')
  })
})
