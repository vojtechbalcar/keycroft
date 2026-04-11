/**
 * Type stubs for the future friend system.
 *
 * No implementation lives here yet — these types define the shape so that
 * calling code can reference them without breaking when the real system
 * is built in a later stage.
 */

export type FriendStatus = 'pending' | 'accepted' | 'declined'

export type FriendRelationship = {
  /** The user who sent the friend request. */
  requesterId: string
  /** The user who received the friend request. */
  recipientId: string
  status: FriendStatus
  createdAt: string
  updatedAt: string
}

export type FriendSummary = {
  userId: string
  displayName: string | null
  /** Current phase id of the friend. */
  currentPhaseId: string | null
  /** Best WPM from the friend's recent sessions. */
  bestRecentWpm: number
  /** Friendship status from the perspective of the requesting user. */
  status: FriendStatus
}

export type FriendStore = {
  getFriends: (userId: string) => Promise<FriendSummary[]>
  sendFriendRequest: (requesterId: string, recipientId: string) => Promise<FriendRelationship>
  respondToRequest: (
    recipientId: string,
    requesterId: string,
    decision: 'accept' | 'decline',
  ) => Promise<FriendRelationship>
  removeFriend: (userId: string, friendId: string) => Promise<void>
}
