import createHandler from "../../../util/api/createHandler";
import createRequestMakers from "../../../util/api/createRequestMaker";
import sendEmailHandler from "../../../services/subs/handlers/sendEmailHandler";

const methodHandlers = {
  post: sendEmailHandler,
};

export default createHandler(methodHandlers);

export const { post: makeSendEmailRequest } = createRequestMakers(
  "/subs/sendEmail",
  methodHandlers
);
