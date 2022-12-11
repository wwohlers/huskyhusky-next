import { GetStaticProps } from "next";
import Head from "next/head";
import React from "react";
import Headline from "../components/home/Headline";
import HeadlineGroup from "../components/home/HeadlineGroup";
import { getHeadlines } from "../services/articles/server";
import { IHeadline } from "../services/articles/article.interface";
import { withDB } from "../services/database";

type HomeProps = {
  headlines: IHeadline[];
};

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  const headlines = await withDB((conn) => {
    return getHeadlines(conn);
  });
  return {
    props: {
      headlines,
    },
  };
};

const Home: React.FC<HomeProps> = ({ headlines }) => {
  return (
    <div className="flex flex-col xl:flex-row justify-center items-center">
      <Head>
        <title>Home - The Husky Husky</title>
        <meta name="description" content="Northeastern's finest news source." />
      </Head>
      <div className="w-full xl:w-2/3 flex flex-row flex-wrap">
        <Headline height="double" headline={headlines[0]} />
        <Headline containerClasses="md:w-1/2" headline={headlines[1]} />
        <Headline containerClasses="md:w-1/2" headline={headlines[2]} />
        <HeadlineGroup
          containerClasses="md:w-1/2"
          headlines={headlines.slice(3, 6)}
        />
        <HeadlineGroup
          containerClasses="md:w-1/2"
          headlines={headlines.slice(6, 9)}
        />
        <Headline containerClasses="md:w-1/2" headline={headlines[9]} />
        <Headline containerClasses="md:w-1/2" headline={headlines[10]} />
      </div>
      <div className="w-full xl:w-1/3 flex flex-row flex-wrap">
        <Headline
          containerClasses="md:w-1/2 xl:w-full"
          headline={headlines[11]}
        />
        <Headline
          containerClasses="md:w-1/2 xl:w-full"
          headline={headlines[12]}
        />
        <Headline
          containerClasses="md:w-1/2 xl:w-full"
          headline={headlines[13]}
        />
        <HeadlineGroup
          containerClasses="md:w-1/2 xl:w-full"
          headlines={headlines.slice(14, 17)}
        />
        <Headline
          containerClasses="block md:hidden xl:block xl:w-full"
          headline={headlines[17]}
        />
      </div>
    </div>
  );
};

export default Home;
