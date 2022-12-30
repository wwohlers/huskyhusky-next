import { MethodHandler } from "../../../util/api/createHandler";
import requireAuth from "../../../util/api/guards/requireAuth";
import {
  createSchemaValidator,
  isEmail,
  isNewPassword,
} from "../../../util/validation";
import { createUser } from "../server";
import { isUserName, IUser } from "../user.interface";

type CreateUserRequest = {
  name: string;
  email: string;
  password: string;
};
type CreateUserResponse = IUser;

const requestBodyValidator = createSchemaValidator<CreateUserRequest>({
  name: isUserName,
  email: isEmail,
  password: isNewPassword,
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
