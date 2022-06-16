import type { NextPage } from "next";
import Head from "next/head";
import { getTopRevenues } from "../sqlite3/database";
import Image from "next/image";
import React from "react";

const CardStreamer = ({
  streamerId,
  twitch_data,
  rank,
  sum_salary_all,
}: {
  streamerId: string;
  twitch_data: any;
  rank: number;
  sum_salary_all: number;
}) => (
  <div
    key={streamerId}
    className="flex flex-col border-2 border-white rounded-lg p-5 min-w-full"
  >
    <div className="flex items-center">
      <div className="flex-shrink-0">
        <Image
          src={twitch_data.logo}
          alt={twitch_data.displayName}
          width={48}
          height={48}
          className="rounded-full h-12 w-12"
        />
      </div>
      <div className="flex-grow ml-4">
        <div className="flex flex-col">
          <div className="flex flex-grow justify-between">
            <div className="text-gray-200 font-extrabold text-lg tracking-tight text-ellipsis overflow-hidden w-8/12">
              {twitch_data.displayName}
            </div>
            <div className="text-gray-200 font-extrabold text-lg tracking-tight w-4/12 text-end">
              {String(rank.toLocaleString("pt-BR"))}º
            </div>
          </div>
          <div className="flex-grow">
            <p className="text-neutral-400 font-extrabold text-2xl tracking-tight">
              {sum_salary_all}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const Home: NextPage<{
  topRevenues: Array<any>;
}> = ({ topRevenues }) => {
  const [activeSearch, setActiveSearch] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [inputSearch, setInputSearch] = React.useState("");

  const [searchValue, setSearchValue] = React.useState<{
    streamerId: string;
    twitch_data: any;
    rank: number;
    sum_salary_all: number;
  }>();

  return (
    <>
      <Head>
        <title>Twitch Payouts Leak</title>
        <meta
          name="description"
          content="Histórico de pagamentos dos streamers da Twitch durante agosto de 2019 há outubro de 2021."
        />
      </Head>
      <div className="max-w-8xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex flex-col items-center mt-20">
          <h1 className="text-gray-200 font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight text-center">
            Twitch Payouts Leak
          </h1>
          <div className="mt-6">
            <p className="text-neutral-400 font-extrabold text-2xl sm:text-3xl lg:text-4xl tracking-tight text-center">
              Histórico de pagamentos dos streamers da Twitch durante agosto de
              2019 a outubro de 2021.
            </p>
          </div>
          <div className="mt-12">
            <h2 className="text-gray-200 font-extrabold text-2xl sm:text-3xl lg:text-4xl tracking-tight text-center">
              Vazamento de dados
            </h2>
            <p className="text-neutral-400 font-extrabold text-2xl sm:text-3xl lg:text-4xl tracking-tight text-center">
              Em 6 de agosto de 2021, o site da Twitch foi atingido por
              vazamento de dados. Foi exposto o histórico de pagamentos dos
              streamers da plataforma, mais de 2 milhões de usuários foram
              expostos.
            </p>
          </div>
        </div>
        <div className="flex flex-col mt-20" id="search">
          <div className="flex flex-col items-center">
            <form className="flex flex-col w-full xl:flex-row xl:w-1/3">
              <input
                className="bg-neutral-600 appearance-none font-extrabold text-lg border-2 border-transparent text-neutral-400 rounded w-full py-4 px-4 leading-tight focus:outline-none focus:border-neutral-500"
                id="search-input"
                type="text"
                placeholder="Nome do streamer"
                onChange={(e) => setInputSearch(e.target.value)}
              />
              <button
                className="bg-neutral-500 hover:bg-neutral-600 text-white text-lg font-extrabold py-2 px-4 rounded focus:outline-none focus:shadow-outline my-4 xl:ml-4 xl:my-0 "
                type="submit"
                onClick={async (e) => {
                  e.preventDefault();
                  // if (loading) return;
                  setActiveSearch(false);
                  if (inputSearch.length > 0) {
                    setLoading(true);
                    const apiTwitch = await fetch(
                      `https://api.ivr.fi/twitch/resolve/${inputSearch}`
                    );
                    const dataTwitch = await apiTwitch.json();

                    if (dataTwitch.status !== 200) {
                      setLoading(false);
                      return;
                    }

                    const apiSearch = await fetch(
                      `./api/database?id=${dataTwitch.id}`
                    );
                    const data = await apiSearch.json();
                    if (data.result.length > 0) {
                      console.log("aqui")
                      setActiveSearch(true);
                      const result = data.result[0];
                      setSearchValue({
                        streamerId: result.streamerId,
                        twitch_data: result.twitch_data,
                        rank: result.rank,
                        sum_salary_all: result.sum_salary_all,
                      });
                    }
                    setLoading(false);
                  } else {
                    setActiveSearch(false);
                    setLoading(false);
                  }
                }}
              >
                Buscar
              </button>
            </form>
          </div>
        </div>
        {loading && (
          <div className="flex flex-col items-center mt-20">
            <div className="text-neutral-400 font-extrabold text-2xl sm:text-3xl lg:text-4xl tracking-tight text-center">
              Buscando...
            </div>
          </div>
        )}
        {activeSearch && searchValue && (
          <div className="flex justify-center my-20">
            <div className="w-96 flex">
              <CardStreamer
                streamerId={searchValue.streamerId}
                twitch_data={searchValue.twitch_data}
                rank={searchValue.rank}
                sum_salary_all={searchValue.sum_salary_all}
              />
            </div>
          </div>
        )}
        {!activeSearch && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-5 gap-5 my-20">
            {topRevenues.map(
              ({
                twitch_data,
                streamerId,
                sum_salary_all,
                rank,
              }: {
                rank: number;
                streamerId: string;
                sum_salary_all: any;
                twitch_data: any;
              }) => (
                <CardStreamer
                  key={streamerId}
                  streamerId={streamerId}
                  twitch_data={twitch_data}
                  rank={rank}
                  sum_salary_all={sum_salary_all}
                />
              )
            )}
          </div>
        )}
      </div>
      <div className="flex justify-center my-4">
        <span className="text-gray-200 font-extrabold">
          Build by Eubyt
        </span>
      </div>
    </>
  );
};

export async function getStaticProps() {
  const topRevenues = await getTopRevenues(50);
  return {
    props: {
      topRevenues,
    },
  };
}

export default Home;
