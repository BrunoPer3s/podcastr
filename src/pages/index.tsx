import { GetStaticProps } from "next";
import Image from "next/image";
import Head from "next/head";
import Link from 'next/link';
import { api } from "../api";
import { format, parseISO } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";
import { convertDurationToTimeString } from "../utils/convertDurationToTimeString";

import styles from "../styles/pages/home.module.scss";
import { BiPlay } from "react-icons/bi";
import { usePlayer } from "../hooks/PlayerContext";
import { useDarkTheme } from "../hooks/DarkThemeContext";

import { AiFillFire } from 'react-icons/ai';
import { FiRadio } from 'react-icons/fi';
import Cookies from "js-cookie";

interface Episode {
  id: string;
  title: string;
  thumbnail: string;
  members: string;
  duration: number;
  durationAsString: string;
  url: string;
  publishedAt: string;
}

interface HomeProps {
  latestEpisodes: Episode[];
  allEpisodes: Episode[];
}

export default function Home({ latestEpisodes, allEpisodes }: HomeProps) {
  const { playList } = usePlayer();
  const { isDark } = useDarkTheme();

  const episodeList = [...latestEpisodes, ...allEpisodes];

  return (
    <div className={!isDark ? styles.homepage : `${styles.homepage} ${styles.homepageDark}`}>
      <Head>
        <title>Home | Podcastr</title>
      </Head>
      <section>
        <h1>
          <AiFillFire color="#04d361" style={{marginRight: '16px'}}/>
          Últimos lançamentos
        </h1>
        <ul>
          {latestEpisodes.map((ep, index) => (
            <li key={ep.id}>
              <Image
                width={192}
                height={192}
                src={ep.thumbnail}
                alt={ep.title}
                objectFit="cover"
              />
              <div className={!isDark ? styles.episodeDetails : `${styles.episodeDetails} ${styles.episodeDetailsDark}`}>
                <Link href={`/episodes/${ep.id}`}>
                  <a>{ep.title}</a>
                </Link>
                <p>{ep.members}</p>
                <span>{ep.publishedAt}</span>
                <span>{ep.durationAsString}</span>
              </div>
              <button type="button" onClick={() => playList(episodeList, index)}>
                <BiPlay size={28} color={!isDark ? "#04D361" : '#fff'} />
              </button>
            </li>
          ))}
        </ul>
      </section>
      <section className={!isDark ? styles.allEpisodes : `${styles.allEpisodes} ${styles.allEpisodesDark}`}>
        <h1>
          <FiRadio color="#04d361" style={{marginRight: '16px'}}/>
          Todos os episódios
        </h1>
        <table>
          <thead>
            <tr>
              <th>Podcast</th>
              <th className="invisible-th"></th>
              <th>Integrantes</th>
              <th>Data</th>
              <th>Duração</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {allEpisodes.map((episode, index) => (
              <tr key={episode.id}>
                <td>
                  <Image
                    width={120}
                    height={120}
                    src={episode.thumbnail}
                    alt={episode.title}
                    objectFit="cover"
                  />
                </td>
                <td>
                  <Link href={`/episodes/${episode.id}`}>
                    <a>{episode.title}</a>
                  </Link>
                </td>
                <td>{episode.members}</td>
                <td style={{width: 100}}>{episode.publishedAt}</td>
                <td>{episode.durationAsString}</td>
                <td>
                  <button type="button" onClick={() => playList(episodeList, index + latestEpisodes.length)}>
                    <BiPlay size={28} color={!isDark ? "#04D361" : '#fff'}/>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async (ctx) => {
  const response = await api.get("episodes", {
    params: {
      _limit: 12,
      _sort: "published_at",
      _order: "desc",
    },
  });

  const episodes = response.data.map((episode) => {
    return {
      id: episode.id,
      title: episode.title,
      thumbnail: episode.thumbnail,
      members: episode.members,
      publishedAt: format(parseISO(episode.published_at), "d MMM yy", {
        locale: ptBR,
      }),
      duration: Number(episode.file.duration),
      durationAsString: convertDurationToTimeString(
        Number(episode.file.duration)
      ),
      url: episode.file.url,
    };
  });

  const latestEpisodes = episodes.slice(0, 2);
  const allEpisodes = episodes.slice(2, episodes.length);

  return {
    props: {
      latestEpisodes,
      allEpisodes
    },
    revalidate: 60 * 60 * 8,
  };
};




