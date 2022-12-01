import mongoose from "mongoose";
import { IUser, PublicUser } from "./user.interface";
import bcrypt from "bcrypt";
import { signJWT } from "../../util/jwt";

export async function userIsAdmin(conn: mongoose.Connection, userId: string) {
  const user = await conn.models.User.findById(userId);
  return user?.admin;
}

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

export async function createUser(
  conn: mongoose.Connection,
  user: Pick<IUser, "name" | "email" | "password">
) {
  const hashedPassword = await bcrypt.hash(user.password, 10);
  const newUser = await conn.models.User.create({
    name: user.name,
    email: user.email,
    password: hashedPassword,
  });
  return newUser;
}

export async function signIn(
  conn: mongoose.Connection,
  email: string,
  password: string
) {
  const user = await conn.models.User.findOne({ email });
  if (!user || user.removed) {
    throw new Error("Invalid email or user account removed");
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    throw new Error("Invalid password");
  }

  const token = signJWT({ id: user._id });

  return {
    user,
    token,
  };
}
