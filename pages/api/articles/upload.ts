import { uploadImageHandler } from "../../../services/articles/handlers/uploadImageHandler";
import createHandler from "../../../util/api/createHandler";
import createRequestMakers from "../../../util/api/createRequestMaker";

const methodHandlers = {
  post: uploadImageHandler,
}

export default createHandler(methodHandlers);

export const { post: makeUploadImageRequest } = createRequestMakers("/articles/upload", methodHandlers);