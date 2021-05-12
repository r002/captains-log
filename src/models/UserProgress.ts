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

type TCardInput = {
  title: string
  userHandle: string
  number: number
  createdAt: string
}

export class UserProgressDb {
  #db = new Map<string, Map<string, Card>>()

  addCard (cardInput: TCardInput) {
    const card = new Card(cardInput)
    if (this.#db.has(card.userHandle)) {
      this.#db.get(card.userHandle)!.set(card.dateStr, card) // Why is TSC demanding I assert here? 5/11/21 🤔
    } else {
      const userCards = new Map<string, Card>()
      userCards.set(card.dateStr, card)
      this.#db.set(card.userHandle, userCards)
    }
  }

  getCurrentStreak (userHandle: string): number {
    const userCards = this.#db.get(userHandle)
    return userCards?.size ?? 0
  }

  getCards (userHandle: string): Card[] {
    if (this.#db.has(userHandle)) {
      return Array.from(this.#db.get(userHandle)!.values()) // Why is TSC demanding I assert here? 5/11/21 🤔
    }
    return []
  }

  getCard (userHandle: string, dateStr: string): Card | null {
    return this.#db.get(userHandle)?.get(dateStr) ?? null
  }

  updateCard (userHandle: string, oldDateStr: string, newDateStr: string) {
    const card = this.#db.get(userHandle)?.get(oldDateStr)
    card!.created = new Date(newDateStr)
    this.#db.get(userHandle)?.set(newDateStr, card!)
    this.#db.get(userHandle)?.delete(oldDateStr)
  }
}
