import styled from 'styled-components'
import React from 'react'

const FSidebar = styled.div`
  grid-area: sidebar;
  padding: 14px;
  color: lightgrey;
  background: #051e34;
`

const FLogo = styled.div`
  margin-bottom: 5px;
  font-family: 'Roboto', sans-serif;
  font-weight: 400;
  color: white;
  font-size: 21px;
`

const FMenuHeader = styled.div`
  margin-top: 10px;
  padding: 10px 0;
  font-size: 17px;
  font-family: 'Roboto', sans-serif;
  font-weight: 500;
`

const FMenuItem = styled.div`
  padding: 8px 0;
  font-size: 15px;
  font-family: 'Roboto', sans-serif;
`

type TSidebar = {
  collapseSidebar: boolean
  setCollapseSidebar: React.Dispatch<React.SetStateAction<boolean>>
}

const Sidebar = (props: TSidebar) => {
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
        <FMenuItem>🗳️ Reset Voting</FMenuItem>
      </>

  function handleClick () {
    props.setCollapseSidebar(!props.collapseSidebar)
  }

  return (
    <FSidebar>
      {content}
      <br />
      <button onClick={handleClick}>c</button>
    </FSidebar>
  )
}

export default Sidebar
