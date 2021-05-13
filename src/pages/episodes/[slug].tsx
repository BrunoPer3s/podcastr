import { format, parseISO } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";
import { GetServerSideProps, GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/dist/client/router";
import { api } from "../../api";
import { convertDurationToTimeString } from "../../utils/convertDurationToTimeString";
import styles from "../../styles/pages/episode.module.scss";
import Image from "next/image";
import { BiChevronLeft, BiPlay } from "react-icons/bi";
import { usePlayer } from "../../hooks/PlayerContext";
import Head from "next/head";
import { useDarkTheme } from "../../hooks/DarkThemeContext";

interface Episode {
  id: string;
  title: string;
  thumbnail: string;
  members: string;
  description: string;
  duration: number;
  durationAsString: string;
  url: string;
  publishedAt: string;
}

interface EpisodeProps {
  episode: Episode;
}

export default function Episode({ episode }: EpisodeProps) {
  const { back } = useRouter();
  const { play } = usePlayer();
  const { isDark } = useDarkTheme();
  return (
    <div className={!isDark ? styles.container : `${styles.container} ${styles.containerDark}`}>
       <Head>
        <title>{episode.title} | Podcastr</title>
      </Head>
      <section>
        <header>
          <button type="button" onClick={() => back()}>
            <BiChevronLeft size={30} />
          </button>
          <button type="button">
            <BiPlay size={35}  onClick={() => play(episode)} />
          </button>
          <Image
            width={800}
            height={600}
            objectFit="cover"
            src={episode.thumbnail}
            alt={episode.title}
          />
        </header>
        <main>
          <h1>{episode.title}</h1>
          <div>
            <span>{episode.members}</span>
            <span>{episode.publishedAt}</span>
            <span>{episode.durationAsString}</span>
          </div>
          <div dangerouslySetInnerHTML={{__html: episode.description}}/>
        </main>
      </section>
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const { data } = await api.get('episodes',  {
    params: {
      _limit: 2,
      _sort: "published_at",
      _order: "desc",
    }
  });

  const paths = data.map(episode => {
    return {
      params: {
        slug: episode.id
      }
    }
  });

  return {
    paths,
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async (ctx) => {
  const { slug } = ctx.params;
  const { data } = await api.get(`/episodes/${slug}`);
  
  const episode = {
    id: data.id,
    title: data.title,
    thumbnail: data.thumbnail,
    members: data.members,
    description: data.description,
    publishedAt: format(parseISO(data.published_at), "d MMM yy", {
      locale: ptBR,
    }),
    duration: Number(data.file.duration),
    durationAsString: convertDurationToTimeString(Number(data.file.duration)),
    url: data.file.url,
  };
  return {
    props: {
      episode,
    },
    revalidate: 60 * 60 * 24, // 24 hours
  };
};




