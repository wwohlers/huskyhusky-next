import signOutHandler from "../../../services/users/handlers/signOutHandler";
import createHandler from "../../../util/api/createHandler";
import createRequestMakers from "../../../util/api/createRequestMaker";

const methodHandlers = {
  post: signOutHandler
}

export default createHandler(methodHandlers);

export const { post: makeSignOutRequest } = createRequestMakers("/users/signOut", methodHandlers);