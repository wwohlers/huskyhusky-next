import createHandler from "../../../api/createHandler";
import createRequestMakers from "../../../api/createRequestMaker";
import editUserHandler from "../../../api/handlers/users/editUserHandler";
import meHandler from "../../../api/handlers/users/meHandler";

const methodHandlers = {
  get: meHandler,
  patch: editUserHandler,
};

export default createHandler(methodHandlers);

export const { get: getMe } = createRequestMakers("/users", methodHandlers);
