# Keycroft Stage 2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the first real Keycroft typing session at `/play`, including the core keystroke engine, trustworthy session metrics, a focused typing UI, and smoke coverage that proves the loop works end-to-end.

**Architecture:** Keep the typing engine deliberately split between pure state logic and thin UI. `lib/typing/` should own session state transitions, key normalization, practice text fixtures, and metric calculation, while `components/typing/` should render the active session and the completed-session summary without embedding typing rules in JSX. Stage 2 must stay isolated: no persistence, no placement, no village state, and no content system yet.

**Tech Stack:** Next.js App Router, React, TypeScript, Tailwind CSS, Vitest, React Testing Library, Playwright

---

## Starting Point

- Stage 1 already exists on `main`
- `/` and `/home` already render successfully
- Shared styling, layout shells, and smoke test tooling already exist
- There is no `/play` route yet
- There is no typing engine, typing session state, or metrics module yet
- There is no persistence, onboarding, or village behavior yet
- This stage should prove the typing loop in isolation before any game systems are added

## Files to Create in Stage 2

- Create: `lib/typing/text-runner.ts`
- Create: `lib/typing/session-metrics.ts`
- Create: `lib/typing/key-events.ts`
- Create: `lib/typing/practice-texts.ts`
- Create: `lib/validation/typing.ts`
- Create: `components/typing/typing-surface.tsx`
- Create: `components/typing/session-header.tsx`
- Create: `components/typing/session-summary.tsx`
- Create: `app/(app)/play/page.tsx`
- Create: `tests/typing/text-runner.test.ts`
- Create: `tests/typing/session-metrics.test.ts`
- Create: `tests/typing/typing-surface.test.tsx`
- Create: `e2e/play-session.spec.ts`

## Files to Modify in Stage 2

- None required beyond the new Stage 2 files

## Task 1: Build the Typing Runner Core

**Files:**
- Create: `tests/typing/text-runner.test.ts`
- Create: `lib/validation/typing.ts`
- Create: `lib/typing/key-events.ts`
- Create: `lib/typing/text-runner.ts`

- [ ] **Step 1: Write the failing text-runner tests**

```ts
// tests/typing/text-runner.test.ts
import { describe, expect, it } from "vitest";

import {
  applyTypingAction,
  createTypingSession,
  getCharacterStatuses
} from "@/lib/typing/text-runner";

describe("text-runner", () => {
  it("creates an empty session for a valid prompt", () => {
    const session = createTypingSession("calm");

    expect(session.targetText).toBe("calm");
    expect(session.inputValue).toBe("");
    expect(session.startedAt).toBeNull();
    expect(session.completedAt).toBeNull();
    expect(session.characterInputCount).toBe(0);
    expect(session.correctedErrors).toBe(0);
    expect(session.isComplete).toBe(false);
  });

  it("advances through correct input and completes on an exact match", () => {
    let session = createTypingSession("go");

    session = applyTypingAction(session, { type: "input", value: "g" }, 1000);
    session = applyTypingAction(session, { type: "input", value: "o" }, 1400);

    expect(session.inputValue).toBe("go");
    expect(session.startedAt).toBe(1000);
    expect(session.completedAt).toBe(1400);
    expect(session.characterInputCount).toBe(2);
    expect(session.isComplete).toBe(true);
  });

  it("marks incorrect characters until they are removed", () => {
    let session = createTypingSession("calm");

    session = applyTypingAction(session, { type: "input", value: "x" }, 1000);

    expect(getCharacterStatuses(session)[0]).toEqual({
      expected: "c",
      actual: "x",
      status: "incorrect"
    });

    session = applyTypingAction(session, { type: "backspace" }, 1100);

    expect(getCharacterStatuses(session)[0]).toEqual({
      expected: "c",
      actual: null,
      status: "pending"
    });
  });

  it("counts corrected errors only when an incorrect character is removed", () => {
    let session = createTypingSession("calm");

    session = applyTypingAction(session, { type: "input", value: "x" }, 1000);
    session = applyTypingAction(session, { type: "backspace" }, 1050);
    session = applyTypingAction(session, { type: "input", value: "c" }, 1100);
    session = applyTypingAction(session, { type: "backspace" }, 1150);

    expect(session.correctedErrors).toBe(1);
  });
});
```

