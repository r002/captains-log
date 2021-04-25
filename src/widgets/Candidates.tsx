import styled, { css } from 'styled-components'
import { TPassage } from './Shared'
import { FPassage, FLine } from './StoryBoard'
import React, { useState } from 'react'
import { vote, getVotingResult } from '../services/FirestoreApi'

const Container = styled.div`
  margin-left: 150px;
  margin-right: 150px;
  text-align: center;
`

type TCandidateButton = {
  readonly selected? : boolean
}

const CandidateButton = styled.button<TCandidateButton>`
  background: white;
  border-radius: 3px;
  border: 2px solid palevioletred;
  color: palevioletred;
  margin-right: 10px;
  padding: 0.25em 1em;

  ${props => props.selected && css`
    background: palevioletred;
    color: white;
  `}
`

type TVoteButton = {
  background: string
  // disabled: boolean
}

const VoteButton = styled.button<TVoteButton>`
  border-radius: 3px;
  border: 2px solid black;
  color: black;
  margin-right: 10px;
  padding: 0.25em 1em;

  ${props => props.background && css`
    background: ${props.background};
  `}
`

type TCandidates = {
  candidates: TPassage[]
  parentId : string
}

const Candidates = (props: TCandidates) => {
  const [candidateNo, setCandidateNo] = useState(0)
  const [voteMap, setVoteMap] = useState(new Map<string, string>())

  function handleClick (e: React.MouseEvent<HTMLElement>) {
    // console.log('>> clicked: ', e.currentTarget.dataset.index)
    setCandidateNo(parseInt(e.currentTarget.dataset.index!))
  }

  function upvote () {
    console.log('>> upvote:', props.candidates[candidateNo].id)
    vote(props.candidates[candidateNo].id, props.parentId, 'upvote')
    voteMap.set(props.candidates[candidateNo].id, 'upvote')
    setVoteMap(new Map(voteMap))
  }

  function downvote () {
    console.log('>> downvote:', props.candidates[candidateNo].id)
    vote(props.candidates[candidateNo].id, props.parentId, 'downvote')
    voteMap.set(props.candidates[candidateNo].id, 'downvote')
    setVoteMap(new Map(voteMap))
  }

  const body = []
  const candidateButtons = []
  const voteButtons = []
  if (props.candidates.length > 0) {
    const passage = props.candidates[candidateNo]
    const lines = passage.content.split('\n\n')
    body.push(
    <FPassage key={passage.id}>
      {lines.map((line, i) => <FLine key={i}>{line} {i !== lines.length - 1 ? <p /> : ''}</FLine>)}
    </FPassage>
    )

    if (!voteMap.has(props.candidates[candidateNo].id)) {
      getVotingResult(props.candidates[candidateNo].id, props.parentId).then(votingRecord => {
        // console.log('>>>>>>>>>>>>>>> getVotingRecord', votingRecord)
        if (votingRecord) {
          voteMap.set(votingRecord.passageId, votingRecord.decision)
          setVoteMap(new Map(voteMap))
        }
      })
    }

    if (!voteMap.has(props.candidates[candidateNo].id)) {
      voteButtons.push(
        <VoteButton background='lightgreen' onClick={upvote} key='upvote'>
          Upvote 👍
        </VoteButton>,
        <VoteButton background='pink' onClick={downvote} key='downvote'>
          Downvote 👎
        </VoteButton>
      )
    } else {
      const voteMessage = voteMap.get(props.candidates[candidateNo].id) === 'upvote'
        ? '👍 You upvoted! 👍'
        : '👎 You downvoted! 👎'
      voteButtons.push(voteMessage)
    }
  }

  for (const [i, passage] of props.candidates.entries()) {
    candidateButtons.push(
      <CandidateButton data-index={i} key={passage.id} onClick={handleClick} selected={i === candidateNo}>
        Candidate #{i + 1}
      </CandidateButton>
    )
  }

  // console.log('>>>> voteMap:', voteMap)
  return (
    <>
     <Container>
        {candidateButtons}
      </Container>
      <br /><br />
      {body}
      <Container>
        {voteButtons}
      </Container>
    </>
  )
}

export default Candidates
