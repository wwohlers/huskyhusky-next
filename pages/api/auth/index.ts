import { IUser } from "../../../services/users/user.interface";
import createHandler from "../../../util/api/createHandler";

export type MeResponse = {
  authenticated: false;
} | {
  authenticated: true;
  user: IUser;
}

const meHandler = createHandler(false, {
  GET: async ({ conn, userId }) => {
    if (!userId) return [200, { authenticated: false } as MeResponse];
    const me = await conn.models.User.findById(userId!);
    if (me && !me.removed) {
      return [200, { authenticated: true, user: me } as MeResponse];
    } else {
      return [404, { message: "User not found" }];
    }
  },
});

export default meHandler;
