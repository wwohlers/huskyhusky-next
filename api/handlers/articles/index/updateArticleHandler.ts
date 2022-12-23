import {
  IArticle,
  createArticleTitleValidator,
} from "../../../../services/articles/article.interface";
import {
  createArrayValidator,
  createIdValidator,
  createSchemaValidator,
  createTextFieldValidator,
  isBoolean,
  isString,
} from "../../../../util/validation";
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

const requestBodyValidator = createSchemaValidator<UpdateArticleRequest>({
  _id: createIdValidator(),
  name: createArticleTitleValidator(),
  title: createArticleTitleValidator(),
  tags: createArrayValidator(isString),
  brief: createTextFieldValidator(1, 200),
  image: isString,
  attr: createTextFieldValidator(1, 200),
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
