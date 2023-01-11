import { string } from "deterrent";
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
  "_id" | "name" | "title" | "tags" | "brief" | "image" | "author" | "public"
>;

export const headlineSelector = "_id name title tags brief image author public";

export const articleNameValidator = string({ name: "Article name" })
  .minLength(3)
  .maxLength(300);
export const articleTitleValidator = string({ name: "Article title" })
  .minLength(1)
  .maxLength(100);
export const articleBriefValidator = string({ name: "Article brief" })
  .minLength(1)
  .maxLength(500);
export const articleAttrValidator = string({ name: "Article attribution" })
  .minLength(0)
  .maxLength(100);

export function convertTitleToName(title: string): string {
  return title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}
