import { MethodHandler } from "../../../util/api/createHandler";
import { createSchemaValidator, isEmail } from "../../../util/validation";
import { requestPasswordReset } from "../server";

type ForgotPasswordRequest = {
  email: string;
};
type ForgotPasswordResponse = void;

const forgotPasswordValidator = createSchemaValidator<ForgotPasswordRequest>({
  email: isEmail,
});

export const forgotPasswordHandler: MethodHandler<
  ForgotPasswordRequest,
  ForgotPasswordResponse
> = async ({ conn, req }) => {
  const { email } = forgotPasswordValidator(req.body);
  await requestPasswordReset(conn, email);
};
