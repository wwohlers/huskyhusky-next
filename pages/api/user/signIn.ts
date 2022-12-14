import createHandler from "../../../api/createHandler";
import createRequestMakers from "../../../api/createRequestMaker";
import signInHandler from "../../../api/handlers/users/signInHandler";

const methodHandlers = {
  post: signInHandler,
}

export default createHandler(methodHandlers);

export const { post: signIn } = createRequestMakers("/users/signIn", methodHandlers);