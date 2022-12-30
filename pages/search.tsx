import { GetServerSideProps } from "next";
import Head from "next/head";
import React from "react";
import Label from "../components/atoms/Label";
import HeadlineList from "../components/HeadlineList";
import { IHeadline } from "../services/articles/article.interface";
import { searchArticles } from "../services/articles/server";
import { withDB } from "../services/database";
import { returnProps, returnRedirect } from "../util/next";

type SearchProps = {
  query: string;
  headlines: IHeadline[];
};

export const getServerSideProps: GetServerSideProps<SearchProps> = async ({
  query,
}) => {
  if (!Object.hasOwn(query, "q")) {
    return returnRedirect("/", true);
  }
  const headlines = await withDB((conn) => {
    return searchArticles(conn, query.q as string);
  });
  return returnProps({
    query: query.q as string,
    headlines,
  });
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
      <HeadlineList
        headlines={headlines}
        emptyText="We couldn't find anything matching that search query."
      />
    </div>
  );
};

export default Search;
