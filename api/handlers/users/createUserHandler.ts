import { createUser } from "../../../services/users/server";
import {
  IUser,
  createUserNameValidator,
} from "../../../services/users/user.interface";
import {
  createEmailValidator,
  createNewPasswordValidator,
  createSchemaValidator,
} from "../../../util/validation";
import { MethodHandler } from "../../createHandler";
import requireAuth from "../../guards/requireAuth";

type CreateUserRequest = {
  name: string;
  email: string;
  password: string;
};
type CreateUserResponse = IUser;

const requestBodyValidator = createSchemaValidator<CreateUserRequest>({
  name: createUserNameValidator(),
  email: createEmailValidator(),
  password: createNewPasswordValidator(),
});

const createUserHandler: MethodHandler<
  CreateUserRequest,
  CreateUserResponse
> = async ({ req, conn, userId }) => {
  requireAuth(conn, userId, true);
  const { name, email, password } = requestBodyValidator(req.body);
  const user = await createUser(conn, { name, email, password });
  return user.toObject();
};

export default createUserHandler;
