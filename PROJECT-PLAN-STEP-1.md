# Keycroft Stage 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bootstrap the real Keycroft application inside the existing repository, create the design context, and ship a working Stage 1 shell with a marketing homepage, an authenticated app placeholder, and smoke-test coverage.

**Architecture:** Keep the existing `docs/` and `skills/` folders untouched and add the product app at the repository root using Next.js App Router. Split routes into `app/(marketing)` and `app/(app)` immediately, create a small shared design token layer, and keep Stage 1 deliberately thin: no placement logic, no typing engine, no database, no auth integration yet.

**Tech Stack:** Next.js App Router, React, TypeScript, Tailwind CSS, Vitest, React Testing Library, Playwright

---

## Starting Point

- The repository already exists and is on `main`
- `.gitignore` already exists
- Planning docs already exist in `docs/superpowers/`
- No app code exists yet
- Vercel/Supabase setup is deferred from this stage and should not block Stage 1 delivery

## Files to Create in Stage 1

- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next-env.d.ts`
- Create: `next.config.ts`
- Create: `eslint.config.mjs`
- Create: `postcss.config.mjs`
- Create: `.impeccable.md`
- Create: `app/layout.tsx`
- Create: `app/globals.css`
- Create: `app/(marketing)/page.tsx`
- Create: `app/(app)/layout.tsx`
- Create: `app/(app)/home/page.tsx`
- Create: `components/layout/site-shell.tsx`
- Create: `components/layout/app-shell.tsx`
- Create: `components/shared/logo.tsx`
- Create: `components/shared/primary-button.tsx`
- Create: `lib/design/tokens.ts`
- Create: `lib/site/metadata.ts`
- Create: `vitest.config.ts`
- Create: `playwright.config.ts`
- Create: `tests/setup.ts`
- Create: `tests/smoke/marketing-home.test.tsx`
- Create: `tests/smoke/app-home.test.tsx`
- Create: `e2e/marketing-home.spec.ts`
- Create: `e2e/app-home.spec.ts`

## Files to Modify in Stage 1

- Modify: `.gitignore`

## Task 1: Bootstrap the App Tooling

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next-env.d.ts`
- Create: `next.config.ts`
- Create: `eslint.config.mjs`
- Create: `postcss.config.mjs`
- Create: `vitest.config.ts`
- Create: `playwright.config.ts`
- Create: `tests/setup.ts`
- Modify: `.gitignore`

- [ ] **Step 1: Create `package.json` with the minimal Stage 1 scripts and dependencies**

```json
{
  "name": "keycroft",
  "private": true,
  "version": "0.1.0",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "playwright test"
  },
  "dependencies": {
    "next": "^16.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4.0.0",
    "@testing-library/jest-dom": "^6.0.0",
    "@testing-library/react": "^16.0.0",
    "@testing-library/user-event": "^14.0.0",
    "@types/node": "^20.0.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@vitest/coverage-v8": "^3.0.0",
    "eslint": "^9.0.0",
    "eslint-config-next": "^16.0.0",
    "jsdom": "^26.0.0",
    "playwright": "^1.54.0",
    "postcss": "^8.0.0",
    "tailwindcss": "^4.0.0",
    "typescript": "^5.0.0",
    "vitest": "^3.0.0"
  }
}
```

- [ ] **Step 2: Create the TypeScript, Next.js, ESLint, and PostCSS config files**

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "es2022"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

```ts
// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true
};

export default nextConfig;
```

```js
// eslint.config.mjs
import nextVitals from "eslint-config-next/core-web-vitals";

export default [...nextVitals];
```

```js
// postcss.config.mjs
export default {
  plugins: {
    "@tailwindcss/postcss": {}
  }
};
```

```ts
// vitest.config.ts
import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  test: {
    environment: "jsdom",
    setupFiles: ["./tests/setup.ts"]
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, ".")
    }
  }
});
```

```ts
// playwright.config.ts
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  use: {
    baseURL: "http://127.0.0.1:3000"
  },
  webServer: {
    command: "npm run dev",
    url: "http://127.0.0.1:3000",
    reuseExistingServer: !process.env.CI
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] }
    }
  ]
});
```

```ts
// tests/setup.ts
import "@testing-library/jest-dom/vitest";
```

