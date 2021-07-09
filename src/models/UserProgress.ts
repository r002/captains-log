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
  _cardsByDate = new Map<string, Card>() // Index key: Eg. '7/8/2021'
  _cardsByNo = new Map<number, Card>() // Index key: Eg. 185
  _streakCurrent = 0
  _missedDays = 0

  constructor (props: TUserInput) {
    this.userFullname = props.userFullname
    this.userHandle = props.userHandle
    this.startDate = new Date(props.startDateStr)
  }

  setCard (cardInput: TCardInput) {
    const card = new Card(cardInput)
    this._cardsByDate.set(card.createdStr, card)
    this._cardsByNo.set(card.number, card)
  }

  getCardByDate (dateStr: string) {
    return this._cardsByDate.get(dateStr)
  }

  getCardByNo (cardNo: number) {
    return this._cardsByNo.get(cardNo)
  }

  incrementComments (cardNo: number) {
    this._cardsByNo.get(cardNo)!.comments++
  }

  decrementComments (cardNo: number) {
    this._cardsByNo.get(cardNo)!.comments--
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
