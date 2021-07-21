import { UserProgressDb, Tag } from '../models/UserProgress'
import * as util from '../lib/util'
import { getStudyMembers } from './FirestoreApi'

export const uriAllCards = 'https://api.github.com/repos/studydash/cards/issues?milestone=1&sort=created&direction=desc&per_page=100'
// const uriAllCards0 = 'https://api.github.com/repos/studydash/cards/issues?milestone=1&sort=created&direction=desc&per_page=100&creator=r002'
// const uriAllCards1 = 'https://api.github.com/repos/studydash/cards/issues?milestone=1&sort=created&direction=desc&per_page=100&creator=anitabe404'
// const uriAllCards2 = 'https://api.github.com/repos/studydash/cards/issues?milestone=1&sort=created&direction=desc&per_page=100&creator=shazahuang'

// const dayCodes = ['U', 'M', 'T', 'W', 'H', 'F', 'S']

// Render a member's record for the past 12 weeks * 7 days = 84 times
export function RenderRecord (record: Map<string, number>, startDate: string): string {
  const dateCursor = new Date()
  let s = ''
  for (let i = 0; i < 7 * 12; i++) {
    // Demarcate weeks on "Saturday | Sunday"
    const weekBar = dateCursor.getDay() === 0 ? '|' : '' // Is it Sunday? If so, prefix with '|' to start a new week
    if (record.has(util.getYearMonthDay(dateCursor))) {
      s = weekBar + '*' + s
      // s = dayCodes[dateCursor.getDay()] + s
    } else {
      if (i === 0) { // It is today
        s = weekBar + '_' + s
      } else {
        s = weekBar + '❌' + s // a 'missed' day
      }
    }
    dateCursor.setTime(dateCursor.getTime() - 86400 * 1000) // 86400 seconds in 24 hours

    if (dateCursor.getTime() < Date.parse(startDate)) {
      break
    }
  }
  return s.replace(/^\|/g, '') // Trim any leading '|' from final output
}

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

// Experimental; remove this later. Keeping here for future reference. 7/8/21
// export async function getNumberOfCommentsPerCard (cardNo: number) {
//   const url = `https://api.github.com/repos/studydash/cards/issues/${cardNo}/comments`
//   const fetchTimeline = await fetch(url, {
//     // headers: {
//     //   Accept: 'application/vnd.github.mockingbird-preview+json'
//     // }
//   })
//   const rs = await fetchTimeline.json()
//   console.log('>>rs', rs)
// }

export async function getUpDb (d: Date): Promise<UserProgressDb> {
  const upDb = new UserProgressDb()
  const members = await getStudyMembers()

  for (const member of members) {
    upDb.addUser(member)
  }

  const fetchCards = await fetch(uriAllCards + '&labels=' + util.getPeriod(d))
  const allCards = await fetchCards.json()
  for (const item of allCards) {
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
