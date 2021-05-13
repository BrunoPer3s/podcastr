import { createContext, ReactNode, useContext, useState, useEffect } from 'react';
import { setCookie, parseCookies } from 'nookies';

interface DarkThemeContextData {
  isDark: boolean;
  toggleIsDark: () => void;
}

interface DarkThemeProviderProps {
  isAlreadyDark?: boolean;
  children: ReactNode;
}

export const DarkThemeContext = createContext<DarkThemeContextData>({} as DarkThemeContextData);

export function DarkThemeProvider ({children, isAlreadyDark} : DarkThemeProviderProps) {

  const [ isDark, setIsDark ] = useState(false);

  useEffect(() => {
    const { 'isDark': isDarkTheme } = parseCookies();
    setIsDark(Boolean(Number(isDarkTheme)));

  }, [])

  useEffect(() => {
      setCookie(undefined, 'isDark', String(Number(isDark)), {
        maxAge: 60 * 60 * 24 * 30,
        path: '/'
      });

      
  }, [isDark]);

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

