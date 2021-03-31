import firebase from 'firebase/app'
import { ILog } from '../widgets/Shared'

export async function getLogs (user: firebase.User) : Promise<Array<ILog>> {
  // console.log('----------------- fire getLogs!')

  const qs = await firebase.firestore().collection(`users/${user.uid}/logs`)
    .orderBy('dt', 'desc').limit(50).get()
  const logs = qs.docs.map((doc: any) => (
    {
      id: doc.id,
      dt: doc.data().dt.toDate(),
      activity: doc.data().activity,
      type: doc.data().type,
      created: doc.data().created?.toDate() ?? null, // Temporary. Eventually, all logs will have 'created' field 3/30/21
      command: doc.data().command,
      rawInput: doc.data().rawInput,
      vidTitle: doc.data().vidTitle,
      url: doc.data().url
    }))
  // console.log('------------------ Return results from db!', logs, user)
  return logs
}

export function writeLog (log: ILog): void {
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
