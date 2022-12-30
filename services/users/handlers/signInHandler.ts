import { serialize } from "cookie";
import { MethodHandler } from "../../../util/api/createHandler";
import {
  createSchemaValidator,
  isEmail,
  isEnteredPassword,
} from "../../../util/validation";
import { signIn } from "../server";
import { IUser } from "../user.interface";

type SignInRequest = {
  email: string;
  password: string;
};
type SignInResponse = IUser;

const requestBodyValidator = createSchemaValidator<SignInRequest>({
  email: isEmail,
  password: isEnteredPassword,
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
