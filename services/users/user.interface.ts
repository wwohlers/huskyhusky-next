import { Document } from "mongoose";

/**
 * Represents a User object.
 */
export interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  tokens: string[];
  admin: boolean;
  resetKey: string;
  removed: boolean;
  bio: string;
  createdAt: number;
}
