import { MethodHandler } from "../../createHandler";
import { serialize } from "cookie";

const signOutHandler: MethodHandler<{}, {}> = async ({ res }) => {
    res.setHeader(
      "Set-Cookie",
      serialize("auth", "0", {
        httpOnly: true,
        maxAge: 1,
        path: "/",
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
      })
    );
    return {};
}

export default signOutHandler;