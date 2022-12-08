import { adminUpdateUser } from "../../../services/users";
import { IUser } from "../../../services/users/user.interface";
import createHandler from "../../../util/api/createHandler";

const adminUpdateHandler = createHandler(true, {
  PATCH: async ({ req, userId, conn }) => {
    const reqUser = await conn.models.User.findById<IUser>(userId).lean();
    if (!reqUser || !reqUser.admin) {
      return [401, { error: "Unauthorized" }];
    }
    const { user } = req.body;
    const updatedUser = await adminUpdateUser(conn, user);
    return [201, { user: updatedUser }];
  },
});

export default adminUpdateHandler;