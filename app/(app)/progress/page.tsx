'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

import { buildHistorySeries } from '@/lib/analytics/build-history-series'
import { buildProgressSummary } from '@/lib/analytics/build-progress-summary'
import { buildShareCard } from '@/lib/analytics/build-share-card'
import { useResolvedProgress } from '@/lib/storage/use-resolved-progress'
import { HistoryChart } from '@/components/progress/history-chart'
import { KeyboardHeatmap } from '@/components/progress/keyboard-heatmap'
import { MonthlyReflection } from '@/components/progress/monthly-reflection'
import { ProgressOverview } from '@/components/progress/progress-overview'
import { ShareCard } from '@/components/progress/share-card'

export default function ProgressPage() {
  const router = useRouter()
  const { progress, signedIn } = useResolvedProgress()

  useEffect(() => {
    if (progress === null) {
      return
    }

    if (progress.placement === null) {
      router.replace('/onboarding')
    }
  }, [progress, router])

  if (!progress) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p style={{ color: 'var(--kc-muted)' }}>Loading your stockpile...</p>
      </div>
    )
  }

  if (progress.placement === null) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p style={{ color: 'var(--kc-muted)' }}>Redirecting to placement...</p>
      </div>
    )
  }

  const summary = buildProgressSummary(progress)
  const series = buildHistorySeries(progress, { days: 7 })
  const shareCard = buildShareCard(progress)

  return (
    <div className="px-6 py-8" style={{ background: '#f4efe4' }}>
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <ProgressOverview summary={summary} signedIn={signedIn} />

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(0,0.95fr)]">
          <HistoryChart series={series} />
          <KeyboardHeatmap
            phaseId={summary.phaseId}
            averageAccuracy={summary.averageAccuracy}
            totalCorrectedErrors={summary.totalCorrectedErrors}
            totalSessions={summary.totalSessions}
          />
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.35fr)]">
          <MonthlyReflection summary={summary} series={series} />
          <ShareCard card={shareCard} />
        </div>
      </div>
    </div>
  )
}
