import { Document } from "mongoose";
import { IUser } from "../users/user.interface";
import { Comment } from "./comment.interface";

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
  comments: Comment[];
  updatedAt: number;
  createdAt: number;
}
