import createHandler from "../../../services/api/createHandler";
import createRequestMakers from "../../../services/api/createRequestMaker";
import createCommentHandler from "../../../services/api/handlers/articles/comment/createCommentHandler";
import deleteCommentHandler from "../../../services/api/handlers/articles/comment/deleteCommentHandler";

const methodHandlers = {
  post: createCommentHandler,
  delete: deleteCommentHandler,
};

export default createHandler(methodHandlers);

export const {
  post: makeCreateCommentRequest,
  delete: makeDeleteCommentRequest,
} = createRequestMakers("/articles/comment", methodHandlers);
