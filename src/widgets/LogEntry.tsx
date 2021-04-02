import styled from 'styled-components'
import React, { useEffect, useState, useContext } from 'react'
import { UserContext } from '../providers/AuthContext'
import { getLogs, writeLog, deleteLog } from '../services/FirestoreApi'
import { FormattedDt, ILog } from './Shared'
import { LogViewer } from './LogViewer'
import { parseInput } from '../services/InputEngine'

const Box = styled.div`
  padding: 20px;
  width: 100%;
  background: black;
  color: lightgrey;
  box-sizing: border-box;
  border: solid darkgray 1px;
  line-height: 1.6;
  font-size: 22px;
`

const Prompt = styled.div`
  font-size: 16px;
  margin-bottom: 10px;
`

const LogInput = styled.input`
  width: 900px;
  font-size: 22px;
  background: black;
  color: lightgrey;
  border: none;
  outline: none;
`

const Ticker = () => {
  const [dt, setDt] = useState(new Date())

  function tick () {
    setDt(new Date())
  }

  useEffect(() => {
    const interval = setInterval(() => tick(), 1000) // (* 60) Update every minute
    return () => {
      clearInterval(interval)
    }
  }, [])

  return (
    <>
      <FormattedDt date={dt} includeSeconds={true} />
    </>
  )
}

export const LogEntry = () => {
  // console.log('🚀🚀 LogEntry BEGIN rendering')

  const [activity, setActivity] = useState('')
  const { user } = useContext(UserContext)
  const [logs, setLogs] = useState([] as Array<ILog>)

  function listenForLogAction (event: Event) {
    const e = event as CustomEvent
    // console.log('^^^^^^^^^ global message received!', e)

    switch (e.detail.action) {
      case 'deleteLog':
        deleteLog(e.detail.logId)
        setLogs(oldLogs => oldLogs.filter(log => log.id !== e.detail.logId))
        console.log('^^^^^^^^^deleteLog called! Log removed from local view', e.detail)
        break
      case 'updateActivity':
        setLogs(oldLogs => {
          const oldLog = oldLogs.filter(log => log.id === e.detail.logId)[0]
          const newLogs = oldLogs.filter(log => log.id !== e.detail.logId)
          const newLog = Object.assign({}, oldLog)
          newLog.activity = e.detail.newActivity // Only update the activity field
          writeLog(newLog)
          newLogs.push(newLog)
          newLogs.sort((a: any, b: any) => b.dt - a.dt) // Sorts logs by dt in desc order (newest->oldest)
          return newLogs
        })
        console.log('^^^^^^^^^updateActivity called! Log updated in local view', e.detail)
        break
      case 'updateDt':
        setLogs(oldLogs => {
          const oldLog = oldLogs.filter(log => log.id === e.detail.logId)[0]
          const newLogs = oldLogs.filter(log => log.id !== e.detail.logId)
          const newLog = Object.assign({}, oldLog)
          newLog.dt = e.detail.newDate // Only update the dt field
          writeLog(newLog)
          newLogs.push(newLog)
          newLogs.sort((a: any, b: any) => b.dt - a.dt) // Sorts logs by dt in desc order (newest->oldest)
          return newLogs
        })
        console.log('^^^^^^^^^updateDt called! Log updated in local view', e.detail)
        break
    }
  }

  useEffect(() => {
    document.body.addEventListener('logAction', listenForLogAction, false)
    return () => {
      document.body.removeEventListener('logAction', listenForLogAction)
    }
  }, [])

  // Initial load logs from db if user signs in
  useEffect(() => {
    // console.log('******** LogEntry fire useEffect', user)
    if (user) {
      getLogs(50).then(logsFromDb => {
        if (logs.length === 0 || logs.length + logsFromDb.length > logsFromDb.length) {
          // If user has written logs anonymously, first write the unsaved logs to Firestore
          for (const log of logs) {
            writeLog(log)
            console.log('>> write unsaved log to firestore', log)
          }
          // Now update the logs with any from the db. This will update the view.
          setLogs(oldLogs => [
            ...oldLogs,
            ...logsFromDb
          ])
        }
      })
    } else {
      // console.log('&&&&& LogEntry User has logged out; clear logs', user)
      setLogs([])
    }
  }, [user])

  function handleChange (e: React.FormEvent<HTMLInputElement>) {
    setActivity(e.currentTarget.value)
  }

  function addLog (e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      parseInput(activity).then(newLog => {
        setLogs((oldLogs: Array<ILog>) => [
          newLog,
          ...oldLogs]
        )
        setActivity('')
        writeLog(newLog)
      })
    }
  }

  // console.log('🚀🚀🚀🚀 LogEntry FINISHED rendering', logs, user)
  return (
    <>
      <Box>
        <Prompt><span title='Robert Shell 😄'>RS</span> <Ticker /></Prompt>
        $ <LogInput autoFocus={true} value={activity} onChange={handleChange} onKeyDown={addLog}></LogInput>
      </Box>
      <br /><br />
      <hr />
      <br /><br />
      <LogViewer logs={logs} />
    </>
  )
}
