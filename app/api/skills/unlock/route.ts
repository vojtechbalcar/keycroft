import { auth } from '@/auth'
import { canUnlockSkill, getSkillDefinition, type SkillId } from '@/lib/skills/skill-definitions'
import { unlockSkillInDb, readRpgProgress } from '@/lib/storage/rpg-progress'

export const POST = auth(async (request) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userId = (request as any).auth?.user?.id
  if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json() as { skillId: SkillId }
  const { skillId } = body
  if (!skillId) return Response.json({ error: 'Missing skillId' }, { status: 400 })

  const progress = await readRpgProgress(userId)

  if (!canUnlockSkill(skillId, progress.unlockedSkills, progress.skillPoints)) {
    return Response.json(
      { error: 'Cannot unlock: missing requirements or insufficient points' },
      { status: 400 },
    )
  }

  const def = getSkillDefinition(skillId)
  await unlockSkillInDb(userId, skillId, def.pointCost)

  return Response.json({ skillId, remainingPoints: progress.skillPoints - def.pointCost })
})
