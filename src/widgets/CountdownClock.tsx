import styled from 'styled-components'
import React, { useEffect, useState } from 'react'
import { msToTime } from '../lib/util'

const today = new Date()
// today.setTime(today.getTime() + 86400 * 1000) // Set to tomorrow
// console.log('>> Today:', today.toDateString())
const deadline = new Date(`${today.toDateString()} 23:59:59`)

const FCountdownClock = styled.div<{color?: string}>`
  color: ${p => p.color};
`

const FH2 = styled.div`
  font-size: 16px;
  color: #ec7240;
  margin-top: 3px;
  margin-bottom: 10px;
`

const FH1 = styled.div`
  font-size: 26px;
  color: #5ff708;
  margin-top: 5px;
  margin-bottom: 10px;
`

const CountdownClock: React.FC<{color?: string}> = (props) => {
  const [timeRemaining, setTimeRemaining] = useState(deadline.getTime() - Date.now())

  function tick () {
    setTimeRemaining(deadline.getTime() - Date.now())
  }

  useEffect(() => {
    const interval = setInterval(() => tick(), 1000) // (* 60) Update every minute
    return () => {
      clearInterval(interval)
    }
  }, [])

  const d = msToTime(timeRemaining)
  return (
    <FCountdownClock color={props.color}>
      Deadline:
      <FH2>{deadline.toString()}</FH2>
      Time remaining:
      {/* <h1>{d.days} days {d.hours} hours {d.minutes} minutes {d.seconds} seconds</h1> */}
      <FH1>{d.hours} hours {d.minutes} minutes {d.seconds} seconds</FH1>
    </FCountdownClock>
  )
}

export default CountdownClock
