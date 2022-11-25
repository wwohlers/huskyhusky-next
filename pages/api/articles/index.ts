import { IArticle } from "../../../services/articles/article.interface";
import createHandler, { MethodHandler } from "../../../util/api/createHandler";

const handleGet: MethodHandler<IArticle[]> = async (req, res, conn) => {
  const articles = await conn.models.Article.find();
  res.json(articles.map((a) => a.toObject()));
};

const handler = createHandler({
  GET: handleGet,
});

export default handler;
