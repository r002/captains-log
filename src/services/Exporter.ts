import { getLogs } from './FirestoreApi'

export function exportLogs (limit: number) {
  getLogs(limit).then(logs => {
    console.log('>> number of logs to export:', logs.length)
  })
}
