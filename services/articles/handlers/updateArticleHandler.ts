import { array, boolean, object, string } from "deterrent";
import { MethodHandler } from "../../../util/api/createHandler";
import requireAuth from "../../../util/api/guards/requireAuth";
import { NotFoundError } from "../../../util/api/handleError";
import { idValidator } from "../../../util/validation";
import {
  IArticle,
  articleAttrValidator,
  articleBriefValidator,
  articleNameValidator,
  articleTitleValidator,
} from "../article.interface";

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

const requestBodyValidator = object().schema<UpdateArticleRequest>({
  _id: idValidator,
  name: articleNameValidator,
  title: articleTitleValidator,
  tags: array().of(string()),
  brief: articleBriefValidator,
  image: string(),
  attr: articleAttrValidator,
  text: string(),
  public: boolean(),
});

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
  } = requestBodyValidator.assert(req.body);
  const article = await conn.models.Article.findByIdAndUpdate(
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
  return article.toObject();
};

export default updateArticleHandler;
