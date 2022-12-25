import createHandler from "../../../api/createHandler";
import createRequestMakers from "../../../api/createRequestMaker";
import signOutHandler from "../../../api/handlers/users/signOutHandler";

const methodHandlers = {
  post: signOutHandler
}

export default createHandler(methodHandlers);

export const { post: makeSignOutRequest } = createRequestMakers("/users/signOut", methodHandlers);