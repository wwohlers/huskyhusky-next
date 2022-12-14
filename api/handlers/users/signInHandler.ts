import { serialize } from "cookie";
import { signIn } from "../../../services/users/server";
import { MethodHandler } from "../../createHandler";

type SignInRequest = {
  email: string;
  password: string;
};
type SignInResponse = {};

const signInHandler: MethodHandler<SignInRequest, SignInResponse> = async ({
  req,
  res,
  conn,
}) => {
  const { email, password } = req.body;
  const { token } = await signIn(conn, email, password);
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
  return {};
};

export default signInHandler;
