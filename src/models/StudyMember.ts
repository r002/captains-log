export type Streak = {
  days: number,
  startDate: string,
  endDate: string
}

export type Card = {
  date: string,
  number: number
}

export type StudyMember = {
  userFullname: string
  userHandle: string
  startDateStr: string
  uid: string
  repo: string
  active: boolean,
  streakCurrent: Streak,
  streakMax: Streak,
  recordCount: number,
  daysJoined: number,
  lastCard: Card,
  record: Map<string, number>
}
