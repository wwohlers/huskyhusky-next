import { IArticle } from "../../../../articles/article.interface";
import { MethodHandler } from "../../../createHandler";
import requireAuth from "../../../guards/requireAuth";

type CreateArticleRequest = {};
type CreateArticleResponse = IArticle;

const createArticleHandler: MethodHandler<
  CreateArticleRequest,
  CreateArticleResponse
> = async ({ userId, conn }) => {
  requireAuth(conn, userId, false);
  const numArticles = await conn.models.Article.count();
  // this name could in theory be not unique, but it's very unlikely
  const title = `Article ${numArticles + 1}`;
  const name = `article-${numArticles + 1}`;
  const article = await conn.models.Article.create({
    author: userId,
    name,
    title,
    public: false,
  });
  return article.toObject();
};

export default createArticleHandler;
