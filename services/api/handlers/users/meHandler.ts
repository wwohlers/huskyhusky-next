import { IUser } from "../../../users/user.interface";
import { MethodHandler } from "../../createHandler";

export type MeResponse =
  | {
      authenticated: false;
    }
  | {
      authenticated: true;
      user: IUser;
    };

const meHandler: MethodHandler<{}, MeResponse> = async ({ conn, userId }) => {
  if (userId) {
    const me = await conn.models.User.findById(userId);
    if (me && !me.removed) {
      return {
        authenticated: true,
        user: me.toObject(),
      };
    }
  }
  return {
    authenticated: false,
  };
};

export default meHandler;
