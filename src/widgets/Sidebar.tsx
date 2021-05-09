import styled, { css } from 'styled-components'
import React, { useState } from 'react'
import { deleteVotes, coronate, getMenuItems } from '../services/FirestoreApi'

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
  cursor: pointer;
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

type TMenuItem = {
  label: string
  dest: string
  readonly selected: boolean
  navigate: Function
}

const MenuItem = (props: TMenuItem) => {
  function navigate (e: React.MouseEvent<HTMLElement>) {
    props.navigate(e.currentTarget.dataset.page)
  }

  return (
    <FMenuItem data-page={props.dest}
      selected={props.selected}
      onClick={navigate}>{props.label}</FMenuItem>
  )
}

type TSidebar = {
  collapseSidebar: boolean
  setCollapseSidebar: React.Dispatch<React.SetStateAction<boolean>>
  navigate: Function
  selectedPage: string
}

const Sidebar = (props: TSidebar) => {
  const [menuItems, setMenuItems] = useState([])

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

  function goHome () {
    props.navigate('index')
  }

  if (menuItems.length === 0) {
    getMenuItems('gtx_isye6501').then(rs => {
      rs.menu.sort((a: any, b: any) => (a.order > b.order) ? 1 : -1)
      console.log('>> GET rs.menu:', rs.menu)
      setMenuItems(rs.menu)
    })
  }

  const content = props.collapseSidebar
    ? <>
        <FLogo>📗</FLogo>
        <hr />
        <FMenuHeader>🛠️</FMenuHeader>
        <FMenuItem>🧰</FMenuItem>
        <FMenuItem>⏲️</FMenuItem>
        <FMenuItem>📜</FMenuItem>
        <FMenuItem>👑</FMenuItem>
        <FMenuItem>🧹</FMenuItem>
        <hr />
        <FMenuHeader>🗺️</FMenuHeader>
        <FMenuItem>✍️</FMenuItem>
        <FMenuItem>🗳️</FMenuItem>
        <FMenuItem>💠</FMenuItem>
        <hr />
        <FMenuHeader>🛸</FMenuHeader>
        <FMenuItem>🔺</FMenuItem>
        <FMenuItem>🌎</FMenuItem>
        <hr />
        <FMenuHeader>🏫</FMenuHeader>
        <FMenuItem>🔒</FMenuItem>
      </>
    : <>
        <FLogo onClick={goHome}>📗 Storyline</FLogo>
        <hr />
        <FMenuHeader>Admin Tools</FMenuHeader>
        <MenuItem dest='admin'
          selected={props.selectedPage === 'admin'}
          label='🧰 Admin Console'
          navigate={props.navigate} />
        <FMenuItem>⏲️ Restart Countdown</FMenuItem>
        <FMenuItem>📜 Generate Random Results</FMenuItem>
        <FMenuItem onClick={handleCoronate}>👑 Coronate</FMenuItem>
        <FMenuItem onClick={handleResetVoting}>🧹 Delete User's Votes</FMenuItem>
        <hr />
        <FMenuHeader>Navigation</FMenuHeader>
        <MenuItem dest='write'
          selected={props.selectedPage === 'write'}
          label='✍️ Write'
          navigate={props.navigate}
        />
        <MenuItem dest='storyboard'
          selected={props.selectedPage === 'storyboard'}
          label="🗳️ Vote for What's Next"
          navigate={props.navigate}
        />
        <MenuItem dest='results'
          selected={props.selectedPage === 'results'}
          label='💠 Results this Week'
          navigate={props.navigate}
        />
        <hr />
        <FMenuHeader>Misc</FMenuHeader>
        <MenuItem dest='https://github.com/r002/captains-log/blob/main/changelog.md'
          selected={props.selectedPage === 'NA'}
          label='🔺 Changelog'
          navigate={props.navigate}
        />
        <MenuItem dest='fileviewer&asset=bg2003.pdf'
          selected={props.selectedPage === 'fileviewer&asset=bg2003.pdf'}
          label='🌎 Open Asset Test'
          navigate={props.navigate}
        />
        <hr />
        <FMenuHeader>GTx: ISYE 6501</FMenuHeader>
        {
          menuItems.map((item: any) => {
            const dest = item.asset.includes('https://')
              ? item.asset
              : 'fileviewer&asset=' + item.asset
            return (
              <MenuItem dest={dest}
                key={item.order}
                selected={props.selectedPage === dest}
                label={item.title}
                navigate={props.navigate}
              />
            )
          })
        }
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
