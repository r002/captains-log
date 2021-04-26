import styled, { css } from 'styled-components'
import { useEffect, useState, useContext } from 'react'
import { UserContext } from '../providers/AuthContext'
import { TPassage } from '../widgets/Shared'
import { msToTime } from '../lib/util'
import { getPassagesByStory } from '../services/FirestoreApi'
import Candidates from '../widgets/Candidates'

export const FLine = styled.div`
  font-family: Georgia, serif;
  font-size: 18px;
  letter-spacing: 1px;
  line-height: 1.8;
`

type TFPassage = {
  background? : string
}

export const FPassage = styled.div<TFPassage>`
  background: lightgrey;
  border-radius: 3px;
  border: 2px solid palevioletred;
  color: black;
  padding: 20px;
  font-family: Georgia, serif;
  font-size: 18px;
  letter-spacing: 1px;
  line-height: 1.8;
  margin-left: 150px;
  margin-right: 150px;
  margin-bottom: 30px;

  ${props => props.background && css`
    background: ${props.background};
  `}
`

const Container = styled.div`
  margin-left: 150px;
  margin-right: 150px;
  text-align: center;
`

const CountdownClock = () => {
  const deadline = new Date('May 2, 2021 12:00:00')
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
    <>
      Deadline:
      <h1>{deadline.toString()}</h1>
      Time remaining:
      <h1>{d.days} days {d.hours} hours {d.minutes} minutes {d.seconds} seconds</h1>
    </>
  )
}

const StoryBoard = () => {
  const { user } = useContext(UserContext)
  const [passages, setPassages] = useState(null as unknown as TPassage[])
  // console.log('>> user:', user)

  if (user && !passages) {
    getPassagesByStory('aaa').then(passages => {
      console.log('>> passages', passages)
      setPassages(passages)
    })
  }

  const cannon = []
  let candidates = [] as TPassage[]
  let parentId = ''
  if (passages) {
    const cannonPassages = passages.filter(passage => passage.branch === 'cannon')
    for (const passage of cannonPassages) {
      parentId = passage.id
      const lines = passage.content.split('\n\n')
      cannon.push(
        <FPassage key={passage.id} background='palegoldenrod'>
          {lines.map((line, i) => <FLine key={i}>{line} {i !== lines.length - 1 && <p />}</FLine>)}
        </FPassage>
      )
    }

    candidates = passages.filter(passage => passage.branch === 'candidate')
  }

  return (
    <>
      <Container>
        Be part of the story. | What happens next? You decide.<br /><br />
        <CountdownClock />
      </Container>
      <br /><br />

      {cannon}

      <Candidates candidates={candidates} parentId={parentId} />

      {/* <Container>
        <FEditor defaultValue='Editor goes here' />
      </Container> */}
    </>
  )
}

export default StoryBoard
