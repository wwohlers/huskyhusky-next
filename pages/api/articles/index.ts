import createHandler from "../../../services/api/createHandler";
import createRequestMakers from "../../../services/api/createRequestMaker";
import createArticleHandler from "../../../services/api/handlers/articles/index/createArticleHandler";
import updateArticleHandler from "../../../services/api/handlers/articles/index/updateArticleHandler";

const methodHandlers = {
  put: updateArticleHandler,
  post: createArticleHandler,
};

export default createHandler(methodHandlers);

export const { put: makeUpdateArticleRequest, post: makeCreateArticleRequest } = createRequestMakers(
  "/articles",
  methodHandlers
);