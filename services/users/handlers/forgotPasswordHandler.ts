import { object } from "deterrent";
import { MethodHandler } from "../../../util/api/createHandler";
import { emailValidator } from "../../../util/validation";
import { requestPasswordReset } from "../server";

type ForgotPasswordRequest = {
  email: string;
};
type ForgotPasswordResponse = void;

const forgotPasswordValidator = object().schema<ForgotPasswordRequest>({
  email: emailValidator,
});

export const forgotPasswordHandler: MethodHandler<
  ForgotPasswordRequest,
  ForgotPasswordResponse
> = async ({ conn, req }) => {
  const { email } = forgotPasswordValidator.assert(req.body);
  await requestPasswordReset(conn, email);
};
