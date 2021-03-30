import { createContext } from 'react'

export const themes = {
  light: {
    foreground: 'black',
    background: 'white'
  },
  dark: {
    foreground: 'white',
    background: 'black'
  }
}

export const ThemeContext = createContext({
  theme: themes.light,
  toggler: () => {
    // Default. Never appears if overridden in /App.tsx.
    console.log('Default toggler has been called! If I am overriden, I will never appear!')
  }
})
