import mongoose, { Model } from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";
import { handleError } from "../../errors/handleError";
import { withDB } from "../../services/database";
import { getUserIdFromReq } from "../../util/jwt";

// type for an individual handler for each method (GET, POST, etc)
export type MethodHandler = (params: {
  req: NextApiRequest,
  res: NextApiResponse,
  conn: mongoose.Connection,
  userId: string | undefined,
}) => Promise<[number, any]>;

type Methods = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export function createHandler(
  methodHandlers: Partial<Record<Methods, MethodHandler>>,
) {
  return async (req: NextApiRequest, res: NextApiResponse<any>) => {
    try {
      await withDB((conn) => {
        const handler = methodHandlers[(req.method as Methods) ?? "GET"];
        if (handler) {
          const userId = getUserIdFromReq(req);
          return handler({req, res, conn, userId});
        }
        return res.status(405).json({ error: "Method not allowed" });
      });
    } catch (e) {
      handleError(e as Error, res);
    }
  };
}

const healthCheckHandler = createHandler(false, {
  GET: async () => {
    return [200, { status: "OK" }];
  },
});

export default healthCheckHandler;