import Image from "next/image";

import { usePlayer } from "../../hooks/PlayerContext";

import styles from "./styles.module.scss";
import {
  BiPlay,
  BiSkipNext,
  BiSkipPrevious,
  BiRepeat,
  BiShuffle,
  BiPause,
} from "react-icons/bi";

import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { useEffect, useRef, useState } from "react";
import { convertDurationToTimeString } from "../../utils/convertDurationToTimeString";
import { useDarkTheme } from "../../hooks/DarkThemeContext";

export function Player() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [progress, setProgress] = useState(0);

  const {
    episodeList,
    currentEpisodeIndex,
    isPlaying,
    toggleIsPlaying,
    setPlayingState,
    playNext,
    playPrevious,
    hasNext,
    hasPrevious,
    isLooping,
    toggleIsLooping,
    isShuffling,
    toggleIsShuffling,
    clearPlayerState
  } = usePlayer();

  const { isDark } = useDarkTheme();

  useEffect(() => {
    if (!audioRef.current) {
      return;
    }

    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  function setupProgressListener() {
    audioRef.current.currentTime = 0;
    audioRef.current.addEventListener('timeupdate', () => {
      setProgress(Math.floor(audioRef.current.currentTime));
    });
  }

  function handleSeek(amount: number) {
    audioRef.current.currentTime = amount;
    setProgress(amount);
  }

  function handleEpisodeEnded() {
    if(hasNext) {
      playNext();
    } else {
      clearPlayerState();
    }
  }

  const episode = episodeList[currentEpisodeIndex];
  return (
    <aside className={!isDark ? styles.AsideContainer : `${styles.AsideContainer} ${styles.AsideContainerDark}`}>
      <div>
        <header className={styles.TitleFlex}>
          <img src="/headphone.svg" alt="Headphone" />
          <h1>Tocando agora</h1>
        </header>
        {episode ? (
          <main className={styles.CurrentEpisode}>
            <Image
              width={592}
              height={592}
              src={episode.thumbnail}
              objectFit="cover"
            />
            <strong>{episode.title}</strong>
            <span>{episode.members}</span>
          </main>
        ) : (
          <main className={styles.PodcastBox}>
            <h2>
              Selecione um
              <br />
              podcast para ouvir
            </h2>
          </main>
        )}
        <footer
          className={`${styles.PlayerStats} ${!episode ? styles.empty : ""}`}
        >
          <div className={styles.progress}>
          <span>{convertDurationToTimeString(progress)}</span>
            <div className={styles.slider}>
              {episode ? (
                <Slider
                  max={episode.duration}
                  value={progress}
                  onChange={handleSeek}
                  trackStyle={{ backgroundColor: "#04d361" }}
                  railStyle={{ backgroundColor: "#9f75ff" }}
                  handleStyle={{ borderColor: "#04d361", borderWidth: 4 }}
                />
              ) : (
                <div className={styles.emptySlider} />
              )}
            </div>
            <span>{convertDurationToTimeString(episode?.duration ?? 0)}</span>
          </div>

          {episode && (
            <audio
              src={episode.url}
              ref={audioRef}
              loop={isLooping}
              autoPlay
              onEnded={handleEpisodeEnded}
              onLoadedMetadata={setupProgressListener}
              onPlay={() => setPlayingState(true)}
              onPause={() => setPlayingState(false)}
            />
          )}

          <div className={styles.buttonContainer}>
           <button
              type="button"
              disabled={!episode || episodeList.length === 1}
              onClick={toggleIsShuffling}
              className={isShuffling ? styles.isActive :''}
            >
              <BiShuffle size={30} />
            </button>
            <button type="button" disabled={!episode || !hasPrevious} onClick={playPrevious}>
              <BiSkipPrevious size={40} />
            </button>
            <button
              type="button"
              disabled={!episode}
              className={styles.playButton}
              onClick={toggleIsPlaying}
            >
              {!isPlaying ? <BiPlay size={40} /> : <BiPause size={40} />}
            </button>
            <button type="button" disabled={!episode || !hasNext} onClick={playNext}>
              <BiSkipNext size={40} />
            </button>
            <button type="button" disabled={!episode} onClick={toggleIsLooping} className={isLooping ? styles.isActive : ''}>
              <BiRepeat size={30} />
            </button>
          </div>
        </footer>
      </div>
    </aside>
  );
}
