import { GetStaticProps } from "next";
import Image from "next/image";
import Link from "next/link";
import { format, parseISO } from "date-fns";
import ptBr from "date-fns/locale/pt-BR";
import { api } from "../services/api";
import { convertDurationToTimeString } from "../utils/convertDurationToTimeString";

import styles from "./home.module.scss";
import React from "react";

type Espisode = {
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
type HomeProps = {
  allEpisodes: Espisode[];
  lastestEpisodes: Espisode[];
};

export default function Home({ allEpisodes, lastestEpisodes }: HomeProps) {
  return (
    <div className={styles.homepage}>
      <section className={styles.lastestEpisodes}>
        <h2>Últimos lançamentos</h2>
        <ul>
          {lastestEpisodes.map((episodes) => {
            return (
              <li key={episodes.id}>
                <Image
                  width={192}
                  height={192}
                  src={episodes.thumbnail}
                  alt={episodes.title}
                  objectFit="cover"
                />

                <div className={styles.episodesDetails}>
                  <Link href={`/episodes/${episodes.id}`}>
                    <a>{episodes.title}</a>
                  </Link>

                  <p>{episodes.members}</p>
                  <span>{episodes.publishedAt}</span>
                  <span>{episodes.durationAsString}</span>
                </div>

                <button type="button">
                  <img src="/play-green.svg" alt="Tocar episodio" />
                </button>
              </li>
            );
          })}
        </ul>
      </section>
      <section className={styles.allEpisodes}>
        <h2>Todos episodios</h2>
        <table cellSpacing={0}>
          <thead>
            <tr>
              <th></th>
              <th>Podcastr</th>
              <th>Integrantes</th>
              <th>Data</th>
              <th>Duração</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {allEpisodes.map((episode) => {
              return (
                <tr key={episode.id}>
                  <td style={{ width: 72 }}>
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
                  <td style={{ width: 100 }}>{episode.publishedAt}</td>
                  <td>{episode.durationAsString}</td>
                  <td>
                    {
                      <button type="button">
                        <img src="/play-green.svg" alt="Tocar Episódio" />
                      </button>
                    }
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const { data } = await api.get("episodes", {
    params: {
      _limit: 12,
      _sort: "published_at",
      _order: "desc",
    },
  });

  const episodes = data.map((episodes) => {
    return {
      id: episodes.id,
      title: episodes.title,
      thumbnail: episodes.thumbnail,
      members: episodes.members,
      publishedAt: format(parseISO(episodes.published_at), "d MMM yy", {
        locale: ptBr,
      }),
      duration: Number(episodes.file.duration),
      durationAsString: convertDurationToTimeString(
        Number(episodes.file.duration)
      ),
      description: episodes.description,
      url: episodes.file.url,
    };
  });

  const lastestEpisodes = episodes.slice(0, 2);
  const allEpisodes = episodes.slice(2, episodes.length);
  return {
    props: {
      lastestEpisodes,
      allEpisodes,
    },
    revalidate: 60 * 60 * 8,
  };
};
