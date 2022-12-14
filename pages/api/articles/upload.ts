import createHandler from "../../../api/createHandler";
import createRequestMakers from "../../../api/createRequestMaker";
import { uploadImageHandler } from "../../../api/handlers/articles/uploadImageHandler";

const methodHandlers = {
  post: uploadImageHandler,
}

export default createHandler(methodHandlers);

export const { post: uploadArticleImage } = createRequestMakers("/articles/upload", methodHandlers);