- [ ] **Step 2: Run the text-runner tests to verify they fail**

Run:

```bash
npx vitest run tests/typing/text-runner.test.ts
```

Expected:
- FAIL with module resolution errors for `@/lib/typing/text-runner`
- no passing tests yet

- [ ] **Step 3: Write the validation, key normalization, and runner implementation**

```ts
// lib/validation/typing.ts
export function ensurePlayableText(targetText: string): string {
  if (targetText.length === 0) {
    throw new Error("Practice text must not be empty.");
  }

  if (targetText.includes("\n") || targetText.includes("\r")) {
    throw new Error("Stage 2 practice text must stay on one line.");
  }

  return targetText;
}
```

```ts
// lib/typing/key-events.ts
export type TypingKeyAction =
  | { type: "input"; value: string }
  | { type: "backspace" }
  | { type: "ignore" };

export type TypingKeyEvent = {
  key: string;
  altKey: boolean;
  ctrlKey: boolean;
  metaKey: boolean;
};

export function normalizeTypingKey(event: TypingKeyEvent): TypingKeyAction {
  if (event.key === "Backspace") {
    return { type: "backspace" };
  }

  if (event.altKey || event.ctrlKey || event.metaKey) {
    return { type: "ignore" };
  }

  if (event.key.length !== 1) {
    return { type: "ignore" };
  }

  return { type: "input", value: event.key };
}
```

```ts
// lib/typing/text-runner.ts
import { ensurePlayableText } from "@/lib/validation/typing";

import type { TypingKeyAction } from "@/lib/typing/key-events";

export type CharacterStatus = "pending" | "correct" | "incorrect";

export type CharacterView = {
  expected: string;
  actual: string | null;
  status: CharacterStatus;
};

export type TypingSessionState = {
  targetText: string;
  inputValue: string;
  startedAt: number | null;
  completedAt: number | null;
  characterInputCount: number;
  correctedErrors: number;
  isComplete: boolean;
};

export function createTypingSession(targetText: string): TypingSessionState {
  return {
    targetText: ensurePlayableText(targetText),
    inputValue: "",
    startedAt: null,
    completedAt: null,
    characterInputCount: 0,
    correctedErrors: 0,
    isComplete: false
  };
}

export function applyTypingAction(
  session: TypingSessionState,
  action: TypingKeyAction,
  atMs: number
): TypingSessionState {
  if (session.isComplete || action.type === "ignore") {
    return session;
  }

  if (action.type === "backspace") {
    if (session.inputValue.length === 0) {
      return session;
    }

    const lastIndex = session.inputValue.length - 1;
    const removedWasIncorrect =
      session.inputValue[lastIndex] !== session.targetText[lastIndex];

    return {
      ...session,
      inputValue: session.inputValue.slice(0, -1),
      correctedErrors:
        session.correctedErrors + (removedWasIncorrect ? 1 : 0)
    };
  }

  if (session.inputValue.length >= session.targetText.length) {
    return session;
  }

  const nextInputValue = `${session.inputValue}${action.value}`;
  const startedAt = session.startedAt ?? atMs;
  const isComplete = nextInputValue === session.targetText;

  return {
    ...session,
    inputValue: nextInputValue,
    startedAt,
    completedAt: isComplete ? atMs : null,
    characterInputCount: session.characterInputCount + 1,
    isComplete
  };
}

export function getCharacterStatuses(
  session: TypingSessionState
): CharacterView[] {
  return session.targetText.split("").map((expected, index) => {
    if (index >= session.inputValue.length) {
      return {
        expected,
        actual: null,
        status: "pending"
      };
    }

    const actual = session.inputValue[index];
    const status = actual === expected ? "correct" : "incorrect";

    return {
      expected,
      actual,
      status
    };
  });
}

export function getCurrentErrorCount(session: TypingSessionState): number {
  return getCharacterStatuses(session).filter(
    (character) => character.status === "incorrect"
  ).length;
}
```

