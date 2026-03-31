# Keycroft Master Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the first shippable version of Keycroft: a desktop-first typing web app with a cozy village progression loop, placement-based onboarding, short-session-friendly practice, and a premium-quality landing page.

**Architecture:** Use a Next.js App Router application with a clear split between marketing routes and the authenticated app shell. Keep typing metrics, progression rules, and village projection as separate modules so the village is a deterministic visual projection of real typing progress instead of a manually managed game state. Start with local guest persistence to validate the core loop quickly, then add server-backed accounts, analytics, and social systems in later stages.

**Tech Stack:** Next.js App Router, React, TypeScript, Tailwind CSS, PostgreSQL, Prisma, Auth.js, Zod, Vitest, React Testing Library, Playwright

---

## Planning Notes

- This repository is currently docs-only. There is no app code yet.
- Because the product spec covers multiple subsystems, this document is a staged master plan, not a single code-execution checklist.
- Each stage should later get its own detailed execution plan before implementation starts.
- Before touching UI implementation, create a project design context with the local `teach-impeccable` skill and save it to `.impeccable.md`.
- Before touching Next.js code, read the local version-matched docs in `node_modules/next/dist/docs/` as required by the project instructions.

## Stack References

These official sources informed the stack direction:

- Next.js docs: https://nextjs.org/docs/app
- Auth.js docs: https://authjs.dev/
- Prisma + Next.js docs: https://www.prisma.io/docs/guides/nextjs
- Tailwind CSS docs: https://tailwindcss.com/docs/installation/framework-guides/nextjs
- Vitest docs: https://vitest.dev/guide/
- Playwright docs: https://playwright.dev/docs/intro

## Recommended Build Order

1. Foundation and visual system
2. Typing loop proof of value
3. Placement and local progression
4. Village projection and home hub
5. Chapter content and adaptive learning
6. Accounts and server persistence
7. Analytics and shareable progress
8. Marketing and conversion
9. Premium and social readiness
10. Hardening and launch prep

## Initial Repository Structure

The first code stage should create this shape:

```text
app/
  (marketing)/
  (app)/
  api/
components/
  layout/
  marketing/
  typing/
  world/
  onboarding/
  progress/
  shared/
content/
  chapters/
  copy/
lib/
  auth/
  content/
  placement/
  progression/
  storage/
  typing/
  world/
  analytics/
  validation/
prisma/
public/
tests/
e2e/
docs/superpowers/specs/
docs/superpowers/plans/
.impeccable.md
```

## Stage 1: Foundation, App Shell, and Design Context

