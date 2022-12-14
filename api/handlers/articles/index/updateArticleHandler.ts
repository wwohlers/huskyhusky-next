import { IArticle } from "../../../../services/articles/article.interface";
import { MethodHandler } from "../../../createHandler";
import requireAuth from "../../../guards/requireAuth";
import { NotFoundError } from "../../../handleError";

type UpdateArticleRequest = Pick<
  IArticle,
  | "_id"
  | "name"
  | "title"
  | "tags"
  | "brief"
  | "image"
  | "attr"
  | "text"
  | "public"
>;
type UpdateArticleResponse = IArticle;

const updateArticleHandler: MethodHandler<
  UpdateArticleRequest,
  UpdateArticleResponse
> = async ({ req, userId, conn }) => {
  requireAuth(conn, userId, false);
  const {
    _id,
    name,
    title,
    tags,
    brief,
    image,
    attr,
    text,
    public: isPublic,
  } = req.body;
  if (!_id) {
    throw new NotFoundError("Article not found");
  }
  const article = await conn.models.Article.findByIdAndUpdate<IArticle>(
    _id,
    {
      name,
      title,
      tags,
      brief,
      image,
      attr,
      text,
      public: isPublic,
      updatedAt: Date.now(),
    },
    {
      new: true, // return the modified document rather than the original
    }
  );
  if (!article) {
    throw new NotFoundError("Article not found");
  }
  return article;
};

export default updateArticleHandler;
