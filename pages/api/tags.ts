import createHandler from "../../services/api/createHandler";
import createRequestMakers from "../../services/api/createRequestMaker";
import tagsHandler from "../../services/api/handlers/tagsHandler";

const methodHandlers = {
  get: tagsHandler,
}

export default createHandler(methodHandlers);

export const { get: makeGetTagsRequest } = createRequestMakers("/tags", methodHandlers);