**Outcome:** Create a working Next.js app shell with a clean route split, testing setup, and the design foundation for Keycroft.

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.ts`
- Create: `postcss.config.mjs`
- Create: `.gitignore`
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
- Create: `tests/smoke/home-page.test.tsx`
- Create: `e2e/home-page.spec.ts`
- Create: `vitest.config.ts`
- Create: `playwright.config.ts`

- [ ] Initialize a new git repository in the project root before code work starts.
- [ ] Create the Next.js app in the current project root with App Router, TypeScript, ESLint, and Tailwind CSS.
- [ ] Add `.gitignore` entries for `.next`, `node_modules`, `.env*`, `playwright-report`, `test-results`, and `.superpowers`.
- [ ] Run the local `teach-impeccable` skill and write `.impeccable.md` with the approved Keycroft design context before building any real UI.
- [ ] Create the root layout with metadata, global fonts, and a top-level theme token file strategy.
- [ ] Split the routes into `app/(marketing)` and `app/(app)` immediately so the landing page and product UI do not become tangled.
- [ ] Implement a real marketing homepage shell at `/` and a bare authenticated home shell at `/home`.
- [ ] Add Vitest + React Testing Library for component/unit tests.
- [ ] Add Playwright for end-to-end smoke tests.
- [ ] Verify the app boots locally and both `/` and `/home` load successfully.
- [ ] Commit the stage.

**Exit Criteria:**
- `npm run dev` launches successfully
- `npm run test` passes the home-page smoke suite
- `npx playwright test e2e/home-page.spec.ts` passes
- `.impeccable.md` exists with Keycroft-specific design context

## Stage 2: Core Typing Session Engine

**Outcome:** Prove the core typing loop before building deeper game systems.

**Files:**
- Create: `lib/typing/text-runner.ts`
- Create: `lib/typing/session-metrics.ts`
- Create: `lib/typing/key-events.ts`
- Create: `lib/validation/typing.ts`
- Create: `components/typing/typing-surface.tsx`
- Create: `components/typing/session-header.tsx`
- Create: `components/typing/session-summary.tsx`
- Create: `app/(app)/play/page.tsx`
- Create: `tests/typing/session-metrics.test.ts`
- Create: `tests/typing/text-runner.test.ts`
- Create: `tests/typing/typing-surface.test.tsx`
- Create: `e2e/play-session.spec.ts`

- [ ] Implement the text runner so the app can track cursor position, correctness, corrected errors, and completion state.
- [ ] Implement a metrics module that computes WPM, accuracy, clean-run status, corrected error count, and elapsed time from a completed run.
- [ ] Build the first typing surface with a distraction-free layout and clear error handling.
- [ ] Add a short built-in practice text set so the page is usable without a content system.
- [ ] Build a session summary card that explains what improved and what to focus on next.
- [ ] Write unit tests for the metric math before wiring it into the UI.
- [ ] Write component tests for the typing surface and summary.
- [ ] Add one Playwright flow that completes a short session and verifies the summary appears.
- [ ] Commit the stage.

**Exit Criteria:**
- A user can type through a full short session in-browser
- WPM and accuracy are computed consistently
- The summary screen appears reliably
- No village state exists yet, but the typing loop already feels good enough to evaluate

## Stage 3: Placement Flow and Local Guest Progression

**Outcome:** Give the product a real starting point and persistence without waiting on server-side accounts.

**Files:**
- Create: `lib/placement/assess.ts`
- Create: `lib/placement/phase-definitions.ts`
- Create: `lib/storage/guest-profile.ts`
- Create: `lib/storage/guest-progress.ts`
- Create: `lib/progression/progress-events.ts`
- Create: `lib/progression/phase-evaluator.ts`
- Create: `components/onboarding/opening-scene.tsx`
- Create: `components/onboarding/placement-flow.tsx`
- Create: `components/onboarding/phase-result.tsx`
- Create: `app/(app)/onboarding/page.tsx`
- Modify: `app/(app)/home/page.tsx`
- Create: `tests/placement/assess.test.ts`
- Create: `tests/progression/phase-evaluator.test.ts`
- Create: `e2e/onboarding-placement.spec.ts`

- [ ] Build a very short opening scene with minimal narrative framing.
- [ ] Implement the first placement test flow using a short typing sample as the primary placement mechanism.
- [ ] Add optional self-identification as a secondary input, not the main one.
- [ ] Define named phases for early product use.
- [ ] Persist guest progress locally with a stable client-side profile id.
- [ ] Save enough local data to reopen the app and continue from the correct phase and recent history.
- [ ] Update the product home route so it can route new users into onboarding and returning users into their home hub.
- [ ] Add tests for placement scoring and phase assignment.
- [ ] Add an end-to-end onboarding test from opening scene to first phase result.
- [ ] Commit the stage.

**Exit Criteria:**
- A first-time user gets placed into a named phase
- Returning users keep their local progress
- Advanced users can avoid total beginner treatment
- The product has a real beginner-to-returning-user flow

## Stage 4: Village Projection and Home Hub

**Outcome:** Turn progress into a living village and make the home screen feel like a place instead of a dashboard.

**Files:**
- Create: `lib/world/world-regions.ts`
- Create: `lib/world/world-rules.ts`
- Create: `lib/world/project-village.ts`
- Create: `components/world/village-map.tsx`
- Create: `components/world/village-overview.tsx`
- Create: `components/world/region-panel.tsx`
- Create: `components/world/next-session-card.tsx`
- Create: `components/world/progress-tree.tsx`
- Modify: `app/(app)/home/page.tsx`
- Create: `tests/world/project-village.test.ts`
- Create: `tests/world/village-map.test.tsx`
- Create: `e2e/home-hub.spec.ts`

- [ ] Define the first set of village regions and what skill domains they represent.
- [ ] Implement deterministic village projection rules so world visuals are computed from progress data, not hand-edited state.
- [ ] Build the first home hub around the village, the next action CTA, and a small set of key metrics.
- [ ] Keep the home hub visually rich but information-light.
- [ ] Add zoom or detail panes only if they are needed for clarity.
- [ ] Test the projection logic with sample progress fixtures.
- [ ] Test that the home hub renders the correct region states for different profiles.
- [ ] Add an end-to-end test that confirms progress changes alter the hub output.
- [ ] Commit the stage.

**Exit Criteria:**
- The home screen feels like entering Keycroft
- Progress changes produce visible village changes
- The user always sees one obvious next step

## Stage 5: Chapter Content System and Adaptive Side Quests

**Outcome:** Replace hardcoded practice with a structured learning path and targeted optional work.

**Files:**
- Create: `content/chapters/ch01-arrival.json`
- Create: `content/chapters/ch02-home-row.json`
- Create: `content/chapters/ch03-reach-control.json`
- Create: `content/copy/weekly-intentions.json`
- Create: `lib/content/chapter-schema.ts`
- Create: `lib/content/load-chapter.ts`
- Create: `lib/content/list-chapters.ts`
- Create: `lib/progression/chapter-progress.ts`
- Create: `lib/progression/recommend-next-step.ts`
- Create: `lib/progression/recommend-side-quest.ts`
- Create: `components/typing/chapter-session.tsx`
- Create: `components/progress/chapter-list.tsx`
- Create: `components/progress/side-quest-card.tsx`
- Create: `app/(app)/chapters/[chapterId]/page.tsx`
- Create: `tests/content/load-chapter.test.ts`
- Create: `tests/progression/recommend-next-step.test.ts`
- Create: `tests/progression/recommend-side-quest.test.ts`
- Create: `e2e/chapter-progress.spec.ts`

- [ ] Define a JSON or TypeScript-backed schema for chapter content.
- [ ] Create the first three real chapters from the approved overview.
- [ ] Build a next-step recommender that chooses between the guided path and adaptive side work.
- [ ] Build side-quest recommendations for repeated weak spots.
- [ ] Add a chapter list and progress view to the app shell.
- [ ] Keep quests meaningful and chapter-linked; do not add daily chore mechanics.
- [ ] Add tests for chapter loading and recommendation rules.
- [ ] Add an end-to-end flow that completes a chapter lesson and unlocks the next step.
- [ ] Commit the stage.

**Exit Criteria:**
- The product has a real chapter path
- Users can see optional adaptive side work
- The app no longer depends on hardcoded practice examples

## Stage 6: Accounts, Database, and Server Persistence

**Outcome:** Move from local-only progress to durable user accounts without breaking the guest-first experience.

**Files:**
- Create: `prisma/schema.prisma`
- Create: `prisma/seed.ts`
- Create: `lib/db.ts`
- Create: `auth.ts`
- Create: `app/api/auth/[...nextauth]/route.ts`
- Create: `proxy.ts`
- Create: `lib/auth/get-session-user.ts`
- Create: `lib/auth/guest-upgrade.ts`
- Create: `lib/storage/server-progress.ts`
- Create: `app/(app)/settings/page.tsx`
- Create: `tests/auth/guest-upgrade.test.ts`
- Create: `tests/storage/server-progress.test.ts`
- Create: `e2e/account-upgrade.spec.ts`

- [ ] Design the Prisma schema for users, guest upgrade linkage, sessions, chapter progress, typing runs, and village state inputs.
- [ ] Add Auth.js with email magic link as the first sign-in method.
- [ ] Keep guest mode available so first-use friction stays low.
- [ ] Add a guest-to-account upgrade path that migrates local progress to the server.
- [ ] Move authoritative progress persistence to PostgreSQL while preserving local caching for UX.
- [ ] Add tests for guest upgrade and server persistence flows.
- [ ] Add an end-to-end flow that upgrades a guest profile into an account.
- [ ] Commit the stage.

**Exit Criteria:**
- Users can keep progress across devices once they create an account
- Guest mode still works
- Progress data has a durable server-backed source of truth

## Stage 7: Analytics, History, and Shareable Progress

**Outcome:** Turn progress into something users can understand and show off.

**Files:**
- Create: `lib/analytics/build-progress-summary.ts`
- Create: `lib/analytics/build-history-series.ts`
- Create: `lib/analytics/build-share-card.ts`
- Create: `components/progress/progress-overview.tsx`
- Create: `components/progress/keyboard-heatmap.tsx`
- Create: `components/progress/history-chart.tsx`
- Create: `components/progress/monthly-reflection.tsx`
- Create: `components/progress/share-card.tsx`
- Create: `app/(app)/progress/page.tsx`
- Create: `tests/analytics/build-progress-summary.test.ts`
- Create: `tests/analytics/build-history-series.test.ts`
- Create: `e2e/progress-page.spec.ts`

- [ ] Build a progress page centered on village growth, keyboard heatmaps, and a calm history view.
- [ ] Emphasize accuracy and consistency as much as raw WPM.
- [ ] Add monthly reflection or milestone journaling so the app creates memory, not just stats.
- [ ] Build the first shareable progress card flow for screenshots and future profile flexing.
- [ ] Test analytics builders against representative sample data.
- [ ] Add one end-to-end test that completes practice and verifies the progress page updates.
- [ ] Commit the stage.

**Exit Criteria:**
- Users can clearly see how they are improving
- The app surfaces screenshot-worthy progress moments
- Progress is legible without becoming a sterile dashboard

## Stage 8: Landing Page, Conversion, and Founder Narrative

**Outcome:** Ship a public-facing front door that sells Keycroft on beauty, clarity, and difference.

**Files:**
- Modify: `app/(marketing)/page.tsx`
- Create: `app/(marketing)/about/page.tsx`
- Create: `app/(marketing)/faq/page.tsx`
- Create: `app/(marketing)/privacy/page.tsx`
- Create: `components/marketing/hero.tsx`
- Create: `components/marketing/feature-grid.tsx`
- Create: `components/marketing/progress-preview.tsx`
- Create: `components/marketing/founder-note.tsx`
- Create: `components/marketing/waitlist-form.tsx`
- Create: `tests/marketing/hero.test.tsx`
- Create: `e2e/marketing-home.spec.ts`

- [ ] Rebuild the landing page around the visual contrast with ugly typing sites.
- [ ] Lead with world growth, not generic productivity copy.
- [ ] Add a subtle founder-made note to reinforce the quiet, crafted identity.
- [ ] Keep the page fast, highly visual, and clearly differentiated from standard typing products.
- [ ] Add a waitlist or early access capture if launch timing requires it.
- [ ] Test the critical above-the-fold experience and CTA flow.
- [ ] Commit the stage.

**Exit Criteria:**
- The marketing site feels beautiful and intentional
- The product difference is obvious in seconds
- The landing page is fast enough to support paid or organic acquisition later

## Stage 9: Premium Readiness and Social Scaffolding

**Outcome:** Prepare the product for later monetization and friend features without bloating the initial launch.

**Files:**
- Create: `lib/entitlements/feature-flags.ts`
- Create: `lib/entitlements/plans.ts`
- Create: `lib/social/friends.ts`
- Create: `lib/social/challenges.ts`
- Create: `components/progress/premium-upsell.tsx`
- Create: `app/(app)/friends/page.tsx`
- Create: `app/(app)/challenges/page.tsx`
- Modify: `prisma/schema.prisma`
- Create: `tests/entitlements/feature-flags.test.ts`
- Create: `tests/social/challenges.test.ts`

- [ ] Add feature-flag infrastructure for premium features before adding billing.
- [ ] Keep the free version fully usable and avoid fake scarcity.
- [ ] Add minimal social data structures for friend relationships and asynchronous challenges.
- [ ] Keep real-time competition out of this stage.
- [ ] Build gentle social scaffolding only after the solo product is strong.
- [ ] Commit the stage.

**Exit Criteria:**
- The codebase is ready for premium without a rushed rewrite
- Friend and challenge systems can be layered in later
- The core product is still primarily solo

## Stage 10: Hardening, Performance, and Launch Prep

**Outcome:** Raise the product to a level where early users can trust it.

**Files:**
- Modify: `playwright.config.ts`
- Modify: `vitest.config.ts`
- Create: `.github/workflows/ci.yml`
- Create: `docs/launch-checklist.md`
- Create: `tests/accessibility/a11y-smoke.test.tsx`
- Create: `e2e/regression/full-core-flow.spec.ts`

- [ ] Add CI for lint, typecheck, unit tests, and Playwright smoke coverage.
- [ ] Audit the typing surface for performance on common laptop hardware.
- [ ] Audit keyboard accessibility and focus management.
- [ ] Check visual stability, hydration behavior, and route performance.
- [ ] Create a launch checklist for analytics, privacy, content completeness, and support readiness.
- [ ] Add one full end-to-end regression test for the core journey from onboarding through progress review.
- [ ] Commit the stage.

**Exit Criteria:**
- The product can survive real early users
- The core journey has automated regression coverage
- Launch work is governed by a checklist instead of memory

## Explicitly Deferred Until After Initial Launch

- Real-time multiplayer racing
- Native desktop packaging
- AI-driven story personalization
- Advanced premium billing flows
- Group or guild mechanics
- Multiple world themes
- Complex seasonal systems

## Current Recommendation

Do not start with the full product. Start with Stages 1 through 4 only:

1. foundation
2. typing loop
3. placement and local persistence
4. village home hub

That slice is the fastest path to validating the actual Keycroft magic:

- does the typing feel good
- does the village feedback feel motivating
- do users want to come back

Only after that should deeper content, accounts, and monetization systems expand.
