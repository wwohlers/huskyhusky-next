import { signIn } from "../../../services/users";
import createHandler from "../../../util/api/createHandler";
import { serialize } from "cookie";

export type SignInRequestBody = {
  email: string;
  password: string;
};

const signInHandler = createHandler(false, {
  POST: async ({ req, res, conn }) => {
    const { email, password } = req.body as SignInRequestBody;
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
    return [201, {}];
  },
});

export default signInHandler;
