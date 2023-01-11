import { object } from "deterrent";
import { MethodHandler } from "../../../util/api/createHandler";
import requireAuth from "../../../util/api/guards/requireAuth";
import {
  NotFoundError,
  UnauthorizedError,
} from "../../../util/api/handleError";
import { idValidator } from "../../../util/validation";
import { canEditArticle } from "../../users/server";

type DeleteArticleRequest = {
  articleId: string;
};
type DeleteArticleResponse = void;

const requestBodyValidator = object({
  name: "Delete article request",
}).schema<DeleteArticleRequest>({
  articleId: idValidator,
});

const deleteArticleHandler: MethodHandler<
  DeleteArticleRequest,
  DeleteArticleResponse
> = async ({ req, conn, userId }) => {
  const { articleId } = requestBodyValidator.assert(req.body);
  requireAuth(conn, userId, false);
  const user = await conn.models.User.findById(userId);
  const article = await conn.models.Article.findById(articleId);
  if (!article) {
    throw new NotFoundError("Article not found");
  }
  if (!canEditArticle(user, article)) {
    throw new UnauthorizedError(
      "You do not have permission to delete this article"
    );
  }
  await conn.models.Article.findByIdAndDelete(articleId);
};

export default deleteArticleHandler;