import { updateUserPassword } from "../../../services/users/server";
import createHandler from "../../../util/api/createHandler";

const changePasswordHandler = createHandler(true, {
  PATCH: async ({ req, userId, conn }) => {
    if (!userId) {
      return [401, { error: "Unauthorized" }];
    }
    const { newPassword, oldPassword } = req.body;
    const user = await updateUserPassword(
      conn,
      userId,
      newPassword,
      oldPassword
    );
    return [200, user];
  },
});

export default changePasswordHandler;
