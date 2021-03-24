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

const MetaLog = ({ content }: {content: string}) => {
  return (
    <FLogRecord background='purple' type='meta'>
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

/**
 * Loop through all raw logs once to add MetaLogs. Happens first.
 * @param logs
 * @returns
 */
function processLogs (logs: Array<ILog>): Array<any> {
  // 1. Loop through all logs and add day breaks
  const processedLogs = [] as any
  let curDate = logs[0].dt
  console.log('*******cur date:', curDate)

  for (const log of logs) {
    if (log.dt.toString().slice(0, 15) !== curDate.toString().slice(0, 15)) {
      // Push a MetaLog into the array
      const metaLog = {
        type: 'MetaLog',
        content: `A NEW DAY!! ${curDate.toString().slice(0, 15)}`
      }
      processedLogs.push(metaLog)
      // processedLogs.push({ dt: curDate, activity: `A NEW DAY!! ${curDate.toString().slice(0, 15)}` })
      curDate = log.dt
    }

    const activityLog = {
      type: 'ActivityLog',
      dt: log.dt,
      activity: log.activity
    }
    processedLogs.push(activityLog)
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
