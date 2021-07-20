import firebase from 'firebase/app'
import { ILog, TPassage, TVote } from '../widgets/Shared'
import { AutoId } from '../lib/util'
import MMenuItem from '../models/MMenuItem'
import MStudyMember from '../models/MStudyMember'

/**
 * @param void
 * @returns a promise of studyMembers[]
 */
export async function getStudyMembers (): Promise<Array<MStudyMember>> {
  const qs = await firebase.firestore().collection('studyMembers').get()
  const studyMembers = qs.docs.map((doc: any) => {
    const o = doc.data()
    return {
      userFullname: o.Fullname,
      userHandle: o.Handle,
      startDateStr: o.StartDate,
      uid: o.Uid,
      repo: o.Repo,
      active: o.Active
    }
  })
  return studyMembers
}

/**
 * Queries firestore to get menu items.
 */
export async function getMenuItems (menuId: string): Promise<Array<MMenuItem>> {
  const doc = await firebase.firestore().collection('menus').doc(menuId).get()
  const menu = doc.data()!.menu as Array<MMenuItem>
  menu.sort((a: any, b: any) => (a.order > b.order) ? 1 : -1)
  return menu
}

/**
 * Queries firestore and returns the coronation results (vote tallies).
 * @returns
 */
export async function coronate (parentId: string): Promise<string> {
  const u = firebase.auth().currentUser
  if (u && parentId) {
    // console.log('>>>>> path:', `passages/${passageId}/votes`)
    const qs = await firebase.firestore().collection(`votingResults/${parentId}/votes`).get()
    const votingResults = qs.docs.map((doc: any) => {
      const o = Object.assign({}, doc.data())
      o.created = o.created.toDate()
      return o
    })
    return `Voting Results: ${JSON.stringify(votingResults, null, 2)}`
  }
  return 'Voting Results: Error!!'
}

/**
 * Deletes all votes that a User has cast for a parentId's candidates.
 * @param parentId
 */
export function deleteVotes (parentId: string): void {
  const u = firebase.auth().currentUser
  if (u) {
    firebase.firestore().collection(`votingResults/${parentId}/votes`)
      .where('user.uid', '==', u.uid).get().then(qs => {
        qs.forEach(doc => {
          doc.ref.delete()
        })
      }).catch((error) => {
        console.error('Error removing document: ', error)
      })
  }
}

/**
 * Returns a single voting result.
 * @param passageId
 * @param parentId
 * @returns
 */
export async function getVotingResult (passageId: string, parentId: string): Promise<TVote> {
  const u = firebase.auth().currentUser
  if (u && parentId) {
    // console.log('>>>>> path:', `passages/${passageId}/votes`)
    const qs = await firebase.firestore().collection(`votingResults/${parentId}/votes`)
      .where('user.uid', '==', u.uid)
      .where('passageId', '==', passageId)
      .get()
    const votingRecord = qs.docs.map((doc: any) => {
      const o = Object.assign({}, doc.data())
      o.created = o.created.toDate()
      return o
    })
    return votingRecord[0] ?? null
  }
  return null as unknown as TVote
}

export function vote (passageId: string, parentId: string, decision: string): void {
  const u = firebase.auth().currentUser
  if (u) {
    const vote = {
      id: AutoId.newId(),
      user: {
        uid: u.uid,
        displayName: u.displayName,
        photoUrl: u.photoURL
      },
      created: new Date(),
      decision: decision,
      passageId: passageId, // Necessary?
      parentId: parentId // Necessary?
    }

    firebase.firestore().collection(`votingResults/${parentId}/votes`).doc(vote.id)
      .set(vote, { merge: true }).then(() => {
        console.log('>> Vote written to Firestore!', vote)
      }).catch((error) => {
        console.error('Error writing vote to Firestore: ', error)
      })
  }
}

export function addPassage (passage: TPassage): void {
  const u = firebase.auth().currentUser
  if (u) {
    firebase.firestore().collection('passages').doc(passage.id)
      .set(passage, { merge: true }).then(() => {
        console.log('>> Passage written to Firestore!', passage)
      }).catch((error) => {
        console.error('Error writing passage to Firestore: ', error)
      })
  }
}

export async function getCandidatesByParent (parentId: string): Promise<Array<TPassage>> {
  const u = firebase.auth().currentUser
  // console.log('----------------- fire getPassages!', u)
  if (u) {
    const qs = await firebase.firestore().collection('passages')
      .where('parentId', '==', parentId)
      .orderBy('created', 'desc').get()
    const passages = qs.docs.map((doc: any) => {
      const p = Object.assign({}, doc.data())
      // console.log('>> p:', p)
      p.created = p.created.toDate()
      return p
    })
    return passages
  }
  return [] as Array<TPassage>
}

export async function getPassagesByStory (storyId: string): Promise<Array<TPassage>> {
  const u = firebase.auth().currentUser
  // console.log('----------------- fire getPassages!', u)
  if (u) {
    const qs = await firebase.firestore().collection('passages')
      .where('storyId', '==', storyId)
      .orderBy('created', 'desc').get()
    const passages = qs.docs.map((doc: any) => {
      const p = Object.assign({}, doc.data())
      // console.log('>> p:', p)
      p.created = p.created.toDate()
      return p
    })
    return passages
  }
  return [] as Array<TPassage>
}

export async function getLogs (limit: number) : Promise<Array<ILog>> {
  // console.log('----------------- fire getLogs!')
  const u = firebase.auth().currentUser
  if (u) {
    const qs = await firebase.firestore().collection(`users/${u.uid}/logs`)
      .orderBy('dt', 'desc').limit(limit).get()
    const logs = qs.docs.map((doc: any) => {
      const l = Object.assign({}, doc.data())
      // console.log('>> l:', l)
      l.dt = l.dt.toDate()
      l.created = l.created?.toDate() ?? null // Temporary; eventually all logs will have 'created' field
      return l
    })
    // console.log('------------------ Return results from db!', logs, user)
    return logs
  }
  const logs = [] as Array<ILog>
  return logs
}

export function writeLog (log: ILog): void {
  // console.log('>> Attempting to write log:', log)
  const u = firebase.auth().currentUser
  if (u) {
    firebase.firestore().collection(`users/${u.uid}/logs`).doc(log.id)
      .set(log, { merge: true }).then(() => {
        console.log('>> Log written to Firestore!', log)
      }).catch((error) => {
        console.error('Error writing log to Firestore: ', error)
      })
  }
}

export function deleteLog (logId: string) {
  const u = firebase.auth().currentUser
  if (u) {
    firebase.firestore().collection(`users/${u.uid}/logs`).doc(logId)
      .delete().then(() => {
        console.log('Log successfully deleted from Firestore!', u, logId)
      }).catch((error) => {
        console.error('Error removing log from Firestore: ', error)
      })
  }
}
