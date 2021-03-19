import styled, { css } from 'styled-components'
import { ThemeManager } from '../providers/ThemeContext'
import { AuthContext } from '../providers/AuthContext'
import { useContext } from 'react'

interface ButtonProps {
  readonly primary?: boolean,
  readonly theme?: boolean
  margin? : string
}

const Button = styled.button<ButtonProps>`
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

const NormalButton = ({ handleClick, margin, label }: any) => {
  const tm = useContext(ThemeManager)

  return (
    <>
      <Button
        onClick={handleClick}
        theme={tm.currentTheme}
        margin={margin}
        >
        {label}
      </Button>
    </>
  )
}

const LoginButton = (props: any) => {
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

const LogoutButton = (props: any) => {
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

const NavWrapper = styled.div`
  padding: 10px;
  width: 100%;
  background: lightslategray;
  box-sizing: border-box;
  text-align: right;
  border-bottom: solid darkgray 1px;
`

// Show user's name & the LogoutButton if they're logged in.
// Else, display the LoginButton.

export const Navbar = ({ changeTheme }: any) => {
  return (
    <NavWrapper>
      <NormalButton label='☀️'
                    handleClick={changeTheme}
                    margin='0 25px 0 0' />
      <LoginButton label='Login' />
      <LogoutButton label='Logout' />
    </NavWrapper>
  )
}
