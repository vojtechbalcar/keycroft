import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const user = await prisma.user.upsert({
    where: {
      email: 'demo@keycroft.local',
    },
    update: {
      name: 'Keycroft Demo',
      currentPhaseId: 'workshop',
      placementCompletedAt: new Date('2026-04-01T08:00:00.000Z'),
      placementPhaseId: 'workshop',
      placementPhaseName: 'Workshop',
      placementSummary: 'Solid mechanics with room to smooth out consistency.',
      placementRecommendedFocus: 'Keep accuracy high while bringing rhythm up.',
      placementReason: 'Seeded local demo account.',
      placementSelfRating: 'steady-practice',
      placementWpm: 32,
      placementAccuracy: 96,
      placementCorrectedErrors: 1,
    },
    create: {
      email: 'demo@keycroft.local',
      name: 'Keycroft Demo',
      currentPhaseId: 'workshop',
      placementCompletedAt: new Date('2026-04-01T08:00:00.000Z'),
      placementPhaseId: 'workshop',
      placementPhaseName: 'Workshop',
      placementSummary: 'Solid mechanics with room to smooth out consistency.',
      placementRecommendedFocus: 'Keep accuracy high while bringing rhythm up.',
      placementReason: 'Seeded local demo account.',
      placementSelfRating: 'steady-practice',
      placementWpm: 32,
      placementAccuracy: 96,
      placementCorrectedErrors: 1,
    },
  })

  await prisma.chapterProgress.upsert({
    where: {
      userId_chapterId: {
        userId: user.id,
        chapterId: 'ch01-arrival',
      },
    },
    update: {
      completedAt: new Date('2026-04-02T09:00:00.000Z'),
    },
    create: {
      userId: user.id,
      chapterId: 'ch01-arrival',
      completedAt: new Date('2026-04-02T09:00:00.000Z'),
    },
  })

  await prisma.typingRun.upsert({
    where: {
      userId_completedAt: {
        userId: user.id,
        completedAt: new Date('2026-04-03T09:00:00.000Z'),
      },
    },
    update: {
      phaseId: 'workshop',
      source: 'seed',
      wpm: 36,
      accuracy: 97,
      correctedErrors: 1,
    },
    create: {
      userId: user.id,
      phaseId: 'workshop',
      source: 'seed',
      completedAt: new Date('2026-04-03T09:00:00.000Z'),
      wpm: 36,
      accuracy: 97,
      correctedErrors: 1,
    },
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (error) => {
    console.error(error)
    await prisma.$disconnect()
    process.exit(1)
  })
