import { NextApiRequest, NextApiResponse } from "next";
import { HuskyHuskyDB, withDB } from "../../services/database";
import { getUserIdFromReq } from "../jwt";
import { handleError, MethodNotAllowedError } from "./handleError";

export type MethodHandlers = {
  [key in Methods]?: MethodHandler<any, any>;
};

// type for an individual handler for each method (GET, POST, etc)
export type MethodHandler<B, R> = (params: {
  req: Omit<NextApiRequest, "body"> & { body: B };
  res: NextApiResponse;
  conn: HuskyHuskyDB;
  userId: string | undefined;
}) => Promise<R>;

export type Methods = "get" | "post" | "put" | "patch" | "delete";

export default function createHandler(methodHandlers: MethodHandlers) {
  return async (req: NextApiRequest, res: NextApiResponse<any>) => {
    try {
      const response = await withDB((conn) => {
        const handler =
          methodHandlers[(req.method?.toLowerCase() as Methods) ?? "get"];
        if (handler) {
          const userId = getUserIdFromReq(req);
          return handler({ req, res, conn, userId });
        } else {
          throw new MethodNotAllowedError("Method not allowed");
        }
      });
      const statusCode = req.method === "GET" ? 200 : 201;
      res.status(statusCode);
      res.json(response ?? {});
    } catch (e) {
      handleError(e as Error, res);
    }
  };
}
