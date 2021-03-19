import styled from 'styled-components'
import { useEffect, useRef, useState } from 'react'

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
  width: 600px;
  font-size: 22px;
  background: black;
  color: lightgrey;
  border: none;
  outline: none;
`
// Awaiting TC39 to approve 'Temporal'! 🥴
const formattedDt = (d: string) => {
  return (
    <>
      <LimeGreen>{d.slice(0, 15)} </LimeGreen>
      <Yellow>{d.slice(16, 21)} ET</Yellow>
    </>
  )
}

const FLogRecord = styled.div`
  padding: 10px;
  width: 600px;
  background: darkblue;
  color: white;
  box-sizing: border-box;
  border: solid darkgray 1px;
`
interface ILog {
  dt: string
  content: string
}

export const LogRecord = (log: ILog) => {
  return (
    <FLogRecord>
      {formattedDt(log.dt)}: {log.content}
    </FLogRecord>
  )
}

export const LogEntry = () => {
  const [dt, setDt] = useState(Date().toString())
  function tick () {
    setDt(Date().toString())
  }

  const inputEl = useRef(null as any)
  const [logs, setLogs] = useState([] as Array<ILog>)

  function addLog (event: any) {
    if (event.key === 'Enter') {
      setLogs((oldLogs: Array<ILog>) => [
        {
          dt: dt,
          content: inputEl.current.value
        },
        ...oldLogs])
    }
  }

  useEffect(() => {
    const interval = setInterval(() => tick(), 1000 * 60) // Update every minute

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    inputEl.current.value = ''
  }, [logs])

  // console.log('>> Logs right before render', logs)

  return (
    <>
      <Box>
        <Prompt>RS {formattedDt(dt)}</Prompt>
        $ <LogInput ref={inputEl} autoFocus={true} onKeyDown={addLog} />
      </Box>
      <br /><br />
      <hr />
      <br /><br />
      {logs.map((l: ILog, i: number) => <LogRecord key={'log' + i} {...l} />)}
      {/* {logs.map((l: ILog, i: number) => <LogRecord key={'log' + i} dt={l.dt} content={l.content} />)} */}
      {/* {logs.map((log: string, i: number) => <span key={'log' + i}>{log}<br /></span>)} */}
    </>
  )
}
