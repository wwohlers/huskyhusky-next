import { GetStaticPaths, GetStaticProps, NextApiRequest } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useMemo, useState } from "react";
import { MdModeEdit, MdOutlineEdit } from "react-icons/md";
import { toast } from "react-toastify";
import Button from "../../components/atoms/Button";
import HeadlineList from "../../components/HeadlineList";
import { getHeadlinesByUser } from "../../services/articles/server";
import { IArticle, IHeadline } from "../../services/articles/article.interface";
import { withDB } from "../../services/database";
import { getPublicUser, getPublicUsers } from "../../services/users/server";
import { PublicUser } from "../../services/users/user.interface";
import { apiClient } from "../../util/client";
import stringifyIds from "../../util/stringifyIds";

type WriterProps = {
  user: PublicUser;
  headlines: IHeadline[];
};

export const getStaticPaths: GetStaticPaths = async () => {
  const users = await withDB((conn) => {
    return conn.models.User.find().lean();
  });
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
  const [user, headlines] = await withDB(async (conn) => {
    const name = params?.name;
    if (!name) {
      return [undefined, undefined];
    }
    const user = await getPublicUser(conn, name as string);
    if (!user) {
      return [undefined, undefined];
    }
    const headlines = await getHeadlinesByUser(conn, user._id);
    return [user, headlines];
  });
  if (!user || !headlines) {
    return {
      notFound: true,
    };
  } else {
    return {
      props: {
        user,
        headlines,
      },
    };
  }
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
