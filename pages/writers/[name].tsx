import { GetStaticPaths, GetStaticProps, NextApiRequest } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useMemo, useState } from "react";
import { MdModeEdit, MdOutlineEdit } from "react-icons/md";
import { toast } from "react-toastify";
import Button from "../../components/atoms/Button";
import HeadlineList from "../../components/HeadlineList";
import { getHeadlinesByUser } from "../../services/articles";
import { IArticle, IHeadline } from "../../services/articles/article.interface";
import { connectToDB } from "../../services/database";
import { getPublicUser, getPublicUsers } from "../../services/users";
import { PublicUser } from "../../services/users/user.interface";
import { apiClient } from "../../util/client";
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
    stringifyIds(user);
    if (user) {
      const headlines = await getHeadlinesByUser(conn, user._id);
      conn.close();
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
  const router = useRouter();

  const write = async () => {
    const res = await apiClient.post<IArticle>("/articles");
    if (res.success) {
      router.push(`/edit/${res.data._id}`);
    } else {
      toast.error(res.error);
    }
  };

  return (
    <div className="w-full">
      <Head>
        <title>{`${user.name} - The Husky Husky`}</title>
        <meta name="description" content={user.bio} />
      </Head>
      <div className="flex flex-row justify-between">
        <div>
          <h1 className="text-3xl font-semibold">{user.name}</h1>
          <h2 className="text-gray-400 mb-8">{user.bio}</h2>
        </div>
        <div>
          <Button
            className="flex flex-row items-center space-x-2"
            onClick={write}
          >
            <MdModeEdit />
            <span>Write</span>
          </Button>
        </div>
      </div>
      <HeadlineList headlines={headlines} />
    </div>
  );
};

export default Writer;
