import firebase from 'firebase/app'
import { ILog, TPassage } from '../widgets/Shared'

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

export async function getPassages (storyId: string): Promise<Array<TPassage>> {
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
