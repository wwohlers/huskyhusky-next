import mongoose, { Model, mongo } from "mongoose";
import { ArticleSchema } from "./services/articles/article.schema";
import { SubSchema } from "./services/subs/sub.schema";
import { UserSchema } from "./services/users/user.schema";

const { DATABASE_URL } = process.env;

export const connectToDB = () => {
  const conn = mongoose.createConnection(DATABASE_URL as string);
  conn.model("Article", ArticleSchema);
  conn.model("Sub", SubSchema);
  conn.model("User", UserSchema);
  return conn;
};
