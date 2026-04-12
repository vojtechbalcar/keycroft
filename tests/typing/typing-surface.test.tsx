import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { SessionSummary } from '@/components/typing/session-summary'
import { TypingSurface } from '@/components/typing/typing-surface'

const prompt = {
  id: 'test-line',
  label: 'Village Path',
  focus: 'light rhythm',
  text: 'calm',
}

describe('TypingSurface', () => {
  it('renders the active prompt and session header', () => {
    render(<TypingSurface prompt={prompt} onComplete={() => undefined} />)

    expect(screen.getByText(/village path/i)).toBeInTheDocument()
    expect(screen.getByText(/light rhythm/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/typing input/i)).toBeInTheDocument()
  })

  it('shows an incorrect state until the user removes the wrong key', () => {
    render(<TypingSurface prompt={prompt} onComplete={() => undefined} />)

    const input = screen.getByLabelText(/typing input/i)
    fireEvent.keyDown(input, { key: 'x' })

    const typingLine = screen.getByTestId('typing-line')
    expect(typingLine.querySelector('[data-status="incorrect"]')).not.toBeNull()

    fireEvent.keyDown(input, { key: 'Backspace' })

    expect(typingLine.querySelector('[data-status="incorrect"]')).toBeNull()
  })

  it('highlights the next expected key and lets the visible keyboard type it', () => {
    render(<TypingSurface prompt={prompt} onComplete={() => undefined} />)

    const expectedKey = screen.getByRole('button', { name: /type c/i })
    expect(expectedKey).toHaveAttribute('data-key-state', 'expected')

    fireEvent.click(expectedKey)

    expect(screen.getByRole('button', { name: /type a/i })).toHaveAttribute(
      'data-key-state',
      'expected',
    )
  })

  it('calls onComplete when the full prompt is typed correctly', () => {
    const onComplete = vi.fn()

    render(<TypingSurface prompt={prompt} onComplete={onComplete} />)

    const input = screen.getByLabelText(/typing input/i)
    fireEvent.keyDown(input, { key: 'c' })
    fireEvent.keyDown(input, { key: 'a' })
    fireEvent.keyDown(input, { key: 'l' })
    fireEvent.keyDown(input, { key: 'm' })

    expect(onComplete).toHaveBeenCalledTimes(1)
    expect(onComplete.mock.calls[0][0]).toEqual(
      expect.objectContaining({
        inputValue: 'calm',
        isComplete: true,
      }),
    )
  })
})

describe('SessionSummary', () => {
  it('renders session metrics and a focus recommendation', () => {
    render(
      <SessionSummary
        metrics={{
          elapsedMs: 4000,
          correctCharacters: 4,
          characterInputCount: 6,
          correctedErrors: 2,
          accuracy: 66.7,
          wpm: 12,
          cleanRun: false,
        }}
        onTryAnother={() => undefined}
        prompt={prompt}
      />,
    )

    expect(
      screen.getByRole('heading', { name: /session complete/i }),
    ).toBeInTheDocument()
    expect(screen.getByText(/66.7%/i)).toBeInTheDocument()
    expect(screen.getByText(/focus next/i)).toBeInTheDocument()
  })
})
