import { object } from "deterrent";
import { MethodHandler } from "../../../util/api/createHandler";
import requireAuth from "../../../util/api/guards/requireAuth";
import { emailValidator, newPasswordValidator } from "../../../util/validation";
import { createUser } from "../server";
import { IUser, userNameValidator } from "../user.interface";

type CreateUserRequest = {
  name: string;
  email: string;
  password: string;
};
type CreateUserResponse = IUser;

const requestBodyValidator = object().schema<CreateUserRequest>({
  name: userNameValidator,
  email: emailValidator,
  password: newPasswordValidator,
});

const createUserHandler: MethodHandler<
  CreateUserRequest,
  CreateUserResponse
> = async ({ req, conn, userId }) => {
  requireAuth(conn, userId, true);
  const { name, email, password } = requestBodyValidator.assert(req.body);
  const user = await createUser(conn, { name, email, password });
  return user.toObject();
};

export default createUserHandler;
