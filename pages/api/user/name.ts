import { updateUserName } from "../../../services/users";
import createHandler from "../../../util/api/createHandler";

const changeNameHandler = createHandler(true, {
  PATCH: async ({ req, userId, conn }) => {
    if (!userId) {
      return [401, { error: "Unauthorized" }];
    }
    const { name } = req.body;
    const user = await updateUserName(conn, userId, name);
    return [200, user];
  }
});

export default changeNameHandler;