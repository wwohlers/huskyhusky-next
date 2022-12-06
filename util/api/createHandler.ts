import mongoose, { Model } from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";
import { connectToDB } from "../../services/database";
import getUserIdFromReq from "./getUserIdFromReq";

// type for an individual handler for each method (GET, POST, etc)
export type MethodHandler = (params: {
  req: NextApiRequest,
  res: NextApiResponse,
  conn: mongoose.Connection,
  userId: string | undefined,
}) => Promise<[number, any]>;

type Methods = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export default function createHandler(
  requireAuth: boolean,
  methodHandlers: Partial<Record<Methods, MethodHandler>>,
) {
  return async (req: NextApiRequest, res: NextApiResponse<any>) => {
    let conn: mongoose.Connection;
    try {
      conn = await connectToDB();
    } catch (e) {
      console.error("Failed to connect to database", e);
      res.status(500).json({ error: "Failed to connect to database" });
      return;
    }
    const handler = methodHandlers[(req.method as Methods) ?? "GET"];
    if (handler) {
      const userId = getUserIdFromReq(req);
      if (requireAuth && !userId) {
        conn.close();
        return res.status(401).json({ error: "Unauthorized" });
      }
      try {
        const [status, response] = await handler({req, res, conn, userId});
        conn.close();
        res.status(status).json(response);
      } catch (e: any) {
        conn.close();
        console.error("REQ ERROR:", req.method, req.url, e.toString());
        res.status(500).json({ error: e.toString() });
      }
    } else {
      conn.close();
      res.status(404).json({ error: "Not found" });
    }
  };
}
