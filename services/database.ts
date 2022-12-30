import mongoose, { Model, mongo } from "mongoose";
import { IArticle } from "./articles/article.interface";
import { ArticleSchema } from "./articles/article.schema";
import { ISub } from "./subs/sub.interface";
import { SubSchema } from "./subs/sub.schema";
import { IUser } from "./users/user.interface";
import { UserSchema } from "./users/user.schema";

const { DATABASE_URL } = process.env;

export type HuskyHuskyDB = mongoose.Connection & {
  models: {
    User: Model<IUser>;
    Article: Model<IArticle>;
    Sub: Model<ISub>;
  };
};

export type WithDBHandler<K> = (conn: HuskyHuskyDB) => Promise<K>;

async function connectToDB(): Promise<HuskyHuskyDB> {
  const conn = await mongoose.createConnection(DATABASE_URL as string);
  conn.model("Article", ArticleSchema);
  conn.model("Sub", SubSchema);
  conn.model("User", UserSchema);
  return conn as HuskyHuskyDB;
}

/**
 * Run a function with a database connection. Automatically closes the connection and converts _id fields to strings.
 * @param callback
 * @returns
 */
export async function withDB<K>(
  callback: WithDBHandler<K>
): Promise<K> {
  const conn = await connectToDB();
  const result = await callback(conn);
  conn.close();
  return result as K;
}
