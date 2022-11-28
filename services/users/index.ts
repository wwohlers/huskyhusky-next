import mongoose from "mongoose";
import { PublicUser } from "./user.interface";

export async function getPublicUsers(conn: mongoose.Connection) {
  const users = await conn.models.User.find({
    removed: false,
  })
    .sort({ name: 1 })
    .select("_id name bio createdAt")
    .lean();
  return users as PublicUser[];
}

export async function getPublicUser(conn: mongoose.Connection, name: string) {
  const user = await conn.models.User.findOne({ name, removed: false })
    .select("_id name bio createdAt")
    .lean();
  return user as PublicUser;
}