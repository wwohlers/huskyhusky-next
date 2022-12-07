import { updateUserEmail } from "../../../services/users";
import createHandler from "../../../util/api/createHandler";

const changeEmailHandler = createHandler(true, {
  PATCH: async ({ req, userId, conn }) => {
    if (!userId) {
      return [401, { error: "Unauthorized" }];
    }
    const { email, password } = req.body;
    const user = await updateUserEmail(conn, userId, email, password);
    return [200, user];
  }
});

export default changeEmailHandler;