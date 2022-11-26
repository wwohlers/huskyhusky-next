import { IUser } from "../users/user.interface";
import { IComment } from "./comment.interface";

/**
 * Represents an Article object.
 */
export interface IArticle {
  _id: string;
  author: IUser;
  name: string;
  title: string;
  tags: string[];
  brief: string;
  image: string;
  attr: string;
  text: string;
  public: boolean;
  clicks: number;
  comments: IComment[];
  updatedAt: number;
  createdAt: number;
}

export type IHeadline = Pick<
  IArticle,
  "_id" | "name" | "title" | "tags" | "brief" | "image"
>;
