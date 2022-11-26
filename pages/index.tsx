import React from "react";
import { GetStaticProps } from "next";
import Head from "next/head";
import { connectToDB } from "../database";
import { getHeadlines } from "../services/articles";
import { IHeadline } from "../services/articles/article.interface";
import stringifyIds from "../util/stringifyIds";
import styles from "../styles/Home.module.scss";
import Headline from "../components/home/Headline";
import HeadlineGroup from "../components/home/HeadlineGroup";

type HomeProps = {
  headlines: IHeadline[];
};

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  const conn = await connectToDB();
  const headlines = await getHeadlines(conn);
  conn.close();
  stringifyIds(headlines);
  return {
    props: {
      headlines,
    },
  };
};

const Home: React.FC<HomeProps> = ({ headlines }) => {
  return (
    <div>
      <Head>
        <title>Home - The Husky Husky</title>
        <meta name="description" content="Northeastern's finest news source." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex flex-col xl:flex-row md:w-[64rem] xl:w-[72rem]">
        <div className="w-full xl:w-2/3 flex flex-row flex-wrap">
          <Headline height="double" headline={headlines[0]} />
          <Headline width="half" headline={headlines[1]} />
          <Headline width="half" headline={headlines[2]} />
          <HeadlineGroup width="half" headlines={headlines.slice(3, 6)} />
          <HeadlineGroup width="half" headlines={headlines.slice(6, 9)} />
          <Headline width="half" headline={headlines[9]} />
          <Headline width="half" headline={headlines[10]} />
        </div>
        <div className="w-full xl:w-1/3 flex flex-col">
          <Headline headline={headlines[11]} />
          <Headline headline={headlines[12]} />
          <Headline headline={headlines[13]} />
          <HeadlineGroup headlines={headlines.slice(14, 17)} />
          <Headline headline={headlines[17]} />
        </div>
      </div>
    </div>
  );
};

export default Home;
