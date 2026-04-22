'use client'

import { useState } from 'react'
import type { BuildingDefinition, BuildingId } from '@/lib/village/building-definitions'

type Props = {
  building: BuildingDefinition
  currentLevel: number
  canUpgrade: boolean
  onUpgrade: (buildingId: BuildingId) => Promise<void>
}

const LEVEL_LABELS = ['Empty', 'Foundation', 'Established', 'Thriving', 'Flourishing']

export function BuildingCard({ building, currentLevel, canUpgrade, onUpgrade }: Props) {
  const [loading, setLoading] = useState(false)
  const nextTier = building.tiers[currentLevel]

  async function handleUpgrade() {
    setLoading(true)
    await onUpgrade(building.id)
    setLoading(false)
  }

  return (
    <div className="rounded-xl border border-neutral-700 bg-neutral-900 p-5 space-y-3">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-neutral-100">{building.name}</h3>
          <p className="text-xs text-neutral-400 mt-0.5">{building.description}</p>
        </div>
        <span className="text-xs text-neutral-500 shrink-0 ml-3">
          {LEVEL_LABELS[currentLevel] ?? 'Max'}
        </span>
      </div>

      {nextTier ? (
        <div className="rounded-lg border border-neutral-700 bg-neutral-800 p-3 text-sm space-y-1">
          <p className="text-neutral-300 font-medium">Next: {nextTier.label}</p>
          <p className="text-neutral-400 text-xs">{nextTier.unlocks}</p>
          <div className="flex gap-3 text-xs text-neutral-400 mt-1">
            <span>🪙 {nextTier.goldCost} gold</span>
            {nextTier.rareMaterialCost > 0 && (
              <span>
                ✨ {nextTier.rareMaterialCost} {nextTier.rareMaterialType}
              </span>
            )}
          </div>
        </div>
      ) : (
        <p className="text-xs text-emerald-400">Fully upgraded</p>
      )}

      {nextTier && (
        <button
          onClick={handleUpgrade}
          disabled={!canUpgrade || loading}
          className={`w-full py-2 rounded-lg text-sm font-medium transition-colors ${
            canUpgrade && !loading
              ? 'bg-amber-700 hover:bg-amber-600 text-white'
              : 'bg-neutral-700 text-neutral-500 cursor-not-allowed'
          }`}
        >
          {loading ? 'Upgrading…' : canUpgrade ? 'Upgrade' : 'Not enough resources'}
        </button>
      )}
    </div>
  )
}
