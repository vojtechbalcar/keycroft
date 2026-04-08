'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import { PlacementFlow } from '@/components/onboarding/placement-flow'
import type { PlacementResult } from '@/lib/placement/assess'
import {
  readGuestProgress,
  recordPlacementResult,
  saveGuestProgress,
} from '@/lib/storage/guest-progress'
import { ensureGuestProfile } from '@/lib/storage/guest-profile'

export default function OnboardingPage() {
  const router = useRouter()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const storage = window.localStorage
    ensureGuestProfile(storage)
    const progress = readGuestProgress(storage)
    if (progress.placement !== null) {
      router.replace('/home')
      return
    }
    queueMicrotask(() => setReady(true))
  }, [router])

  function handlePlacementComplete(result: PlacementResult) {
    const storage = window.localStorage
    const progress = readGuestProgress(storage)
    const nextProgress = recordPlacementResult(progress, result, new Date().toISOString())
    saveGuestProgress(storage, nextProgress)
  }

  if (!ready) {
    return (
      <section className="rounded-[32px] border border-[var(--kc-line-light)] bg-[var(--kc-surface)] p-8 text-[var(--kc-text-dark)] shadow-[0_18px_50px_rgba(58,45,30,0.10)]">
        Preparing your starting path...
      </section>
    )
  }

  return <PlacementFlow onPlacementComplete={handlePlacementComplete} />
}
