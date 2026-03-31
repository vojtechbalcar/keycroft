import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

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
