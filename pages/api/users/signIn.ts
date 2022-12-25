import createHandler from "../../../services/api/createHandler";
import createRequestMakers from "../../../services/api/createRequestMaker";
import signInHandler from "../../../services/api/handlers/users/signInHandler";

const methodHandlers = {
  post: signInHandler,
};

export default createHandler(methodHandlers);

export const { post: makeSignInRequest } = createRequestMakers(
  "/users/signIn",
  methodHandlers
);