- [ ] **Step 4: Run the text-runner tests to verify they pass**

Run:

```bash
npx vitest run tests/typing/text-runner.test.ts
```

Expected:
- PASS
- `4 passed`

- [ ] **Step 5: Commit the typing runner baseline**

```bash
git add tests/typing/text-runner.test.ts lib/validation/typing.ts lib/typing/key-events.ts lib/typing/text-runner.ts
git commit -m "feat: add stage two typing session runner"
```

## Task 2: Build Session Metrics with TDD

**Files:**
- Create: `tests/typing/session-metrics.test.ts`
- Create: `lib/typing/session-metrics.ts`

- [ ] **Step 1: Write the failing session-metrics tests**

```ts
// tests/typing/session-metrics.test.ts
import { describe, expect, it } from "vitest";

import { calculateSessionMetrics } from "@/lib/typing/session-metrics";
import type { TypingSessionState } from "@/lib/typing/text-runner";

function createCompletedSession(
  overrides: Partial<TypingSessionState> = {}
): TypingSessionState {
  return {
    targetText: "calm",
    inputValue: "calm",
    startedAt: 1000,
    completedAt: 5000,
    characterInputCount: 4,
    correctedErrors: 0,
    isComplete: true,
    ...overrides
  };
}

describe("session-metrics", () => {
  it("calculates elapsed time, accuracy, and wpm for a clean run", () => {
    const metrics = calculateSessionMetrics(createCompletedSession());

    expect(metrics.elapsedMs).toBe(4000);
    expect(metrics.correctCharacters).toBe(4);
    expect(metrics.accuracy).toBe(100);
    expect(metrics.wpm).toBe(12);
    expect(metrics.cleanRun).toBe(true);
  });

  it("reduces accuracy when extra character inputs were needed", () => {
    const metrics = calculateSessionMetrics(
      createCompletedSession({
        characterInputCount: 6,
        correctedErrors: 2
      })
    );

    expect(metrics.accuracy).toBe(66.7);
    expect(metrics.correctedErrors).toBe(2);
    expect(metrics.cleanRun).toBe(false);
  });

  it("throws when the session is incomplete", () => {
    expect(() =>
      calculateSessionMetrics(
        createCompletedSession({
          completedAt: null,
          isComplete: false
        })
      )
    ).toThrow("Session must be complete before calculating metrics.");
  });
});
```

- [ ] **Step 2: Run the session-metrics tests to verify they fail**

Run:

```bash
npx vitest run tests/typing/session-metrics.test.ts
```

Expected:
- FAIL with module resolution errors for `@/lib/typing/session-metrics`

- [ ] **Step 3: Write the session-metrics implementation**

```ts
// lib/typing/session-metrics.ts
import type { TypingSessionState } from "@/lib/typing/text-runner";

export type SessionMetrics = {
  elapsedMs: number;
  correctCharacters: number;
  characterInputCount: number;
  correctedErrors: number;
  accuracy: number;
  wpm: number;
  cleanRun: boolean;
};

function roundToOneDecimal(value: number): number {
  return Math.round(value * 10) / 10;
}

export function calculateSessionMetrics(
  session: TypingSessionState
): SessionMetrics {
  if (
    session.startedAt === null ||
    session.completedAt === null ||
    !session.isComplete
  ) {
    throw new Error("Session must be complete before calculating metrics.");
  }

  const elapsedMs = Math.max(session.completedAt - session.startedAt, 1);
  const correctCharacters = session.targetText.length;
  const characterInputCount = Math.max(session.characterInputCount, 1);
  const accuracy = roundToOneDecimal(
    (correctCharacters / characterInputCount) * 100
  );
  const wpm = roundToOneDecimal(
    (correctCharacters / 5) / (elapsedMs / 60000)
  );

  return {
    elapsedMs,
    correctCharacters,
    characterInputCount: session.characterInputCount,
    correctedErrors: session.correctedErrors,
    accuracy,
    wpm,
    cleanRun: session.correctedErrors === 0
  };
}
```

