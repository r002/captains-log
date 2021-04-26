import styled, { css } from 'styled-components'
import firebase from 'firebase/app'
import { useState, useEffect } from 'react'
import { Navbar } from './widgets/Navbar'
import { ThemeContext, themes } from './providers/ThemeContext'
import './style.css'
import { UserContext } from './providers/AuthContext'
import { TFlashAlert, sendFlashAlert } from './services/Internal'
import Sidebar from './widgets/Sidebar'
import LogEntry from './pages/LogEntry'
import StoryBoard from './pages/StoryBoard'
import Results from './pages/Results'
import Admin from './pages/Admin'
import Write from './pages/Write'

type TMainLayout = {
  readonly collapseSidebar: boolean
  readonly userLoggedIn: boolean
}

const MainLayout = styled.div<TMainLayout>`
  height: 100vh;
  display: grid;
  grid-gap: 0;
  grid-template-columns: 0  1fr;
  grid-template-rows: 52px  1fr;
  grid-template-areas:
    "sidebar navbar"
    "sidebar content";
  background-color: transparent;
  color: #444;

  ${props => props.userLoggedIn && css`
  grid-template-columns: 250px  1fr;
  `}

  ${props => props.collapseSidebar && css`
  grid-template-columns: 50px  1fr;
  `}
`

const Body = styled.div`
  grid-area: content;
  padding: 40px 20px 20px 20px;
  width: 100%;
  background-color: transparent;
  /* background: lightslategray; */
  box-sizing: border-box;
  /* border: solid darkgray 1px; */
`

type TUserAuth = {
  initializing: boolean
  user: firebase.User | null
}
const useAuth = () => {
  const [state, setState] = useState(() => {
    // const user = firebase.auth().currentUser
    return {
      initializing: true,
      user: null
    } as TUserAuth
  })

  function onChange (u: firebase.User | null) {
    // console.log('^^^^^^^^^^^^^^^^^^user auth onChange fired!', user)
    // Check if the user is authorized to use the system
    if (u) {
      const docRef = firebase.firestore().collection('authorized').doc(u.uid)
      docRef.get().then((doc) => {
        if (doc.exists) {
          console.log('Document data:', doc.data())
          setState(() => {
            return {
              initializing: false,
              user: u
            }
          })
        }
        // Note: else block never fires because of security rule
        // else {
        //   // doc.data() will be undefined in this case
        //   console.log('No such document!')
        // }
      }).catch((error) => {
        console.log(`${u.displayName} has insufficient firestore security permissions. Sign out.`, error)
        const flashAlert = {
          alert: `Sorry! ${u.displayName} isn't authorized`,
          content: u.email,
          debug: {
            logId: '' // TODO: Such a hack. Fix this later. 4/10/21
          }
        } as TFlashAlert
        sendFlashAlert(flashAlert)
        firebase.auth().signOut()
      })
    } else {
      // user object is null. No user signed in
      setState(() => {
        return {
          initializing: false,
          user: null
        }
      })
    }
  }

  useEffect(() => {
    // listen for auth state changes
    const unsubscribe = firebase.auth().onAuthStateChanged(onChange)
    // unsubscribe to the listener when unmounting
    return () => unsubscribe()
  }, [])

  return state
}

const pages = new Map([
  ['index', <LogEntry />],
  ['storyboard', <StoryBoard />],
  ['results', <Results />],
  ['write', <Write />],
  ['admin', <Admin />]
])

type TApp = {
  page: string
}
const App = (props: TApp) => {
  const { initializing, user } = useAuth()
  const [collapseSidebar, setCollapseSidebar] = useState(false)
  const [page, setPage] = useState(props.page)
  const [context, setContext] = useState({
    theme: themes.light,
    toggleTheme: customToggler
  })

  function navigate (page: string): void {
    if (page.includes('https://')) {
      window.location.href = page
    } else {
      setPage(page)
    }
  }

  function customToggler (): void {
    setContext((oldContext) => ({
      theme: oldContext.theme === themes.light
        ? themes.dark
        : themes.light,
      toggleTheme: customToggler
    }))
  }

  useEffect(() => {
    history.pushState({ page: page }, page, '/?p=' + page)
  }, [page])

  let appWrapper = <></>
  if (initializing) {
    console.log('firebase is initializing!!!!')
  } else {
    appWrapper =
      <>
        <ThemeContext.Provider value={context}>
          <UserContext.Provider value={{ user }}>
            <MainLayout collapseSidebar={collapseSidebar}
              userLoggedIn={user !== null}>
              {user &&
                <Sidebar navigate={navigate}
                  selectedPage={page}
                  collapseSidebar={collapseSidebar}
                  setCollapseSidebar={setCollapseSidebar} />
              }
              <Navbar />
              <Body>
                {user === null
                  ? '👋 Hello! 🙋‍♂️ Please login to proceed. 🙏'
                  : pages.get(page) ?? <>Page not found!</>}
              </Body>
            </MainLayout>
          </UserContext.Provider>
        </ThemeContext.Provider>
      </>
    document.body.style.visibility = 'visible'
  }

  // console.log('App render fired 😁')
  // console.log('App render fired 😁', initializing, user)

  return (appWrapper)
}

export default App
