import { MethodHandler } from "../../../util/api/createHandler";
import {
  createSchemaValidator,
  isNewPassword,
  isString,
} from "../../../util/validation";
import { resetPassword } from "../server";

type ResetPasswordRequest = {
  token: string;
  password: string;
};
type ResetPasswordResponse = void;

const resetPasswordValidator = createSchemaValidator<ResetPasswordRequest>({
  token: isString,
  password: isNewPassword,
});

export const resetPasswordHandler: MethodHandler<
  ResetPasswordRequest,
  ResetPasswordResponse
> = async ({ conn, req }) => {
  const { token, password } = resetPasswordValidator(req.body);
  await resetPassword(conn, token, password);
};
