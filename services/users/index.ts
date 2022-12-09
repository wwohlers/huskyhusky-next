import mongoose, { Document, Model } from "mongoose";
import { AdminUser, IUser, PublicUser } from "./user.interface";
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

export async function getAdminUsers(conn: mongoose.Connection) {
  const users = await conn.models.User.find()
    .sort({ name: 1 })
    .select("_id name email admin removed createdAt")
    .lean();
  return users as AdminUser[];
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

export async function updateUserName(
  conn: mongoose.Connection,
  userId: string,
  name: string,
) {
  try {
    const user = await conn.models.User.findByIdAndUpdate<IUser>(
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
  conn: mongoose.Connection,
  userId: string,
  bio: string,
) {
  const user = await conn.models.User.findByIdAndUpdate<IUser>(
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
  conn: mongoose.Connection,
  userId: string,
  email: string,
  password: string,
) {
  const user = await (conn.models.User as Model<IUser>).findById(userId);
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
  conn: mongoose.Connection,
  userId: string,
  newPassword: string,
  password: string,
) {
  const user = await (conn.models.User as Model<IUser>).findById(userId);
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

export async function adminUpdateUser(
  conn: mongoose.Connection,
  update: AdminUser,
) {
  const user = await conn.models.User.findByIdAndUpdate<IUser>(
    update._id,
    {
      name: update.name,
      admin: update.admin,
      removed: update.removed,
    },
    {
      new: true, // return the modified document rather than the original
    }
  ).select("_id name email admin removed createdAt").lean();
  return user;
}