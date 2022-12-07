import { updateUserBio, updateUserName } from "../../../services/users";
import { IUser } from "../../../services/users/user.interface";
import createHandler from "../../../util/api/createHandler";

const changeBioHandler = createHandler(true, {
  PATCH: async ({ req, userId, conn }) => {
    if (!userId) {
      return [401, { error: "Unauthorized" }];
    }
    const { bio } = req.body;
    const user = await updateUserBio(conn, userId, bio);
    return [200, user];
  }
});

export default changeBioHandler;