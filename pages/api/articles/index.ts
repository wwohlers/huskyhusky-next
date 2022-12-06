import { IArticle } from "../../../services/articles/article.interface";
import createHandler from "../../../util/api/createHandler";

const articleHandler = createHandler(true, {
  PUT: async ({ req, userId, conn }) => {
    if (!userId) {
      return [401, { error: "Unauthorized" }];
    }
    const {
      _id,
      name,
      title,
      tags,
      brief,
      image,
      attr,
      text,
      public: isPublic,
    } = req.body as IArticle;
    if (_id) {
      const article = await conn.models.Article.findByIdAndUpdate<IArticle>(
        _id,
        {
          name,
          title,
          tags,
          brief,
          image,
          attr,
          text,
          public: isPublic,
          updatedAt: Date.now(),
        },
        {
          new: true, // return the modified document rather than the original
        }
      );
      return [200, article];
    } else {
      return [404, { error: "Article not found" }];
    }
  },
  POST: async ({ req, userId, conn }) => {
    if (!userId) {
      return [401, { error: "Unauthorized" }];
    }
    const numArticles = await conn.models.Article.count();
    // this name could in theory be not unique, but it's very unlikely
    const title = `Article ${numArticles + 1}`;
    const name = `article-${numArticles + 1}`;
    const article = await conn.models.Article.create({
      author: userId,
      name,
      title,
      public: false,
    });
    return [201, article];
  },
});

export default articleHandler;
