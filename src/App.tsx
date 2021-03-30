import firebase from 'firebase/app'
import { useState, useEffect } from 'react'
import { Navbar } from './widgets/Navbar'
import { LogEntry } from './widgets/LogEntry'
import { ThemeContext, themes } from './providers/ThemeContext'
import './style.css'
import { UserContext } from './providers/AuthContext'
import styled from 'styled-components'
import { TFlashAlert } from './services/Internal'
import { FlashAlert } from './widgets/FlashAlert'

const Body = styled.div`
  padding: 40px 20px 20px 20px;
  width: 100%;
  /* background: lightslategray; */
  box-sizing: border-box;
  /* border: solid darkgray 1px; */
`

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

const App = () => {
  const { initializing, user } = useAuth()
  const [flashAlert, setFlashAlert] = useState<TFlashAlert | null>(null)
  const [context, setContext] = useState({
    theme: themes.light,
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    toggler: customToggler
  })

  function customToggler (): void {
    setContext((oldContext) => ({
      theme: oldContext.theme === themes.light
        ? themes.dark
        : themes.light,
      toggler: customToggler
    }))
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
    setFlashAlert(null) // Reset the Flash Alert every time. This is hacky; fix later 3/28/21
  }, [user])

  let appWrapper = <></>
  if (!initializing) {
    appWrapper =
      <>
        <ThemeContext.Provider value={context}>
          <UserContext.Provider value={{ user }}>
            <Navbar />
            <Body>
              {flashAlert &&
                <FlashAlert key={new Date().toString()} {...flashAlert} />
              }
              <br />
              <LogEntry />
            </Body>
          </UserContext.Provider>
        </ThemeContext.Provider>
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
