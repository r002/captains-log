import styled, { css } from 'styled-components'
import { ThemeContext } from '../providers/ThemeContext'
import { UserContext } from '../providers/AuthContext'
import { useContext, useEffect, useState } from 'react'
import firebase from 'firebase/app'
import { exportLogs } from '../services/Exporter'
import { TFlashAlert } from '../services/Internal'

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
  height: 52px;
  grid-area: navbar;
  padding: 10px 20px;
  width: 100%;
  background: lightslategray;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  border-bottom: solid darkgray 1px;
`

export const Navbar = () => {
  const [flashAlert, setFlashAlert] = useState<TFlashAlert | null>(null)
  const { user } = useContext(UserContext)
  const welcomeMsg = user
    ? <>
        <ExportButton /> {user.displayName} <LogoutButton />
      </>
    : <LoginButton />

  function listenForFlashAlert (event: Event) {
    const fa = (event as CustomEvent).detail as TFlashAlert
    setFlashAlert(fa)
    console.log('!!!!!!!!!! FlashAlert received!', fa)
    document.getElementById('fadeEl')!.className = 'show'
    setTimeout(() => {
      document.getElementById('fadeEl')!.className = 'hide'
    }, 3000)
  }

  useEffect(() => {
    document.body.addEventListener('flashAlert', listenForFlashAlert, false)
    return () => {
      document.body.removeEventListener('flashAlert', listenForFlashAlert)
    }
  }, [])

  return (
    <NavWrapper>
      <div id="justifyLeft">
        <div id='fadeEl' className='hide'>
          {flashAlert?.alert}: {flashAlert?.content}
        </div>
      </div>
      <div id="justifyRight">
        <ThemeToggler />
        {welcomeMsg}
      </div>
    </NavWrapper>
  )
}
