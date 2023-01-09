import { string } from "deterrent";

/**
 * Represents a User object.
 */
export interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  admin: boolean;
  removed: boolean;
  bio: string;
  createdAt: number; // all dates in seconds since Jan 1, 1970 (NOT MILLISECONDS)
}

export type PublicUser = Pick<IUser, "_id" | "name" | "bio" | "createdAt">;

export const publicUserSelector = "_id name bio createdAt";

export type AdminUser = Pick<
  IUser,
  "_id" | "name" | "email" | "admin" | "removed" | "createdAt"
>;

export const adminUserSelector = "_id name email admin removed createdAt";

export const userNameValidator = string({ name: "User name" }).minLength(1).maxLength(30);
export const userBioValidator = string({ name: "User bio" }).minLength(0).maxLength(200);
