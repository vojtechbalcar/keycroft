# Keycroft — Village World Redesign

**Date:** 2026-04-11
**Status:** Approved for implementation

---

## Overview

Rebuild Keycroft's game layer around a **world map + themed villages** model. Each village is a distinct location on a pixel-art RPG map and teaches a specific set of keyboard keys through thematically matched typing lessons. Villages unlock progressively as the player earns mastery. This replaces the current abstract phase system (lantern/workshop/lookout) as the primary player-facing progression surface, while keeping the underlying phase logic as an internal placement/difficulty signal.

---

## The Six Villages

| # | Village | Keys taught | Theme |
|---|---------|-------------|-------|
| 1 | **Meadow Farm** | Home row — `a s d f j k l ;` | Calm farmland, starter village, always unlocked |
| 2 | **Fishing Docks** | Reach keys — `g h t y` + home row | Harbour, tides, nets, lanterns |
| 3 | **Mountain Mine** | Outer reaches — `b n q w e r p` | Stone, ore, tunnels, firelight |
| 4 | **Forest Watch** | Number row — `1–0` | Tallying, counting, ancient records |
| 5 | **Desert Market** | Symbols — `@ # ! , . : " ' ( )` | Trade, signs, shorthand, prices |
| 6 | **Volcano Forge** | Full keyboard, speed + accuracy | Final mastery, prose, technical text |

Each village has:
- A unique **colour palette** used in the typing screen backdrop
- A **word bank** of 20–40 phrases thematically tied to the setting
- A **mastery bar** (0–100) tracked separately per village
- A set of **3 lessons + 1 capstone** (reusing the existing chapter JSON shape)
- An **unlock threshold**: 80 mastery in the prior village opens the path

---

## Route Structure

Current routes stay in place. New routes added:

```
/world          — world map screen (replaces /home as primary hub)
/world/[id]     — individual village screen (lessons + scene)
```

The existing `/home` (hub) route redirects to `/world`. The existing `/play` free-practice route stays for unstructured sessions.

The existing `(hub)` route group gets `/world` added. The `(app)` group keeps `/play`, `/progress`, `/settings`, etc.

---

## Data Model

### VillageDefinition (static, in `lib/world/village-definitions.ts`)

```typescript
export type VillageId =
  | 'meadow-farm'
  | 'fishing-docks'
  | 'mountain-mine'
  | 'forest-watch'
  | 'desert-market'
  | 'volcano-forge'

export type VillageDefinition = {
  id: VillageId
  order: number               // 1–6
  name: string
  tagline: string             // one-line flavour
  palette: {
    bg: string                // CSS colour for typing backdrop
    accent: string
    surface: string
  }
  keyFocus: string[]          // keys this village introduces
  unlockThreshold: number     // mastery score required in prior village (0 = always unlocked)
  prevVillageId: VillageId | null
}
```

### VillageMastery (persisted in GuestProgress)

Add to `GuestProgress`:

```typescript
villageMastery: Record<VillageId, number>   // 0–100 per village, default 0
```

Mastery earned per session inside a village:
- **+8 pts** for a clean session (accuracy ≥ 95%)
- **+5 pts** for a solid session (accuracy 85–94%)
- **+2 pts** for any completed session
- Mastery is capped at 100 and never decreases

### VillageState (computed, in `lib/world/project-world.ts`)

```typescript
export type VillageState =
  | 'locked'        // prior village mastery < threshold
  | 'active'        // unlocked, mastery < 80
  | 'flourishing'   // mastery ≥ 80, path to next village open
  | 'complete'      // mastery = 100

export type VillageProjection = {
  definition: VillageDefinition
  mastery: number
  state: VillageState
  isCurrentVillage: boolean   // the one the player should focus on next
}

export type WorldState = {
  villages: VillageProjection[]
  currentVillageId: VillageId
  totalMastery: number        // sum / 6 villages, 0–100
}
```

`projectWorld(progress: GuestProgress): WorldState` — deterministic, same inputs = same output.

---

## World Map Screen (`/world`)

The primary hub. Replaces the current `/home` page.

**Layout:** Full-screen dark green background. A pixel-art style overhead map fills most of the screen (CSS-rendered, not a raster image). Each village appears as a named location marker. Locked villages are visually dimmed with a fog overlay. Connected villages show a dotted path between them.

**Village markers:**
- Rendered as a small pixel-art icon + label
- State badge: 🔒 locked / ⚡ active / 🌿 flourishing / ⭐ complete
- Mastery bar shown below each unlocked marker
- Clicking an active/flourishing village navigates to `/world/[id]`

