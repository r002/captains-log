import styled, { css } from 'styled-components'
import { ThemeContext } from '../providers/ThemeContext'
import { UserContext } from '../providers/AuthContext'
import { useContext } from 'react'
import firebase from 'firebase/app'
import { exportLogs } from '../services/Exporter'
import { TFlashAlert } from '../services/Internal'
import { FlashAlert } from './FlashAlert'

type TFButton = {
  readonly theme : boolean
  readonly primary? : boolean
  margin? : string
}

const FButton = styled.button<TFButton>`
  background: transparent;
  border-radius: 3px;
  border: 2px solid palevioletred;
  color: palevioletred;
  margin: ${props => props.margin};
  padding: 0.25em 1em;

  ${props => props.primary && css`
    background: palevioletred;
    color: white;
  `}

  ${props => props.theme && css`
    background: ${props.theme.background};
    color: ${props.theme.foreground};
  `}
`

const ThemeToggler = () => {
  const tc = useContext(ThemeContext)

  function handleClick () {
    tc.toggleTheme()
  }

  return (
    <FButton
      onClick={handleClick}
      theme={tc.theme}
      margin='0 15px 0 0'
      >
      ☀️
    </FButton>
  )
}

const LoginButton = () => {
  const tc = useContext(ThemeContext)
  function handleClick () {
    const provider = new firebase.auth.GoogleAuthProvider()
    firebase.auth().signInWithPopup(provider)
  }

  return (
    <FButton
      onClick={handleClick}
      theme={tc.theme}
      >
      Login
    </FButton>
  )
}

const LogoutButton = () => {
  const tc = useContext(ThemeContext)
  function handleClick () {
    console.log('>> User logged out:', firebase.auth().currentUser)
    firebase.auth().signOut()
  }

  return (
    <FButton primary
      onClick={handleClick}
      theme={tc.theme}
      >
      Logout
    </FButton>
  )
}

const ExportButton = () => {
  const tc = useContext(ThemeContext)
  function handleClick () {
    exportLogs(1000)
  }

  return (
    <FButton
      theme={tc.theme}
      onClick={handleClick}
      >
      Export Logs
    </FButton>
  )
}

const NavWrapper = styled.div`
  padding: 10px 20px;
  width: 100%;
  background: lightslategray;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  border-bottom: solid darkgray 1px;
`

type TNavBar = {
  flashAlert: TFlashAlert | null
}

export const Navbar = (props: TNavBar) => {
  const { user } = useContext(UserContext)
  const welcomeMsg = user
    ? <>
        <ExportButton /> {user.displayName} <LogoutButton />
      </>
    : <LoginButton />

  return (
    <NavWrapper>
      <div id="justifyLeft">
        {props.flashAlert &&
          <FlashAlert key={new Date().toString()} {...props.flashAlert} />
        }
      </div>
      <div id="justifyRight">
        <ThemeToggler />
        {welcomeMsg}
      </div>
    </NavWrapper>
  )
}
