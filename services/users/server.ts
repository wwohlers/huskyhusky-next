import bcrypt from "bcrypt";
import mongoose, { Model } from "mongoose";
import { signJWT } from "../../util/jwt";
import { HuskyHuskyDB } from "../database";
import {
  AdminUser,
  adminUserSelector,
  IUser,
  PublicUser,
  publicUserSelector,
} from "./user.interface";

export function canEditArticle(user: IUser | undefined | null, article: { author: IUser }) {
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
  const newUser = await conn.models.User.create({
    name: user.name,
    email: user.email,
    password: hashedPassword,
  });
  return newUser;
}

export async function signIn(
  conn: HuskyHuskyDB,
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

export async function updateUserName(
  conn: HuskyHuskyDB,
  userId: string,
  name: string
) {
  try {
    const user = await conn.models.User.findByIdAndUpdate(
      userId,
      {
        name,
      },
      {
        new: true, // return the modified document rather than the original
      }
    );
    return user;
  } catch (e) {
    throw new Error("Name already taken");
  }
}

export async function updateUserBio(
  conn: HuskyHuskyDB,
  userId: string,
  bio: string
) {
  const user = await conn.models.User.findByIdAndUpdate(
    userId,
    {
      bio,
    },
    {
      new: true, // return the modified document rather than the original
    }
  ).lean();
  return user;
}

export async function updateUserEmail(
  conn: HuskyHuskyDB,
  userId: string,
  email: string,
  password: string
) {
  const user = await conn.models.User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    throw new Error("Invalid password");
  }
  try {
    user.email = email;
    await user.save();
    return user.toObject();
  } catch (e) {
    throw new Error("Email already taken");
  }
}

export async function updateUserPassword(
  conn: HuskyHuskyDB,
  userId: string,
  newPassword: string,
  password: string
) {
  const user = await conn.models.User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    throw new Error("Invalid password");
  }
  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    return user.toObject();
  } catch (e) {
    throw new Error("Email already taken");
  }
}

export async function adminUpdateUser(conn: HuskyHuskyDB, update: AdminUser) {
  const user = await conn.models.User.findByIdAndUpdate(
    update._id,
    {
      name: update.name,
      admin: update.admin,
      removed: update.removed,
    },
    {
      new: true, // return the modified document rather than the original
    }
  )
    .select(adminUserSelector)
    .lean();
  return user as AdminUser;
}
