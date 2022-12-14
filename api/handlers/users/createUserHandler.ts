import { userIsAdmin, createUser } from "../../../services/users/server";
import { IUser } from "../../../services/users/user.interface";
import { MethodHandler } from "../../createHandler";
import requireAuth from "../../guards/requireAuth";

type CreateUserRequest = {
  name: string;
  email: string;
  password: string;
};
type CreateUserResponse = IUser;

const createUserHandler: MethodHandler<
  CreateUserRequest,
  CreateUserResponse
> = async ({ req, conn, userId }) => {
  requireAuth(conn, userId, true);
  const { name, email, password } = req.body;
  const user = await createUser(conn, { name, email, password });
  return user;
};

export default createUserHandler;
