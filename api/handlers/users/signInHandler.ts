import { serialize } from "cookie";
import { signIn } from "../../../services/users/server";
import { IUser } from "../../../services/users/user.interface";
import {
  createSchemaValidator,
  createEmailValidator,
  createEnteredPasswordValidator,
} from "../../../util/validation";
import { MethodHandler } from "../../createHandler";

type SignInRequest = {
  email: string;
  password: string;
};
type SignInResponse = IUser;

const requestBodyValidator = createSchemaValidator<SignInRequest>({
  email: createEmailValidator(),
  password: createEnteredPasswordValidator(),
});

const signInHandler: MethodHandler<SignInRequest, SignInResponse> = async ({
  req,
  res,
  conn,
}) => {
  const { email, password } = requestBodyValidator(req.body);
  const { token, user } = await signIn(conn, email, password);
  res.setHeader(
    "Set-Cookie",
    serialize("auth", token, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    })
  );
  return user.toObject();
};

export default signInHandler;
