import { object, string } from "deterrent";
import { MethodHandler } from "../../../util/api/createHandler";
import { newPasswordValidator } from "../../../util/validation";
import { resetPassword } from "../server";

type ResetPasswordRequest = {
  token: string;
  password: string;
};
type ResetPasswordResponse = void;

const resetPasswordValidator = object().schema<ResetPasswordRequest>({
  token: string(),
  password: newPasswordValidator,
});

export const resetPasswordHandler: MethodHandler<
  ResetPasswordRequest,
  ResetPasswordResponse
> = async ({ conn, req }) => {
  const { token, password } = resetPasswordValidator.assert(req.body);
  await resetPassword(conn, token, password);
};
