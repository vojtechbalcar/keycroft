'use client'

import { useEffect, useState } from 'react'

import { useSessionUser } from '@/components/layout/session-context'
import type { GuestProgress } from '@/lib/storage/guest-progress'
import { resolveProgressSnapshot } from '@/lib/storage/progress-sync'

export function useResolvedProgress() {
  const sessionUser = useSessionUser()
  const [progress, setProgress] = useState<GuestProgress | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      const nextProgress = await resolveProgressSnapshot(
        window.localStorage,
        sessionUser !== null,
      )

      if (!cancelled) {
        setProgress(nextProgress)
      }
    }

    void load()

    return () => {
      cancelled = true
    }
  }, [sessionUser])

  return {
    progress,
    setProgress,
    signedIn: sessionUser !== null,
    sessionUser,
  }
}
