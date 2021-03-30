import styled, { css } from 'styled-components'
import { ThemeContext } from '../providers/ThemeContext'
import { UserContext } from '../providers/AuthContext'
import { useContext } from 'react'
import firebase from 'firebase/app'

type TFButton = {
  readonly primary? : boolean,
  readonly theme? : boolean
  margin? : string,
  label? : string
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

const ThemeToggler = (props: TFButton) => {
  const tc = useContext(ThemeContext)

  function handleClick () {
    tc.toggler()
    console.log('@@ ThemeToggler handleClick called!')
  }

  return (
    <>
      <FButton
        onClick={handleClick}
        theme={tc.theme}
        margin={props.margin}
        >
        {props.label}
      </FButton>
    </>
  )
}

const LoginButton = (props: TFButton) => {
  const tc = useContext(ThemeContext)
  const login = () => {
    const provider = new firebase.auth.GoogleAuthProvider()
    firebase.auth().signInWithPopup(provider)
  }

  return (
    <>
      <FButton
        onClick={login}
        theme={tc.theme}
        >
        {props.label}
      </FButton>
    </>
  )
}

const LogoutButton = (props: TFButton) => {
  const tc = useContext(ThemeContext)
  function logout () {
    console.log('>> User logged out:', firebase.auth().currentUser)
    firebase.auth().signOut()
  }

  return (
    <>
      <FButton primary
        onClick={logout}
        theme={tc.theme}
        >
      {props.label}
      </FButton>
    </>
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
        {user.displayName} <LogoutButton label='Logout' />
      </>
    : <LoginButton label='Login' />
  return (
    <NavWrapper>
      <ThemeToggler label='☀️'
                    margin='0 15px 0 0' />
      {welcomeMsg}
    </NavWrapper>
  )
}
