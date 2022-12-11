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

export type WithDBHandler<K> = (conn: HuskyHuskyDB) => K;

type WithoutPromise<T> = T extends Promise<infer U> ? U : T;

function connectToDB(): HuskyHuskyDB {
  const conn = mongoose.createConnection(DATABASE_URL as string);
  conn.model("Article", ArticleSchema);
  conn.model("Sub", SubSchema);
  conn.model("User", UserSchema);
  return conn as HuskyHuskyDB;
}

/**
 * Run a function with a database connection. Automatically closes the connection and converts _id fields to strings.
 * @param handler
 * @returns
 */
export async function withDB<K>(
  handler: WithDBHandler<K>
): Promise<WithoutPromise<K>> {
  const conn = await connectToDB();
  const result = await handler(conn);
  conn.close();
  return stringifyIds(result) as WithoutPromise<K>;
}

/**
 * Deeply converts all _id fields to strings. Mutates the original object.
 * @param obj
 */
export function stringifyIds(obj: any) {
  for (const key in obj) {
    if (key === "_id" && obj[key]?.toString) {
      obj[key] = obj[key].toString();
    } else if (typeof obj[key] === "object") {
      stringifyIds(obj[key]);
    }
  }
}
