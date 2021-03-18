import styled, { css } from 'styled-components'
import { ThemeManager } from './providers/ThemeContext'
import { AuthContext } from './providers/AuthContext'
import { useContext } from 'react'

interface ButtonProps {
  readonly primary?: boolean,
  readonly theme?: boolean
}

const Button = styled.button<ButtonProps>`
  background: transparent;
  border-radius: 3px;
  border: 2px solid palevioletred;
  color: palevioletred;
  margin: 0 1em;
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

export const NormalButton = (props: any) => {
  const tm = useContext(ThemeManager)

  return (
    <>
      <Button
        onClick={props.changeTheme}
        theme={tm.currentTheme}
        >
        {props.label}
      </Button>
    </>
  )
}

export const LoginButton = (props: any) => {
  const authContext = useContext(AuthContext)
  const tm = useContext(ThemeManager)
  const login = () => {
    const provider = new authContext.auth.GoogleAuthProvider()
    authContext.auth().signInWithPopup(provider)
  }

  return (
    <>
      <Button
        onClick={login}
        theme={tm.currentTheme}
        >
        {props.label}
      </Button>
    </>
  )
}

export const LogoutButton = (props: any) => {
  const authContext = useContext(AuthContext)
  function logout () {
    console.log('>> User logged out:', authContext.auth().currentUser)
    authContext.auth().signOut()
  }

  return (
    <>
      <Button primary onClick={logout}>
      {props.label}
      </Button>
    </>
  )
}
