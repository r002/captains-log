import styled, { css } from 'styled-components'
import React from 'react'
import { deleteVotes, coronate } from '../services/FirestoreApi'

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
  padding: 12px 14px 11px;
  font-size: 16px;
  font-family: 'Roboto', sans-serif;
  font-weight: 500;
  background-color: #122c44;
  color: white;
`

type TFMenuItem = {
  readonly selected? : boolean
}

const FMenuItem = styled.div<TFMenuItem>`
  padding: 8px 14px;
  font-size: 14px;
  font-family: 'Roboto', sans-serif;
  background-color: #122c44;
  font-weight: 500;

  &:hover {
    background-color: #253d53;
    cursor: pointer;
  }

  ${props => props.selected && css`
    color: #5f93e6;
  `}
`

type TSidebar = {
  collapseSidebar: boolean
  setCollapseSidebar: React.Dispatch<React.SetStateAction<boolean>>
  navigate: Function
  selectedPage: string
}

const Sidebar = (props: TSidebar) => {
  function handleResetVoting () {
    const parentId = 't7XqvCIszaUUrHAm1RLs' // TODO: Actually impl this! 4/22/21
    deleteVotes(parentId)
    console.log(">> User's votes deleted for parentId:", parentId)
  }

  function handleCoronate () {
    const parentId = 't7XqvCIszaUUrHAm1RLs' // TODO: Actually impl this! 4/22/21
    coronate(parentId).then(rs => {
      console.log('>> Coronate!', rs)
    })
  }

  function navigate (e: React.MouseEvent<HTMLElement>) {
    props.navigate(e.currentTarget.dataset.page)
  }

  const content = props.collapseSidebar
    ? <>
        <FLogo>📗</FLogo>
        <hr />
        <FMenuHeader>🛠️</FMenuHeader>
        <FMenuItem>⏲️</FMenuItem>
        <FMenuItem>📜</FMenuItem>
        <FMenuItem>👑</FMenuItem>
        <FMenuItem>🧹</FMenuItem>
        <hr />
        <FMenuHeader>📄</FMenuHeader>
        <FMenuItem>🗳️</FMenuItem>
        <FMenuItem>💠</FMenuItem>
      </>
    : <>
        <FLogo>📗 Storyline</FLogo>
        <hr />
        <FMenuHeader>Admin Tools</FMenuHeader>
        <FMenuItem>⏲️ Restart Countdown</FMenuItem>
        <FMenuItem>📜 Generate Random Results</FMenuItem>
        <FMenuItem onClick={handleCoronate}>👑 Coronate</FMenuItem>
        <FMenuItem onClick={handleResetVoting}>🧹 Delete User's Votes</FMenuItem>
        <hr />
        <FMenuHeader>Navigation</FMenuHeader>
        <FMenuItem data-page='storyboard'
          selected={props.selectedPage === 'storyboard'}
          onClick={navigate}>🗳️ Vote for What's Next</FMenuItem>
        <FMenuItem data-page='results'
          selected={props.selectedPage === 'results'}
          onClick={navigate}>💠 Results this Week</FMenuItem>
      </>

  function handleCollapseSidebar () {
    props.setCollapseSidebar(!props.collapseSidebar)
  }

  return (
    <FSidebar>
      {content}
      <hr />
      <button onClick={handleCollapseSidebar}>c</button>
    </FSidebar>
  )
}

export default Sidebar
