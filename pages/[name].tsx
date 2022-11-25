import { DateTime } from "luxon";
import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import React, { useMemo, useState } from "react";
import { connectToDB } from "../database";
import { getAllArticleNames, getArticleByName } from "../services/articles";
import { IArticle } from "../services/articles/article.interface";
import { timeAgo } from "../util/datetime";
import stringifyIds from "../util/stringifyIds";
import probe from "probe-image-size";
import { sanitizeHtml } from "../util/sanitizeHtml";
import Link from "next/link";
import Comment from "../components/article/Comment";
import NewComment from "../components/article/NewComment";
import Label from "../components/atoms/Label";

type ArticleProps = {
  article: IArticle;
  imageSize: probe.ProbeResult;
};

export const getStaticPaths: GetStaticPaths = async () => {
  const conn = await connectToDB();
  const names = await getAllArticleNames(conn);
  conn.close();
  return {
    fallback: "blocking",
    paths: names.map((name) => ({
      params: {
        name,
      },
    })),
  };
};

export const getStaticProps: GetStaticProps<ArticleProps> = async ({
  params,
}) => {
  const name = params?.name;
  if (name) {
    const conn = await connectToDB();
    const article = await getArticleByName(conn, name as string);
    conn.close();
    stringifyIds(article);
    if (article) {
      const imageSize = await probe(article.image);
      return {
        props: {
          article,
          imageSize,
        },
      };
    }
  }
  return {
    redirect: {
      destination: "/404",
      permanent: false,
    },
  };
};

const Article: React.FC<ArticleProps> = ({ article, imageSize }) => {
  const [showNewComment, setShowNewComment] = useState(false);

  const timeAgoStr = useMemo(() => {
    const dt = DateTime.fromMillis(article.createdAt * 1000);
    return timeAgo(dt);
  }, [article]);

  const sanitizedHtml = useMemo(() => {
    return sanitizeHtml(article.text);
  }, [article]);

  return (
    <>
      <Head>
        <title>{`${article.title} - The Husky Husky`}</title>
        <meta name="description" content={article.brief} />
      </Head>
      <div className="max-w-4xl">
        <div>
          {article.tags.map((tag) => (
            <Link href={"/tags/" + tag} className="mr-4">
              <Label>{tag}</Label>
            </Link>
          ))}
        </div>
        <h1 className="text-4xl font-semibold my-1">{article.title}</h1>
        <p className="my-1 text-gray-500">
          Published {timeAgoStr} by {article.author.name}
        </p>
        <img
          className="w-full rounded-md"
          src={article.image}
          alt={`Image for ${article.title}`}
        />
        <article
          className="my-8 text-lg"
          dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
        ></article>
        <div className="my-16">
          <div className="flex flex-row justify-between items-center">
            <p className="text-xl">{article.comments.length} comments</p>
            <button onClick={() => setShowNewComment(!showNewComment)}>
              New Comment
            </button>
          </div>
          {showNewComment && <NewComment />}
          {article.comments.map((comment) => (
            <Comment comment={comment} />
          ))}
        </div>
      </div>
    </>
  );
};

export default Article;
