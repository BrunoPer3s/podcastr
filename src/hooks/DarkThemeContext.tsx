import { createContext, ReactNode, useContext, useState } from 'react';

interface DarkThemeContextData {
  isDark: boolean;
  toggleIsDark: () => void;
}

interface DarkThemeProviderProps {
  children: ReactNode;
}

export const DarkThemeContext = createContext<DarkThemeContextData>({} as DarkThemeContextData);

export function DarkThemeProvider ({children} : DarkThemeProviderProps) {
  const [ isDark, setIsDark ] = useState(false);

  function toggleIsDark () {
    setIsDark(!isDark);
  }
  return (
    <DarkThemeContext.Provider value={{isDark, toggleIsDark}}>
      {children}
    </DarkThemeContext.Provider>
  )
}

export const useDarkTheme = () => useContext(DarkThemeContext);