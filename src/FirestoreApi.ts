import firebase from 'firebase/app'
import { ILog } from './widgets/Shared'

export async function getLogs (user: firebase.User) : Promise<Array<ILog>> {
  // console.log('----------------- fire getLogs!')

  const qs = await firebase.firestore().collection(`users/${user.uid}/logs`)
    .orderBy('dt', 'desc').limit(100).get()
  const logs = qs.docs.map((doc: any) => (
    {
      id: doc.id,
      dt: doc.data().dt.toDate(),
      activity: doc.data().activity
    }))
  // console.log('------------------ Return results from db!', logs, user)
  return logs
}

export function writeLog (log: ILog): void {
  const u = firebase.auth().currentUser
  if (u) {
    firebase.firestore().collection(`users/${u.uid}/logs`).doc(log.id)
      .set(log).then(() => {
        console.log('>> Log written to Firestore!', log)
      }).catch((error) => {
        console.error('Error writing log to Firestore: ', error)
      })
  }
}

export function updateLog (log: ILog): void {
  const u = firebase.auth().currentUser
  if (u) {
    firebase.firestore().collection(`users/${u.uid}/logs`).doc(log.id)
      .update({
        id: log.id,
        activity: log.activity
      }).then(() => {
        console.log('>> Log updated Firestore!', log)
      }).catch((error) => {
        console.error('Error updating log in Firestore: ', error)
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
