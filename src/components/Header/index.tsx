import format from 'date-fns/format';
import ptBR from 'date-fns/locale/pt-BR';
import { useRouter } from 'next/dist/client/router';
import styles from './styles.module.scss';
import { FaMoon, FaSun} from 'react-icons/fa';
import { useDarkTheme } from '../../hooks/DarkThemeContext';

export function Header() {
  const {toggleIsDark, isDark} = useDarkTheme();

  const { push } = useRouter();
  const currentDate = format(new Date(), 'EEEE, d MMMM', {
    locale: ptBR,
  });

  return (
    <header className={!isDark ? styles.headerContainer : `${styles.headerContainer} ${styles.headerContainerDark}`}>
      <div className={styles.headerContent}> 
        <div className={!isDark ? styles.logoContainer : `${styles.logoContainer} ${styles.logoContainerDark}`}>
          <div onClick={() => push('/')}>
            <img src="/logo.svg" alt="Podcastr"/>
            <h1>Podcastr</h1>
          </div>
          <p>O melhor para você ouvir, sempre
          {isDark ? (
            <button type="button" onClick={toggleIsDark}>
              <FaSun color="#fdca40" size={20}/>
            </button>
          ) : (
            <button type="button" onClick={toggleIsDark}>
            <FaMoon color="#301b3f" size={20}/>
            </button>
          )}
          </p>
        </div>
        <span>{currentDate}</span>
      </div>
    </header>
  );
}