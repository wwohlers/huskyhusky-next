import mongoose from "mongoose";
import { HuskyHuskyDB } from "../database";
import { headlineSelector, IArticle, IHeadline } from "./article.interface";

export async function getAllArticleNames(conn: HuskyHuskyDB) {
  const articles = await conn.models.Article.find().lean();
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
  return result[0].tags as string[];
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

export async function getHeadlinesByTag(conn: HuskyHuskyDB, tag: string) {
  const articles = await conn.models.Article.find({
    public: true,
    tags: tag,
  })
    .sort({ createdAt: -1 })
    .select(headlineSelector)
    .populate("author", "_id name")
    .lean();
  return articles as IHeadline[];
}

export async function getHeadlinesByUser(conn: HuskyHuskyDB, userId: string) {
  const articles = await conn.models.Article.find({
    public: true,
  })
    .sort({ createdAt: -1 })
    .select(headlineSelector)
    .populate("author", "_id name")
    .lean();
  return articles.filter(
    (a) => a.author._id.toString() === userId
  ) as IHeadline[];
}
