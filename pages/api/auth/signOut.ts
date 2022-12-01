import createHandler from "../../../util/api/createHandler";
import { serialize } from "cookie";

const signOutHandler = createHandler(false, {
  POST: async ({ res }) => {
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
    return [201, {}];
  },
});

export default signOutHandler;
