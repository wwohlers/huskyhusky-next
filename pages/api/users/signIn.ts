import signInHandler from "../../../services/users/handlers/signInHandler";
import createHandler from "../../../util/api/createHandler";
import createRequestMakers from "../../../util/api/createRequestMaker";

const methodHandlers = {
  post: signInHandler,
};

export default createHandler(methodHandlers);

export const { post: makeSignInRequest } = createRequestMakers(
  "/users/signIn",
  methodHandlers
);
