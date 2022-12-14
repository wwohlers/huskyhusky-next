import { object } from "deterrent";
import { serialize } from "cookie";
import { MethodHandler } from "../../../util/api/createHandler";
import {
  emailValidator,
  enteredPasswordValidator,
} from "../../../util/validation";
import { signIn } from "../server";
import { IUser } from "../user.interface";

type SignInRequest = {
  email: string;
  password: string;
};
type SignInResponse = IUser;

const requestBodyValidator = object().schema<SignInRequest>({
  email: emailValidator,
  password: enteredPasswordValidator,
});

const signInHandler: MethodHandler<SignInRequest, SignInResponse> = async ({
  req,
  res,
  conn,
}) => {
  const { email, password } = requestBodyValidator.assert(req.body);
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
