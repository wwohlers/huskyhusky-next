import { createTextFieldValidator } from "../../util/validation";
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
  "_id" | "name" | "title" | "tags" | "brief" | "image" | "author"
>;

export const headlineSelector = "_id name title tags brief image author";

export const isArticleName = createTextFieldValidator(1, 200);

export const isArticleTitle = createTextFieldValidator(1, 100);

export const isArticleBrief = createTextFieldValidator(1, 500);

export const isArticleAttr = createTextFieldValidator(0, 100);

export function convertTitleToName(title: string): string {
  return title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}
