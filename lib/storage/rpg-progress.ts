import { db } from '@/lib/db'
import type { BuildingLevels } from '@/lib/map/map-rules'
import type { SkillId } from '@/lib/skills/skill-definitions'

export type RpgProgress = {
  gold: number
  rareMaterials: Record<string, number>
  skillPoints: number
  unlockedSkills: SkillId[]
  buildingLevels: BuildingLevels
  clearedNodeIds: Set<string>
  clearedChapterIds: Set<string>
}

export async function readRpgProgress(userId: string): Promise<RpgProgress> {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: {
      gold: true,
      rareMaterials: true,
      skillPoints: true,
      unlockedSkills: true,
      buildingLevels: true,
      nodeCompletions: { select: { nodeId: true } },
      chapterProgresses: { select: { chapterId: true } },
    },
  })

  if (!user) {
    return {
      gold: 0,
      rareMaterials: {},
      skillPoints: 0,
      unlockedSkills: [],
      buildingLevels: { townHall: 0, workshop: 0, tavern: 0 },
      clearedNodeIds: new Set(),
      clearedChapterIds: new Set(),
    }
  }

  return {
    gold: user.gold,
    rareMaterials: (user.rareMaterials as Record<string, number>) ?? {},
    skillPoints: user.skillPoints,
    unlockedSkills: user.unlockedSkills as SkillId[],
    buildingLevels: (user.buildingLevels as BuildingLevels) ?? { townHall: 0, workshop: 0, tavern: 0 },
    clearedNodeIds: new Set(user.nodeCompletions.map((n) => n.nodeId)),
    clearedChapterIds: new Set(user.chapterProgresses.map((c) => c.chapterId)),
  }
}

export async function awardLessonGold(
  userId: string,
  nodeId: string,
  chapterId: string,
  goldEarned: number,
): Promise<void> {
  await db.$transaction([
    db.user.update({
      where: { id: userId },
      data: { gold: { increment: goldEarned } },
    }),
    db.nodeCompletion.upsert({
      where: { userId_chapterId_nodeId: { userId, chapterId, nodeId } },
      create: { userId, chapterId, nodeId },
      update: {},
    }),
  ])
}

export async function recordBossAttempt(
  userId: string,
  chapterId: string,
  nodeId: string,
  won: boolean,
  goldEarned: number,
  rareDrop: string | null,
  score: number,
  skillPointsEarned: number,
): Promise<void> {
  await db.$transaction(async (tx) => {
    const updates: Record<string, unknown> = {
      gold: { increment: goldEarned },
    }

    if (rareDrop) {
      const user = await tx.user.findUnique({ where: { id: userId }, select: { rareMaterials: true } })
      const current = (user?.rareMaterials as Record<string, number>) ?? {}
      updates.rareMaterials = { ...current, [rareDrop]: (current[rareDrop] ?? 0) + 1 }
    }

    if (skillPointsEarned > 0) {
      updates.skillPoints = { increment: skillPointsEarned }
    }

    await tx.user.update({ where: { id: userId }, data: updates })

    if (won) {
      await tx.nodeCompletion.upsert({
        where: { userId_chapterId_nodeId: { userId, chapterId, nodeId } },
        create: { userId, chapterId, nodeId, bestScore: score },
        update: { bestScore: score },
      })
      await tx.chapterProgress.upsert({
        where: { userId_chapterId: { userId, chapterId } },
        create: { userId, chapterId, completedAt: new Date() },
        update: {},
      })
    }
  })
}

export async function upgradeBuildingInDb(
  userId: string,
  buildingId: string,
  goldCost: number,
  rareMaterialType: string | null,
  rareMaterialCost: number,
  newLevel: number,
): Promise<void> {
  await db.$transaction(async (tx) => {
    const user = await tx.user.findUnique({
      where: { id: userId },
      select: { buildingLevels: true, rareMaterials: true },
    })

    const currentLevels = (user?.buildingLevels as Record<string, number>) ?? {}
    const currentRare = (user?.rareMaterials as Record<string, number>) ?? {}

    const updatedLevels = { ...currentLevels, [buildingId]: newLevel }
    const updatedRare = rareMaterialType
      ? { ...currentRare, [rareMaterialType]: (currentRare[rareMaterialType] ?? 0) - rareMaterialCost }
      : currentRare

    await tx.user.update({
      where: { id: userId },
      data: {
        buildingLevels: updatedLevels,
        rareMaterials: updatedRare,
        gold: { decrement: goldCost },
      },
    })
  })
}

export async function unlockSkillInDb(
  userId: string,
  skillId: SkillId,
  pointCost: number,
): Promise<void> {
  await db.$transaction(async (tx) => {
    const user = await tx.user.findUnique({ where: { id: userId }, select: { unlockedSkills: true } })
    const current = (user?.unlockedSkills ?? []) as SkillId[]

    await tx.user.update({
      where: { id: userId },
      data: {
        unlockedSkills: [...current, skillId],
        skillPoints: { decrement: pointCost },
      },
    })
  })
}
