import createHandler from "../../../util/api/createHandler";
import createRequestMakers from "../../../util/api/createRequestMaker";
import createUserHandler from "../../../services/users/handlers/createUserHandler";

const methodHandlers = {
  post: createUserHandler,
};

export default createHandler(methodHandlers);

export const { post: makeCreateUserRequest } = createRequestMakers(
  "/users/createUser",
  methodHandlers
);
