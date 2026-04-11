/**
 * Type stubs for the async challenge system.
 *
 * Challenges are asynchronous — you set a target, a friend attempts it in
 * their own session, and results are compared after both runs complete.
 * No real-time connection is required.
 *
 * No implementation lives here yet. Types are defined so that scaffold pages
 * and future feature work can reference a stable shape.
 */

export type ChallengeStatus =
  | 'pending'   // Issued, recipient has not accepted yet
  | 'accepted'  // Recipient accepted, waiting for their run
  | 'completed' // Both runs are in, result is determined
  | 'declined'  // Recipient declined
  | 'expired'   // No response or run within the expiry window

export type ChallengeResult = 'challenger-wins' | 'recipient-wins' | 'draw'

export type ChallengeRun = {
  userId: string
  completedAt: string
  wpm: number
  accuracy: number
  correctedErrors: number
}

export type Challenge = {
  id: string
  challengerId: string
  recipientId: string
  /** The chapter used as the challenge text. */
  chapterId: string
  status: ChallengeStatus
  challengerRun: ChallengeRun
  recipientRun: ChallengeRun | null
  result: ChallengeResult | null
  createdAt: string
  expiresAt: string
}

export type ChallengeSummary = {
  challengeId: string
  opponentId: string
  opponentDisplayName: string | null
  chapterId: string
  status: ChallengeStatus
  result: ChallengeResult | null
  createdAt: string
}

export type ChallengeStore = {
  getChallengesForUser: (userId: string) => Promise<ChallengeSummary[]>
  issueChallenge: (input: {
    challengerId: string
    recipientId: string
    chapterId: string
    challengerRun: ChallengeRun
  }) => Promise<Challenge>
  respondToChallenge: (
    challengeId: string,
    recipientId: string,
    decision: 'accept' | 'decline',
  ) => Promise<Challenge>
  submitChallengeRun: (
    challengeId: string,
    run: ChallengeRun,
  ) => Promise<Challenge>
}
