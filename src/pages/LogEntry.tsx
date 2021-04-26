import styled from 'styled-components'
import React, { useEffect, useState, useContext } from 'react'
import { UserContext } from '../providers/AuthContext'
import { getLogs, writeLog, deleteLog } from '../services/FirestoreApi'
import { FormattedDt, ILog } from '../widgets/Shared'
import { LogViewer } from '../widgets/LogViewer'
import { parseInput } from '../services/InputEngine'
import { DataContext, TActivityUpdate, TDateUpdate } from '../providers/DataContext'
import YoutubePane from '../widgets/DetailPanes/YoutubePane'
import SummaryPane from '../widgets/DetailPanes/SummaryPane'

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

const useDataContext = (setLogs: React.Dispatch<React.SetStateAction<ILog[]>>,
  setSelectedLog: React.Dispatch<React.SetStateAction<string>>) => {
  const [dataContext] = useState({
    updateDate: updateDateImpl,
    updateActivity: updateActivityImpl,
    deleteLog: deleteLogImpl,
    selectLog: selectLogImpl
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

  function selectLogImpl (logIdToSelect: string): void {
    console.log('>> calling selectLogImpl!', logIdToSelect)
    setSelectedLog(logIdToSelect)
  }

  return dataContext
}

const useInitialLoad = (setLogs: React.Dispatch<React.SetStateAction<ILog[]>>,
  logs: ILog[], user: any, addLog: any) => {
  // Initial load logs from db if user signs in
  useEffect(() => {
    // console.log('******** LogEntry fire useEffect', user)
    if (user) {
      getLogs(50).then(logsFromDb => {
        // Only save the WelcomeLog to the user's account if they've never saved any logs before.
        if (logsFromDb.length > 0) {
          logs.pop() // Remove WelcomeLog -- always the last element!
        }

        if (logs.length > 0) {
          // If user has written logs anonymously, first write the unsaved logs to Firestore
          for (const log of logs) {
            writeLog(log)
            console.log('>> write unsaved log to firestore', log)
          }
        }
        // Now update the logs with any from the db. This will update the view.
        setLogs(logs => [
          ...logs,
          ...logsFromDb
        ])
      })
    } else {
      // console.log('&&&&& LogEntry User has logged out; clear logs', user)
      setLogs([])
      addLog('watch https://www.youtube.com/watch?v=dQw4w9WgXcQ') // Default "WelcomeLog"
    }
  }, [user])
}

const LogEntry = () => {
  // console.log('🚀🚀 LogEntry BEGIN rendering')

  const [activity, setActivity] = useState('')
  const { user } = useContext(UserContext)
  const [logs, setLogs] = useState([] as Array<ILog>)
  const [selectedLog, setSelectedLog] = useState<string>('')
  const dataContext = useDataContext(setLogs, setSelectedLog)

  // console.log('🚀🚀 selectedLog, user, logs:', selectedLog, user, logs)
  useInitialLoad(setLogs, logs, user, addLog)

  function handleChange (e: React.FormEvent<HTMLInputElement>) {
    setActivity(e.currentTarget.value)
  }

  function handleKeyDown (e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      addLog(activity)
    }
  }

  function addLog (userInput: string) {
    parseInput(userInput).then(newLog => {
      setLogs((oldLogs: Array<ILog>) => [
        newLog,
        ...oldLogs]
      )
      setActivity('')
      writeLog(newLog)
      setSelectedLog(newLog.id)
    })
  }

  const log = logs.filter(l => l.id === selectedLog)[0]
  // console.log('********************** selectedLog, log:', selectedLog, log)

  let rightPane = <></>
  if (log) {
    // Depending on the log's type, decide what to paint in the right pane
    // console.log('>>>>>>>> Paint right pane:', log.type)
    switch (log.type) {
      case 'YoutubeLog':
        rightPane = <YoutubePane log={log} />
        break
      case 'ActivityLog':
        rightPane = <SummaryPane logs={logs} />
        break
    }
  } else if (logs[0]) {
    setSelectedLog(logs[0].id)
  }

  function handleArrows (e: React.KeyboardEvent<HTMLDivElement>) {
    switch (e.code) {
      case 'ArrowUp': {
        const i = logs.map(l => l.id).indexOf(selectedLog) // Find the index of the currently selected log
        // console.log('>>> keyup:', selectedLog, i, logs)
        if (i !== 0) {
          setSelectedLog(logs[i - 1].id)
        }
        e.preventDefault()
        break
      }
      case 'ArrowDown': {
        const i = logs.map(l => l.id).indexOf(selectedLog) // Find the index of the currently selected log
        // console.log('>>> keydown:', selectedLog, i, logs)
        if (i !== logs.length - 1) {
          setSelectedLog(logs[i + 1].id)
        }
        e.preventDefault()
        break
      }
    }
  }

  // console.log('🚀🚀🚀🚀 LogEntry FINISHED rendering. selectedLog:', selectedLog)
  return (
    <DataContext.Provider value={dataContext}>
      <div onKeyDown={handleArrows}>
        <Box>
          <Prompt><span title='Robert Shell 😄'>RS</span> <Ticker /></Prompt>
          $ <LogInput autoFocus={true} value={activity} onChange={handleChange} onKeyDown={handleKeyDown}></LogInput>
        </Box>
        <br /><br />
        <hr />
        <br /><br />
        <div style={{ display: 'flex' }}>
          <LogViewer logs={logs} selectedLog={selectedLog} />
          {rightPane}
        </div>
      </div>
    </DataContext.Provider>
  )
}

export default LogEntry
