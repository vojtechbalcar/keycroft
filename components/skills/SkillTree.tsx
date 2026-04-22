'use client'

import { useState } from 'react'
import {
  skillDefinitions,
  canUnlockSkill,
  type SkillId,
} from '@/lib/skills/skill-definitions'

type Props = {
  unlockedSkills: SkillId[]
  skillPoints: number
  onUnlock: (skillId: SkillId) => Promise<void>
}

export function SkillTree({ unlockedSkills: initial, skillPoints: initialPoints, onUnlock }: Props) {
  const [unlocked, setUnlocked] = useState<SkillId[]>(initial)
  const [points, setPoints] = useState(initialPoints)
  const [loading, setLoading] = useState<SkillId | null>(null)

  async function handleUnlock(skillId: SkillId) {
    setLoading(skillId)
    await onUnlock(skillId)
    const def = skillDefinitions.find((s) => s.id === skillId)!
    setUnlocked((prev) => [...prev, skillId])
    setPoints((p) => p - def.pointCost)
    setLoading(null)
  }

  const performance = skillDefinitions.filter((s) => s.branch === 'performance')
  const economy = skillDefinitions.filter((s) => s.branch === 'economy')

  function renderNode(skill: (typeof skillDefinitions)[0]) {
    const isUnlocked = unlocked.includes(skill.id)
    const canBuy = canUnlockSkill(skill.id, unlocked, points)
    const isLoading = loading === skill.id

    return (
      <div
        key={skill.id}
        className={`rounded-lg border p-3 space-y-1.5 ${
          isUnlocked
            ? 'border-blue-700 bg-blue-950'
            : canBuy
              ? 'border-neutral-600 bg-neutral-800'
              : 'border-neutral-700 bg-neutral-900 opacity-60'
        }`}
      >
        <p className="font-medium text-sm text-neutral-100">{skill.name}</p>
        <p className="text-xs text-neutral-400">{skill.description}</p>
        <p className="text-xs text-neutral-500">
          {skill.pointCost} pt{skill.pointCost > 1 ? 's' : ''}
          {skill.requires && ` · requires ${skill.requires}`}
        </p>
        {isUnlocked ? (
          <p className="text-xs text-blue-400">✓ Active</p>
        ) : (
          <button
            disabled={!canBuy || !!loading}
            onClick={() => handleUnlock(skill.id)}
            className={`mt-0.5 w-full py-1 rounded text-xs font-medium transition-colors ${
              canBuy && !loading
                ? 'bg-blue-700 hover:bg-blue-600 text-white'
                : 'bg-neutral-700 text-neutral-500 cursor-not-allowed'
            }`}
          >
            {isLoading ? '…' : 'Unlock'}
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-sm text-neutral-300">
        ⚡ {points} skill point{points !== 1 ? 's' : ''} available
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">
            Performance
          </p>
          {performance.map(renderNode)}
        </div>
        <div className="space-y-2">
          <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">
            Economy
          </p>
          {economy.map(renderNode)}
        </div>
      </div>
    </div>
  )
}
