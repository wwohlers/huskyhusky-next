import { GetServerSideProps } from "next";
import Head from "next/head";
import Link from "next/link";
import React, { useCallback, useState } from "react";
import { IoMdArrowBack } from "react-icons/io";
import EditArticle from "../../components/article/EditArticle";
import { useUser } from "../../hooks/useUser";
import { IArticle } from "../../services/articles/article.interface";
import { getArticleById } from "../../services/articles/server";
import { withDB } from "../../services/database";
import { canEditArticle } from "../../services/users/server";
import { getUserIdFromReq } from "../../util/jwt";
import { convertHTMLToMarkdown, isHTML } from "../../util/markdown";
import { returnNotFound, returnProps, returnRedirect } from "../../util/next";
import { updateArticle } from "../api/articles";

type EditProps = {
  article: IArticle;
};

export const getServerSideProps: GetServerSideProps<EditProps> = async ({
  params,
  req,
}) => {
  return withDB(async (conn) => {
    const id = typeof params?.id === "object" ? params.id[0] : params?.id;
    if (!id) {
      return returnNotFound();
    }
    const userId = getUserIdFromReq(req);
    if (!userId) {
      return returnRedirect("/login");
    }
    const article = await getArticleById(conn, id);
    if (!article) {
      return returnNotFound();
    }
    const user = await conn.models.User.findById(userId).lean();
    if (!canEditArticle(user, article)) {
      return returnRedirect("/login");
    }
    if (isHTML(article.text)) {
      article.text = convertHTMLToMarkdown(article.text);
    }
    return returnProps({ article });
  });
};

const Edit: React.FC<EditProps> = ({ article: initialArticle }) => {
  const user = useUser();
  const [article, setArticle] = useState<IArticle>(initialArticle);

  const onSave = useCallback(async (article: IArticle) => {
    const res = await updateArticle(article);
    setArticle(res);
  }, []);

  return (
    <>
      <Head>
        <title>{`Edit ${article.title} - The Husky Husky`}</title>
        <meta
          name="description"
          content={`Edit ${article.title} on The Husky Husky.`}
        />
      </Head>
      <div className="w-full max-w-3xl">
        <Link
          className="flex flex-row items-center font-medium space-x-1 text-sm mb-1"
          href={"/writers/" + (user?.name ?? "")}
        >
          <IoMdArrowBack />
          <span>Back to your profile</span>
        </Link>
        <h1 className="text-2xl font-medium">
          Editing <span className="font-semibold">{article.title}</span>
        </h1>
        <EditArticle article={article} onSave={onSave} />
      </div>
    </>
  );
};

export default Edit;
