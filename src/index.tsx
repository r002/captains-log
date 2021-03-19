import { useState, StrictMode } from 'react'
import ReactDOM from 'react-dom'
import { Navbar } from './widgets/Navbar'
import { ThemeManager, themeManager } from './providers/ThemeContext'
import './style.css'

const App = () => {
  const [theme, setTheme] = useState(themeManager)

  function togTheme () {
    setTheme(currThemePack => {
      return (themeManager.toggleTheme(currThemePack.currentTheme))
    })
  }

  return (
    <ThemeManager.Provider value={theme}>
      <Navbar changeTheme={togTheme} />
    </ThemeManager.Provider>
  )
}

ReactDOM.render(
  <StrictMode>
    <App />
  </StrictMode>,
  document.querySelector('#root')
)
