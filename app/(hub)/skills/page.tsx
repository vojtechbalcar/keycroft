'use client'

import { useEffect, useState } from 'react'
import { SkillTree } from '@/components/skills/SkillTree'
import type { SkillId } from '@/lib/skills/skill-definitions'

export default function SkillsPage() {
  const [data, setData] = useState<{ unlockedSkills: SkillId[]; skillPoints: number } | null>(null)

  useEffect(() => {
    fetch('/api/progress')
      .then((r) => r.json())
      .then((d) =>
        setData({
          unlockedSkills: (d.progress?.unlockedSkills ?? []) as SkillId[],
          skillPoints: d.progress?.skillPoints ?? 0,
        }),
      )
  }, [])

  async function handleUnlock(skillId: SkillId) {
    await fetch('/api/skills/unlock', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ skillId }),
    })
  }

  if (!data) return <div className="p-8 text-neutral-400">Loading skills…</div>

  return (
    <div className="max-w-xl mx-auto px-4 py-10 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-100">Skill Tree</h1>
        <p className="text-sm text-neutral-400 mt-1">
          Earn skill points by defeating bosses. Spend them to strengthen your runs.
        </p>
      </div>
      <SkillTree
        unlockedSkills={data.unlockedSkills}
        skillPoints={data.skillPoints}
        onUnlock={handleUnlock}
      />
    </div>
  )
}