**Map layout (approximate positions):**
```
                    [Forest Watch]
      [Meadow Farm] ——→ [Fishing Docks] ——→ [Mountain Mine]
                                                    ↓
              [Volcano Forge] ←—— [Desert Market]
```

**Bottom bar:** Total mastery %, current village name, "Continue" button → goes to current village.

---

## Village Screen (`/world/[id]`)

Two panels side by side on desktop, stacked on mobile:

**Left — Village scene (60% width):**
- Pixel-art style scene using CSS + emoji/icon building blocks
- Uses the village's palette colours
- Buildings animate in when mastery milestones are crossed (CSS transitions)
- Mastery bar runs along the bottom of the scene
- Village name and tagline at top

**Right — Lesson panel (40% width):**
- List of lessons (3 + capstone), checkmarked as completed
- Currently active lesson's typing surface embedded inline
- After each lesson: brief result (WPM, accuracy, mastery gained +N pts)
- After all 4: "Village mastered!" screen with path-unlock animation if threshold crossed

**Typing surface in village context:**
- Prompts are drawn from the village's thematic word bank
- The backdrop colour shifts to the village palette during typing
- On session complete: mastery bar animates upward; if new milestone → building appears in scene

---

## Mastery & Unlock Flow

```
Player types a lesson inside a village
  → session metrics calculated
  → masteryGained = computeMasteryGain(metrics)
  → villageMastery[villageId] += masteryGained (cap 100)
  → if villageMastery[villageId] >= 80 && nextVillage exists:
      → nextVillage becomes 'active' (unlocked)
      → show "Path to [NextVillageName] unlocked!" moment
  → return to village screen (updated mastery bar)
  → player can continue lessons or go back to world map
```

Mastery gain is computed in `lib/world/mastery-rules.ts`. No server required — all local for guest players.

---

## Session Reward Moment

After any completed session inside a village:

1. Typing surface fades out
2. Village scene zooms to fill the panel
3. A new building or detail appears in the scene (CSS animation)
4. Stats card slides up: WPM / accuracy / mastery gained
5. If path unlocked: amber banner "Path to [Village] opens ahead →"
6. Buttons: "Next lesson" / "Back to world map"

This replaces the current flat "try another" summary card.

---

## Pixel Art Visual Approach

We have no dedicated pixel art assets. The approach is **CSS pixel art** — achievable without a designer:

- `image-rendering: pixelated` on all scaled images
- Pixel fonts via Google Fonts (`Press Start 2P` for headings, regular body text stays readable)
- Village scene backdrops: CSS box-shadows stacked to create pixel-art-style scenery (this technique produces authentic-looking pixel art from pure CSS)
- Village map: CSS grid + absolute-positioned markers, parchment/earth tones
- Building "sprites": emoji + CSS scaling + pixelated filter, or simple geometric shapes with pixel borders (4px, solid colour stepping)
- Colour palettes kept to 4–6 colours per village to feel authentic

The map does NOT attempt to replicate the detailed inspo sprite art — it uses the same *language* (overhead, labelled regions, parchment, paths) in a CSS-native way that can be built without assets.

---

## Implementation Scope

This spec covers **the game layer only**. Auth, server persistence, and analytics are unchanged.

### Files to create
- `lib/world/village-definitions.ts`
- `lib/world/mastery-rules.ts`
- `lib/world/project-world.ts`
- `content/villages/meadow-farm.ts` (word bank + lessons)
- `content/villages/fishing-docks.ts`
- `content/villages/mountain-mine.ts`
- `content/villages/forest-watch.ts`
- `content/villages/desert-market.ts`
- `content/villages/volcano-forge.ts`
- `components/world/world-map.tsx`
- `components/world/village-marker.tsx`
- `components/world/village-scene.tsx`
- `components/world/mastery-bar.tsx`
- `components/world/session-reward.tsx`
- `app/(hub)/world/page.tsx`
- `app/(hub)/world/[villageId]/page.tsx`

### Files to modify
- `lib/storage/guest-progress.ts` — add `villageMastery` field
- `app/(hub)/home/page.tsx` — redirect to `/world`
- `app/(app)/play/page.tsx` — wire mastery gain when a village is active

### Tests to add
- `tests/world/project-world.test.ts` — village unlock logic
- `tests/world/mastery-rules.test.ts` — mastery gain calculation

---

## What This Does NOT Include

- Real pixel sprite assets (planned for later, CSS approach used now)
- Multiplayer or friend challenges
- Village-specific leaderboards
- Sound / music (deferred)
- Mobile-first layout optimisation (desktop-first, mobile passable)
