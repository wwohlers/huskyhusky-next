import { array, boolean, object, string } from "deterrent";
import { MethodHandler } from "../../../util/api/createHandler";
import requireAuth from "../../../util/api/guards/requireAuth";
import {
  NotFoundError,
  UnauthorizedError,
} from "../../../util/api/handleError";
import { now } from "../../../util/datetime";
import { idValidator } from "../../../util/validation";
import { canEditArticle } from "../../users/server";
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
  const article = await conn.models.Article.findById(_id);
  if (!article) {
    throw new NotFoundError("Article not found");
  }
  const user = await conn.models.User.findById(userId);
  if (!canEditArticle(user, article)) {
    throw new UnauthorizedError(
      "You do not have permission to edit this article"
    );
  }
  article.name = name;
  article.title = title;
  article.tags = tags;
  article.brief = brief;
  article.image = image;
  article.attr = attr;
  article.text = text;
  article.public = isPublic;
  article.updatedAt = now();
  article.markModified("tags");
  await article.save();
  return article.toObject();
};

export default updateArticleHandler;
