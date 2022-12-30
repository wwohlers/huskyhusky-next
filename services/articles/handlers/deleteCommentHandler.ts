import { MethodHandler } from "../../../util/api/createHandler";
import requireAuth from "../../../util/api/guards/requireAuth";
import { NotFoundError } from "../../../util/api/handleError";
import { createSchemaValidator, createIdValidator, isNumber } from "../../../util/validation";

type DeleteCommentRequest = {
  articleId: string;
  commentIndex: number;
};

type DeleteCommentResponse = void;

const requestBodyValidator = createSchemaValidator<DeleteCommentRequest>({
  articleId: createIdValidator(),
  commentIndex: isNumber,
});

const deleteCommentHandler: MethodHandler<
  DeleteCommentRequest,
  DeleteCommentResponse
> = async ({ req, userId, conn }) => {
  requireAuth(conn, userId, true);
  const { articleId, commentIndex } = requestBodyValidator(req.body);
  const article = await conn.models.Article.findById(articleId);
  if (!article) {
    throw new NotFoundError("Article not found");
  }
  if (commentIndex < 0 || commentIndex >= article.comments.length) {
    throw new NotFoundError("Comment not found");
  }
  article.comments[commentIndex].deleted = true;
  article.markModified("comments");
  await article.save();
}

export default deleteCommentHandler;