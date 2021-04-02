import { getLogs } from './FirestoreApi'

export function exportLogs (limit: number) {
  getLogs(limit).then(logs => {
    console.log('>> number of logs to export:', logs.length)

    const blob = new Blob([JSON.stringify(logs, null, 2) + '\n'], { type: 'text/plain' })
    const url = window.URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `clog__${Date().slice(0, 21)}.json`
    anchor.click()
  })
}