- [ ] **Step 4: Run the session-metrics tests to verify they pass**

Run:

```bash
npx vitest run tests/typing/session-metrics.test.ts
```

Expected:
- PASS
- `3 passed`

- [ ] **Step 5: Commit the metrics module**

```bash
git add tests/typing/session-metrics.test.ts lib/typing/session-metrics.ts
git commit -m "feat: add stage two session metrics"
```

## Task 3: Build the Interactive Typing Surface

**Files:**
- Create: `tests/typing/typing-surface.test.tsx`
- Create: `lib/typing/practice-texts.ts`
- Create: `components/typing/session-header.tsx`
- Create: `components/typing/typing-surface.tsx`

- [ ] **Step 1: Write the failing typing-surface tests**

```tsx
// tests/typing/typing-surface.test.tsx
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { TypingSurface } from "@/components/typing/typing-surface";

const prompt = {
  id: "test-line",
  label: "Village Path",
  focus: "light rhythm",
  text: "calm"
};

describe("TypingSurface", () => {
  it("renders the active prompt and session header", () => {
    render(<TypingSurface prompt={prompt} onComplete={() => undefined} />);

    expect(screen.getByText(/village path/i)).toBeInTheDocument();
    expect(screen.getByText(/light rhythm/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/typing input/i)).toBeInTheDocument();
  });

  it("shows an incorrect state until the user removes the wrong key", () => {
    render(<TypingSurface prompt={prompt} onComplete={() => undefined} />);

    const input = screen.getByLabelText(/typing input/i);
    fireEvent.keyDown(input, { key: "x" });

    const typingLine = screen.getByTestId("typing-line");
    expect(typingLine.querySelector('[data-status="incorrect"]')).not.toBeNull();

    fireEvent.keyDown(input, { key: "Backspace" });

    expect(typingLine.querySelector('[data-status="incorrect"]')).toBeNull();
  });

  it("calls onComplete when the full prompt is typed correctly", () => {
    const onComplete = vi.fn();

    render(<TypingSurface prompt={prompt} onComplete={onComplete} />);

    const input = screen.getByLabelText(/typing input/i);
    fireEvent.keyDown(input, { key: "c" });
    fireEvent.keyDown(input, { key: "a" });
    fireEvent.keyDown(input, { key: "l" });
    fireEvent.keyDown(input, { key: "m" });

    expect(onComplete).toHaveBeenCalledTimes(1);
    expect(onComplete.mock.calls[0][0]).toEqual(
      expect.objectContaining({
        inputValue: "calm",
        isComplete: true
      })
    );
  });
});
```

- [ ] **Step 2: Run the typing-surface tests to verify they fail**

Run:

```bash
npx vitest run tests/typing/typing-surface.test.tsx
```

Expected:
- FAIL with module resolution errors for `@/components/typing/typing-surface`

- [ ] **Step 3: Write the practice text fixtures, live header, and typing surface**

```ts
// lib/typing/practice-texts.ts
export type PracticeText = {
  id: string;
  label: string;
  focus: string;
  text: string;
};

export const practiceTexts: PracticeText[] = [
  {
    id: "village-path",
    label: "Village Path",
    focus: "light rhythm",
    text: "calm hands build quiet speed"
  },
  {
    id: "lantern-row",
    label: "Lantern Row",
    focus: "clean space control",
    text: "soft steps keep the lanterns bright"
  },
  {
    id: "market-square",
    label: "Market Square",
    focus: "punctuation touch",
    text: "clear words, steady hands, open doors."
  }
];
```

