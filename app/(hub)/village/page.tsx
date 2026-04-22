'use client'

import { useEffect, useState } from 'react'
import { buildingDefinitions } from '@/lib/village/building-definitions'
import type { BuildingId } from '@/lib/village/building-definitions'
import { BuildingCard } from '@/components/village/BuildingCard'
import { canUpgradeBuilding } from '@/lib/village/village-rules'
import type { BuildingLevels } from '@/lib/map/map-rules'

type VillageState = {
  gold: number
  rareMaterials: Record<string, number>
  buildingLevels: BuildingLevels
}

export default function VillagePage() {
  const [state, setState] = useState<VillageState | null>(null)
  const [loading, setLoading] = useState(true)

  async function fetchState() {
    const res = await fetch('/api/progress')
    const data = await res.json()
    const p = data.progress
    setState({
      gold: p?.gold ?? 0,
      rareMaterials: p?.rareMaterials ?? {},
      buildingLevels: p?.buildingLevels ?? { townHall: 0, workshop: 0, tavern: 0 },
    })
  }

  useEffect(() => {
    fetchState().finally(() => setLoading(false))
  }, [])

  async function handleUpgrade(buildingId: BuildingId) {
    const res = await fetch('/api/village/upgrade', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ buildingId }),
    })
    if (res.ok) {
      await fetchState()
    }
  }

  if (loading) return <div className="p-8 text-neutral-400">Loading village…</div>
  if (!state) return <div className="p-8 text-neutral-400">Could not load village.</div>

  const resources = { gold: state.gold, rareMaterials: state.rareMaterials }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-neutral-100">Your Village</h1>
        <div className="text-sm text-neutral-300 space-y-0.5 text-right">
          <div>🪙 {state.gold} gold</div>
          {Object.entries(state.rareMaterials)
            .filter(([, v]) => v > 0)
            .map(([k, v]) => (
              <div key={k}>
                ✨ {v} {k}
              </div>
            ))}
        </div>
      </div>

      <div className="space-y-4">
        {buildingDefinitions.map((building) => (
          <BuildingCard
            key={building.id}
            building={building}
            currentLevel={state.buildingLevels[building.id] ?? 0}
            canUpgrade={canUpgradeBuilding(building.id, state.buildingLevels, resources)}
            onUpgrade={handleUpgrade}
          />
        ))}
      </div>
    </div>
  )
}
