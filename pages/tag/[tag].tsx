import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import React from "react";
import Label from "../../components/atoms/Label";
import HeadlineList from "../../components/HeadlineList";
import { IHeadline } from "../../services/articles/article.interface";
import {
  getArticleTags,
  getHeadlinesByTag,
} from "../../services/articles/server";
import { withDB } from "../../services/database";
import {
  DEFAULT_REVALIDATE_PERIOD,
  returnProps,
  returnRedirect,
} from "../../util/next";

type TagProps = {
  tag: string;
  headlines: IHeadline[];
};

export const getStaticPaths: GetStaticPaths = async () => {
  const tags = await withDB((conn) => {
    return getArticleTags(conn);
  });
  return {
    fallback: "blocking",
    paths: tags.map((tag) => ({
      params: {
        tag,
      },
    })),
  };
};

export const getStaticProps: GetStaticProps<TagProps> = async ({ params }) => {
  if (!params?.tag) {
    return returnRedirect("/");
  }
  const tag = params.tag as string;
  const headlines = await withDB((conn) => {
    return getHeadlinesByTag(conn, tag);
  });
  return returnProps(
    {
      tag,
      headlines,
    },
    DEFAULT_REVALIDATE_PERIOD
  );
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
