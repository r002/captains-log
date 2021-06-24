import { UserProgressDb, Tag } from '../models/UserProgress'
import * as util from '../lib/util'

export const uriAllCards = 'https://api.github.com/repos/studydash/cards/issues?milestone=1&sort=created&direction=desc&per_page=100'
// const uriAllCards0 = 'https://api.github.com/repos/studydash/cards/issues?milestone=1&sort=created&direction=desc&per_page=100&creator=r002'
// const uriAllCards1 = 'https://api.github.com/repos/studydash/cards/issues?milestone=1&sort=created&direction=desc&per_page=100&creator=anitabe404'
// const uriAllCards2 = 'https://api.github.com/repos/studydash/cards/issues?milestone=1&sort=created&direction=desc&per_page=100&creator=shazahuang'

export type StudyMember = {
  userFullname: string
  userHandle: string
  startDateStr: string
  uid: string
  repo: string
  active: boolean
}

export const studyMembers: StudyMember[] = [
  {
    userFullname: 'Robert Lin',
    userHandle: 'r002',
    startDateStr: '2021-05-03T04:00:00Z',
    uid: '45280066',
    repo: 'https://github.com/studydash/cards',
    active: true
  },
  {
    userFullname: 'Anita Beauchamp',
    userHandle: 'anitabe404',
    startDateStr: '2021-05-04T04:00:00Z',
    uid: '9167395',
    repo: 'https://github.com/studydash/cards',
    active: true
  },
  {
    userFullname: 'Matthew Curcio',
    userHandle: 'mccurcio',
    startDateStr: '2021-05-10T04:00:00Z',
    uid: '1915749',
    repo: 'https://github.com/studydash/cards',
    active: false
  },
  {
    userFullname: 'Shaza Huang',
    userHandle: 'shazahuang',
    startDateStr: '2021-06-18T04:00:00Z',
    uid: '85973779',
    repo: 'https://github.com/studydash/cards',
    active: true
  }
]

export const tagMap = new Map<string, Tag>()
tagMap.set('movie trailer', {
  name: 'movie trailer',
  icon: '🎬'
})
tagMap.set('tv show', {
  name: 'tv show',
  icon: '📺'
})
tagMap.set('youtube', {
  name: 'youtube',
  icon: '▶'
})
tagMap.set('reading', {
  name: 'reading',
  icon: '📖'
})
tagMap.set('life', {
  name: 'life',
  icon: '🌳'
})
tagMap.set('travel', {
  name: 'travel',
  icon: '🛸'
})
tagMap.set('podcast notes', {
  name: 'podcast notes',
  icon: '🎙'
})

export async function getUpDb (d: Date): Promise<UserProgressDb> {
  const upDb = new UserProgressDb()
  for (const member of studyMembers) {
    upDb.addUser(member)
  }

  const fetchCards = await fetch(uriAllCards + '&labels=' + util.getPeriod(d))
  const allCards = await fetchCards.json()
  for (const item of allCards) {
    // Ad-hoc code to adjust dates of Anita's cards - 5/11/21
    // This is a total hack. Write a proper `updateCard(...)` method later
    if (item.number === 16) {
      item.created_at = '2021-05-08T04:00:00Z'
    } else if (item.number === 19) {
      item.created_at = '2021-05-09T04:00:00Z'
    } else if (item.number === 22) {
      item.created_at = '2021-05-10T04:00:00Z'
    }

    const tags = [] as Tag[]
    for (const label of item.labels) {
      if (tagMap.has(label.name)) {
        tags.push(tagMap.get(label.name)!) // Why is assertion required here? 5/20/21
      }
    }

    const cardInput = {
      title: item.title,
      userHandle: item.user.login,
      number: item.number,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
      tags: tags,
      comments: item.comments
    }
    upDb.getUser(cardInput.userHandle)!.setCard(cardInput)
  }
  return upDb
}
