import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useMemo } from "react";
import { MdModeEdit } from "react-icons/md";
import Button from "../../components/atoms/Button";
import HeadlineList from "../../components/HeadlineList";
import { useUser } from "../../hooks/useUser";
import { IHeadline } from "../../services/articles/article.interface";
import { getHeadlinesByUser } from "../../services/articles/server";
import { withDB } from "../../services/database";
import { getPublicUser } from "../../services/users/server";
import { PublicUser } from "../../services/users/user.interface";
import {
  DEFAULT_REVALIDATE_PERIOD,
  returnNotFound,
  returnProps,
} from "../../util/next";
import toastError from "../../util/toastError";
import { makeCreateArticleRequest } from "../api/articles";

type WriterProps = {
  user: PublicUser;
  headlines: IHeadline[];
};

export const getStaticPaths: GetStaticPaths = async () => {
  const users = await withDB(async (conn) => {
    return await conn.models.User.find().lean();
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
    return returnNotFound();
  } else {
    return returnProps({ user, headlines }, DEFAULT_REVALIDATE_PERIOD);
  }
};

const Writer: React.FC<WriterProps> = ({ user, headlines }) => {
  const router = useRouter();
  const authUser = useUser();

  const write = async () => {
    try {
      const data = await makeCreateArticleRequest();
      router.push(`/edit/${data._id}`);
    } catch (e) {
      toastError(e);
    }
  };

  const canWrite = authUser && authUser._id === user._id;

  const emptyText = canWrite
    ? "You haven't written anything yet. Click Write to get started!"
    : `${user.name} hasn't published anything yet. Check back later!`;

  const headlinesToShow = useMemo(() => {
    return headlines.filter((h) => h.public || canWrite);
  }, [headlines, canWrite]);

  return (
    <div className="w-full">
      <Head>
        <title>{`${user.name} - The Husky Husky`}</title>
        <meta name="description" content={user.bio} />
      </Head>
      <div className="flex flex-row justify-between">
        <div>
          <h1 className="text-3xl font-semibold">{user.name}</h1>
          <h2 className="text-secondary mb-8">{user.bio}</h2>
        </div>
        <div>
          {canWrite && (
            <Button
              className="flex flex-row items-center space-x-2"
              onClick={write}
            >
              <MdModeEdit />
              <span>Write</span>
            </Button>
          )}
        </div>
      </div>
      <HeadlineList headlines={headlinesToShow} emptyText={emptyText} />
    </div>
  );
};

export default Writer;
