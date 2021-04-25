import { GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";
import { api } from "../../services/api";
import { format, parseISO } from "date-fns";
import ptBr from "date-fns/locale/pt-BR";
import { convertDurationToTimeString } from "../../utils/convertDurationToTimeString";

import styles from "./episodes.module.scss";
import Image from "next/image";
import Link from "next/link";

type Episode = {
  id: string;
  title: string;
  members: string;
  publishedAt: string;
  thumbnail: string;
  description: string;
  file: {};
  url: string;
  type: string;
  duration: number;
  durationAsString: string;
};

type EpisodeProps = {
  episodes: Episode;
};

export default function Episode({ episodes }: EpisodeProps) {
  return (
    <div className={styles.episode}>
      <div className={styles.thumbnailContainer}>
        <Link href="/">
          <button type="button">
            <img src="/arrow-left.svg" alt="Voltar" />
          </button>
        </Link>

        <Image
          width={700}
          height={160}
          src={episodes.thumbnail}
          objectFit="cover"
        ></Image>

        <button type="button">
          <img src="/play.svg" alt="Tocar Episodio" />
        </button>
      </div>

      <header>
        <h1>{episodes.title}</h1>
        <span>{episodes.members}</span>
        <span>{episodes.publishedAt}</span>
        <span>{episodes.durationAsString}</span>
      </header>
      <div
        className={styles.description}
        dangerouslySetInnerHTML={{ __html: episodes.description }}
      />
    </div>
  );
}
export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async (ctx) => {
  const { slug } = ctx.params;
  const { data } = await api.get(`/episodes/${slug}`);
  const episodes = {
    id: data.id,
    title: data.title,
    thumbnail: data.thumbnail,
    members: data.members,
    publishedAt: format(parseISO(data.published_at), "d MMM yy", {
      locale: ptBr,
    }),
    duration: Number(data.file.duration),
    durationAsString: convertDurationToTimeString(Number(data.file.duration)),
    description: data.description,
    url: data.file.url,
  };
  return {
    props: { episodes },
    revalidate: 60 * 60 * 24,
  };
};
