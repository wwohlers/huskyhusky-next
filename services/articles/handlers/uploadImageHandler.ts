import { S3 } from "aws-sdk";
import { MethodHandler } from "../../../util/api/createHandler";
import requireAuth from "../../../util/api/guards/requireAuth";
import { ValidationError } from "deterrent";

type UploadImageRequest = {
  data: string | ArrayBuffer | null | undefined;
};
type UploadImageResponse = {
  url: string;
};

const s3 = new S3({
  accessKeyId: process.env.HH_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.HH_AWS_SECRET_ACCESS_KEY,
});

export const uploadImageHandler: MethodHandler<
  UploadImageRequest,
  UploadImageResponse
> = async ({ conn, req, userId }) => {
  requireAuth(conn, userId, false);
  const bucketName = process.env.HH_AWS_BUCKET_NAME!;
  if (!req.body.data) {
    throw new ValidationError("No image data");
  }
  const { Location } = await s3
    .upload({
      Bucket: bucketName,
      Key: `${userId}-${Date.now()}`,
      Body: Buffer.from(req.body.data as string, "binary"),
      ACL: "public-read",
    })
    .promise();
  return { url: Location };
};