import styled, { css } from 'styled-components'
import { ThemeContext } from '../providers/ThemeContext'
import { UserContext } from '../providers/AuthContext'
import { useContext } from 'react'
import firebase from 'firebase/app'

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

  function toggleTheme () {
    tc.toggler()
  }

  return (
    <FButton
      onClick={toggleTheme}
      theme={tc.theme}
      margin='0 15px 0 0'
      >
      ☀️
    </FButton>
  )
}

const LoginButton = () => {
  const tc = useContext(ThemeContext)
  const login = () => {
    const provider = new firebase.auth.GoogleAuthProvider()
    firebase.auth().signInWithPopup(provider)
  }

  return (
    <FButton
      onClick={login}
      theme={tc.theme}
      >
      Login
    </FButton>
  )
}

const LogoutButton = () => {
  const tc = useContext(ThemeContext)
  function logout () {
    console.log('>> User logged out:', firebase.auth().currentUser)
    firebase.auth().signOut()
  }

  return (
    <FButton primary
      onClick={logout}
      theme={tc.theme}
      >
      Logout
    </FButton>
  )
}

const ExportButton = () => {
  const tc = useContext(ThemeContext)
  return (
    <FButton
      theme={tc.theme}
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
  text-align: right;
  border-bottom: solid darkgray 1px;
`

export const Navbar = () => {
  const { user } = useContext(UserContext)
  const welcomeMsg = user
    ? <>
        <ExportButton /> {user.displayName} <LogoutButton />
      </>
    : <LoginButton />
  return (
    <NavWrapper>
      <ThemeToggler />
      {welcomeMsg}
    </NavWrapper>
  )
}
