type TCardInput = {
  title: string
  userHandle: string
  number: number
  createdAt: string
}
class Card {
  title: string
  userHandle: string
  number: number
  created: Date

  constructor (props: TCardInput) {
    this.title = props.title
    this.userHandle = props.userHandle
    this.number = props.number
    this.created = new Date(props.createdAt)
  }

  get dateStr () {
    return this.created.toLocaleDateString()
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
  #cards = new Map<string, Card>()
  #streakCurrent = 0
  #missedDays = 0

  constructor (props: TUserInput) {
    this.userFullname = props.userFullname
    this.userHandle = props.userHandle
    this.startDate = new Date(props.startDateStr)
  }

  addCard (cardInput: TCardInput) {
    const card = new Card(cardInput)
    this.#cards.set(card.dateStr, card)
  }

  getCard (dateStr: string) {
    return this.#cards.get(dateStr)
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
      if (this.#cards.has(dateStr)) {
        this.#streakCurrent++
      } else {
        const today = new Date()
        if (today.toLocaleDateString() !== dateStr) { // Don't do anything if user hasn't yet contributed today
          this.#streakCurrent = 0 // Reset the streak
          this.#missedDays++
        }
      }
    }
  }

  get CurrentStreak () {
    if (this.#streakCurrent === 0) {
      this.calculateStreak()
    }
    return this.#streakCurrent
  }

  get MissedDays () {
    return this.#missedDays
  }
}

export class UserProgressDb {
  #db = new Map<string, UserProgress>()

  addUser (userInput: TUserInput) {
    this.#db.set(userInput.userHandle, new UserProgress(userInput))
  }

  getUser (userHandle: string) {
    return this.#db.get(userHandle)
  }
}
