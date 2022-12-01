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
  createdAt: number;
}

export type PublicUser = Pick<IUser, "_id" | "name" | "bio" | "createdAt">;