import createArticleHandler from "../../../services/articles/handlers/createArticleHandler";
import updateArticleHandler from "../../../services/articles/handlers/updateArticleHandler";
import createHandler from "../../../util/api/createHandler";
import createRequestMakers from "../../../util/api/createRequestMaker";

const methodHandlers = {
  put: updateArticleHandler,
  post: createArticleHandler,
};

export default createHandler(methodHandlers);

export const { put: makeUpdateArticleRequest, post: makeCreateArticleRequest } = createRequestMakers(
  "/articles",
  methodHandlers
);