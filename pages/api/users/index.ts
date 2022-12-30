import editUserHandler from "../../../services/users/handlers/editUserHandler";
import meHandler from "../../../services/users/handlers/meHandler";
import createHandler from "../../../util/api/createHandler";
import createRequestMakers from "../../../util/api/createRequestMaker";

const methodHandlers = {
  get: meHandler,
  patch: editUserHandler,
};

export default createHandler(methodHandlers);

export const { get: makeGetMeRequest, patch: makeEditUserRequest } =
  createRequestMakers("/users", methodHandlers);
