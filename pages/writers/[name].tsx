import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import React, { useMemo, useState } from "react";
import { getHeadlinesByUser } from "../../services/articles";
import { IHeadline } from "../../services/articles/article.interface";
import { connectToDB } from "../../services/database";
import { getPublicUser, getPublicUsers } from "../../services/users";
import { PublicUser } from "../../services/users/user.interface";
import stringifyIds from "../../util/stringifyIds";

type WriterProps = {
  user: PublicUser;
  headlines: IHeadline[];
};

export const getStaticPaths: GetStaticPaths = async () => {
  const conn = await connectToDB();
  const users = await getPublicUsers(conn);
  conn.close();
  return {
    fallback: "blocking",
    paths: users.map(({ name }) => ({
      params: {
        name,
      },
    })),
  };
};

export const getStaticProps: GetStaticProps<WriterProps> = async ({
  params,
}) => {
  const name = params?.name;
  if (name) {
    const conn = await connectToDB();
    const user = await getPublicUser(conn, name as string);
    console.log(user);
    if (user) {
      const headlines = await getHeadlinesByUser(conn, user._id);
      conn.close();
      stringifyIds(user);
      stringifyIds(headlines);
      if (headlines) {
        return {
          props: {
            user,
            headlines,
          },
        };
      }
    }
    conn.close();
  }
  return {
    notFound: true,
  };
};

const Writer: React.FC<WriterProps> = ({ user, headlines }) => {
  return (
    <div className="w-full">
      <Head>
        <title>{`${user.name} - The Husky Husky`}</title>
        <meta name="description" content={user.bio} />
      </Head>
      {headlines.map((headline) => (
        <div key={headline._id}>{headline.title}</div>
      ))}
    </div>
  );
};

export default Writer;
