import { GetServerSideProps } from "next";
import { AppProps } from "next/app";
import { Header } from "../components/Header";
import { Player } from "../components/Player";
import { DarkThemeProvider } from "../hooks/DarkThemeContext";
import { PlayerProvider } from "../hooks/PlayerContext";
import { GlobalStyles } from '../styles/global';

interface Props {
  isDark: boolean;
}

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <DarkThemeProvider isAlreadyDark={pageProps.isDark}>
      <PlayerProvider>
        <div style={{display: 'flex', width:"100%"}}>
          <main style={{width: '1440px'}}>
            <Header/>
            <Component {...pageProps} />
          </main>
          <Player/>
        </div>
        <GlobalStyles/>
      </PlayerProvider>
    </DarkThemeProvider>
  );
}



export default MyApp;



