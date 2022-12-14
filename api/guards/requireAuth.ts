import mongoose from "mongoose";
import { HuskyHuskyDB } from "../../services/database";
import { IUser } from "../../services/users/user.interface";
import { UnauthorizedError } from "../handleError";

export default async function requireAuth(conn: HuskyHuskyDB, userId: string | undefined, requireAdmin = false): Promise<IUser & mongoose.Document> {
  if (!userId) {
    throw new UnauthorizedError("Invalid or expired authentication token");
  }
  const user = await conn.models.User.findById(userId);
  if (!user || user.removed) {
    throw new Error("User does not exist or has been removed");
  }
  if (requireAdmin && !user.admin) {
    throw new Error("User is not an admin");
  }
  return user;
}