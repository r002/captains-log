import styled from 'styled-components'
import React, { useEffect, useState, useContext } from 'react'
import { UserContext } from '../providers/AuthContext'
import firebase from 'firebase/app'
import { FormattedDt, ILog } from './Shared'
import { LogViewer } from './LogViewer'
import { AutoId } from '../lib/util'

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

async function getLogs (user: firebase.User) : Promise<Array<ILog>> {
  console.log('----------------- fire getLogs!')

  const qs = await firebase.firestore().collection(`users/${user.uid}/logs`)
    .orderBy('dt', 'desc').limit(100).get()
  const logs = qs.docs.map((doc: any) => (
    {
      id: doc.id,
      dt: doc.data().dt.toDate(),
      activity: doc.data().activity
    }))
  console.log('------------------ Return results from db!', logs, user)
  return logs
}

function writeLog (user: firebase.User, log:ILog): void {
  firebase.firestore().collection(`users/${user.uid}/logs`).doc(log.id)
    .set(log)
  console.log('>> log written to Firestore!', log)
}

export const LogEntry = () => {
  // console.log('🚀🚀 LogEntry BEGIN rendering')

  const { user } = useContext(UserContext)
  const [logs, setLogs] = useState([] as Array<ILog>)
  const [dt, setDt] = useState(new Date())
  const [activity, setActivity] = useState('')

  function tick () {
    setDt(new Date())
  }

  useEffect(() => {
    // tick()
    const interval = setInterval(() => tick(), 1000) // (* 60) Update every minute
    return () => clearInterval(interval)
  }, [])

  function handleChange (e: React.FormEvent<HTMLInputElement>) {
    setActivity(e.currentTarget.value)
  }

  // Initial load logs from db if user signs in
  useEffect(() => {
    // console.log('******** LogEntry fire useEffect', user)
    if (user) {
      getLogs(user).then(logsFromDb => {
        if (logs.length === 0 || logs.length + logsFromDb.length > logsFromDb.length) {
          // If user has written logs anonymously, first write the unsaved logs to Firestore
          for (const log of logs) {
            writeLog(user, log)
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

  function addLog (e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      const newLog = {
        id: AutoId.newId(),
        dt: dt,
        activity: activity
      }
      setLogs((oldLogs: Array<ILog>) => [
        newLog,
        ...oldLogs]
      )
      setActivity('')

      // Write to Firebase if user is signed in
      if (user) {
        writeLog(user, newLog)
      }
    }
  }

  // console.log('🚀🚀🚀🚀 LogEntry FINISHED rendering', logs, user)
  return (
    <>
      <Box>
        <Prompt><span title='Robert Shell 😄'>RS</span> {FormattedDt(dt)}</Prompt>
        $ <LogInput autoFocus={true} value={activity} onChange={handleChange} onKeyDown={addLog}></LogInput>
      </Box>
      <br /><br />
      <hr />
      <br /><br />
      <LogViewer logs={logs} />
    </>
  )
}
