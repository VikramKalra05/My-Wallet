import React from 'react'
import { createContext, useState } from 'react'

const ThemeContext = createContext()

const ThemeContextProvider = () => {
  const [darkTheme, setDarkTheme] = useState(false);

  return (
    <ThemeContext.Provider value={{ darkTheme, setDarkTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export default ThemeContextProvider