```tsx
// components/typing/session-header.tsx
type SessionHeaderProps = {
  promptLabel: string;
  promptFocus: string;
  elapsedMs: number;
  typedCharacters: number;
  totalCharacters: number;
  currentErrors: number;
};

function formatElapsed(elapsedMs: number): string {
  return `${(elapsedMs / 1000).toFixed(1)}s`;
}

export function SessionHeader({
  promptLabel,
  promptFocus,
  elapsedMs,
  typedCharacters,
  totalCharacters,
  currentErrors
}: SessionHeaderProps) {
  return (
    <header className="space-y-4 rounded-[24px] border border-[var(--kc-line)] bg-[var(--kc-surface)] p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          <p className="text-sm uppercase tracking-[0.18em] text-[var(--kc-muted)]">
            {promptLabel}
          </p>
          <h1 className="text-2xl tracking-tight text-[var(--kc-text)]">
            Focus: {promptFocus}
          </h1>
        </div>
        <p className="text-sm text-[var(--kc-muted)]">
          Errors in line: {currentErrors}
        </p>
      </div>
      <dl className="grid gap-3 sm:grid-cols-3">
        <div>
          <dt className="text-xs uppercase tracking-[0.18em] text-[var(--kc-muted)]">
            Time
          </dt>
          <dd className="mt-1 text-lg text-[var(--kc-text)]">
            {formatElapsed(elapsedMs)}
          </dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-[0.18em] text-[var(--kc-muted)]">
            Progress
          </dt>
          <dd className="mt-1 text-lg text-[var(--kc-text)]">
            {typedCharacters}/{totalCharacters}
          </dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-[0.18em] text-[var(--kc-muted)]">
            Status
          </dt>
          <dd className="mt-1 text-lg text-[var(--kc-text)]">
            {typedCharacters === 0 ? "Ready" : "Typing"}
          </dd>
        </div>
      </dl>
    </header>
  );
}
```

```tsx
// components/typing/typing-surface.tsx
"use client";

import { useEffect, useRef, useState } from "react";

import { SessionHeader } from "@/components/typing/session-header";
import { normalizeTypingKey } from "@/lib/typing/key-events";
import type { PracticeText } from "@/lib/typing/practice-texts";
import {
  applyTypingAction,
  createTypingSession,
  getCharacterStatuses,
  getCurrentErrorCount,
  type TypingSessionState
} from "@/lib/typing/text-runner";

type TypingSurfaceProps = {
  prompt: PracticeText;
  onComplete: (session: TypingSessionState) => void;
};

export function TypingSurface({ prompt, onComplete }: TypingSurfaceProps) {
  const [session, setSession] = useState(() => createTypingSession(prompt.text));
  const [now, setNow] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setSession(createTypingSession(prompt.text));
    setNow(0);
  }, [prompt]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [prompt]);

  useEffect(() => {
    if (session.startedAt === null || session.isComplete) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setNow(Date.now());
    }, 100);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [session.startedAt, session.isComplete]);

  const characterStatuses = getCharacterStatuses(session);
  const elapsedMs =
    session.startedAt === null
      ? 0
      : session.isComplete && session.completedAt !== null
        ? session.completedAt - session.startedAt
        : now - session.startedAt;

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    const action = normalizeTypingKey(event);

    if (action.type === "ignore") {
      return;
    }

    event.preventDefault();

    const nextSession = applyTypingAction(session, action, Date.now());
    setSession(nextSession);

    if (nextSession.isComplete) {
      onComplete(nextSession);
    }
  }

  return (
    <section
      className="space-y-6"
      onClick={() => {
        inputRef.current?.focus();
      }}
    >
      <input
        aria-label="Typing input"
        className="sr-only"
        onChange={() => undefined}
        onKeyDown={handleKeyDown}
        readOnly
        ref={inputRef}
        value=""
      />

      <SessionHeader
        currentErrors={getCurrentErrorCount(session)}
        elapsedMs={elapsedMs}
        promptFocus={prompt.focus}
        promptLabel={prompt.label}
        totalCharacters={prompt.text.length}
        typedCharacters={session.inputValue.length}
      />

      <section className="rounded-[32px] border border-[var(--kc-line)] bg-[var(--kc-surface)] p-8 shadow-[0_18px_50px_rgba(58,45,30,0.10)]">
        <p className="text-sm uppercase tracking-[0.18em] text-[var(--kc-muted)]">
          Type the line exactly as shown
        </p>
        <div
          className="mt-6 flex flex-wrap gap-x-0.5 gap-y-3 text-3xl leading-relaxed text-[var(--kc-text)]"
          data-testid="typing-line"
        >
          {characterStatuses.map((character, index) => (
            <span
              className={
                character.status === "correct"
                  ? "text-[var(--kc-accent-strong)]"
                  : character.status === "incorrect"
                    ? "rounded bg-[rgba(200,155,109,0.22)] text-[var(--kc-warm)]"
                    : "text-[var(--kc-text)] opacity-55"
              }
              data-status={character.status}
              key={`${character.expected}-${index}`}
            >
              {character.expected === " " ? "\u00A0" : character.expected}
            </span>
          ))}
        </div>
        <p className="mt-6 text-sm leading-6 text-[var(--kc-muted)]">
          Backspace is allowed. Progress only counts when the full line is
          correct.
        </p>
      </section>
    </section>
  );
}
```

