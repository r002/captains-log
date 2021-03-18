import { useState, StrictMode } from 'react'
import ReactDOM from 'react-dom'
import { LoginButton, LogoutButton, NormalButton } from './components'
import { ThemeManager, themeManager } from './providers/ThemeContext'
import TicTacToe from './TicTacToe/App'

const App = () => {
  const [theme, setTheme] = useState(themeManager)

  function togTheme () {
    setTheme(currThemePack => {
      return (themeManager.toggleTheme(currThemePack.currentTheme))
    })
  }

  return (
    <ThemeManager.Provider value={theme}>
      <br /><br />
      <LoginButton label='Login' />
      <br /><br />
      <LogoutButton label='Logout' />
      <br /><br />
      <NormalButton label='Toggle Theme' changeTheme={togTheme} />
      <br /><br />
      <hr />
      <TicTacToe />
    </ThemeManager.Provider>
  )
}

ReactDOM.render(
  <StrictMode>
    <App />
  </StrictMode>,
  document.querySelector('#root')
)
