import { createContext } from 'react'

export const themes = {
  light: {
    foreground: '#000000',
    background: '#eeeeee'
  },
  dark: {
    foreground: '#ffffff',
    background: '#222222'
  }
}

export const themeManager = {
  currentTheme: themes.light, // default theme
  toggleTheme: (curTheme: any) => {
    console.log('currentTheme:', curTheme)
    themeManager.currentTheme =
      curTheme === themes.dark
        ? themes.light
        : themes.dark
    return Object.assign({}, themeManager)
  }
}

export const ThemeManager = createContext(themeManager)
