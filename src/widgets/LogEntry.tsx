import styled from 'styled-components'
import React, { useEffect, useState, useContext } from 'react'
import { UserContext } from '../providers/AuthContext'
import { getLogs, writeLog, deleteLog } from '../services/FirestoreApi'
import { FormattedDt, ILog } from './Shared'
import { LogViewer } from './LogViewer'
import { parseInput } from '../services/InputEngine'
import { DataContext, TActivityUpdate, TDateUpdate } from '../providers/DataContext'

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
  const [selectedLog, setSelectedLog] = useState<string | null>(null)
  const [dataContext] = useState({
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    updateDate: updateDateImpl,
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    updateActivity: updateActivityImpl,
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    deleteLog: deleteLogImpl
  })

  function updateDateImpl ({ logId, newDate }: TDateUpdate): void {
    setLogs(oldLogs => {
      const oldLog = oldLogs.filter(log => log.id === logId)[0]
      const newLogs = oldLogs.filter(log => log.id !== logId)
      const newLog = Object.assign({}, oldLog)
      newLog.dt = newDate // Only update the dt field
      writeLog(newLog)
      newLogs.push(newLog)
      newLogs.sort((a: any, b: any) => b.dt - a.dt) // Sorts logs by dt in desc order (newest->oldest)
      return newLogs
    })
  }

  function updateActivityImpl ({ logId, newActivity }: TActivityUpdate): void {
    console.log('>> calling updateActivityImpl!', logId, newActivity)
    setLogs(oldLogs => {
      const oldLog = oldLogs.filter(log => log.id === logId)[0]
      const newLogs = oldLogs.filter(log => log.id !== logId)
      const newLog = Object.assign({}, oldLog)
      newLog.activity = newActivity // Only update the activity field
      writeLog(newLog)
      newLogs.push(newLog)
      newLogs.sort((a: any, b: any) => b.dt - a.dt) // Sorts logs by dt in desc order (newest->oldest)
      return newLogs
    })
  }

  function deleteLogImpl (logIdToDelete: string): void {
    console.log('>> calling deleteLogImpl!', logIdToDelete)
    deleteLog(logIdToDelete)
    setLogs(oldLogs => oldLogs.filter(log => log.id !== logIdToDelete))
  }

  if (logs.length > 0) {
    // console.log('>> LogViewer.selectedLog before', selectedLog)
    if (selectedLog === null) {
      setSelectedLog(logs[0].id)
    }
    // console.log('>> LogViewer.selectedLog after', selectedLog)
  }

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
    <DataContext.Provider value={dataContext}>
      <Box>
        <Prompt><span title='Robert Shell 😄'>RS</span> <Ticker /></Prompt>
        $ <LogInput autoFocus={true} value={activity} onChange={handleChange} onKeyDown={addLog}></LogInput>
      </Box>
      <br /><br />
      <hr />
      <br /><br />
      <LogViewer logs={logs} selectedLog={selectedLog} />
    </DataContext.Provider>
  )
}
