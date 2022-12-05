import createHandler from "../../../util/api/createHandler";
import { S3 } from "aws-sdk";

export type UploadResponse = {
  url: string;
};

const s3 = new S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const uploadImageHandler = createHandler(true, {
  POST: async ({ req, userId }) => {
    if (!userId) {
      return [401, { error: "Unauthorized" }];
    }
    const bucketName = process.env.AWS_BUCKET_NAME;
    if (!bucketName) {
      return [500, { error: "No bucket name" }];
    }
    const { Location } = await s3
      .upload({
        Bucket: bucketName,
        Key: `${userId}-${Date.now()}`,
        Body: Buffer.from(req.body.data, "binary"),
        ACL: "public-read",
      })
      .promise();
    return [201, { url: Location }];
  },
});

export default uploadImageHandler;
