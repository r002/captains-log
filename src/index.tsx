import { useState, StrictMode, useEffect } from 'react'
import ReactDOM from 'react-dom'
import { Navbar } from './widgets/Navbar'
import { ThemeManager, themes } from './providers/ThemeContext'
import './style.css'
import firebase from 'firebase/app'
import { UserContext } from './providers/AuthContext'

// export const useSession = () => {
//   const { user } = useContext(UserContext)
//   return user
// }

export const useAuth = () => {
  const [state, setState] = useState(() => {
    const user = firebase.auth().currentUser

    return {
      initializing: !user,
      user
    }
  })

  function onChange (user: any) {
    setState(() => { return ({ initializing: false, user }) })
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
  const [theme, setTheme] = useState(themes.light)
  const { initializing, user } = useAuth()
  console.log('>> initializing', initializing)

  function togTheme () {
    setTheme(currentTheme => {
      return currentTheme === themes.dark
        ? themes.light
        : themes.dark
    })
  }

  console.log('>> user:', user)

  return (
    <ThemeManager.Provider value={theme}>
      <UserContext.Provider value={{ user }}>
        <Navbar changeTheme={togTheme} />
        <br /><br />
        3/19, Fri - 01:30a ET: Body goes here.
      </UserContext.Provider>
    </ThemeManager.Provider>
  )
}

ReactDOM.render(
  <StrictMode>
    <App />
  </StrictMode>,
  document.querySelector('#root')
)
