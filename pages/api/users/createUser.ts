import createHandler from "../../../services/api/createHandler";
import createRequestMakers from "../../../services/api/createRequestMaker";
import createUserHandler from "../../../services/api/handlers/users/createUserHandler";

const methodHandlers = {
  post: createUserHandler,
};

export default createHandler(methodHandlers);

export const { post: makeCreateUserRequest } = createRequestMakers(
  "/users/createUser",
  methodHandlers
);