- [ ] **Step 4: Run the typing-surface tests to verify they pass**

Run:

```bash
npx vitest run tests/typing/typing-surface.test.tsx
```

Expected:
- PASS
- `3 passed`

- [ ] **Step 5: Commit the interactive typing surface**

```bash
git add tests/typing/typing-surface.test.tsx lib/typing/practice-texts.ts components/typing/session-header.tsx components/typing/typing-surface.tsx
git commit -m "feat: add stage two typing surface"
```

## Task 4: Build the Session Summary and `/play` Route

**Files:**
- Modify: `tests/typing/typing-surface.test.tsx`
- Create: `components/typing/session-summary.tsx`
- Create: `app/(app)/play/page.tsx`

- [ ] **Step 1: Extend the component tests with summary coverage**

```tsx
// tests/typing/typing-surface.test.tsx
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { SessionSummary } from "@/components/typing/session-summary";
import { TypingSurface } from "@/components/typing/typing-surface";

const prompt = {
  id: "test-line",
  label: "Village Path",
  focus: "light rhythm",
  text: "calm"
};

describe("TypingSurface", () => {
  it("renders the active prompt and session header", () => {
    render(<TypingSurface prompt={prompt} onComplete={() => undefined} />);

    expect(screen.getByText(/village path/i)).toBeInTheDocument();
    expect(screen.getByText(/light rhythm/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/typing input/i)).toBeInTheDocument();
  });

  it("shows an incorrect state until the user removes the wrong key", () => {
    render(<TypingSurface prompt={prompt} onComplete={() => undefined} />);

    const input = screen.getByLabelText(/typing input/i);
    fireEvent.keyDown(input, { key: "x" });

    const typingLine = screen.getByTestId("typing-line");
    expect(typingLine.querySelector('[data-status="incorrect"]')).not.toBeNull();

    fireEvent.keyDown(input, { key: "Backspace" });

    expect(typingLine.querySelector('[data-status="incorrect"]')).toBeNull();
  });

  it("calls onComplete when the full prompt is typed correctly", () => {
    const onComplete = vi.fn();

    render(<TypingSurface prompt={prompt} onComplete={onComplete} />);

    const input = screen.getByLabelText(/typing input/i);
    fireEvent.keyDown(input, { key: "c" });
    fireEvent.keyDown(input, { key: "a" });
    fireEvent.keyDown(input, { key: "l" });
    fireEvent.keyDown(input, { key: "m" });

    expect(onComplete).toHaveBeenCalledTimes(1);
    expect(onComplete.mock.calls[0][0]).toEqual(
      expect.objectContaining({
        inputValue: "calm",
        isComplete: true
      })
    );
  });
});

describe("SessionSummary", () => {
  it("renders session metrics and a focus recommendation", () => {
    render(
      <SessionSummary
        metrics={{
          elapsedMs: 4000,
          correctCharacters: 4,
          characterInputCount: 6,
          correctedErrors: 2,
          accuracy: 66.7,
          wpm: 12,
          cleanRun: false
        }}
        onTryAnother={() => undefined}
        prompt={prompt}
      />
    );

    expect(
      screen.getByRole("heading", { name: /session complete/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/66.7%/i)).toBeInTheDocument();
    expect(screen.getByText(/focus next/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the component tests to verify the new summary test fails**

Run:

```bash
npx vitest run tests/typing/typing-surface.test.tsx
```

Expected:
- FAIL with a missing module error for `@/components/typing/session-summary`

- [ ] **Step 3: Write the session summary component and `/play` route**

```tsx
// components/typing/session-summary.tsx
import type { SessionMetrics } from "@/lib/typing/session-metrics";
import type { PracticeText } from "@/lib/typing/practice-texts";

