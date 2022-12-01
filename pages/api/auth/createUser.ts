import { createUser, userIsAdmin } from "../../../services/users";
import createHandler from "../../../util/api/createHandler";

const createUserHandler = createHandler(true, {
  POST: async ({ req, conn, userId }) => {
    if (!userId || !(await userIsAdmin(conn, userId))) {
      return [401, { error: "Unauthorized" }];
    }
    const { name, email, password } = req.body;
    const user = await createUser(conn, { name, email, password });
    return [201, { user }];
  },
});

export default createUserHandler;
