import * as mongoose from "mongoose";
import { now } from "../../util/datetime";
import { IUser } from "./user.interface";

/**
 * Represents a User in the database.
 */
export const UserSchema = new mongoose.Schema<IUser>({
  // name: display name of the user
  name: {
    type: String,
    unique: true,
    required: true,
  },

  email: {
    type: String,
    unique: true,
    required: true,
  },

  // password: salted password
  password: {
    type: String,
    required: true,
  },

  // admin: whether this user is an admin
  admin: {
    type: Boolean,
    default: false,
  },

  // removed: whether the user has been removed
  removed: {
    type: Boolean,
    default: false,
  },

  // bio: the user's bio
  bio: {
    type: String,
  },

  createdAt: {
    type: Number,
    required: true,
    default: now,
  },
});
