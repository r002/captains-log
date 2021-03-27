import styled, { css } from 'styled-components'
import { FormattedDt, ILog } from './Shared'
import { UserContext } from '../providers/AuthContext'
import React, { useContext, useEffect, useState, useRef, MutableRefObject } from 'react'
import { msToTime } from '../lib/util'

interface IFlog {
  readonly background?: string
  readonly type?: string
}

const FLogRecord = styled.div<IFlog>`
  padding: 10px;
  width: 900px;
  /* background: darkblue; */
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

const FDuration = styled.div`
  font-size: 20px;
`

const Grey = styled.span`
color: grey;
`

const Duration = ({ hours, minutes }: {hours: number, minutes: number}) => {
  return (
    <FDuration>{hours} <Grey>hr</Grey> {minutes} <Grey>min</Grey></FDuration>
  )
}

const DurationLog = ({ title, hours, minutes }: {title: string, hours: number, minutes: number}) => {
  return (
    <FLogRecord background='purple' type='meta'>
      ⌛ {title} 🕒<br />
      <Duration hours={hours} minutes={minutes} />
    </FLogRecord>
  )
}

const SleepLog = ({ title, hours, minutes }: {title: string, hours: number, minutes: number}) => {
  return (
    <FLogRecord background='#292929' type='meta'>
      😴 {title} 🌙<br />
      <Duration hours={hours} minutes={minutes} />
    </FLogRecord>
  )
}

const ActivityLogInput = styled.input`
  background: transparent;
  border: none;
  outline: none;
  color: lightgrey;
  width: 500px;
`

type TActivityLog = ILog & {
  bg: string
}

// const ActivityLog = ({ id, dt, activity, bg }: {id: string, dt: Date, activity: string, bg: string}) => {
const ActivityLog = ({ id, dt, activity, bg }: TActivityLog) => {
  const [editable, setEditable] = useState(false)
  const [newActivity, setNewActivity] = useState(activity)
  const inputEl = useRef() as MutableRefObject<HTMLInputElement>

  function handleDeleteAction (e: React.MouseEvent<HTMLElement>) { // React.MouseEvent<HTMLButtonElement>
    // console.log('>>>>>>>>> handleLogMutation fired! e.target.id:', e)
    const customEvent = new CustomEvent('globalListener', {
      detail: {
        logId: e.currentTarget.id,
        action: e.currentTarget.dataset.action
      }
    })
    document.body.dispatchEvent(customEvent)
  }

  function handleEditAction () {
    setEditable(!editable)
  }

  function handleChange (e: React.FormEvent<HTMLInputElement>) {
    setNewActivity(e.currentTarget.value)
  }

  function updateLog (e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      const customEvent = new CustomEvent('globalListener', {
        detail: {
          logId: e.currentTarget.dataset.logid,
          newActivity: newActivity,
          action: 'updateLog'
        }
      })
      document.body.dispatchEvent(customEvent)
      setEditable(!editable)
    }
  }

  useEffect(() => {
    if (editable) {
      inputEl.current.focus()
      inputEl.current.select()
    }
  }, [editable])

  useEffect(() => {
    setNewActivity(activity)
  }, [activity])

  return (
    <FLogRecord title={dt.toString()} background={bg}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ background: 'transparent' }}>
          {FormattedDt(dt, false)} :: {editable
            ? <ActivityLogInput data-logid={id} ref={inputEl} type="text" value={newActivity} onChange={handleChange}
                onKeyDown={updateLog} style={{ background: 'transparent' }} />
            : <ActivityLogInput type="text" value={activity} readOnly={true} onDoubleClick={handleEditAction} style={{ cursor: 'pointer' }} />
          }
        </div>
        <div style={{ background: 'transparent' }}>
          {/* <span data-action='editLog' id={id} onClick={handleEditAction} style={{ cursor: 'pointer' }}>📝</span>&nbsp; */}
          <span data-action='deleteLog' id={id} onClick={handleDeleteAction} style={{ cursor: 'pointer' }}>❌</span>
        </div>
      </div>
    </FLogRecord>
  )
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
      id: log.id,
      dt: log.dt,
      activity: log.activity
    }
    processedLogs.push(activityLog) // Add the activity log first.

    // https://eslint.org/docs/rules/no-case-declarations
    switch (log.activity.toLowerCase()) {
      case 'wake up': {
        const coeff = 1000 * 60 // Round times to the nearest minute
        const endTime = new Date(Math.round(log.dt.getTime() / coeff) * coeff)
        const startTime = new Date(Math.round(logs[i + 1].dt.getTime() / coeff) * coeff) // TODO: Possible IooB error here!
        const sleepDuration = endTime.getTime() - startTime.getTime()
        const sleepObj = msToTime(sleepDuration)
        const nightBefore = new Date(log.dt.getTime() - 1 * 24 * 60 * 60 * 1000)
        const sleepLog = {
          type: 'SleepLog',
          title: nightBefore.toString().slice(0, 15),
          hours: sleepObj.hours,
          minutes: sleepObj.minutes
        }
        processedLogs.push(sleepLog)
        break
      }
      case 'return':
      case 'finish': {
        const coeff = 1000 * 60 // Round times to the nearest minute
        const endTime = new Date(Math.round(log.dt.getTime() / coeff) * coeff)
        const startTime = new Date(Math.round(logs[i + 1].dt.getTime() / coeff) * coeff)
        const duration = endTime.getTime() - startTime.getTime()
        const activityLog = logs[i + 1].activity.toLowerCase()
        const activity = /.*\s(?<name>.*)$/.exec(activityLog)
        let activityName = activity?.groups?.name ?? 'Error!!!!'
        activityName = activityName.charAt(0).toUpperCase() + activityName.slice(1)
        const o = msToTime(duration)
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
  return processedLogs // Return an array of RenderItems PLUS additional data.
}

/**
 * Loop through all processed logs to generate the render markup. Happens second.
 * @param logs
 * @returns
 */
function renderLogs (items: Array<any>, bg: string): Array<any> {
  // console.log('{{{{}}}} logs first/last item:', items[0], items.slice(-1)[0])
  const renderItems = [] as any

  for (const [i, item] of items.entries()) {
    switch (item.type) {
      case 'DurationLog':
        renderItems.push(<DurationLog key={'ri' + i} {...item} />)
        break
      case 'SleepLog':
        renderItems.push(<SleepLog key={'ri' + i} {...item} />)
        break
      case 'ActivityLog':
      default:
        renderItems.push(<ActivityLog key={'ri' + i} {...item} bg={bg} />)
        break
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
      setPLogs([]) // If logs arrives here empty, it means the user has logged out. Clear all logs from viewer.
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
