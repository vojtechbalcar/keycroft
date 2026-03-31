export type TypingKeyAction =
  | { type: 'input'; value: string }
  | { type: 'backspace' }
  | { type: 'ignore' }

export type TypingKeyEvent = {
  key: string
  altKey: boolean
  ctrlKey: boolean
  metaKey: boolean
}

export function normalizeTypingKey(event: TypingKeyEvent): TypingKeyAction {
  if (event.key === 'Backspace') {
    return { type: 'backspace' }
  }

  if (event.altKey || event.ctrlKey || event.metaKey) {
    return { type: 'ignore' }
  }

  if (event.key.length !== 1) {
    return { type: 'ignore' }
  }

  return { type: 'input', value: event.key }
}
