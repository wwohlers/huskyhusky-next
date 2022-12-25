import createHandler from "../../api/createHandler";
import createRequestMakers from "../../api/createRequestMaker";
import tagsHandler from "../../api/handlers/tagsHandler";

const methodHandlers = {
  get: tagsHandler,
}

export default createHandler(methodHandlers);

export const { get: makeGetTagsRequest } = createRequestMakers("/tags", methodHandlers);