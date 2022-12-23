import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import React, { useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import Comment from "../components/article/Comment";
import NewComment from "../components/article/NewComment";
import Button from "../components/atoms/Button";
import Label from "../components/atoms/Label";
import {
  getAllArticleNames,
  getArticleByName,
} from "../services/articles/server";
import { IArticle } from "../services/articles/article.interface";
import { withDB } from "../services/database";
import { timeAgo } from "../util/datetime";
import { isHTML } from "../util/markdown";
import { sanitizeHtml } from "../util/sanitizeHtml";
import { returnNotFound, returnProps } from "../util/next";
import { IComment } from "../services/articles/comment.interface";

type ArticleProps = {
  article: IArticle;
};

export const getStaticPaths: GetStaticPaths = async () => {
  const names = await withDB((conn) => {
    return getAllArticleNames(conn);
  });
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
    const article = await withDB((conn) => {
      return getArticleByName(conn, name as string);
    });
    if (article) {
      return returnProps({ article });
    }
  }
  return returnNotFound();
};

const Article: React.FC<ArticleProps> = ({ article: initialArticle }) => {
  const [article, setArticle] = useState(initialArticle);
  const [showNewComment, setShowNewComment] = useState(false);

  const sanitizedHtml = useMemo(() => {
    return sanitizeHtml(article.text);
  }, [article]);

  const isHtml = useMemo(() => {
    return isHTML(article.text);
  }, [article]);

  const onCommentCreated = (comment: IComment) => {
    setShowNewComment(false);
    setArticle((prev) => ({
      ...prev,
      comments: [...prev.comments, comment],
    }));
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
        <Link
          href={"/writers/" + article.author.name}
          className="my-2 text-gray-500"
        >
          Published {timeAgo(article.createdAt)} by {article.author.name}
        </Link>
        <img
          className="mt-2 w-full rounded-md"
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
              onSuccess={onCommentCreated}
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
