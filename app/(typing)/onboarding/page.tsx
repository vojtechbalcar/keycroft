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

const BG = 'linear-gradient(180deg,#f4ebd7 0%,#ebdfc9 100%)'
const MUTED = '#746754'

export default function OnboardingPage() {
  const router = useRouter()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const storage = window.localStorage
    ensureGuestProfile(storage)
    const progress = readGuestProgress(storage)
    if (progress.placement !== null) {
      router.replace('/world')
      return
    }
    queueMicrotask(() => setReady(true))
  }, [router])

  function handlePlacementComplete(result: PlacementResult) {
    const storage = window.localStorage
    const progress = readGuestProgress(storage)
    const nextProgress = recordPlacementResult(progress, result, new Date().toISOString())
    saveGuestProgress(storage, nextProgress)
    router.replace('/world')
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: BG,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1.5rem',
      fontFamily: 'var(--font-mono, monospace)',
    }}>
      {!ready ? (
        <p style={{ color: MUTED, fontSize: '0.78rem', letterSpacing: '0.1em' }}>
          Preparing your starting path…
        </p>
      ) : (
        <div style={{ width: '100%', maxWidth: 760 }}>
          <PlacementFlow onPlacementComplete={handlePlacementComplete} />
        </div>
      )}
    </div>
  )
}
