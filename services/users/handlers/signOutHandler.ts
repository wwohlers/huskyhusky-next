import { serialize } from "cookie";
import { MethodHandler } from "../../../util/api/createHandler";

const signOutHandler: MethodHandler<void, void> = async ({ res }) => {
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
    return;
}

export default signOutHandler;