# Keycroft — RPG Remodel Design

**Date:** 2026-04-22
**Status:** Approved for implementation
**Approach:** Option B — Core loop first, systems second

---

## Overview

Rebuild Keycroft's game layer around a **single upgradeable village + adventure map** model. Lessons become nodes on a quest map. Chapters end with a boss fight. Completing content earns resources. Resources upgrade your village. Upgrading your village unlocks new map chapters. A skill tree of passive bonuses and modifiers gives players meaningful long-term choices.

This replaces the current 6-themed-villages model. The underlying typing engine is unchanged.

---

## Product Principles (unchanged)

- Reward real improvement, not empty repetition
- Feel premium and calm — never loud or manipulative
- Progress visible in both stats and world state
- No microtransactions, loot boxes, fake scarcity

---

## 1. Core Loop

```
Open map → select lesson node → type → earn gold
→ complete 3 lessons → boss node unlocks
→ boss fight (60s gauntlet) → win = gold + rare material
→ return to village → spend resources to upgrade buildings
→ building upgrade unlocks next chapter on map
→ spend skill points (earned per chapter cleared) on skill tree
```

---

## 2. Adventure Map

### Structure
- A linear path of nodes laid out like an RPG overworld
- Nodes group into **chapters**: 3 lesson nodes + 1 boss node
- Boss node is locked until all 3 lesson nodes in the chapter are cleared
- New chapters unlock when the player upgrades a specific building (see Village section)

### Lesson Nodes
- Standard typing session using the existing engine
- Word/key focus tied to the chapter theme (uses existing content system)
- **Gold earned on completion:** base amount scaled by accuracy and WPM
- **Replay policy:** first clear earns full gold; replays earn 25% to prevent grinding
- Node shows a "cleared" visual state permanently once completed

### Boss Nodes (60s Gauntlet)
- Timed sprint: type as many correct words as possible in 60 seconds
- **Score = WPM × accuracy** (accuracy is a multiplier, not just a filter)
- Each boss has a score threshold — must meet or exceed to win
- Thresholds scale with chapter number
- **Win:** earn standard gold + 1 rare material (type rotates by chapter arc)
- **Lose:** earn consolation gold (25% of win amount), retry freely — no lives, no energy
- **Second Chance skill:** one retry per chapter that still counts as a win attempt

### Map Progression
- Chapter unlocks are gated by village building upgrades, not just prior chapter completion
- This forces the village ↔ map loop — you can't ignore the village
- Each chapter has a name, a visual map node style, and a key/word focus

---

## 3. Village Upgrade System

### Structure
One village. Three buildings. Each has 4 upgrade tiers with distinct visual states and animations triggered on upgrade.

| Building | Tier gates | What upgrading unlocks |
|---|---|---|
| **Town Hall** | Tier 1–4 | Gates chapter unlocks (T1 = ch2, T2 = ch4, T3 = ch6, T4 = all) |
| **Workshop** | Tier 1–4 | Typing cosmetics (themes, cursor styles, one per tier) |
| **Tavern** | Tier 1–4 | Modifier challenges (harder sessions with bonus loot multipliers) |

### Upgrade Costs
- Tier 1: cheap gold only (immediate for new players)
- Tier 2: moderate gold + 1 rare material
- Tier 3: significant gold + 3 rare materials
- Tier 4: large gold + 5 rare materials + 1 special drop (boss-only rare)

### Visual Treatment
- Each building has 4 distinct art states (empty/basic/developed/flourishing)
- Upgrade triggers a short animation (build dust, light burst, or glow)
- Village should feel visibly alive and growing — not a static image swap

---

## 4. Resources

### MVP Resource Types (2)

**Gold** — common currency
- Earned from every lesson completion
- Amount scales with session accuracy and WPM
- Replay penalty: 25% yield after first clear
- Used for most building upgrades

**Rare Materials** — chapter-specific drops
- Only earned from boss wins
- Type rotates by chapter arc (Stone for chapters 1–3, Timber for 4–6, etc.)
- Required for tier 2+ building upgrades
- Not earned from replays — only first-time boss wins

### Earning Rules (MVP numbers — tune after playtesting)
| Session type | Gold earned |
|---|---|
| Lesson first clear, accuracy ≥ 95% | 120 |
| Lesson first clear, accuracy 85–94% | 80 |
| Lesson first clear, accuracy < 85% | 40 |
| Lesson replay | 25% of above |
| Boss win | 200 + 1 rare material |
| Boss loss | 50 |

---

## 5. Skill Tree

### Earning Skill Points
- 1 skill point per chapter fully cleared (boss defeated)
- Points are spent, not refunded — choices are permanent

### Tree Structure (6 nodes, 2 branches)

