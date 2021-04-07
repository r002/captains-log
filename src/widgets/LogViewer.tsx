import { ILog } from './Shared'
import { UserContext } from '../providers/AuthContext'
import { useContext, useEffect, useState } from 'react'
import { msToTime } from '../lib/util'
import DurationLog from './LogTypes/DurationLog'
import SleepLog from './LogTypes/SleepLog'
import ActivityLog from './LogTypes/ActivityLog'
import YoutubeLog from './LogTypes/YoutubeLog'

/**
 * Loop through all raw logs once to add MetaLogs. Happens first.
 * @param logs
 * @returns
 */
function processLogs (logs: Array<ILog>): Array<any> {
  const processedLogs = [] as any // TODO: Decalre a type here! 3/31/21

  for (let i = 0; i < logs.length - 1; i++) {
    const log = logs[i]
    if (log.type === 'YoutubeLog') {
      const youtubeLog = {
        type: 'YoutubeLog',
        id: log.id,
        dt: log.dt,
        vidTitle: log.vidTitle,
        vid: log.vid
      }
      processedLogs.push(youtubeLog)
    } else {
      const activityLog = {
        type: 'ActivityLog',
        id: log.id,
        dt: log.dt,
        activity: log.activity
      }
      processedLogs.push(activityLog) // Add the activity log first.

      switch (log.activity.toLowerCase()) {
        case 'wake up': {
          const coeff = 1000 * 60 // Round times to the nearest minute
          const endTime = new Date(Math.floor(log.dt.getTime() / coeff) * coeff)
          const startTime = new Date(Math.floor(logs[i + 1].dt.getTime() / coeff) * coeff)
          const duration = endTime.getTime() - startTime.getTime()
          const o = msToTime(duration)
          const nightBefore = new Date(log.dt.getTime() - 1 * 24 * 60 * 60 * 1000)
          const sleepLog = {
            type: 'SleepLog',
            title: nightBefore.toString().slice(0, 15),
            hours: o.hours,
            minutes: o.minutes
          }
          processedLogs.push(sleepLog)
          break
        }
        case 'return':
        case 'finish': {
          const coeff = 1000 * 60 // Round times to the nearest minute
          const endTime = new Date(Math.floor(log.dt.getTime() / coeff) * coeff)
          const startTime = new Date(Math.floor(logs[i + 1].dt.getTime() / coeff) * coeff)
          const duration = endTime.getTime() - startTime.getTime()
          const o = msToTime(duration)
          const activityLog = logs[i + 1].activity.toLowerCase()
          const activity = /.*\s(?<name>.*)$/.exec(activityLog)
          let activityName = activity?.groups?.name ?? 'Error!!!!'
          activityName = activityName.charAt(0).toUpperCase() + activityName.slice(1)
          const durationLog = {
            type: 'DurationLog',
            title: activityName,
            hours: o.hours,
            minutes: o.minutes
          }
          processedLogs.push(durationLog)
          break
        }
      }
    }
  }
  return processedLogs // Return an array of RenderItems PLUS additional data.
}

/**
 * Loop through all processed logs to generate the render markup. Happens second.
 * @param logs
 * @returns
 */
function renderLogs (items: Array<any>, bg: string, selectedLog: string | null): Array<any> {
  // console.log('{{{{}}}} logs first/last item:', items[0], items.slice(-1)[0])
  const renderItems = [] as any

  // console.log('>> selectedLog', selectedLog)
  for (const [i, item] of items.entries()) {
    const selected = item.id === selectedLog

    switch (item.type) {
      case 'DurationLog':
        renderItems.push(<DurationLog key={'ri' + i} {...item} />)
        break
      case 'SleepLog':
        renderItems.push(<SleepLog key={'ri' + i} {...item} />)
        break
      case 'YoutubeLog':
        renderItems.push(<YoutubeLog key={'ri' + i} {...item} bg={bg} selected={selected} />)
        break
      case 'ActivityLog':
      default:
        renderItems.push(<ActivityLog key={'ri' + i} {...item} bg={bg} selected={selected} />)
        break
    }
  }
  return renderItems
}

export const LogViewer = ({ logs, selectedLog }: {logs: Array<ILog>, selectedLog: string}) => {
  const { user } = useContext(UserContext)
  const [renderItems, setRenderItems] = useState([] as Array<any>)

  useEffect(() => {
    if (logs.length > 0) {
      if (user) {
        const processedLogs = processLogs(logs)
        setRenderItems(renderLogs(processedLogs, 'darkblue', selectedLog)) // Saved logs
      } else {
        setRenderItems(renderLogs(logs, '#00468b', selectedLog)) // Unsaved logs
      }

      // console.log('>> fired useEffect, pl:', pl)
    } else {
      setRenderItems([]) // If logs arrive here empty, it means the user has logged out. Clear all logs from viewer.
    }
  }, [logs, selectedLog])

  return (
    <div>
      {renderItems}
      {/* {pLogs.map((l: ILog, i: number) => <LogRecord key={'log' + i} {...l} saved={!!user} />)} */}
      {/* {pLogs.map((l: ILog, i: number) => <LogRecord key={'log' + i} dt={l.dt} activity={l.activity} saved={!!user} />)} */}
    </div>
  )
}
