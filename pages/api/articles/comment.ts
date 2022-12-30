import createHandler from "../../../util/api/createHandler";
import createRequestMakers from "../../../util/api/createRequestMaker";
import createCommentHandler from "../../../services/articles/handlers/createCommentHandler";
import deleteCommentHandler from "../../../services/articles/handlers/deleteCommentHandler";

const methodHandlers = {
  post: createCommentHandler,
  delete: deleteCommentHandler,
};

export default createHandler(methodHandlers);

export const {
  post: makeCreateCommentRequest,
  delete: makeDeleteCommentRequest,
} = createRequestMakers("/articles/comment", methodHandlers);
