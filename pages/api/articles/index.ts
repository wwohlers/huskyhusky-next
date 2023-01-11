import createArticleHandler from "../../../services/articles/handlers/createArticleHandler";
import deleteArticleHandler from "../../../services/articles/handlers/deleteArticleHandler";
import updateArticleHandler from "../../../services/articles/handlers/updateArticleHandler";
import createHandler from "../../../util/api/createHandler";
import createRequestMakers from "../../../util/api/createRequestMaker";

const methodHandlers = {
  put: updateArticleHandler,
  post: createArticleHandler,
  delete: deleteArticleHandler,
};

export default createHandler(methodHandlers);

export const {
  put: makeUpdateArticleRequest,
  post: makeCreateArticleRequest,
  delete: makeDeleteArticleRequest,
} = createRequestMakers("/articles", methodHandlers);
