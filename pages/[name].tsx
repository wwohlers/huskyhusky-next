import { DateTime } from "luxon";
import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import React, { useMemo, useState } from "react";
import { connectToDB } from "../services/database";
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
import ReactMarkdown from "react-markdown";
import { isHTML } from "../util/markdown";

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
    notFound: true,
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

  const isHtml = useMemo(() => {
    return isHTML(article.text);
  }, [article]);

  const onSubmitComment = (name: string, content: string) => {
    // todo: IMPLEMENT
  };

  return (
    <>
      <Head>
        <title>{`${article.title} - The Husky Husky`}</title>
        <meta name="description" content={article.brief} />
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={article.brief} />
        <meta property="og:image" content={article.image} />
        <meta
          property="og:url"
          content={`${process.env.NEXT_PUBLIC_BASE_URL}/${article.name}`}
        />
      </Head>
      <div>
        <div className="flex flex-row space-x-4">
          {article.tags.map((tag) => (
            <Link key={tag} href={"/tags/" + tag}>
              <Label>{tag}</Label>
            </Link>
          ))}
        </div>
        <h1 className="text-4xl font-semibold my-1">{article.title}</h1>
        <p className="my-2 text-gray-500">
          Published {timeAgoStr} by {article.author.name}
        </p>
        <img
          className="mt-4 w-full rounded-md"
          src={article.image}
          alt={`Image for ${article.title}`}
        />
        <div className="my-8 flex flex-col w-full lg:flex-row">
          <div className="lg:w-3/4">
            {isHtml ? (
              <article
                className="text-lg pr-12 leading-normal"
                dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
              ></article>
            ) : (
              <ReactMarkdown className="markdown">
                {isHtml ? sanitizedHtml : article.text}
              </ReactMarkdown>
            )}
          </div>
          <div className="mt-8 lg:pl-8 lg:mt-0">
            <p className="text-lg font-semibold">Share</p>
          </div>
        </div>
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
          {article.comments.map((comment, i) => (
            <Comment key={i} comment={comment} />
          ))}
        </div>
      </div>
    </>
  );
};

export default Article;
