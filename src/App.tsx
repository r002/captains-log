import { useState, useEffect } from 'react'
import { Navbar } from './widgets/Navbar'
import { LogEntry } from './widgets/LogEntry'
import { ThemeManager, themes } from './providers/ThemeContext'
import './style.css'
import firebase from 'firebase/app'
import { UserContext } from './providers/AuthContext'
import styled from 'styled-components'

export const useAuth = () => {
  const [state, setState] = useState(() => {
    // const user = firebase.auth().currentUser

    return {
      initializing: true,
      user: null
    }
  })

  function onChange (user: any) {
    setState(() => {
      // console.log('^^^^^^^^^^^^^^^^^^user auth has changed!', user)
      return {
        initializing: false,
        user: user
      }
    })
    // console.log('^^^^^^^^^^^^^^^^^^firesbase auth onChange fired. User:', user)
  }

  useEffect(() => {
    // listen for auth state changes
    const unsubscribe = firebase.auth().onAuthStateChanged(onChange)
    // unsubscribe to the listener when unmounting
    return () => unsubscribe()
  }, [])

  return state
}

const Body = styled.div`
  padding: 40px 20px 20px 20px;
  width: 100%;
  /* background: lightslategray; */
  box-sizing: border-box;
  /* border: solid darkgray 1px; */
`

const App = () => {
  const [theme, setTheme] = useState(themes.light)
  const { initializing, user } = useAuth()

  function togTheme () {
    setTheme(currentTheme => {
      return currentTheme === themes.dark
        ? themes.light
        : themes.dark
    })
  }

  let appWrapper = <></>
  if (!initializing) {
    appWrapper =
      <>
        <ThemeManager.Provider value={theme}>
          <UserContext.Provider value={{ user }}>
            <Navbar changeTheme={togTheme} />
            <Body>
              <LogEntry />
            </Body>
          </UserContext.Provider>
        </ThemeManager.Provider>
      </>
    document.body.style.visibility = 'visible'
  } else {
    console.log('firebase is initializing!!!!')
  }

  // console.log('App render fired 😁')
  console.log('App render fired 😁', initializing, user)

  return (appWrapper)
}

export default App
