import { createTextFieldValidator } from "../../util/validation";

export interface IComment {
  name: string;
  content: string;
  deleted: boolean;
  createdAt: number;
}

export function createCommentNameValidator() {
  return createTextFieldValidator(3, 30);
}

export function createCommentContentValidator() {
  return createTextFieldValidator(1, 500);
}