import styled from 'styled-components'
import React from 'react'
import { deleteVote } from '../services/FirestoreApi'

const FSidebar = styled.div`
  grid-area: sidebar;
  /* padding: 14px; */
  color: lightgrey;
  background: #051e34;
`

const FLogo = styled.div`
  margin: 11px 14px 10px 14px;
  font-family: 'Roboto', sans-serif;
  font-weight: 400;
  color: white;
  font-size: 21px;
`

const FMenuHeader = styled.div`
  /* margin: 14px; */
  padding: 12px 14px;
  font-size: 16px;
  font-family: 'Roboto', sans-serif;
  font-weight: 500;
  background-color: #122c44;
`

const FMenuItem = styled.div`
  padding: 8px 14px;
  font-size: 14px;
  font-family: 'Roboto', sans-serif;
  background-color: #122c44;

  &:hover {
    background-color: #253d53;
    cursor: pointer;
  }
`

type TSidebar = {
  collapseSidebar: boolean
  setCollapseSidebar: React.Dispatch<React.SetStateAction<boolean>>
}

const Sidebar = (props: TSidebar) => {
  function handleResetVoting () {
    const voteId = 'wkNnqCPmR3mFIaUffIrC' // TODO: Actually impl this! 4/22/21
    deleteVote(voteId)
    console.log('>> Vote deleted:', voteId)
  }

  const content = props.collapseSidebar
    ? <>
        <FLogo>📗</FLogo>
        <hr />
        <FMenuHeader>👑</FMenuHeader>
        <FMenuItem>⏲️</FMenuItem>
        <FMenuItem>📜</FMenuItem>
        <FMenuItem>🗳️</FMenuItem>
      </>
    : <>
        <FLogo>📗 Storyline</FLogo>
        <hr />
        <FMenuHeader>Admin Tools</FMenuHeader>
        <FMenuItem>⏲️ Restart Countdown</FMenuItem>
        <FMenuItem>📜 Generate Results</FMenuItem>
        <FMenuItem onClick={handleResetVoting}>🗳️ Reset Voting</FMenuItem>
      </>

  function handleClick () {
    props.setCollapseSidebar(!props.collapseSidebar)
  }

  return (
    <FSidebar>
      {content}
      <hr />
      <button onClick={handleClick}>c</button>
    </FSidebar>
  )
}

export default Sidebar
