import { MethodHandler } from "../../../util/api/createHandler";
import { IUser } from "../user.interface";

export type MeResponse =
  | {
      authenticated: false;
    }
  | {
      authenticated: true;
      user: IUser;
    };

const meHandler: MethodHandler<void, MeResponse> = async ({ conn, userId }) => {
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
