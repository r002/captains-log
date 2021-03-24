import styled, { css } from 'styled-components'
import { FormattedDt, ILog } from './Shared'
import { UserContext } from '../providers/AuthContext'
import { useContext, useEffect, useState } from 'react'

interface IFlog {
  readonly background?: string
  readonly type?: string
}

const FLogRecord = styled.div<IFlog>`
  padding: 10px;
  width: 900px;
  background: darkblue;
  color: white;
  box-sizing: border-box;
  border: solid darkgray 1px;

  ${props => props.background && css`
    background: ${props.background};
  `}

  ${props => props.type === 'meta' && css`
    height: 70px;
    text-align: center;
  `}
`

const MetaLog = ({ title, content }: {title: string, content: string}) => {
  return (
    <FLogRecord background='purple' type='meta'>
      😴 {title} 🌙<br />
      {content}
    </FLogRecord>
  )
}

const ActivityLog = ({ dt, activity, bg }: {dt: Date, activity: string, bg: string}) => {
  return (
    <FLogRecord title={dt.toString()} background={bg}>
      {FormattedDt(dt)} :: {activity}
    </FLogRecord>
  )
}

// https://stackoverflow.com/questions/19700283/how-to-convert-time-milliseconds-to-hours-min-sec-format-in-javascript
function msToTime (ms: number): string {
  let seconds: any = Math.floor((ms / 1000) % 60)
  let minutes: any = Math.floor((ms / (1000 * 60)) % 60)
  let hours: any = Math.floor((ms / (1000 * 60 * 60)) % 24)

  hours = (hours < 10) ? '0' + hours : hours
  minutes = (minutes < 10) ? '0' + minutes : minutes
  seconds = (seconds < 10) ? '0' + seconds : seconds

  return hours + ':' + minutes + ':' + seconds
}

/**
 * Loop through all raw logs once to add MetaLogs. Happens first.
 * @param logs
 * @returns
 */
function processLogs (logs: Array<ILog>): Array<any> {
  const processedLogs = [] as any

  for (const [i, log] of logs.entries()) {
    const activityLog = {
      type: 'ActivityLog',
      dt: log.dt,
      activity: log.activity
    }
    processedLogs.push(activityLog)

    if (log.activity.toLowerCase() === 'wake up') {
      const sleepDuration = log.dt.getTime() - logs[i + 1].dt.getTime()
      const nightBefore = new Date(log.dt.getTime() - 1 * 24 * 60 * 60 * 1000)
      const metaLog = {
        type: 'MetaLog',
        title: nightBefore.toString().slice(0, 15),
        content: `Slept: ${msToTime(sleepDuration)}`
      }
      processedLogs.push(metaLog)
    }
  }
  return processedLogs // Return an array of RenderItems PLUS additional data.
}

/**
 * Loop through all processed logs to generate the render markup. Happens second.
 * @param logs
 * @returns
 */
function renderLogs (items: Array<any>, bg: string): Array<any> {
  console.log('{{{{}}}} logs first/last item:', items[0], items.slice(-1)[0])
  const renderItems = [] as any
  for (const [i, item] of items.entries()) {
    if (item.type === 'MetaLog') {
      renderItems.push(<MetaLog key={'ri' + i} {...item} />)
    } else {
      renderItems.push(<ActivityLog key={'ri' + i} {...item} bg={bg} />)
    }
  }
  return renderItems
}

export const LogViewer = ({ logs }: {logs: Array<ILog>}) => {
  const { user } = useContext(UserContext)
  const [pLogs, setPLogs] = useState([] as Array<any>) // processed logs

  useEffect(() => {
    if (logs.length > 0) {
      if (user) {
        const processedLogs = processLogs(logs)
        setPLogs(renderLogs(processedLogs, 'darkblue')) // Saved logs
      } else {
        setPLogs(renderLogs(logs, '#00468b')) // Unsaved logs
      }

      // console.log('>> fired useEffect, pl:', pl)
    } else {
      setPLogs([])
    }
  }, [logs])

  return (
    <>
      {pLogs}
      {/* {pLogs.map((l: ILog, i: number) => <LogRecord key={'log' + i} {...l} saved={!!user} />)} */}
      {/* {pLogs.map((l: ILog, i: number) => <LogRecord key={'log' + i} dt={l.dt} activity={l.activity} saved={!!user} />)} */}
    </>
  )
}
