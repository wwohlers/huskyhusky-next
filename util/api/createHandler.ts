import mongoose, { Model } from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";
import { connectToDB } from "../../database";

// type for an individual handler for each method (GET, POST, etc)
export type MethodHandler<R> = (
  req: NextApiRequest,
  res: NextApiResponse<{ error: string } | R>,
  conn: typeof mongoose
) => Promise<void>;

type Methods = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export default function createHandler(
  methodHandlers: Partial<Record<Methods, MethodHandler<any>>>
) {
  return async (req: NextApiRequest, res: NextApiResponse<any>) => {
    let conn: typeof mongoose;
    try {
      conn = await connectToDB();
    } catch (e) {
      console.error("Failed to connect to database", e);
      return res.status(500).json({ error: "Failed to connect to database" });
    }
    const handler = methodHandlers[(req.method as Methods) ?? "GET"];
    if (handler) {
      await handler(req, res, conn);
    }
    conn.disconnect();
  };
}
