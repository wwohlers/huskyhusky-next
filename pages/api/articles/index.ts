import createHandler from "../../../api/createHandler";
import createRequestMakers from "../../../api/createRequestMaker";
import createArticleHandler from "../../../api/handlers/articles/index/createArticleHandler";
import updateArticleHandler from "../../../api/handlers/articles/index/updateArticleHandler";

const methodHandlers = {
  put: updateArticleHandler,
  post: createArticleHandler,
};

export default createHandler(methodHandlers);

export const { put: makeUpdateArticleRequest, post: makeCreateArticleRequest } = createRequestMakers(
  "/articles",
  methodHandlers
);