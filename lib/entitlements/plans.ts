/**
 * Plan definitions for Keycroft.
 * Defines the limits and capabilities of each plan tier.
 */

import type { FeatureFlag, Plan } from './feature-flags'

export type PlanDefinition = {
  id: Plan
  name: string
  description: string
  /** Maximum number of practice sessions stored in history. */
  maxStoredSessions: number
  /** Maximum number of chapters accessible. null = unlimited. */
  maxChapters: number | null
  /** Feature flags that are enabled for this plan. */
  enabledFlags: ReadonlyArray<FeatureFlag>
}

export const FREE_PLAN: PlanDefinition = {
  id: 'free',
  name: 'Free',
  description: 'The full core typing loop, placement, and first three chapters.',
  maxStoredSessions: 5,
  maxChapters: 3,
  enabledFlags: [],
}

export const PREMIUM_PLAN: PlanDefinition = {
  id: 'premium',
  name: 'Premium',
  description: 'Unlimited history, all chapters, keyboard heatmaps, and social features.',
  maxStoredSessions: Infinity,
  maxChapters: null,
  enabledFlags: [
    'premium-history-chart',
    'premium-keyboard-heatmap',
    'premium-monthly-reflection',
    'premium-share-card',
    'social-friends',
    'social-challenges',
    'extended-chapter-path',
  ],
}

export const PLANS: ReadonlyArray<PlanDefinition> = [FREE_PLAN, PREMIUM_PLAN]

export function getPlanById(id: Plan): PlanDefinition {
  const plan = PLANS.find((p) => p.id === id)
  if (!plan) {
    throw new Error(`Unknown plan id: ${id}`)
  }
  return plan
}
