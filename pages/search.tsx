import { connection } from "mongoose";
import { GetServerSideProps } from "next";
import Head from "next/head";
import React from "react";
import { searchArticles } from "../services/articles";
import { IHeadline } from "../services/articles/article.interface";
import { connectToDB } from "../services/database";
import stringifyIds from "../util/stringifyIds";

type SearchProps = {
  query: string;
  headlines: IHeadline[];
};

export const getServerSideProps: GetServerSideProps<SearchProps> = async ({
  query,
}) => {
  if (!Object.hasOwn(query, "q")) {
    return {
      redirect: {
        destination: "/",
        permanent: true,
      },
    };
  }
  const conn = await connectToDB();
  const headlines = await searchArticles(conn, query.q as string);
  conn.close();
  stringifyIds(headlines);
  return {
    props: {
      query: query.q as string,
      headlines,
    },
  };
};

const Search: React.FC<SearchProps> = ({ query, headlines }) => {
  return (
    <div className="w-full flex flex-col">
      <Head>
        <title>{query} - Search - The Husky Husky</title>
        <meta name="description" content="Search The Husky Husky's articles." />
      </Head>
      {headlines.map((headline) => (
        <div key={headline._id}>{headline.title}</div>
      ))}
    </div>
  );
};

export default Search;
