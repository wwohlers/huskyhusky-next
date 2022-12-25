import createHandler from "../../../api/createHandler";
import createRequestMakers from "../../../api/createRequestMaker";
import createCommentHandler from "../../../api/handlers/articles/comment/createCommentHandler";
import deleteCommentHandler from "../../../api/handlers/articles/comment/deleteCommentHandler";

const methodHandlers = {
  post: createCommentHandler,
  delete: deleteCommentHandler,
};

export default createHandler(methodHandlers);

export const {
  post: makeCreateCommentRequest,
  delete: makeDeleteCommentRequest,
} = createRequestMakers("/articles/comment", methodHandlers);
