import createHandler from "../../../services/api/createHandler";
import createRequestMakers from "../../../services/api/createRequestMaker";
import editUserHandler from "../../../services/api/handlers/users/editUserHandler";
import meHandler from "../../../services/api/handlers/users/meHandler";

const methodHandlers = {
  get: meHandler,
  patch: editUserHandler,
};

export default createHandler(methodHandlers);

export const { get: makeGetMeRequest, patch: makeEditUserRequest } =
  createRequestMakers("/users", methodHandlers);