type SessionSummaryProps = {
  prompt: PracticeText;
  metrics: SessionMetrics;
  onTryAnother: () => void;
};

function formatSeconds(elapsedMs: number): string {
  return `${(elapsedMs / 1000).toFixed(1)}s`;
}

function getFocusMessage(metrics: SessionMetrics): string {
  if (metrics.correctedErrors > 0) {
    return "Focus next: slow down enough to remove fewer corrections.";
  }

  if (metrics.accuracy < 97) {
    return "Focus next: keep the line cleaner before pushing speed.";
  }

  return "Focus next: keep the same relaxed rhythm and nudge the pace up.";
}

export function SessionSummary({
  prompt,
  metrics,
  onTryAnother
}: SessionSummaryProps) {
  return (
    <section className="space-y-6 rounded-[32px] border border-[var(--kc-line)] bg-[var(--kc-surface)] p-8 shadow-[0_18px_50px_rgba(58,45,30,0.10)]">
      <div className="space-y-2">
        <p className="text-sm uppercase tracking-[0.18em] text-[var(--kc-muted)]">
          {prompt.label}
        </p>
        <h1 className="text-4xl tracking-tight text-[var(--kc-text)]">
          Session complete
        </h1>
        <p className="max-w-2xl text-base leading-7 text-[var(--kc-muted)]">
          {metrics.cleanRun
            ? "Clean run. The line stayed steady from start to finish."
            : "Solid finish. The next gain comes from reducing mid-line corrections."}
        </p>
      </div>

      <dl className="grid gap-4 md:grid-cols-4">
        <div className="rounded-[24px] border border-[var(--kc-line)] p-4">
          <dt className="text-xs uppercase tracking-[0.18em] text-[var(--kc-muted)]">
            WPM
          </dt>
          <dd className="mt-2 text-3xl text-[var(--kc-text)]">{metrics.wpm}</dd>
        </div>
        <div className="rounded-[24px] border border-[var(--kc-line)] p-4">
          <dt className="text-xs uppercase tracking-[0.18em] text-[var(--kc-muted)]">
            Accuracy
          </dt>
          <dd className="mt-2 text-3xl text-[var(--kc-text)]">
            {metrics.accuracy}%
          </dd>
        </div>
        <div className="rounded-[24px] border border-[var(--kc-line)] p-4">
          <dt className="text-xs uppercase tracking-[0.18em] text-[var(--kc-muted)]">
            Time
          </dt>
          <dd className="mt-2 text-3xl text-[var(--kc-text)]">
            {formatSeconds(metrics.elapsedMs)}
          </dd>
        </div>
        <div className="rounded-[24px] border border-[var(--kc-line)] p-4">
          <dt className="text-xs uppercase tracking-[0.18em] text-[var(--kc-muted)]">
            Corrections
          </dt>
          <dd className="mt-2 text-3xl text-[var(--kc-text)]">
            {metrics.correctedErrors}
          </dd>
        </div>
      </dl>

      <div className="rounded-[24px] border border-[var(--kc-line)] bg-[rgba(255,250,240,0.72)] p-5">
        <p className="text-sm uppercase tracking-[0.18em] text-[var(--kc-muted)]">
          Focus next
        </p>
        <p className="mt-2 text-base leading-7 text-[var(--kc-text)]">
          {getFocusMessage(metrics)}
        </p>
      </div>

      <button
        className="inline-flex items-center justify-center rounded-full bg-[var(--kc-accent)] px-5 py-3 text-sm font-medium text-white transition hover:bg-[var(--kc-accent-strong)]"
        onClick={onTryAnother}
        type="button"
      >
        Try another line
      </button>
    </section>
  );
}
```

```tsx
// app/(app)/play/page.tsx
"use client";

