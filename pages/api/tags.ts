import createHandler from "../../util/api/createHandler";
import createRequestMakers from "../../util/api/createRequestMaker";
import tagsHandler from "../../services/articles/handlers/tagsHandler";

const methodHandlers = {
  get: tagsHandler,
}

export default createHandler(methodHandlers);

export const { get: makeGetTagsRequest } = createRequestMakers("/tags", methodHandlers);