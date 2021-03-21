import styled from 'styled-components'
import { useEffect, useRef, useState, useContext } from 'react'
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
      <Yellow>{d.toString().slice(16, 21)} ET</Yellow> {/* (16, 24) Include seconds */}
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

function useLogs (user: firebase.User | null) {
  const [logsFire, setLogsFire] = useState([] as Array<ILog>)

  let l = null as any
  useEffect(
    () => {
      if (user) {
        console.log('>> user.uid:', user.uid)
        firebase
          .firestore()
          .collection(`users/${user.uid}/logs`)
          .orderBy('dt', 'desc').limit(100)
          .get().then(rs => {
            l = rs.docs.map((doc: any) =>
              ({
                dt: doc.data().dt.toDate(), // Convert Firestore Timestamp into JS Date
                activity: doc.data().activity
              })
            )
            console.log('>> logs fetched from db:', l)
            setLogsFire(l)
          })
      } else {
        console.log('>> useLogs empty logs')
        setLogsFire([])
      }
    }, [user]
  )

  return {
    logsFire: logsFire
  }
}

export const LogEntry = () => {
  const [dt, setDt] = useState(new Date())
  function tick () {
    setDt(new Date())
  }

  const inputEl = useRef(null as any)
  const [logs, setLogs] = useState([] as Array<ILog>)
  const { user } = useContext(UserContext)

  function addLog (event: any) {
    if (event.key === 'Enter') {
      const newLog = {
        dt: dt,
        activity: inputEl.current.value
      }
      setLogs((oldLogs: Array<ILog>) => [
        newLog,
        ...oldLogs]
      )
      // Write to Firebase if user is signed in
      if (user) {
        firebase.firestore().collection(`users/${user.uid}/logs`)
        // .withConverter(m.articleConverter)
          .add(newLog)
          .then((docRef: any) => {
            // newLog.id = docRef.id
            console.log('>> log added!', docRef.id, newLog)
          })
      }
    }
  }

  useEffect(() => {
    const interval = setInterval(() => tick(), 1000) // (* 60) Update every minute
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    inputEl.current.value = ''
  }, [logs])

  // If a user is logged in, get all of the user's logs from Firestore
  const { logsFire } = useLogs(user)

  useEffect(() => {
    if (!logsFire.length && !user) {
      setLogs([]) // Clear all locally added logs if user logs out and had logged activities earlier
    }
    console.log('$$$$ User has logged out; clear local logs', user, logsFire)
  }, [logsFire])

  // console.log('>> Logs right before render', logs)
  return (
    <>
      <Box>
        <Prompt><span title='Robert Shell 😄'>RS</span> {formattedDt(dt)}</Prompt>
        $ <LogInput ref={inputEl} autoFocus={true} onKeyDown={addLog} />
      </Box>
      <br /><br />
      <hr />
      <br /><br />
      {logs.map((l: ILog, i: number) => <LogRecord key={'log' + i} {...l} />)}
      {logsFire.map((l: ILog, i: number) => <LogRecord key={'log' + i} {...l} />)}
    </>
  )
}
