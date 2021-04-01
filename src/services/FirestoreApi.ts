import firebase from 'firebase/app'
import { ILog } from '../widgets/Shared'

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
