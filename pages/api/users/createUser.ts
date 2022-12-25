import createHandler from "../../../api/createHandler";
import createRequestMakers from "../../../api/createRequestMaker";
import createUserHandler from "../../../api/handlers/users/createUserHandler";

const methodHandlers = {
  post: createUserHandler,
};

export default createHandler(methodHandlers);

export const { post: makeCreateUserRequest } = createRequestMakers(
  "/users/createUser",
  methodHandlers
);
