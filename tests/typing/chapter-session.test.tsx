import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { ChapterSession } from '@/components/typing/chapter-session'
import type { ChapterContent } from '@/lib/content/chapter-schema'

const chapterFixture: ChapterContent = {
  id: 'ch-test',
  order: 1,
  title: 'Arrival',
  phaseId: 'lantern',
  summary: 'Short chapter summary',
  skillTheme: 'calm starts',
  lessons: [
    {
      id: 'lesson-1',
      label: 'Opening Line',
      focus: 'steady rhythm',
      goal: 'Type the first short line cleanly.',
      text: 'calm',
    },
  ],
  capstone: {
    id: 'capstone-1',
    label: 'Capstone',
    focus: 'calm consistency',
    goal: 'Finish the chapter on a clean line.',
    text: 'soft',
  },
  unlocks: [],
}

function typePrompt(text: string) {
  const input = screen.getByLabelText(/typing input/i)

  for (const character of text) {
    fireEvent.keyDown(input, { key: character })
  }
}

describe('ChapterSession', () => {
  it('renders chapter context and the first lesson', () => {
    render(
      <ChapterSession
        chapter={chapterFixture}
        onChapterComplete={() => undefined}
        onPracticeComplete={() => undefined}
      />,
    )

    expect(screen.getByText('Arrival')).toBeInTheDocument()
    expect(screen.getAllByText('Opening Line').length).toBeGreaterThan(0)
    expect(screen.getByText(/lesson 1 of 2/i)).toBeInTheDocument()
  })

  it('advances to the capstone after finishing the lesson', () => {
    const onPracticeComplete = vi.fn()

    render(
      <ChapterSession
        chapter={chapterFixture}
        onChapterComplete={() => undefined}
        onPracticeComplete={onPracticeComplete}
      />,
    )

    typePrompt('calm')
    fireEvent.click(screen.getByRole('button', { name: /continue chapter/i }))

    expect(onPracticeComplete).toHaveBeenCalledTimes(1)
    expect(screen.getAllByText('Capstone').length).toBeGreaterThan(0)
    expect(screen.getByText(/lesson 2 of 2/i)).toBeInTheDocument()
  })

  it('marks the chapter complete after finishing the capstone', () => {
    const onChapterComplete = vi.fn()

    render(
      <ChapterSession
        chapter={chapterFixture}
        onChapterComplete={onChapterComplete}
        onPracticeComplete={() => undefined}
      />,
    )

    typePrompt('calm')
    fireEvent.click(screen.getByRole('button', { name: /continue chapter/i }))

    typePrompt('soft')

    expect(onChapterComplete).toHaveBeenCalledWith('ch-test')
    expect(screen.getByText(/chapter complete/i)).toBeInTheDocument()
  })
})
