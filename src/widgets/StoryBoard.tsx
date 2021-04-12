import styled, { css } from 'styled-components'
import { useState, useContext } from 'react'
import { UserContext } from '../providers/AuthContext'
import { TPassage } from './Shared'
import { getPassages } from '../services/FirestoreApi'
import Candidates from './Candidates'

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

// const FEditor = styled.textarea`
//   background: white;
//   color: black;
//   padding: 20px;
//   font-family: Georgia, serif;
//   font-size: 18px;
//   letter-spacing: 1px;
//   line-height: 1.8;
//   width: 100%;
//   height: 500px;
//   box-sizing: border-box;
// `

const StoryBoard = () => {
  const { user } = useContext(UserContext)
  const [passages, setPassages] = useState(null as unknown as TPassage[])
  // console.log('>> user:', user)

  if (user && !passages) {
    getPassages('aaa').then(passages => {
      console.log('>> passages', passages)
      setPassages(passages)
    })
  }

  const cannon = []
  let candidates = [] as TPassage[]
  if (passages) {
    const cannonPassages = passages.filter(passage => passage.branch === 'cannon')
    for (const passage of cannonPassages) {
      const lines = passage.content.split('\n\n')
      cannon.push(
        <FPassage key={passage.id} background='palegoldenrod'>
          {lines.map((line, i) => <FLine key={i}>{line} {i !== lines.length - 1 ? <p /> : ''}</FLine>)}
        </FPassage>
      )
    }

    candidates = passages.filter(passage => passage.branch === 'candidate')
  }

  return (
    <>
      <Container>
        What happens next? You decide.
      </Container>
      <br /><br />

      {cannon}

      <Candidates candidates={candidates} />

      {/* <Container>
        <FEditor defaultValue='Editor goes here' />
      </Container> */}
    </>
  )
}

export default StoryBoard
