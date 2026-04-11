# Keycroft Launch Checklist

A pre-launch readiness checklist. Work through each section before opening to public traffic.

---

## 1. Core Product

- [ ] Placement flow completes without errors on a fresh guest session
- [ ] All three initial chapters (ch01, ch02, ch03) load and play through cleanly
- [ ] Session summary screen appears after every completed practice run
- [ ] Village state updates correctly after chapter completion
- [ ] Progress page loads and displays accurate session history
- [ ] Settings page allows clearing local guest progress

---

## 2. Accounts & Auth

- [ ] Magic link email sends and arrives within 60 seconds
- [ ] Sign-in flow completes and redirects to `/home`
- [ ] Guest-to-account upgrade migrates local progress correctly
- [ ] Signing out clears the session and redirects to `/`
- [ ] Revisiting the app while signed in restores the home hub

---

## 3. Data & Privacy

- [ ] Privacy policy page is live at `/privacy`
- [ ] Privacy policy accurately describes all data collected and third-party services used
- [ ] No keystrokes or typed text are recorded server-side
- [ ] Account deletion flow removes user data within the stated 30-day window
- [ ] Guest progress stays in `localStorage` and is never sent to the server without consent

---

## 4. Performance

- [ ] Marketing home page Largest Contentful Paint (LCP) < 2.5 s on a simulated 4G connection
- [ ] `/play` page time-to-interactive < 3 s (typing must feel instant)
- [ ] No layout shift (CLS < 0.1) on the marketing home page
- [ ] Village map renders without jank on a mid-range laptop

---

## 5. Accessibility

- [ ] All pages have a single, correct `<h1>`
- [ ] All interactive elements are reachable and operable via keyboard
- [ ] Focus ring is visible on all focusable elements
- [ ] Typing surface works with screen reader announcements disabled (it is intentionally visual)
- [ ] Color contrast meets WCAG AA on body text and CTAs

---

## 6. CI & Quality Gates

- [ ] `npm run lint` passes with no errors
- [ ] `npx tsc --noEmit` passes with no errors
- [ ] `npx vitest run` passes all unit tests
- [ ] GitHub Actions CI workflow is green on `main`
- [ ] Playwright smoke suite passes against a production-like environment

---

## 7. Content

- [ ] All three chapters have been proofread for typos and awkward phrasing
- [ ] Chapter difficulty progression is tested by at least one real beginner and one intermediate typist
- [ ] About page and FAQ page are live and accurate
- [ ] Footer links (About, FAQ, Privacy) resolve to real pages

---

## 8. Observability

- [ ] Error tracking is configured (or a decision to defer is documented)
- [ ] Server logs are accessible for diagnosing auth and database errors
- [ ] Database connection pool limits are set appropriately for expected traffic

---

## 9. Support Readiness

- [ ] Support email (`hello@keycroft.com`) is monitored
- [ ] Known edge cases (e.g. corrupted localStorage, expired magic links) have documented handling
- [ ] A rollback plan exists for the database schema and the deployed app

---

## 10. Launch Communication

- [ ] Soft-launch URL is shared with a small group of testers before public announcement
- [ ] Feedback channel (email or form) is ready before the first users arrive
- [ ] Post-launch monitoring window is scheduled (check errors and feedback within 24 h)
