import { DateTime } from "luxon";
import { HuskyHuskyDB } from "../database";
import { headlineSelector, IHeadline } from "./article.interface";

export async function getAllArticleNames(conn: HuskyHuskyDB) {
  const articles = await conn.models.Article.find({ public: true }).lean();
  return articles.map((a) => a.name);
}

export async function getArticleById(conn: HuskyHuskyDB, id: string) {
  const article = await conn.models.Article.findById(id)
    .populate("author", "_id name")
    .lean();
  return article;
}

export async function getArticleByName(conn: HuskyHuskyDB, name: string) {
  const article = await conn.models.Article.findOne({
    name,
    public: true,
  })
    .populate("author", "_id name")
    .populate("comments")
    .lean();
  return article;
}

export async function getHeadlines(conn: HuskyHuskyDB) {
  const articles = await conn.models.Article.find({
    public: true,
  })
    .sort({ createdAt: -1 })
    .limit(18)
    .select(headlineSelector)
    .populate("author", "_id name")
    .lean();
  return articles as IHeadline[];
}

export async function getArticleTags(conn: HuskyHuskyDB) {
  const result = await conn.models.Article.aggregate([
    {
      $group: {
        _id: 0,
        tags: { $push: "$tags" },
      },
    },
    {
      $project: {
        tags: {
          $reduce: {
            input: "$tags",
            initialValue: [],
            in: { $setUnion: ["$$value", "$$this"] },
          },
        },
      },
    },
  ]).exec();
  return result[0].tags.filter(
    (t: unknown) => typeof t === "string"
  ) as string[];
}

export async function searchArticles(conn: HuskyHuskyDB, query: string) {
  const articles = await conn.models.Article.find({
    $text: { $search: query },
    score: { $meta: "textScore" },
    public: true,
  })
    .sort({ score: { $meta: "textScore" } })
    .select(headlineSelector)
    .populate("author", "_id name")
    .lean();
  return articles as IHeadline[];
}

export async function getHeadlinesByTag(
  conn: HuskyHuskyDB,
  tag: string,
  limit: number = 100
) {
  const articles = await conn.models.Article.find({
    public: true,
    tags: tag,
  })
    .limit(limit)
    .sort({ createdAt: -1 })
    .select(headlineSelector)
    .populate("author", "_id name")
    .lean();
  return articles as IHeadline[];
}

export async function getHeadlinesByUser(conn: HuskyHuskyDB, userId: string) {
  const articles = await conn.models.Article.find({
    author: userId,
  })
    .sort({ createdAt: -1 })
    .select(headlineSelector)
    .populate("author", "_id name")
    .lean();
  return articles as IHeadline[];
}

export async function getHeadlinesByMonth(
  conn: HuskyHuskyDB,
  year: number,
  month: number
) {
  const monthStart = DateTime.fromObject({ year, month });
  const monthEnd = monthStart.plus({ month: 1 });
  const articles = await conn.models.Article.find({
    public: true,
    createdAt: {
      $gte: Math.floor(monthStart.toMillis() / 1000),
      $lt: Math.ceil(monthEnd.toMillis() / 1000),
    },
  })
    .sort({ createdAt: -1 })
    .select(headlineSelector)
    .populate("author", "_id name")
    .lean();
  return articles as IHeadline[];
}