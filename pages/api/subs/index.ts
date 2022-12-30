import subscribeHandler from "../../../services/subs/handlers/subscribeHandler";
import unsubscribeHandler from "../../../services/subs/handlers/unsubscribeHandler";
import createHandler from "../../../util/api/createHandler";
import createRequestMakers from "../../../util/api/createRequestMaker";

const methodHandlers = {
  post: subscribeHandler,
  delete: unsubscribeHandler,
};

export default createHandler(methodHandlers);

export const { post: makeSubscribeRequest, delete: makeUnsubscribeRequest } =
  createRequestMakers("/subs", methodHandlers);
