import createHandler from "../../util/api/createHandler";

const getAllTagsHandler = createHandler(false, {
  GET: async ({ conn }) => {
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
    const tags = result[0].tags.filter(
      (tag: any) => typeof tag === "string" && tag.trim() !== ""
    );
    return [200, tags];
  },
});

export default getAllTagsHandler;
