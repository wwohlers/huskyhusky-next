import createHandler from "../../../services/api/createHandler";
import createRequestMakers from "../../../services/api/createRequestMaker";
import { uploadImageHandler } from "../../../services/api/handlers/articles/uploadImageHandler";

const methodHandlers = {
  post: uploadImageHandler,
}

export default createHandler(methodHandlers);

export const { post: makeUploadImageRequest } = createRequestMakers("/articles/upload", methodHandlers);