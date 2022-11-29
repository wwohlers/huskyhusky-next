import mongoose from "mongoose";
import { IArticle, IHeadline } from "./article.interface";

export async function getAllArticleNames(conn: mongoose.Connection) {
  const articles = await conn.models.Article.find().lean<IArticle[]>();
  return articles.map((a) => a.name);
}

export async function getArticleByName(
  conn: mongoose.Connection,
  name: string
) {
  const article = await conn.models.Article.findOne({
    name,
  })
    .populate("author", "_id name")
    .populate("comments")
    .lean<IArticle | null>();
  return article;
}

export async function getHeadlines(conn: mongoose.Connection) {
  const articles = await conn.models.Article.find({
    public: true,
  })
    .sort({ createdAt: -1 })
    .limit(18)
    .select("_id name title brief image tags")
    .lean();
  return articles as IHeadline[];
}

export async function getArticleTags(conn: mongoose.Connection) {
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
  return result[0].tags as string[];
}

export async function searchArticles(conn: mongoose.Connection, query: string) {
  const articles = await conn.models.Article.find({
    $text: { $search: query },
    score: { $meta: "textScore" },
    public: true,
  })
    .sort({ score: { $meta: "textScore" } })
    .select("_id name title brief image tags author")
    .populate("author", "name")
    .lean();
  return articles as IHeadline[];
}

export async function getHeadlinesByTag(
  conn: mongoose.Connection,
  tag: string
) {
  const articles = await conn.models.Article.find({
    public: true,
    tags: tag,
  })
    .sort({ createdAt: -1 })
    .select("_id name title brief image tags author")
    .populate("author", "name")
    .lean();
  return articles as IHeadline[];
}

export async function getHeadlinesByUser(
  conn: mongoose.Connection,
  userId: string
) {
  const articles = await conn.models.Article.find({
    public: true,
  })
    .sort({ createdAt: -1 })
    .select("_id name title brief image tags author")
    .populate("author", "_id name")
    .lean();
  return articles.filter(
    (a) => a.author._id.toString() === userId
  ) as IHeadline[];
}