**Performance Branch** (affects boss scoring):
- **Sharp Eye** (1pt) — accuracy weighted 20% higher in boss score calculation
- **Quick Hands** (1pt, requires Sharp Eye) — +5 WPM added to boss score
- **Clutch** (2pt, requires Quick Hands) — first 10s of boss fight score counts double

**Economy Branch** (affects resource drops):
- **Resource Magnet** (1pt) — +15% gold from all lessons
- **Lucky Strike** (1pt, requires Resource Magnet) — rare material has 20% chance to drop double on boss win
- **Second Chance** (2pt, requires Lucky Strike) — one free retry per chapter on boss fights (retry still eligible for full win + rare drop)

### Rules
- Nodes unlock left-to-right within each branch — no skipping
- Both branches are available from the start (no gate between them)
- Total tree costs 8 points to fully unlock — roughly 8 chapters cleared

---

## 6. Data Model

### Prisma Schema Changes

**UserProgress** (add columns):
```prisma
gold           Int     @default(0)
rareMaterials  Json    @default("{}")   // { "stone": 0, "timber": 0 }
skillPoints    Int     @default(0)
unlockedSkills String[]
buildingLevels Json    @default("{}")   // { "townHall": 1, "workshop": 0, "tavern": 0 }
```

**NodeCompletion** (new table):
```prisma
model NodeCompletion {
  id        String   @id @default(cuid())
  userId    String
  chapterId String
  nodeId    String
  cleared   Boolean  @default(false)
  bestScore Int?                         // WPM × accuracy for boss nodes
  user      User     @relation(fields: [userId], references: [id])
  @@unique([userId, chapterId, nodeId])
}
```

**BossAttempt** (new table):
```prisma
model BossAttempt {
  id         String   @id @default(cuid())
  userId     String
  chapterId  String
  won        Boolean
  score      Int
  goldEarned Int
  rareDrop   String?
  createdAt  DateTime @default(now())
  user       User     @relation(fields: [userId], references: [id])
}
```

---

## 7. Route Structure

| Route | Description |
|---|---|
| `/map` | Adventure map — all chapters and nodes |
| `/map/[chapterId]` | Chapter view — lesson nodes + boss node |
| `/map/[chapterId]/boss` | Boss fight session |
| `/village` | Your upgradeable home village |
| `/skills` | Skill tree view |
| `/play` | Free practice (unchanged) |
| `/progress` | Stats (unchanged) |
| `/settings` | Settings (unchanged) |

`/world` and `/world/[villageId]` are replaced by `/map` and `/map/[chapterId]`.
`/home` redirects to `/map`.

---

## 8. Library Structure

### New/renamed modules

| Path | Purpose |
|---|---|
| `lib/map/chapter-definitions.ts` | Static chapter + node definitions (replaces `lib/world/village-definitions.ts`) |
| `lib/map/map-rules.ts` | Unlock rules, completion logic (replaces `lib/world/world-rules.ts`) |
| `lib/map/boss-rules.ts` | Boss score thresholds, win/lose logic, loot tables |
| `lib/village/building-definitions.ts` | Buildings, tiers, costs, visual stages |
| `lib/village/village-rules.ts` | Upgrade logic, unlock gates |
| `lib/skills/skill-definitions.ts` | Skill tree nodes, costs, unlock requirements |
| `lib/skills/skill-effects.ts` | Effect calculations (score bonuses, resource modifiers) |
| `lib/resources/resource-rules.ts` | Gold/rare earning rules, replay penalties |

### Existing modules kept/adapted
- `lib/typing/` — unchanged
- `lib/progression/` — simplified (chapter cleared events replace phase evaluation)
- `lib/storage/` — adapted to new UserProgress shape
- `lib/content/` — unchanged (word banks, key focus)
- `lib/analytics/` — adapted to new event types

---

## 9. MVP Scope (Option B — ship the feeling first)

### In scope for this implementation
- Adventure map with 2 chapters (6 lesson nodes + 2 boss nodes) as content
- Boss fight (60s gauntlet) with win/lose logic and loot drop
- Village with 3 buildings, tiers 1–2 only (enough to feel the loop)
- 2 resource types (gold + one rare material type)
- Skill tree with both branches, all 6 nodes (data + UI, even if not all are earnable yet)
- Persistent state via Prisma

### Out of scope for this implementation
- Building tier 3–4 (content stub only)
- Multiple rare material types (scaffold the type but only use "stone")
- Cosmetics unlocked by Workshop (scaffold the unlock, cosmetics themselves are Phase 2)
- Tavern modifier challenges (scaffold the unlock, challenges are Phase 2)
- Friends/social features (existing stubs stay as stubs)
