import { DateTime } from "luxon";
import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import React, { useMemo, useState } from "react";
import { connectToDB } from "../database";
import { getAllArticleNames, getArticleByName } from "../services/articles";
import { IArticle } from "../services/articles/article.interface";
import { timeAgo } from "../util/datetime";
import stringifyIds from "../util/stringifyIds";
import { sanitizeHtml } from "../util/sanitizeHtml";
import Link from "next/link";
import Comment from "../components/article/Comment";
import NewComment from "../components/article/NewComment";
import Label from "../components/atoms/Label";
import Button from "../components/atoms/Button";

type ArticleProps = {
  article: IArticle;
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
      return {
        props: {
          article,
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

const Article: React.FC<ArticleProps> = ({ article }) => {
  const [showNewComment, setShowNewComment] = useState(false);

  const timeAgoStr = useMemo(() => {
    const dt = DateTime.fromMillis(article.createdAt * 1000);
    return timeAgo(dt);
  }, [article]);

  const sanitizedHtml = useMemo(() => {
    return sanitizeHtml(article.text);
  }, [article]);

  const onSubmitComment = (name: string, content: string) => {
    // todo: IMPLEMENT
  };

  return (
    <>
      <Head>
        <title>{`${article.title} - The Husky Husky`}</title>
        <meta name="description" content={article.brief} />
      </Head>
      <div className="max-w-4xl">
        <div className="flex flex-row space-x-4">
          {article.tags.map((tag) => (
            <Link href={"/tags/" + tag}>
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
            <p className="text-xl font-semibold">
              {article.comments.length} comments
            </p>
            {!showNewComment && (
              <Button onClick={() => setShowNewComment(true)}>
                New Comment
              </Button>
            )}
          </div>
          {showNewComment && (
            <NewComment
              onSubmit={onSubmitComment}
              onCancel={() => setShowNewComment(false)}
            />
          )}
          {article.comments.map((comment) => (
            <Comment comment={comment} />
          ))}
        </div>
      </div>
    </>
  );
};

export default Article;
