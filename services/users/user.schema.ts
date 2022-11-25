import * as mongoose from "mongoose";
import { IUser } from "./user.interface";

const now = () => Math.floor(Date.now() / 1000);

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

  // tokens: authentication tokens
  tokens: {
    type: [String],
  },

  // admin: whether this user is an admin
  admin: {
    type: Boolean,
    default: false,
  },

  // resetKey: a key emailed to the user to reset their password
  resetKey: {
    type: String,
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
