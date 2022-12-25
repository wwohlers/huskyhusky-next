import createHandler from "../../../services/api/createHandler";
import createRequestMakers from "../../../services/api/createRequestMaker";
import signOutHandler from "../../../services/api/handlers/users/signOutHandler";

const methodHandlers = {
  post: signOutHandler
}

export default createHandler(methodHandlers);

export const { post: makeSignOutRequest } = createRequestMakers("/users/signOut", methodHandlers);