- [ ] **Step 3: Add `next-env.d.ts` and extend `.gitignore` for Stage 1 artifacts**

```ts
/// <reference types="next" />
/// <reference types="next/image-types/global" />

// This file should not be edited by hand outside framework-managed updates.
```

```gitignore
# Stage 1 additions
.playwright/
```

- [ ] **Step 4: Install dependencies and browser tooling**

Run:

```bash
npm install
npx playwright install
```

Expected:
- install completes without peer dependency failures
- Playwright installs Chromium successfully

- [ ] **Step 5: Commit the tooling baseline**

```bash
git add package.json tsconfig.json next-env.d.ts next.config.ts eslint.config.mjs postcss.config.mjs vitest.config.ts playwright.config.ts tests/setup.ts .gitignore
git commit -m "chore: bootstrap keycroft app tooling"
```

## Task 2: Create the Design Context and Shared Tokens

**Files:**
- Create: `.impeccable.md`
- Create: `lib/design/tokens.ts`
- Create: `lib/site/metadata.ts`
- Create: `components/shared/logo.tsx`
- Create: `components/shared/primary-button.tsx`

- [ ] **Step 1: Write `.impeccable.md` from the approved product overview**

```md
# Keycroft Design Context

## Product
- Keycroft is a desktop-first typing web app
- It should feel like a cozy pseudo-game, not a study program
- The village metaphor is central
- The product should feel premium, warm, and slightly magical

## Audience
- Broad audience with a natural skew toward adults and older learners
- People bored by ugly, repetitive typing websites
- People who want to improve in short, satisfying sessions

## Tone
- Cozy
- Cream-forward
- Quietly premium
- Grounded, not childish
- Soft and crafted, not corporate

## Visual Direction
- Village-building and restoration energy
- Strong sense of place
- Fast landing page
- Minimal clutter while typing
- Richer atmosphere in hub and marketing views

## Product Rules
- Reward real progress, not grind
- Keep the free experience genuinely usable
- No microcurrency or fake scarcity
- Progress should be visible immediately and over time
```

- [ ] **Step 2: Create the Stage 1 token file**

```ts
// lib/design/tokens.ts
export const tokens = {
  colors: {
    background: "#f5efdf",
    surface: "#fffaf0",
    text: "#2a241d",
    muted: "#6d6254",
    line: "#dbcdb7",
    accent: "#7a8f62",
    accentStrong: "#5e7448",
    warm: "#c89b6d"
  },
  radius: {
    card: "24px",
    pill: "999px"
  },
  shadow: {
    card: "0 18px 50px rgba(58, 45, 30, 0.10)"
  }
} as const;
```

- [ ] **Step 3: Create shared metadata and two base UI pieces**

```ts
// lib/site/metadata.ts
import type { Metadata } from "next";

export const siteMetadata: Metadata = {
  title: "Keycroft",
  description: "A cozy typing world for people tired of ugly typing websites."
};
```

```tsx
// components/shared/logo.tsx
export function Logo() {
  return (
    <div className="inline-flex items-center gap-3 font-medium tracking-tight">
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--kc-line)] bg-[var(--kc-surface)] text-[var(--kc-text)]">
        K
      </span>
      <span className="text-lg text-[var(--kc-text)]">Keycroft</span>
    </div>
  );
}
```

```tsx
// components/shared/primary-button.tsx
import type { ButtonHTMLAttributes, PropsWithChildren } from "react";

type PrimaryButtonProps = PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>;

export function PrimaryButton({ children, className = "", ...props }: PrimaryButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-full bg-[var(--kc-accent)] px-5 py-3 text-sm font-medium text-white transition hover:bg-[var(--kc-accent-strong)] ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
```

- [ ] **Step 4: Commit the design-context baseline**

```bash
git add .impeccable.md lib/design/tokens.ts lib/site/metadata.ts components/shared/logo.tsx components/shared/primary-button.tsx
git commit -m "feat: add keycroft design context and shared tokens"
```

## Task 3: Build the Root Layout and Global Styles

**Files:**
- Create: `app/layout.tsx`
- Create: `app/globals.css`

- [ ] **Step 1: Write the root layout**

