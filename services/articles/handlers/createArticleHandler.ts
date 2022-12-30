import { MethodHandler } from "../../../util/api/createHandler";
import requireAuth from "../../../util/api/guards/requireAuth";
import { IArticle } from "../article.interface";

type CreateArticleRequest = void;
type CreateArticleResponse = IArticle;

const createArticleHandler: MethodHandler<
  CreateArticleRequest,
  CreateArticleResponse
> = async ({ userId, conn }) => {
  requireAuth(conn, userId, false);
  const title = `Untitled Story`;
  const name = `untitled-${Date.now()}`;
  const article = await conn.models.Article.create({
    author: userId,
    name,
    title,
    public: false,
  });
  return article.toObject();
};

export default createArticleHandler;
