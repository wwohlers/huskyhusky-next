import { connection } from "mongoose";
import { GetServerSideProps } from "next";
import Head from "next/head";
import React from "react";
import Label from "../components/atoms/Label";
import HeadlineList from "../components/HeadlineList";
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
        <title>{`${query} - Search - The Husky Husky`}</title>
        <meta name="description" content="Search The Husky Husky's articles." />
      </Head>
      <Label>Search</Label>
      <h1 className="text-2xl font-semibold mb-6">{query}</h1>
      <HeadlineList headlines={headlines} />
    </div>
  );
};

export default Search;
