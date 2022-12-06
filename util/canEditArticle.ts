import { IUser } from "../services/users/user.interface";

export function canEditArticle(user: IUser | undefined, article: { author: IUser }) {
  if (!user) return false;
  console.log(user._id, article.author._id);
  return user._id === article.author._id || user.admin;
}