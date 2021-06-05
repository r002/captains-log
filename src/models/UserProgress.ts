export type Tag = {
  name: string
  icon: string
}

type TCardInput = {
  title: string
  userHandle: string
  number: number
  createdAt: string
  updatedAt: string
  tags: Tag[]
  comments: number
}
class Card {
  title: string
  userHandle: string
  number: number
  created: Date
  updated: Date
  tags: Tag[]
  comments: number

  constructor (props: TCardInput) {
    this.title = props.title
    this.userHandle = props.userHandle
    this.number = props.number
    this.created = new Date(props.createdAt)
    this.updated = new Date(props.updatedAt)
    this.tags = props.tags
    this.comments = props.comments
  }

  get createdStr () {
    return this.created.toLocaleDateString() // Eg. 5/31/2021
  }

  get updatedStr () {
    return this.updated.toLocaleDateString()
  }
}

type TUserInput = {
  userFullname: string
  userHandle: string
  startDateStr: string
}

class UserProgress {
  userFullname: string
  userHandle: string
  startDate: Date
  _cards = new Map<string, Card>()
  _streakCurrent = 0
  _missedDays = 0

  constructor (props: TUserInput) {
    this.userFullname = props.userFullname
    this.userHandle = props.userHandle
    this.startDate = new Date(props.startDateStr)
  }

  setCard (cardInput: TCardInput) {
    const card = new Card(cardInput)
    this._cards.set(card.createdStr, card)
  }

  getCard (dateStr: string) {
    return this._cards.get(dateStr)
  }

  calculateStreak () {
    // console.log('>> Calculate streak for:', this.userHandle)
    const dateCursor = new Date() // Start on today
    // Generate the date range we're interested in
    const dateRange = [] as string[]
    while (dateCursor.getTime() >= this.startDate.getTime()) {
      dateRange.push(dateCursor.toLocaleDateString())
      dateCursor.setTime(dateCursor.getTime() - 86400 * 1000) // Step one day backwards until we get to the start date
    }
    // console.log('>> dateRange:', this.startDate.getDate(), dateRange)
    for (const dateStr of dateRange) {
      // console.log('>> dateStr:', dateStr)
      if (this._cards.has(dateStr)) {
        this._streakCurrent++
      } else {
        const today = new Date()
        if (today.toLocaleDateString() !== dateStr) { // Don't do anything if user hasn't yet contributed today
          // console.log('>> Resetting streak!')
          this._streakCurrent = 0 // Reset the streak
          this._missedDays++
        }
      }
    }
  }

  get CurrentStreak () {
    this._streakCurrent = this._missedDays = 0
    this.calculateStreak()
    return this._streakCurrent
  }

  get MissedDays () {
    return this._missedDays
  }
}

export class UserProgressDb {
  _db = new Map<string, UserProgress>()

  addUser (userInput: TUserInput) {
    this._db.set(userInput.userHandle, new UserProgress(userInput))
  }

  getUser (userHandle: string) {
    return this._db.get(userHandle)
  }
}
