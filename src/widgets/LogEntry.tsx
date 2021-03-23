import styled from 'styled-components'
import React, { useEffect, useState, useContext } from 'react'
import { UserContext } from '../providers/AuthContext'
import firebase from 'firebase/app'

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

const LimeGreen = styled.span`
  color: limegreen;
`

const Yellow = styled.span`
  color: yellow;
`

const LogInput = styled.input`
  width: 900px;
  font-size: 22px;
  background: black;
  color: lightgrey;
  border: none;
  outline: none;
`
// Awaiting TC39 to approve 'Temporal'! 🥴
const formattedDt = (d: Date) => {
  return (
    <>
      <LimeGreen>{d.toString().slice(0, 15)} </LimeGreen>
      {/* <Yellow>{d.toString().slice(16, 21)} ET</Yellow>  */}
      <Yellow>{d.toString().slice(16, 24)} ET</Yellow> {/* Include seconds */}
    </>
  )
}

const FLogRecord = styled.div`
  padding: 10px;
  width: 900px;
  background: darkblue;
  color: white;
  box-sizing: border-box;
  border: solid darkgray 1px;
`
interface ILog {
  dt: Date
  activity: string
}

export const LogRecord = (log: ILog) => {
  return (
    <FLogRecord title={log.dt.toString()}>
      {formattedDt(log.dt)}: {log.activity}
    </FLogRecord>
  )
}

async function getLogs (user: firebase.User) : Promise<Array<ILog>> {
  console.log('----------------- fire getLogs!')

  const qs = await firebase.firestore().collection(`users/${user.uid}/logs`)
    .orderBy('dt', 'desc').limit(100).get()
  const logs = qs.docs.map((doc: any) => (
    {
      dt: doc.data().dt.toDate(),
      activity: doc.data().activity
    }))
  console.log('------------------ Return results from db!', logs, user)
  return logs
}

function writeLog (user: firebase.User, log:ILog): void {
  firebase.firestore().collection(`users/${user.uid}/logs`)
  // .withConverter(m.articleConverter)
    .add(log)
    .then((docRef: any) => {
      // newLog.id = docRef.id
      console.log('>> log added!', docRef.id, log)
    })
}

export const LogEntry = () => {
  // console.log('🚀🚀 LogEntry BEGIN rendering')

  const { user } = useContext(UserContext)
  const [logsFromDb, setLogsFromDb] = useState([] as Array<ILog>)
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
  if (user && logsFromDb.length === 0) {
    getLogs(user).then(l => {
      setLogsFromDb(l)

      // If user has written logs anonymously, write the unsaved logs to Firestore
      for (const log of logs) {
        writeLog(user, log)
        console.log('>> write unsaved log to firestore', log)
      }
    })

  // Clear logs from db if user signs out
  } else if (!user && logsFromDb.length > 0) {
    setLogsFromDb([])
    setLogs([])
  }

  function addLog (e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      const newLog = {
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
        <Prompt><span title='Robert Shell 😄'>RS</span> {formattedDt(dt)}</Prompt>
        $ <LogInput autoFocus={true} value={activity} onChange={handleChange} onKeyDown={addLog}></LogInput>
      </Box>
      <br /><br />
      <hr />
      <br /><br />
      {/* {logs} */}
      {logs.map((l: ILog, i: number) => <LogRecord key={'log' + i} {...l} />)}
      {logsFromDb.map((l: ILog, i: number) => <LogRecord key={'log' + i} {...l} />)}
    </>
  )
}
