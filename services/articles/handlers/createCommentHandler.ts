import { object } from "deterrent";
import { MethodHandler } from "../../../util/api/createHandler";
import { NotFoundError } from "../../../util/api/handleError";
import { now } from "../../../util/datetime";
import { idValidator } from "../../../util/validation";
import {
  commentContentValidator,
  commentNameValidator,
  IComment,
} from "../comment.interface";

type CreateCommentRequest = {
  articleId: string;
  name: string;
  content: string;
};
type CreateCommentResponse = IComment;

const requestBodyValidator = object({
  name: "Comment",
}).schema<CreateCommentRequest>({
  articleId: idValidator,
  name: commentNameValidator,
  content: commentContentValidator,
});

const createCommentHandler: MethodHandler<
  CreateCommentRequest,
  CreateCommentResponse
> = async ({ req, conn }) => {
  const { articleId, name, content } = requestBodyValidator.assert(req.body);
  const article = await conn.models.Article.findById(articleId);
  if (!article) {
    throw new NotFoundError("Article not found");
  }
  article.comments.push({
    name,
    content,
    deleted: false,
    createdAt: now(),
  });
  article.markModified("comments");
  await article.save();
  return article.comments[article.comments.length - 1];
};

export default createCommentHandler;
