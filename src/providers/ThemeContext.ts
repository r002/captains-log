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

export const ThemeManager = createContext(themes.light)
