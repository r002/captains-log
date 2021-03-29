import firebase from 'firebase/app'
import { useState, useEffect } from 'react'
import { Navbar } from './widgets/Navbar'
import { LogEntry } from './widgets/LogEntry'
import { ThemeManager, themes } from './providers/ThemeContext'
import './style.css'
import { UserContext } from './providers/AuthContext'
import styled from 'styled-components'
import { TFlashAlert } from './services/Internal'
import { FlashAlert } from './widgets/FlashAlert'

const useAuth = () => {
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
  const [flashAlert, setFlashAlert] = useState<TFlashAlert | null>(null)

  function togTheme () {
    setTheme(currentTheme => {
      return currentTheme === themes.dark
        ? themes.light
        : themes.dark
    })
  }

  function listenForFlashAlert (event: Event) {
    const fa = (event as CustomEvent).detail as TFlashAlert
    setFlashAlert(fa)
    console.log('!!!!!!!!!!!!!! FlashAlert received!', fa)
  }

  useEffect(() => {
    document.body.addEventListener('flashAlert', listenForFlashAlert, false)
    return () => {
      document.body.removeEventListener('flashAlert', listenForFlashAlert)
    }
  }, [])

  useEffect(() => {
    setFlashAlert(null) // Reset the Flash Alert every time user signs in/out
  }, [user])

  let appWrapper = <></>
  if (!initializing) {
    appWrapper =
      <>
        <ThemeManager.Provider value={theme}>
          <UserContext.Provider value={{ user }}>
            <Navbar changeTheme={togTheme} />
            <Body>
              {flashAlert &&
                <FlashAlert key={new Date().toString()} {...flashAlert} />
              }
              <br />
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
