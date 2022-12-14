import bcrypt from "bcrypt";
import mongoose, { Document, Model } from "mongoose";
import {
  ConflictError,
  NotFoundError,
  UnauthorizedError,
} from "../../api/handleError";
import { signJWT } from "../../util/jwt";
import { HuskyHuskyDB } from "../database";
import {
  AdminUser,
  adminUserSelector,
  IUser,
  PublicUser,
  publicUserSelector,
} from "./user.interface";

export function canEditArticle(
  user: IUser | undefined | null,
  article: { author: IUser }
) {
  if (!user) return false;
  console.log(user._id, article.author._id);
  return user._id === article.author._id || user.admin;
}

export async function userIsAdmin(conn: HuskyHuskyDB, userId: string) {
  const user = await conn.models.User.findById(userId);
  return user?.admin;
}

export async function getPublicUsers(conn: HuskyHuskyDB) {
  const users = await conn.models.User.find({
    removed: false,
  })
    .sort({ name: 1 })
    .select(publicUserSelector)
    .lean();
  return users as PublicUser[];
}

export async function getAdminUsers(conn: HuskyHuskyDB) {
  const users = await conn.models.User.find()
    .sort({ name: 1 })
    .select(adminUserSelector)
    .lean();
  return users as AdminUser[];
}

export async function getPublicUser(conn: HuskyHuskyDB, name: string) {
  const user = await conn.models.User.findOne({ name, removed: false })
    .select(publicUserSelector)
    .lean();
  return user as PublicUser;
}

export async function createUser(
  conn: HuskyHuskyDB,
  user: Pick<IUser, "name" | "email" | "password">
) {
  const hashedPassword = await bcrypt.hash(user.password, 10);
  try {
    const newUser = await conn.models.User.create({
      name: user.name,
      email: user.email,
      password: hashedPassword,
    });
    return newUser;
  } catch (e) {
    throw new ConflictError("Name or email already in use");
  }
}

export async function comparePassword(user: IUser, password: string) {
  return await bcrypt.compare(password, user.password);
}

export async function signIn(
  conn: HuskyHuskyDB,
  email: string,
  password: string
) {
  const user = await conn.models.User.findOne({ email });
  if (!user || user.removed) {
    throw new NotFoundError("Invalid email or user account removed");
  }

  const valid = await comparePassword(user, password);
  if (!valid) {
    throw new UnauthorizedError("Invalid password");
  }
  const token = signJWT({ id: user._id });
  return {
    user,
    token,
  };
}

export async function selfUpdateUser(
  user: mongoose.Document & IUser,
  userUpdate: Partial<Pick<IUser, "name" | "bio" | "email" | "password">>
) {
  if (userUpdate.email) {
    user.email = userUpdate.email;
  }
  if (userUpdate.password) {
    user.password = await bcrypt.hash(userUpdate.password, 10);
  }
  if (userUpdate.name) {
    user.name = userUpdate.name;
  }
  if (userUpdate.bio) {
    user.bio = userUpdate.bio;
  }
  await user.save();
  return user;
}

export async function adminUpdateUser(
  user: mongoose.Document & IUser,
  userUpdate: Partial<Pick<IUser, "name" | "admin" | "removed">>
) {
  if (userUpdate.name) {
    user.name = userUpdate.name;
  }
  if (userUpdate.admin) {
    user.admin = userUpdate.admin;
  }
  if (userUpdate.removed) {
    user.removed = userUpdate.removed;
  }
  await user.save();
  return user;
}
