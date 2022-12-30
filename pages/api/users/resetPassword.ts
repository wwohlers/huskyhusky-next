import { forgotPasswordHandler } from "../../../services/users/handlers/forgotPasswordHandler";
import { resetPasswordHandler } from "../../../services/users/handlers/resetPasswordHandler";
import createHandler from "../../../util/api/createHandler";
import createRequestMakers from "../../../util/api/createRequestMaker";

const methodHandlers = {
  post: forgotPasswordHandler,
  patch: resetPasswordHandler,
};

export default createHandler(methodHandlers);

export const {
  post: makeForgotPasswordRequest,
  patch: makeResetPasswordRequest,
} = createRequestMakers("/users/resetPassword", methodHandlers);
