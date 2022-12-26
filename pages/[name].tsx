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
  getHeadlinesByTag,
} from "../services/articles/server";
import { IArticle, IHeadline } from "../services/articles/article.interface";
import { withDB } from "../services/database";
import { timeAgo } from "../util/datetime";
import { isHTML } from "../util/markdown";
import { sanitizeHtml } from "../util/sanitizeHtml";
import {
  DEFAULT_REVALIDATE_PERIOD,
  returnNotFound,
  returnProps,
} from "../util/next";
import { IComment } from "../services/articles/comment.interface";
import {
  makeCreateCommentRequest,
  makeDeleteCommentRequest,
} from "./api/articles/comment";
import toastError from "../util/toastError";
import { toast } from "react-toastify";
import TagList from "../components/article/TagList";
import Image from "next/image";
import Section from "../components/Section";
import Share from "../components/article/Share";
import Headline from "../components/home/Headline";

type ArticleProps = {
  article: IArticle;
  similarArticles: IHeadline[];
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
    const { article, similarArticles } = await withDB(async (conn) => {
      const article = await getArticleByName(conn, name as string);
      const similarArticles = await getHeadlinesByTag(
        conn,
        article?.tags[0] ?? "",
        4
      );
      return { article, similarArticles };
    });
    if (article) {
      return returnProps(
        { article, similarArticles },
        DEFAULT_REVALIDATE_PERIOD
      );
    }
  }
  return returnNotFound();
};

const Article: React.FC<ArticleProps> = ({
  article: initialArticle,
  similarArticles,
}) => {
  const [article, setArticle] = useState(initialArticle);
  const [showNewComment, setShowNewComment] = useState(false);

  const sanitizedHtml = useMemo(() => {
    return sanitizeHtml(article.text);
  }, [article]);

  const isHtml = useMemo(() => {
    return isHTML(article.text);
  }, [article]);

  const onCommentCreated = async (name: string, content: string) => {
    try {
      const comment = await makeCreateCommentRequest({
        articleId: article._id,
        name,
        content,
      });
      setArticle((prev) => ({
        ...prev,
        comments: [...prev.comments, comment],
      }));
      setShowNewComment(false);
    } catch (e) {
      toastError(e);
    }
  };

  const onCommentDeleted = async (idx: number) => {
    try {
      await makeDeleteCommentRequest({
        articleId: article._id,
        commentIndex: idx,
      });
      toast.success("Comment deleted");
      setArticle((prev) => ({
        ...prev,
        comments: prev.comments.map((comment, i) => {
          if (i === idx)
            return {
              ...comment,
              deleted: true,
            };
          return comment;
        }),
      }));
    } catch (e) {
      toastError(e);
    }
  };

  const commentCount = useMemo(() => {
    return article.comments.filter((comment) => !comment.deleted).length;
  }, [article]);

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
        <TagList tags={article.tags} />
        <h1 className="text-4xl font-semibold my-1">{article.title}</h1>
        <Link
          href={"/writers/" + article.author.name}
          className="font-medium text-sm text-secondary"
        >
          Published {timeAgo(article.createdAt)} by {article.author.name}
        </Link>
        <div className="flex flex-col xl:flex-row">
          <div className="w-full xl:w-2/3">
            <div className="my-4 relative w-full h-48 sm:h-96">
              <Image
                src={article.image}
                fill
                className="object-contain"
                alt={`Image for ${article.title}`}
              />
            </div>
            <p className="text-secondary text-sm font-medium text-center">
              {article.attr}
            </p>
            <div className="my-4 flex flex-col w-full lg:flex-row">
              {isHtml ? (
                <article
                  className="text-lg pr-12 leading-normal font-medium"
                  dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
                ></article>
              ) : (
                <ReactMarkdown className="markdown">
                  {isHtml ? sanitizedHtml : article.text}
                </ReactMarkdown>
              )}
            </div>
          </div>
          <div className="xl:pl-8 flex-1">
            <Section title="Share">
              <Share name={article.name} title={article.title} />
            </Section>
            <Section title="More Like This">
              <div className="flex md:flex-row xl:flex-col flex-wrap">
                {similarArticles.map((article, i) => (
                  <Headline
                    containerClasses="md:w-1/2 xl:w-full xl:p-0 xl:my-4"
                    key={i}
                    headline={article}
                  />
                ))}
              </div>
            </Section>
          </div>
        </div>
        <div className="my-8">
          <div className="flex flex-row justify-between items-center">
            <p className="text-xl font-semibold">{commentCount} comments</p>
            {!showNewComment && (
              <Button onClick={() => setShowNewComment(true)}>
                New Comment
              </Button>
            )}
          </div>
          {showNewComment && (
            <NewComment
              onSubmit={onCommentCreated}
              onCancel={() => setShowNewComment(false)}
            />
          )}
          {article.comments.map((comment, i) => (
            <Comment
              key={i}
              comment={comment}
              onDeletePressed={() => onCommentDeleted(i)}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default Article;