```tsx
// app/layout.tsx
import type { ReactNode } from "react";
import { siteMetadata } from "@/lib/site/metadata";
import "./globals.css";

export const metadata = siteMetadata;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

- [ ] **Step 2: Write the first global stylesheet with CSS variables and utility-safe base styles**

```css
/* app/globals.css */
@import "tailwindcss";

:root {
  --kc-background: #f5efdf;
  --kc-surface: #fffaf0;
  --kc-text: #2a241d;
  --kc-muted: #6d6254;
  --kc-line: #dbcdb7;
  --kc-accent: #7a8f62;
  --kc-accent-strong: #5e7448;
  --kc-warm: #c89b6d;
}

html {
  background: var(--kc-background);
  color: var(--kc-text);
}

body {
  min-height: 100vh;
  background:
    radial-gradient(circle at top, rgba(255, 255, 255, 0.75), transparent 40%),
    linear-gradient(180deg, #f9f3e6 0%, #f1e7d2 100%);
  font-family: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
}

a {
  color: inherit;
  text-decoration: none;
}
```

- [ ] **Step 3: Run the typecheck/build sanity check**

Run:

```bash
npm run build
```

Expected:
- Next.js builds successfully
- no missing import or CSS processing errors

- [ ] **Step 4: Commit the root app shell**

```bash
git add app/layout.tsx app/globals.css
git commit -m "feat: add keycroft root layout and global styles"
```

## Task 4: Create the Marketing and App Route Shells

**Files:**
- Create: `components/layout/site-shell.tsx`
- Create: `components/layout/app-shell.tsx`
- Create: `app/(marketing)/page.tsx`
- Create: `app/(app)/layout.tsx`
- Create: `app/(app)/home/page.tsx`

- [ ] **Step 1: Create the reusable marketing shell**

```tsx
// components/layout/site-shell.tsx
import type { PropsWithChildren } from "react";
import { Logo } from "@/components/shared/logo";

export function SiteShell({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen px-6 py-8 md:px-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-10">
        <header className="flex items-center justify-between">
          <Logo />
          <span className="text-sm text-[var(--kc-muted)]">Cozy typing, not grind.</span>
        </header>
        {children}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create the reusable app shell**

```tsx
// components/layout/app-shell.tsx
import type { PropsWithChildren } from "react";
import { Logo } from "@/components/shared/logo";

export function AppShell({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen px-6 py-6 md:px-8">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="rounded-[24px] border border-[var(--kc-line)] bg-[var(--kc-surface)] p-5 shadow-[0_18px_50px_rgba(58,45,30,0.10)]">
          <Logo />
          <p className="mt-6 text-sm text-[var(--kc-muted)]">
            Keycroft home hub placeholder
          </p>
        </aside>
        <main>{children}</main>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create the first marketing homepage**

```tsx
// app/(marketing)/page.tsx
import { PrimaryButton } from "@/components/shared/primary-button";
import { SiteShell } from "@/components/layout/site-shell";

export default function MarketingHomePage() {
  return (
    <SiteShell>
      <section className="grid gap-8 rounded-[32px] border border-[var(--kc-line)] bg-[var(--kc-surface)] p-8 shadow-[0_18px_50px_rgba(58,45,30,0.10)] md:grid-cols-[1.2fr_0.8fr] md:p-12">
        <div className="space-y-6">
          <p className="text-sm uppercase tracking-[0.18em] text-[var(--kc-muted)]">
            A better way to get better at typing
          </p>
          <h1 className="max-w-3xl text-5xl leading-tight tracking-tight text-[var(--kc-text)]">
            Build a village while you build real typing skill.
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-[var(--kc-muted)]">
            Keycroft is a cozy typing world for people tired of ugly, repetitive
            typing websites.
          </p>
          <div className="flex gap-3">
            <PrimaryButton>Start the journey</PrimaryButton>
            <a className="inline-flex items-center rounded-full border border-[var(--kc-line)] px-5 py-3 text-sm text-[var(--kc-text)]">
              See the overview
            </a>
          </div>
        </div>
        <div className="rounded-[28px] border border-[var(--kc-line)] bg-[linear-gradient(180deg,#efe3c9_0%,#e4d5b5_100%)] p-6">
          <div className="h-full min-h-[320px] rounded-[22px] border border-dashed border-[var(--kc-line)] bg-[rgba(255,250,240,0.72)] p-6">
            <p className="text-sm text-[var(--kc-muted)]">Village preview placeholder</p>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
```

- [ ] **Step 4: Create the Stage 1 app layout and home placeholder**

```tsx
// app/(app)/layout.tsx
import type { ReactNode } from "react";
import { AppShell } from "@/components/layout/app-shell";

export default function ProductLayout({ children }: { children: ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
```

```tsx
// app/(app)/home/page.tsx
export default function AppHomePage() {
  return (
    <section className="rounded-[32px] border border-[var(--kc-line)] bg-[var(--kc-surface)] p-8 shadow-[0_18px_50px_rgba(58,45,30,0.10)]">
      <p className="text-sm uppercase tracking-[0.18em] text-[var(--kc-muted)]">
        Product shell
      </p>
      <h1 className="mt-4 text-4xl tracking-tight text-[var(--kc-text)]">
        Keycroft home
      </h1>
      <p className="mt-4 max-w-2xl text-base leading-7 text-[var(--kc-muted)]">
        Stage 1 only needs a stable route, layout, and visual foundation. Placement,
        typing, and village systems come next.
      </p>
    </section>
  );
}
```

- [ ] **Step 5: Commit the route shell milestone**

```bash
git add components/layout/site-shell.tsx components/layout/app-shell.tsx app/'(marketing)'/page.tsx app/'(app)'/layout.tsx app/'(app)'/home/page.tsx
git commit -m "feat: add stage one marketing and app route shells"
```

## Task 5: Add Smoke Tests and Verification

**Files:**
- Create: `tests/smoke/marketing-home.test.tsx`
- Create: `tests/smoke/app-home.test.tsx`
- Create: `e2e/marketing-home.spec.ts`
- Create: `e2e/app-home.spec.ts`

- [ ] **Step 1: Add React Testing Library smoke tests**

```tsx
// tests/smoke/marketing-home.test.tsx
import { render, screen } from "@testing-library/react";
import MarketingHomePage from "@/app/(marketing)/page";

describe("MarketingHomePage", () => {
  it("renders the hero headline", () => {
    render(<MarketingHomePage />);
    expect(
      screen.getByRole("heading", {
        name: /build a village while you build real typing skill/i
      })
    ).toBeInTheDocument();
  });
});
```

```tsx
// tests/smoke/app-home.test.tsx
import { render, screen } from "@testing-library/react";
import AppHomePage from "@/app/(app)/home/page";

describe("AppHomePage", () => {
  it("renders the stage one placeholder", () => {
    render(<AppHomePage />);
    expect(screen.getByRole("heading", { name: /keycroft home/i })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Add Playwright route smoke tests**

```ts
// e2e/marketing-home.spec.ts
import { test, expect } from "@playwright/test";

test("marketing home loads", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: /build a village while you build real typing skill/i })
  ).toBeVisible();
});
```

```ts
// e2e/app-home.spec.ts
import { test, expect } from "@playwright/test";

test("app home loads", async ({ page }) => {
  await page.goto("/home");
  await expect(page.getByRole("heading", { name: /keycroft home/i })).toBeVisible();
});
```

- [ ] **Step 3: Run the full Stage 1 verification suite**

Run:

```bash
npm run lint
npm run test
npx playwright test e2e/marketing-home.spec.ts e2e/app-home.spec.ts
npm run build
```

Expected:
- lint passes
- both Vitest smoke tests pass
- both Playwright route checks pass
- production build succeeds

- [ ] **Step 4: Commit the test coverage**

```bash
git add tests/smoke/marketing-home.test.tsx tests/smoke/app-home.test.tsx e2e/marketing-home.spec.ts e2e/app-home.spec.ts
git commit -m "test: add stage one smoke coverage"
```

## Stage 1 Spec Coverage Check

- Product shell covered by Tasks 3 and 4
- Design context covered by Task 2
- Marketing homepage shell covered by Task 4
- App home placeholder covered by Task 4
- Smoke tests covered by Task 5

## Stage 1 Exit State

When this file is completed, the repository should have:

- a working Next.js app in the repo root
- a Stage 1 marketing homepage at `/`
- a Stage 1 product placeholder at `/home`
- a committed `.impeccable.md`
- working unit and end-to-end smoke tests
- a clean base for Stage 2
