import { MethodHandler } from "../../../util/api/createHandler";
import requireAuth from "../../../util/api/guards/requireAuth";
import { NotFoundError } from "../../../util/api/handleError";
import { createSchemaValidator, createIdValidator, createArrayValidator, isString, isBoolean } from "../../../util/validation";
import { IArticle, isArticleAttr, isArticleBrief, isArticleName, isArticleTitle } from "../article.interface";

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

const requestBodyValidator = createSchemaValidator<UpdateArticleRequest>({
  _id: createIdValidator(),
  name: isArticleName,
  title: isArticleTitle,
  tags: createArrayValidator(isString),
  brief: isArticleBrief,
  image: isString,
  attr: isArticleAttr,
  text: isString,
  public: isBoolean,
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
  } = requestBodyValidator(req.body);
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