import { useState } from "react";

import { SessionSummary } from "@/components/typing/session-summary";
import { TypingSurface } from "@/components/typing/typing-surface";
import { practiceTexts } from "@/lib/typing/practice-texts";
import { calculateSessionMetrics } from "@/lib/typing/session-metrics";
import type { TypingSessionState } from "@/lib/typing/text-runner";

export default function PlayPage() {
  const [promptIndex, setPromptIndex] = useState(0);
  const [completedSession, setCompletedSession] =
    useState<TypingSessionState | null>(null);

  const prompt = practiceTexts[promptIndex];
  const metrics =
    completedSession === null
      ? null
      : calculateSessionMetrics(completedSession);

  function handleTryAnother() {
    setPromptIndex((current) => (current + 1) % practiceTexts.length);
    setCompletedSession(null);
  }

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      {metrics === null ? (
        <TypingSurface
          key={prompt.id}
          onComplete={setCompletedSession}
          prompt={prompt}
        />
      ) : (
        <SessionSummary
          metrics={metrics}
          onTryAnother={handleTryAnother}
          prompt={prompt}
        />
      )}
    </div>
  );
}
```

- [ ] **Step 4: Run the updated component tests to verify they pass**

Run:

```bash
npx vitest run tests/typing/typing-surface.test.tsx
```

Expected:
- PASS
- `4 passed`

- [ ] **Step 5: Commit the summary and play route**

```bash
git add tests/typing/typing-surface.test.tsx components/typing/session-summary.tsx "app/(app)/play/page.tsx"
git commit -m "feat: add stage two play route and session summary"
```

## Task 5: Add End-to-End Coverage and Run the Full Stage 2 Suite

**Files:**
- Create: `e2e/play-session.spec.ts`

- [ ] **Step 1: Write the Playwright session flow**

```ts
// e2e/play-session.spec.ts
import { expect, test } from "@playwright/test";

test("user can finish a short typing session", async ({ page }) => {
  await page.goto("/play");

  await page.getByLabel("Typing input").click();
  await page.keyboard.type("calm hands build quiet speed");

  await expect(
    page.getByRole("heading", { name: /session complete/i })
  ).toBeVisible();
  await expect(page.getByText(/focus next/i)).toBeVisible();
  await expect(page.getByText(/wpm/i)).toBeVisible();
});
```

- [ ] **Step 2: Run the targeted Playwright flow**

Run terminal A:

```bash
npm run dev -- --hostname 127.0.0.1 --port 3000
```

Run terminal B:

```bash
npx playwright test e2e/play-session.spec.ts
```

Expected:
- PASS
- `1 passed`
- `/play` completes and the summary becomes visible

- [ ] **Step 3: Run the full Stage 2 verification suite**

Run:

```bash
npm run lint
npx vitest run tests/typing/text-runner.test.ts tests/typing/session-metrics.test.ts tests/typing/typing-surface.test.tsx
npm run dev -- --hostname 127.0.0.1 --port 3000
npx playwright test e2e/play-session.spec.ts
npm run build
```

Expected:
- lint passes
- all three Vitest files pass
- the Playwright session flow passes
- production build succeeds

- [ ] **Step 4: Commit the Stage 2 coverage**

```bash
git add e2e/play-session.spec.ts
git commit -m "test: add stage two play session coverage"
```

## Stage 2 Spec Coverage Check

- Core typing session engine covered by Tasks 1 and 2
- Built-in prompt set covered by Task 3
- Interactive typing surface covered by Task 3
- Session summary and `/play` route covered by Task 4
- End-to-end verification covered by Task 5
- No persistence, onboarding, or village behavior added in this stage

## Stage 2 Exit State

When this file is completed, the repository should have:

- a working `/play` route in the app shell
- a pure typing session engine that tracks printable input, backspace correction, and completion
- consistent WPM and accuracy metrics derived from a completed session
- a usable built-in prompt set with no content backend dependency
- a post-session summary that explains the result and the next focus
- unit, component, and end-to-end coverage for the typing loop
- a clean handoff point for Stage 3 placement and progression work
