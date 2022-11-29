import { GetServerSideProps } from "next";
import Head from "next/head";
import React from "react";
import Label from "../components/atoms/Label";
import HeadlineList from "../components/HeadlineList";
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
        <title>{`${tag} - The Husky Husky`}</title>
        <meta
          name="description"
          content={`View all ${tag} articles on The Husky Husky.`}
        />
      </Head>
      <Label>View Tag</Label>
      <h1 className="text-2xl font-semibold mb-6">{tag}</h1>
      <HeadlineList headlines={headlines} />
    </div>
  );
};

export default Search;
