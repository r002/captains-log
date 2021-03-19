import styled, { css } from 'styled-components'
import { ThemeManager } from '../providers/ThemeContext'
import { UserContext } from '../providers/AuthContext'
import { useContext } from 'react'
import firebase from 'firebase/app'

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
        theme={tm}
        margin={margin}
        >
        {label}
      </Button>
    </>
  )
}

const LoginButton = (props: any) => {
  // const authContext = useContext(AuthContext)
  const tm = useContext(ThemeManager)
  const login = () => {
    const provider = new firebase.auth.GoogleAuthProvider()
    firebase.auth().signInWithPopup(provider)
  }

  return (
    <>
      <Button
        onClick={login}
        theme={tm}
        >
        {props.label}
      </Button>
    </>
  )
}

const LogoutButton = (props: any) => {
  // const authContext = useContext(AuthContext)
  function logout () {
    console.log('>> User logged out:', firebase.auth().currentUser)
    firebase.auth().signOut()
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

export const Navbar = ({ changeTheme }: any) => {
  const { user } = useContext(UserContext)
  const welcomeMsg = user
    ? <>
        {user.displayName} <LogoutButton label='Logout' />
      </>
    : <LoginButton label='Login' />
  return (
    <NavWrapper>
      <NormalButton label='☀️'
                    handleClick={changeTheme}
                    margin='0 15px 0 0' />
      {welcomeMsg}
    </NavWrapper>
  )
}
