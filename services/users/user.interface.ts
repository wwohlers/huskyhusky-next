import { createEmailValidator, createNewPasswordValidator } from "../../util/validation";
import { createTextFieldValidator } from "../../util/validation";

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

export function createUserNameValidator() {
  return createTextFieldValidator(3, 20);
}

export function createUserBioValidator() {
  return createTextFieldValidator(0, 200);
}
