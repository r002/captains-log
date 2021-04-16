import styled, { css } from 'styled-components'
import React, { useState, useRef, useEffect, MutableRefObject } from 'react'
// import React, { useState, useContext } from 'react'
// import { UserContext } from '../providers/AuthContext'
import { TPassage } from './Shared'
import { getPassages } from '../services/FirestoreApi'

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
  /* margin-left: 150px;
  margin-right: 150px; */
  /* width: 1050px; */
  margin-bottom: 20px;
  box-sizing: border-box;

  ${props => props.background && css`
    background: ${props.background};
  `}
`

const FButton = styled.button`
  border-radius: 3px;
  border: 2px solid blue;
  color: black;
  /* margin-right: 5px; */
  padding: 0.25em 1em;
`

const FPassageButton = styled.button`
  border-radius: 3px;
  border: 2px solid blue;
  color: black;
  margin-bottom: 7px;
  padding: 0.25em 1em;
  font-size: 13px;
`

const EditorBar = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
  width: 100%;
  /* background-color: pink; */
`

const All = styled.div`
  display: flex;
  justify-content: space-between;
  /* flex-direction: row; */
  /* padding: 20px; */
  /* background-color: palegreen; */
  width: 1400px;
  margin: 0 auto;
  box-sizing: border-box;
`

const SideBar = styled.div`
  background-color: paleturquoise;
  width: 250px;
  padding: 30px;
  /* text-align: center; */
  /* margin: 0 auto; */
  /* margin-right: 20px; */
  box-sizing: border-box;
`

const Main = styled.div`
  width: 1050px;
  /* margin: 0 auto; */
  /* text-align: center; */
`

const FEditor = styled.textarea`
  background: white;
  color: black;
  padding: 20px;
  font-family: Georgia, serif;
  font-size: 18px;
  letter-spacing: 1px;
  line-height: 1.8;
  width: 100%;
  height: 500px;
  box-sizing: border-box;
`

const Write = () => {
  // const { user } = useContext(UserContext)
  const [passages, setPassages] = useState(null as unknown as TPassage[])
  const [passageText, setPassageText] = useState('A journey of a thousand miles begins with a single step...')
  const textArea = useRef() as MutableRefObject<HTMLTextAreaElement>
  // console.log('>> user:', user)

  if (!passages) {
    getPassages('aaa').then(passages => {
      console.log('>> passages', passages)
      setPassages(passages)
    })
  }

  const cannon = []
  if (passages) {
    const cannonPassages = passages.filter(passage => passage.branch === 'cannon')
    for (const passage of cannonPassages) {
      const lines = passage.content.split('\n\n')
      cannon.push(
        <FPassage key={passage.id} background='palegoldenrod'>
          {lines.map((line, i) => <FLine key={i}>{line} {i !== lines.length - 1 && <p />}</FLine>)}
        </FPassage>
      )
    }
  }

  function handleChange (e: React.FormEvent<HTMLTextAreaElement>) {
    setPassageText(e.currentTarget.value)
  }

  useEffect(() => {
    textArea.current.focus()
    textArea.current.select()
  }, [])

  return (
    <All>
      <SideBar>
      <FPassageButton>Psg #1 (Cannon)</FPassageButton>
      <FPassageButton>Psg #2 (Candidate)</FPassageButton>
      </SideBar>
      <Main>
        {cannon}
        <EditorBar>
          <div id="justifyLeft"></div>
          <div id="justifyRight">
            <FButton>Save</FButton> <FButton>Submit</FButton>
          </div>
        </EditorBar>
        <FEditor ref={textArea} value={passageText} onChange={handleChange} />
      </Main>
    </All>
  )
}

export default Write
