import { string } from "deterrent";

export interface IComment {
  name: string;
  content: string;
  deleted: boolean;
  createdAt: number;
}

export const commentNameValidator = string({ name: "Name" })
  .minLength(3)
  .maxLength(30);
export const commentContentValidator = string({ name: "Content" })
  .minLength(1, { errorMessage: "Please enter some content" })
  .maxLength(500);
