import { GetServerSideProps } from "next";
import Head from "next/head";
import React from "react";
import { getHeadlinesByTag, searchArticles } from "../services/articles";
import { IHeadline } from "../services/articles/article.interface";
import { connectToDB } from "../services/database";
import stringifyIds from "../util/stringifyIds";

type TagProps = {
  tag: string;
  headlines: IHeadline[];
};

export const getServerSideProps: GetServerSideProps<TagProps> = async ({
  query,
}) => {
  if (!Object.hasOwn(query, "t")) {
    return {
      redirect: {
        destination: "/",
        permanent: true,
      },
    };
  }
  const conn = await connectToDB();
  const headlines = await getHeadlinesByTag(conn, query.t as string);
  conn.close();
  stringifyIds(headlines);
  return {
    props: {
      tag: query.t as string,
      headlines,
    },
  };
};

const Search: React.FC<TagProps> = ({ tag, headlines }) => {
  return (
    <div className="w-full flex flex-col">
      <Head>
        <title>{tag} - The Husky Husky</title>
        <meta
          name="description"
          content={`View all ${tag} articles on The Husky Husky.`}
        />
      </Head>
      {headlines.map((headline) => (
        <div key={headline._id}>{headline.title}</div>
      ))}
    </div>
  );
};

export default Search;
